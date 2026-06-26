-- Step 1: Dynamic trial period + viral action extensions
-- Extends public.users with trial lifecycle fields and logs viral bonuses.

-- ---------------------------------------------------------------------------
-- Trial fields on public.users
-- ---------------------------------------------------------------------------
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS trial_start_at timestamptz,
  ADD COLUMN IF NOT EXISTS trial_end_at timestamptz,
  ADD COLUMN IF NOT EXISTS trial_extended_days integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS account_status text NOT NULL DEFAULT 'trial';

ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_account_status_check;

ALTER TABLE public.users
  ADD CONSTRAINT users_account_status_check CHECK (
    account_status IN ('trial', 'active', 'past_due', 'canceled')
  );

ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_trial_extended_days_check;

ALTER TABLE public.users
  ADD CONSTRAINT users_trial_extended_days_check CHECK (trial_extended_days >= 0);

CREATE INDEX IF NOT EXISTS users_trial_end_at_idx
  ON public.users (trial_end_at)
  WHERE account_status = 'trial';

CREATE INDEX IF NOT EXISTS users_account_status_idx
  ON public.users (account_status);

-- Backfill existing users
UPDATE public.users
SET
  trial_start_at = COALESCE(trial_start_at, created_at),
  trial_end_at = COALESCE(trial_end_at, created_at + interval '7 days'),
  trial_extended_days = COALESCE(trial_extended_days, 0),
  account_status = CASE
    WHEN tier IN ('pro', 'pro_max')
      AND subscription_status IN ('active', 'trialing')
      THEN 'active'
    WHEN subscription_status = 'past_due' THEN 'past_due'
    WHEN subscription_status IN ('canceled', 'unpaid', 'incomplete_expired')
      THEN 'canceled'
    ELSE COALESCE(account_status, 'trial')
  END
WHERE trial_start_at IS NULL OR trial_end_at IS NULL;

-- ---------------------------------------------------------------------------
-- viral_actions — audit log for trial extensions (abuse prevention)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.viral_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  action_type text NOT NULL,
  days_granted integer NOT NULL CHECK (days_granted > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT viral_actions_user_action_unique UNIQUE (user_id, action_type)
);

CREATE INDEX IF NOT EXISTS viral_actions_user_id_created_at_idx
  ON public.viral_actions (user_id, created_at DESC);

ALTER TABLE public.viral_actions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "viral_actions_select_own" ON public.viral_actions;
CREATE POLICY "viral_actions_select_own"
  ON public.viral_actions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

REVOKE INSERT, UPDATE, DELETE ON public.viral_actions FROM authenticated;

-- ---------------------------------------------------------------------------
-- profiles view (include trial fields)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.profiles AS
SELECT
  id,
  username,
  tier,
  brand_voice,
  tg_channel_id,
  credits,
  stripe_customer_id,
  stripe_subscription_id,
  stripe_price_id,
  subscription_status,
  subscription_period_end,
  trial_start_at,
  trial_end_at,
  trial_extended_days,
  account_status,
  created_at
FROM public.users;

REVOKE ALL ON public.profiles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.profiles TO authenticated;

-- ---------------------------------------------------------------------------
-- Initialize trial on new user rows
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.initialize_user_trial_defaults()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.trial_start_at := COALESCE(NEW.trial_start_at, now());
  NEW.trial_end_at := COALESCE(NEW.trial_end_at, now() + interval '7 days');
  NEW.trial_extended_days := COALESCE(NEW.trial_extended_days, 0);
  NEW.account_status := COALESCE(NEW.account_status, 'trial');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS users_initialize_trial_defaults ON public.users;
CREATE TRIGGER users_initialize_trial_defaults
  BEFORE INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.initialize_user_trial_defaults();

-- ---------------------------------------------------------------------------
-- Safely extend trial + log viral action (one bonus per action_type/user)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.extend_user_trial(
  p_user_id uuid,
  p_days integer,
  p_action_type text
)
RETURNS timestamptz
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now timestamptz := now();
  v_trial_end timestamptz;
  v_account_status text;
  v_max_extension_days constant integer := 30;
  v_base_extension constant integer := 7;
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User id is required';
  END IF;

  IF p_days IS NULL OR p_days <= 0 OR p_days > v_base_extension THEN
    RAISE EXCEPTION 'Days granted must be between 1 and %', v_base_extension;
  END IF;

  IF p_action_type IS NULL OR length(trim(p_action_type)) = 0 THEN
    RAISE EXCEPTION 'Action type is required';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.viral_actions
    WHERE user_id = p_user_id
      AND action_type = p_action_type
  ) THEN
    RAISE EXCEPTION 'Viral action already claimed: %', p_action_type;
  END IF;

  SELECT trial_end_at, account_status
  INTO v_trial_end, v_account_status
  FROM public.users
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  IF v_account_status = 'active' THEN
    RAISE EXCEPTION 'Paid users cannot extend trial';
  END IF;

  IF COALESCE((
    SELECT trial_extended_days FROM public.users WHERE id = p_user_id
  ), 0) + p_days > v_max_extension_days THEN
    RAISE EXCEPTION 'Maximum trial extension of % days reached', v_max_extension_days;
  END IF;

  v_trial_end := GREATEST(COALESCE(v_trial_end, v_now), v_now) + (p_days || ' days')::interval;

  UPDATE public.users
  SET
    trial_end_at = v_trial_end,
    trial_extended_days = trial_extended_days + p_days,
    account_status = CASE
      WHEN account_status = 'canceled' AND v_trial_end > v_now THEN 'trial'
      ELSE account_status
    END
  WHERE id = p_user_id;

  INSERT INTO public.viral_actions (user_id, action_type, days_granted)
  VALUES (p_user_id, p_action_type, p_days);

  RETURN v_trial_end;
END;
$$;

REVOKE ALL ON FUNCTION public.extend_user_trial(uuid, integer, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.extend_user_trial(uuid, integer, text) TO service_role;

-- Optional: server-side trial snapshot for API routes (read-only)
CREATE OR REPLACE FUNCTION public.get_trial_status(p_user_id uuid)
RETURNS TABLE (
  account_status text,
  trial_start_at timestamptz,
  trial_end_at timestamptz,
  trial_extended_days integer,
  is_valid boolean,
  days_remaining integer
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now timestamptz := now();
BEGIN
  RETURN QUERY
  SELECT
    u.account_status,
    u.trial_start_at,
    u.trial_end_at,
    u.trial_extended_days,
    CASE
      WHEN u.account_status = 'active' THEN true
      WHEN u.account_status = 'trial'
        AND u.trial_end_at IS NOT NULL
        AND u.trial_end_at > v_now THEN true
      ELSE false
    END AS is_valid,
    CASE
      WHEN u.account_status = 'active' THEN 0
      WHEN u.trial_end_at IS NULL THEN 0
      WHEN u.trial_end_at <= v_now THEN 0
      ELSE GREATEST(
        0,
        CEIL(EXTRACT(EPOCH FROM (u.trial_end_at - v_now)) / 86400.0)::integer
      )
    END AS days_remaining
  FROM public.users u
  WHERE u.id = p_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.get_trial_status(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_trial_status(uuid) TO service_role;

-- Multi-tier subscription foundation (Pro + Pro Max)
-- Adds Stripe subscription mirror columns and set_user_subscription RPC.

-- ---------------------------------------------------------------------------
-- Stripe mirror columns on public.users
-- ---------------------------------------------------------------------------
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
  ADD COLUMN IF NOT EXISTS stripe_price_id text,
  ADD COLUMN IF NOT EXISTS subscription_status text,
  ADD COLUMN IF NOT EXISTS subscription_period_end timestamptz;

-- ---------------------------------------------------------------------------
-- Tier constraint: starter (free) | pro | pro_max
-- ---------------------------------------------------------------------------
ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_tier_check;

ALTER TABLE public.users
  ADD CONSTRAINT users_tier_check CHECK (tier IN ('starter', 'pro', 'pro_max'));

ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_subscription_status_check;

ALTER TABLE public.users
  ADD CONSTRAINT users_subscription_status_check CHECK (
    subscription_status IS NULL
    OR subscription_status IN (
      'active',
      'trialing',
      'past_due',
      'canceled',
      'unpaid',
      'incomplete',
      'incomplete_expired',
      'paused'
    )
  );

CREATE UNIQUE INDEX IF NOT EXISTS users_stripe_subscription_id_idx
  ON public.users (stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS users_stripe_customer_id_idx
  ON public.users (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- profiles view (read-only projection for authenticated clients)
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
  created_at
FROM public.users;

REVOKE ALL ON public.profiles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.profiles TO authenticated;

-- ---------------------------------------------------------------------------
-- Backend-only subscription sync (Stripe webhooks / service role)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_user_subscription(
  p_user_id uuid,
  p_tier text,
  p_stripe_customer_id text DEFAULT NULL,
  p_stripe_subscription_id text DEFAULT NULL,
  p_stripe_price_id text DEFAULT NULL,
  p_subscription_status text DEFAULT NULL,
  p_subscription_period_end timestamptz DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User id is required';
  END IF;

  IF p_tier IS NULL OR p_tier NOT IN ('starter', 'pro', 'pro_max') THEN
    RAISE EXCEPTION 'Invalid tier: %', p_tier;
  END IF;

  IF p_subscription_status IS NOT NULL
    AND p_subscription_status NOT IN (
      'active',
      'trialing',
      'past_due',
      'canceled',
      'unpaid',
      'incomplete',
      'incomplete_expired',
      'paused'
    )
  THEN
    RAISE EXCEPTION 'Invalid subscription status: %', p_subscription_status;
  END IF;

  UPDATE public.users
  SET
    tier = p_tier,
    stripe_customer_id = COALESCE(p_stripe_customer_id, stripe_customer_id),
    stripe_subscription_id = COALESCE(p_stripe_subscription_id, stripe_subscription_id),
    stripe_price_id = COALESCE(p_stripe_price_id, stripe_price_id),
    subscription_status = COALESCE(p_subscription_status, subscription_status),
    subscription_period_end = COALESCE(p_subscription_period_end, subscription_period_end)
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.set_user_subscription(
  uuid,
  text,
  text,
  text,
  text,
  text,
  timestamptz
) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.set_user_subscription(
  uuid,
  text,
  text,
  text,
  text,
  text,
  timestamptz
) TO service_role;

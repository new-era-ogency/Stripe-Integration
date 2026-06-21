-- PulseFlow security hardening: RLS, policies, and secure credit deduction RPC.
-- Apply via Supabase SQL editor or: supabase db push

-- ---------------------------------------------------------------------------
-- Tables (idempotent)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  credits integer NOT NULL DEFAULT 0 CHECK (credits >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  video_url text NOT NULL,
  raw_transcript text,
  output_x text,
  output_linkedin text,
  output_telegram text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS generations_user_id_created_at_idx
  ON public.generations (user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

-- Users: read and insert own profile only. No client UPDATE (credits via RPC).
DROP POLICY IF EXISTS "users_select_own" ON public.users;
CREATE POLICY "users_select_own"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "users_insert_own" ON public.users;
CREATE POLICY "users_insert_own"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Generations: read and insert own rows only.
DROP POLICY IF EXISTS "generations_select_own" ON public.generations;
CREATE POLICY "generations_select_own"
  ON public.generations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "generations_insert_own" ON public.generations;
CREATE POLICY "generations_insert_own"
  ON public.generations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Explicitly revoke client UPDATE/DELETE on sensitive tables.
REVOKE UPDATE, DELETE ON public.users FROM authenticated;
REVOKE UPDATE, DELETE ON public.generations FROM authenticated;

-- ---------------------------------------------------------------------------
-- Secure credit deduction (uses auth.uid() — immune to parameter tampering)
-- ---------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.deduct_credit(uuid);

CREATE OR REPLACE FUNCTION public.deduct_credit()
RETURNS TABLE(success boolean, message text, new_credits integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  current_credits integer;
BEGIN
  IF uid IS NULL THEN
    RETURN QUERY SELECT false, 'Unauthorized.'::text, 0;
    RETURN;
  END IF;

  SELECT credits
  INTO current_credits
  FROM public.users
  WHERE id = uid
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'User not found.'::text, 0;
    RETURN;
  END IF;

  IF current_credits <= 0 THEN
    RETURN QUERY SELECT false, 'Insufficient credits.'::text, current_credits;
    RETURN;
  END IF;

  UPDATE public.users
  SET credits = credits - 1
  WHERE id = uid
  RETURNING credits INTO current_credits;

  RETURN QUERY SELECT true, 'Credit deducted.'::text, current_credits;
END;
$$;

REVOKE ALL ON FUNCTION public.deduct_credit() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.deduct_credit() TO authenticated;

-- Usernames for manual signup and profile identity

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS username text;

CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower_idx
  ON public.users (lower(username));

ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_username_format;

ALTER TABLE public.users
  ADD CONSTRAINT users_username_format CHECK (
    username IS NULL OR username ~ '^[a-z][a-z0-9_]{2,19}$'
  );

CREATE OR REPLACE VIEW public.profiles AS
SELECT
  id,
  username,
  tier,
  brand_voice,
  tg_channel_id,
  credits,
  created_at
FROM public.users;

REVOKE ALL ON public.profiles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.profiles TO authenticated;

CREATE OR REPLACE FUNCTION public.set_username(p_username text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  normalized text := lower(trim(p_username));
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF normalized IS NULL OR normalized = '' THEN
    RAISE EXCEPTION 'Username is required';
  END IF;

  IF normalized !~ '^[a-z][a-z0-9_]{2,19}$' THEN
    RAISE EXCEPTION 'Username must be 3–20 characters: letters, numbers, underscores';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.users
    WHERE lower(username) = normalized AND id <> uid
  ) THEN
    RAISE EXCEPTION 'Username is already taken';
  END IF;

  UPDATE public.users
  SET username = normalized
  WHERE id = uid AND username IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Username already set or profile not found';
  END IF;

  RETURN normalized;
END;
$$;

REVOKE ALL ON FUNCTION public.set_username(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_username(text) TO authenticated;

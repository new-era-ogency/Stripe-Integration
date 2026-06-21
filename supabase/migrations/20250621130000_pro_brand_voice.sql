-- Step 2: Pro tier + custom brand voice (profiles view over public.users)

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS tier text NOT NULL DEFAULT 'starter',
  ADD COLUMN IF NOT EXISTS brand_voice text;

ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_tier_check;

ALTER TABLE public.users
  ADD CONSTRAINT users_tier_check CHECK (tier IN ('starter', 'pro'));

CREATE OR REPLACE VIEW public.profiles AS
SELECT
  id,
  tier,
  brand_voice,
  credits,
  created_at
FROM public.users;

REVOKE ALL ON public.profiles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.profiles TO authenticated;

CREATE OR REPLACE FUNCTION public.update_brand_voice(p_brand_voice text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  normalized text := NULLIF(trim(p_brand_voice), '');
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE public.users
  SET brand_voice = normalized
  WHERE id = uid
    AND tier = 'pro';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pro tier required to save a custom brand voice';
  END IF;

  RETURN COALESCE(normalized, '');
END;
$$;

REVOKE ALL ON FUNCTION public.update_brand_voice(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_brand_voice(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.upgrade_user_to_pro(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.users
  SET tier = 'pro'
  WHERE id = p_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.upgrade_user_to_pro(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.upgrade_user_to_pro(uuid) TO service_role;

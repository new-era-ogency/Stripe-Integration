-- Step 4: Telegram channel auto-posting (Pro)

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS tg_channel_id text;

CREATE OR REPLACE VIEW public.profiles AS
SELECT
  id,
  tier,
  brand_voice,
  tg_channel_id,
  credits,
  created_at
FROM public.users;

REVOKE ALL ON public.profiles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.profiles TO authenticated;

CREATE OR REPLACE FUNCTION public.update_tg_channel_id(p_tg_channel_id text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  normalized text := NULLIF(trim(p_tg_channel_id), '');
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE public.users
  SET tg_channel_id = normalized
  WHERE id = uid
    AND tier = 'pro';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pro tier required to connect a Telegram channel';
  END IF;

  RETURN COALESCE(normalized, '');
END;
$$;

REVOKE ALL ON FUNCTION public.update_tg_channel_id(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_tg_channel_id(text) TO authenticated;

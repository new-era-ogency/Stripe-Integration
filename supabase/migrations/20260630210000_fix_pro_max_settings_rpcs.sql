-- Pro Max users were blocked: RPCs only matched tier = 'pro'.

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
    AND tier IN ('pro', 'pro_max');

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pro tier required to connect a Telegram channel';
  END IF;

  RETURN COALESCE(normalized, '');
END;
$$;

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
    AND tier IN ('pro', 'pro_max');

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pro tier required to save a custom brand voice';
  END IF;

  RETURN COALESCE(normalized, '');
END;
$$;

REVOKE ALL ON FUNCTION public.update_tg_channel_id(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_tg_channel_id(text) TO authenticated;

REVOKE ALL ON FUNCTION public.update_brand_voice(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_brand_voice(text) TO authenticated;

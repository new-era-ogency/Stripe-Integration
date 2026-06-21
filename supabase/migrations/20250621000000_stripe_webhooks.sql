-- Stripe webhook idempotency and secure credit grants (service role only).

CREATE TABLE IF NOT EXISTS public.stripe_events (
  id text PRIMARY KEY,
  type text NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.stripe_events FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.grant_credits_from_checkout(
  p_event_id text,
  p_event_type text,
  p_user_id uuid,
  p_credits integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inserted_event_id text;
BEGIN
  IF p_credits <= 0 THEN
    RAISE EXCEPTION 'Invalid credit amount';
  END IF;

  INSERT INTO public.stripe_events (id, type)
  VALUES (p_event_id, p_event_type)
  ON CONFLICT (id) DO NOTHING
  RETURNING id INTO inserted_event_id;

  IF inserted_event_id IS NULL THEN
    RETURN false;
  END IF;

  UPDATE public.users
  SET credits = credits + p_credits
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    DELETE FROM public.stripe_events WHERE id = p_event_id;
    RAISE EXCEPTION 'User not found';
  END IF;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.grant_credits_from_checkout(text, text, uuid, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.grant_credits_from_checkout(text, text, uuid, integer) TO service_role;

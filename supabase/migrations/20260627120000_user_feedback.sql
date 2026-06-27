-- Early-access feedback from trial preview and in-product prompts.
CREATE TABLE IF NOT EXISTS public.user_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  contact text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS user_feedback_created_at_idx
  ON public.user_feedback (created_at DESC);

ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- Inserts only via service-role API route; no client access.
REVOKE ALL ON public.user_feedback FROM anon, authenticated;

-- Generation history schema (Step 1 roadmap)
-- Normalizes storage into youtube_url + generated_content (jsonb).

CREATE TABLE IF NOT EXISTS public.generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  youtube_url text NOT NULL,
  generated_content jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Upgrade legacy columns from earlier migrations when present.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'generations'
      AND column_name = 'video_url'
  ) THEN
    ALTER TABLE public.generations
      ADD COLUMN IF NOT EXISTS youtube_url text,
      ADD COLUMN IF NOT EXISTS generated_content jsonb;

    UPDATE public.generations
    SET
      youtube_url = COALESCE(youtube_url, video_url),
      generated_content = COALESCE(
        generated_content,
        jsonb_strip_nulls(
          jsonb_build_object(
            'outputX', output_x,
            'outputLinkedIn', output_linkedin,
            'outputTelegram', output_telegram,
            'rawTranscript', raw_transcript
          )
        )
      )
    WHERE youtube_url IS NULL OR generated_content IS NULL;

    ALTER TABLE public.generations
      DROP COLUMN IF EXISTS video_url,
      DROP COLUMN IF EXISTS raw_transcript,
      DROP COLUMN IF EXISTS output_x,
      DROP COLUMN IF EXISTS output_linkedin,
      DROP COLUMN IF EXISTS output_telegram;
  END IF;
END $$;

ALTER TABLE public.generations
  ALTER COLUMN youtube_url SET NOT NULL,
  ALTER COLUMN generated_content SET NOT NULL;

CREATE INDEX IF NOT EXISTS generations_user_id_created_at_idx
  ON public.generations (user_id, created_at DESC);

ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

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

REVOKE UPDATE, DELETE ON public.generations FROM authenticated;

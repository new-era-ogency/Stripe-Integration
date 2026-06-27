-- Shift default trial from 7 days to 30-day Pro access period.
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS trial_start_at timestamptz,
  ADD COLUMN IF NOT EXISTS trial_end_at timestamptz;

CREATE OR REPLACE FUNCTION public.initialize_user_trial_defaults()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.trial_start_at := COALESCE(NEW.trial_start_at, now());
  NEW.trial_end_at := COALESCE(NEW.trial_end_at, now() + interval '30 days');
  NEW.trial_extended_days := COALESCE(NEW.trial_extended_days, 0);
  NEW.account_status := COALESCE(NEW.account_status, 'trial');
  RETURN NEW;
END;
$$;

-- Extend active trial users who still have the old 7-day window to 30 days from signup.
UPDATE public.users
SET trial_end_at = trial_start_at + interval '30 days'
WHERE account_status = 'trial'
  AND trial_start_at IS NOT NULL
  AND trial_end_at IS NOT NULL
  AND trial_end_at <= trial_start_at + interval '8 days';

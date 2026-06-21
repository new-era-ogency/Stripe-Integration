-- Align signup credits with product model: free accounts start at 0;
-- paid Starter packs add 20 via grant_credits_from_checkout (Stripe webhook).

ALTER TABLE public.users
  ALTER COLUMN credits SET DEFAULT 0;

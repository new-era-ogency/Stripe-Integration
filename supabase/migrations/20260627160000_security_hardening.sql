-- Security hardening: deny-by-default grants on sensitive tables.
REVOKE ALL ON public.user_feedback FROM PUBLIC;
GRANT ALL ON public.user_feedback TO service_role;

-- Ensure generations cannot be modified by clients (defense in depth).
REVOKE UPDATE, DELETE ON public.generations FROM anon, authenticated;

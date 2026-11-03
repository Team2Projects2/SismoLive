-- Public clients only read. Writes go through the secret key (service_role), so drop
-- the default table privileges Supabase grants to anon/authenticated as defense in depth.
revoke insert, update, delete, truncate on public.sismos, public.ingestas from anon, authenticated;

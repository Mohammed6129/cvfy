-- CVfy — lock CV and payment rows to the server (Nov 2026)
--
-- Run this ONCE in the Supabase SQL editor, AFTER these two environment
-- variables are set in Vercel and the new version is deployed:
--   SUPABASE_SERVICE_ROLE_KEY
--   MOYASAR_SECRET_KEY
--
-- Why: until now a signed-in user could, with their own session, read the
-- full text of an unpaid CV and flip `is_paid` on their own row straight
-- through Supabase, without going through the site. The app now reads and
-- writes these tables only from the server with the service role, so the
-- browser no longer needs any direct access to them.
--
-- Safe to re-run.

-- 1. No direct access to CV rows from the browser.
drop policy if exists "Users can read own cv" on public.cvs;
drop policy if exists "Users can insert own cv" on public.cvs;
drop policy if exists "Users can update own cv" on public.cvs;
drop policy if exists "Users can delete own cv" on public.cvs;

-- 2. No direct access to payment rows either.
drop policy if exists "Users can read own payments" on public.payments;
drop policy if exists "Users can insert own payments" on public.payments;

-- Row level security stays ON with no policies: only the service role
-- (used by the server) can touch these tables.
alter table public.cvs enable row level security;
alter table public.payments enable row level security;

-- 3. One Moyasar payment can unlock one CV, once.
create unique index if not exists payments_moyasar_payment_id_key
  on public.payments (moyasar_payment_id)
  where moyasar_payment_id is not null;

-- 4. Speeds up the "CVs created in the last 24 hours" limit.
create index if not exists cvs_user_created_idx on public.cvs (user_id, created_at desc);

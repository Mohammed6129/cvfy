-- CVfy database schema
-- Run in Supabase SQL Editor

create table if not exists public.cvs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'سيرتي الذاتية',
  form_data jsonb,
  generated_cv jsonb not null,
  is_paid boolean not null default false,
  paid_plan text,
  ats_result jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cvs_user_id_idx on public.cvs (user_id);
create index if not exists cvs_updated_at_idx on public.cvs (updated_at desc);

alter table public.cvs enable row level security;

drop policy if exists "Users can read own cv" on public.cvs;
drop policy if exists "Users can insert own cv" on public.cvs;
drop policy if exists "Users can update own cv" on public.cvs;
drop policy if exists "Users can delete own cv" on public.cvs;

create policy "Users can read own cv"
  on public.cvs for select
  using (auth.uid() = user_id);

create policy "Users can insert own cv"
  on public.cvs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own cv"
  on public.cvs for update
  using (auth.uid() = user_id);

create policy "Users can delete own cv"
  on public.cvs for delete
  using (auth.uid() = user_id);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cv_id uuid not null references public.cvs(id) on delete cascade,
  moyasar_payment_id text,
  plan_id text not null,
  amount_halalas integer not null,
  status text not null default 'paid',
  created_at timestamptz not null default now()
);

alter table public.payments enable row level security;

drop policy if exists "Users can read own payments" on public.payments;
drop policy if exists "Users can insert own payments" on public.payments;

create policy "Users can read own payments"
  on public.payments for select
  using (auth.uid() = user_id);

create policy "Users can insert own payments"
  on public.payments for insert
  with check (auth.uid() = user_id);

-- Migration: remove old one-cv-per-user constraint if present
alter table public.cvs drop constraint if exists cvs_user_id_key;

-- ---------------------------------------------------------------------------
-- Profiles (saved CV file references)
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  cv_pdf_url text,
  cv_word_url text,
  ats_report_url text,
  cv_generated_at timestamptz,
  is_paid boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists cv_pdf_url text;
alter table public.profiles add column if not exists cv_word_url text;
alter table public.profiles add column if not exists ats_report_url text;
alter table public.profiles add column if not exists cv_generated_at timestamptz;
alter table public.profiles add column if not exists is_paid boolean default false;

alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Storage bucket: private CV files per user
-- Create bucket in Dashboard if this insert fails (private, 10MB limit)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit)
values ('cvs', 'cvs', false, 10485760)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit;

drop policy if exists "Users can read own cv files" on storage.objects;
drop policy if exists "Users can upload own cv files" on storage.objects;
drop policy if exists "Users can update own cv files" on storage.objects;

create policy "Users can read own cv files"
  on storage.objects for select
  using (
    bucket_id = 'cvs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can upload own cv files"
  on storage.objects for insert
  with check (
    bucket_id = 'cvs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update own cv files"
  on storage.objects for update
  using (
    bucket_id = 'cvs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

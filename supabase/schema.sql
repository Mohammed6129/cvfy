-- CVfy: user CV storage
-- Run in Supabase SQL Editor: https://supabase.com/dashboard → SQL

create table if not exists public.cvs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  form_data jsonb,
  generated_cv jsonb not null,
  updated_at timestamptz not null default now(),
  constraint cvs_user_id_key unique (user_id)
);

alter table public.cvs enable row level security;

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

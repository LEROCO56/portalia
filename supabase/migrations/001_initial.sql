-- Portalia — Migración inicial
-- Modelo: profiles, course_progress, threads, replies, audits, affiliates
-- RLS habilitado en todas las tablas.

-- ============ PROFILES ============
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'free' check (role in ('free','buyer','affiliate','admin')),
  hotmart_transaction_id text,
  hotmart_purchase_at timestamptz,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_self_select" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id);

-- Trigger: al crear un usuario en auth.users, crear su fila en profiles.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ COURSE PROGRESS ============
create table if not exists public.course_progress (
  user_id uuid references public.profiles(id) on delete cascade,
  lesson_id text not null,
  completed_at timestamptz default now(),
  primary key (user_id, lesson_id)
);

alter table public.course_progress enable row level security;

create policy "progress_self_all" on public.course_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============ COMUNIDAD ============
create table if not exists public.threads (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete set null,
  category text not null default 'general',
  title text not null,
  body text not null,
  pinned boolean default false,
  created_at timestamptz default now()
);

create index if not exists threads_created_idx on public.threads (created_at desc);

alter table public.threads enable row level security;

create policy "threads_read_all" on public.threads for select using (true);
create policy "threads_authed_insert" on public.threads
  for insert with check (auth.uid() = author_id);
create policy "threads_author_update" on public.threads
  for update using (auth.uid() = author_id);
create policy "threads_author_delete" on public.threads
  for delete using (auth.uid() = author_id);

create table if not exists public.replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references public.threads(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  body text not null,
  created_at timestamptz default now()
);

create index if not exists replies_thread_idx on public.replies (thread_id, created_at);

alter table public.replies enable row level security;

create policy "replies_read_all" on public.replies for select using (true);
create policy "replies_authed_insert" on public.replies
  for insert with check (auth.uid() = author_id);
create policy "replies_author_update" on public.replies
  for update using (auth.uid() = author_id);
create policy "replies_author_delete" on public.replies
  for delete using (auth.uid() = author_id);

-- ============ AUDITOR PORTAL IA ============
create table if not exists public.audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  domain text not null,
  business_name text,
  query text,
  score integer,
  gaps jsonb,
  created_at timestamptz default now()
);

create index if not exists audits_user_idx on public.audits (user_id, created_at desc);

alter table public.audits enable row level security;

create policy "audits_self_all" on public.audits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============ AFILIADOS ============
create table if not exists public.affiliates (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  hotmart_affiliate_id text unique,
  tracking_url text,
  approved_at timestamptz,
  created_at timestamptz default now()
);

alter table public.affiliates enable row level security;

create policy "affiliates_self_all" on public.affiliates
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

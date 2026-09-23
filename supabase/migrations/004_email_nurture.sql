-- Portalia — Secuencia nurture de 7 correos en 14 días (content/email/nurture-secuencia.md)
-- Flujo: alta en profiles (role='free') → inscripción automática → pg_cron cada hora llama a la
-- Edge Function `nurture-send` → envía los correos vencidos por Resend → avanza el paso.
-- Salida: al comprar (role deja de ser 'free'), al darse de baja o al terminar D14.

create extension if not exists pg_cron;
create extension if not exists pg_net schema extensions;

-- ============ INSCRIPCIONES ============
create table if not exists public.email_nurture (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  step smallint not null default 0,              -- índice del próximo correo (0..6); 7 = terminó
  next_send_at timestamptz not null default now(),
  unsubscribe_token uuid not null unique default gen_random_uuid(),
  stopped_at timestamptz,
  stop_reason text check (stop_reason in ('compra','baja','completa','error')),
  last_sent_at timestamptz,
  last_error text,
  created_at timestamptz not null default now()
);

create index if not exists email_nurture_due_idx
  on public.email_nurture (next_send_at) where stopped_at is null;

-- Registro de envíos (idempotencia y métricas).
create table if not exists public.email_nurture_log (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  step smallint not null,
  provider_id text,
  sent_at timestamptz not null default now(),
  unique (user_id, step)
);

-- Solo el service role (Edge Function) toca estas tablas: RLS activo y sin políticas.
alter table public.email_nurture enable row level security;
alter table public.email_nurture_log enable row level security;

-- ============ INSCRIPCIÓN Y SALIDA AUTOMÁTICAS ============
create or replace function public.nurture_on_profile_insert()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.role = 'free' then
    insert into public.email_nurture (user_id) values (new.id)
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists nurture_enroll on public.profiles;
create trigger nurture_enroll
  after insert on public.profiles
  for each row execute function public.nurture_on_profile_insert();

create or replace function public.nurture_on_role_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.role <> 'free' and old.role = 'free' then
    update public.email_nurture
       set stopped_at = now(), stop_reason = 'compra'
     where user_id = new.id and stopped_at is null;
  end if;
  return new;
end;
$$;

drop trigger if exists nurture_exit_on_purchase on public.profiles;
create trigger nurture_exit_on_purchase
  after update of role on public.profiles
  for each row execute function public.nurture_on_role_change();

revoke execute on function public.nurture_on_profile_insert() from public, anon, authenticated;
revoke execute on function public.nurture_on_role_change() from public, anon, authenticated;

-- ============ BAJA (enlace en cada correo, Ley 1581 de 2012) ============
-- Pública a propósito: el token es un uuid aleatorio por persona; no revela datos.
create or replace function public.email_nurture_unsubscribe(p_token uuid)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare n int;
begin
  update public.email_nurture
     set stopped_at = coalesce(stopped_at, now()),
         stop_reason = coalesce(stop_reason, 'baja')
   where unsubscribe_token = p_token;
  get diagnostics n = row_count;
  return n > 0;
end;
$$;

revoke execute on function public.email_nurture_unsubscribe(uuid) from public;
grant execute on function public.email_nurture_unsubscribe(uuid) to anon, authenticated;

-- ============ AUTENTICACIÓN DEL CRON ============
-- Secreto aleatorio en Vault; la Edge Function lo valida con esta función (solo service_role).
do $$
begin
  if not exists (select 1 from vault.secrets where name = 'nurture_cron_secret') then
    perform vault.create_secret(encode(extensions.gen_random_bytes(24), 'hex'), 'nurture_cron_secret',
      'Autentica el llamado de pg_cron a la Edge Function nurture-send');
  end if;
end $$;

create or replace function public.nurture_cron_secret_ok(p_secret text)
returns boolean
language sql
security definer set search_path = public
as $$
  select exists (
    select 1 from vault.decrypted_secrets
     where name = 'nurture_cron_secret' and decrypted_secret = p_secret
  );
$$;

revoke execute on function public.nurture_cron_secret_ok(text) from public, anon, authenticated;
grant execute on function public.nurture_cron_secret_ok(text) to service_role;

-- ============ PROGRAMACIÓN: cada hora al minuto 5 ============
do $$
begin
  if exists (select 1 from cron.job where jobname = 'portalia-nurture-send') then
    perform cron.unschedule('portalia-nurture-send');
  end if;
end $$;

select cron.schedule(
  'portalia-nurture-send',
  '5 * * * *',
  $cron$
  select net.http_post(
    url := 'https://rgmdymzxapkjkomfllok.supabase.co/functions/v1/nurture-send',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'nurture_cron_secret')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  );
  $cron$
);

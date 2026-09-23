-- 002: foro de comunidad — solo miembros publican, nombre visible sin exponer emails, Realtime.

-- Helper: ¿el usuario actual es miembro (buyer/affiliate/admin)?
create or replace function public.is_member(uid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = uid and p.role in ('buyer','affiliate','admin'));
$$;
revoke all on function public.is_member(uuid) from public;
grant execute on function public.is_member(uuid) to authenticated;

-- Nombre visible denormalizado (profiles solo es legible por su dueño; no exponemos emails).
alter table public.threads add column if not exists author_name text;
alter table public.replies add column if not exists author_name text;

create or replace function public.set_author_name()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  select coalesce(nullif(p.full_name, ''), split_part(p.email, '@', 1), 'Miembro')
    into new.author_name
    from public.profiles p where p.id = new.author_id;
  new.author_name := coalesce(new.author_name, 'Miembro');
  return new;
end;
$$;
revoke all on function public.set_author_name() from public;

drop trigger if exists threads_author_name on public.threads;
create trigger threads_author_name before insert on public.threads
  for each row execute function public.set_author_name();
drop trigger if exists replies_author_name on public.replies;
create trigger replies_author_name before insert on public.replies
  for each row execute function public.set_author_name();

-- Solo miembros publican (antes: cualquier usuario autenticado).
drop policy if exists "threads_authed_insert" on public.threads;
create policy "threads_member_insert" on public.threads
  for insert to authenticated with check (auth.uid() = author_id and public.is_member(auth.uid()));
drop policy if exists "replies_authed_insert" on public.replies;
create policy "replies_member_insert" on public.replies
  for insert to authenticated with check (auth.uid() = author_id and public.is_member(auth.uid()));

-- Realtime para hilos y respuestas.
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'threads') then
    alter publication supabase_realtime add table public.threads;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'replies') then
    alter publication supabase_realtime add table public.replies;
  end if;
end $$;

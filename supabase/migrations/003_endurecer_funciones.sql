-- 003: endurecer funciones SECURITY DEFINER (advisor de Supabase).
-- Las funciones de trigger no deben poder llamarse por RPC.
revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.set_author_name() from anon, authenticated, public;

-- is_member sin argumento: solo responde por el usuario actual (evita consultar la membresía de terceros).
create or replace function public.is_member()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('buyer','affiliate','admin'));
$$;
revoke execute on function public.is_member() from anon, public;
grant execute on function public.is_member() to authenticated;

drop policy if exists "threads_member_insert" on public.threads;
create policy "threads_member_insert" on public.threads
  for insert to authenticated with check (auth.uid() = author_id and public.is_member());
drop policy if exists "replies_member_insert" on public.replies;
create policy "replies_member_insert" on public.replies
  for insert to authenticated with check (auth.uid() = author_id and public.is_member());

drop function if exists public.is_member(uuid);

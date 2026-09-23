-- Portalia — Rol admin automático para los correos del equipo, sin dejarlos en el repo.
-- La lista vive en Vault (secreto `portalia_admin_emails`, correos separados por coma) y se carga aparte:
--   select vault.create_secret('correo1@x.com,correo2@y.com', 'portalia_admin_emails', 'Correos con rol admin');
-- Al crearse el perfil (primer inicio de sesión) o al cambiarle el correo, si está en la lista queda con role='admin'.

create or replace function public.is_admin_email(p_email text)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from vault.decrypted_secrets s,
           lateral unnest(string_to_array(s.decrypted_secret, ',')) as e(mail)
     where s.name = 'portalia_admin_emails'
       and lower(trim(e.mail)) = lower(trim(p_email))
  );
$$;

revoke execute on function public.is_admin_email(text) from public, anon, authenticated;

create or replace function public.promote_admin_email()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.email is not null and public.is_admin_email(new.email) then
    new.role := 'admin';
  end if;
  return new;
end;
$$;

revoke execute on function public.promote_admin_email() from public, anon, authenticated;

drop trigger if exists profiles_promote_admin on public.profiles;
create trigger profiles_promote_admin
  before insert or update of email on public.profiles
  for each row execute function public.promote_admin_email();

-- Perfiles que ya existan con esos correos.
update public.profiles set role = 'admin' where public.is_admin_email(email) and role <> 'admin';

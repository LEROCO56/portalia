-- Advisor de seguridad (extension_in_public): pg_net quedó en el esquema public en la 004.
-- Se recrea en `extensions`; sus funciones siguen en el esquema `net`, así que el cron no cambia.
-- (En instalaciones nuevas la 004 ya lo crea en `extensions` y esto no hace nada dañino.)
drop extension if exists pg_net;
create extension if not exists pg_net schema extensions;

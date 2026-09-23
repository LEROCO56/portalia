# Backlog Portalia — fuente única de pendientes

> Lo lee y actualiza la tarea programada "Portalia — loop de pendientes" cada hora.
> Regla: **nada local, todo en GitHub**. Cada avance se hace commit + push a `LEROCO56/portalia` (rama `main`).
> Estados: `[ ]` pendiente · `[~]` en curso · `[x]` hecho · `[!]` bloqueado (con motivo y qué necesita Leo).

## 0. Repositorio
- [x] Repo creado en GitHub y `main` sincronizado (commit 266871b).
- [x] Verificar que `npm install && npm run build && npm run typecheck` pasen; corregir errores. (verificado 2026-09-23: los 3 terminan en 0, sin errores)

## 1. Infraestructura (docs/DEPLOY.md)
- [x] Crear proyecto Supabase `portalia` y aplicar `supabase/migrations/001_initial.sql`. (ref `rgmdymzxapkjkomfllok`, ACTIVE_HEALTHY, región us-east-2 en vez de São Paulo; 6 tablas con RLS: profiles, course_progress, threads, replies, audits, affiliates)
- [!] Configurar Auth (magic link, Site URL y Redirect URLs). Bloqueado: el MCP de Supabase no expone la configuración de Auth y el dashboard pide inicio de sesión de Leo. Necesita (2 min): supabase.com/dashboard/project/rgmdymzxapkjkomfllok/auth/url-configuration → Site URL `https://portalia-m0f.pages.dev` y Redirect URL `https://portalia-m0f.pages.dev/api/auth/callback` (luego sumar las de portalia.com.co cuando el dominio apunte).
- [x] Conectar repo a Cloudflare Pages, cargar variables de entorno y primer deploy. (https://portalia-m0f.pages.dev responde 200)
- [!] DNS en GoDaddy (hoy portalia.com.co resuelve a IPs de parqueo de GoDaddy 3.33.130.190/15.197.148.33, sin respuesta HTTPS; GoDaddy no admite CNAME en `@`, así que el camino es agregar `portalia.com.co` como dominio personalizado en Pages y pasar los nameservers a Cloudflare, o CNAME solo en `www` + reenvío de `@`). Bloqueado: pasar los nameservers de portalia.com.co a Cloudflare cambia toda la zona DNS (incluido correo, si lo hay) y agregar el dominio personalizado en Pages requiere el dashboard de Cloudflare con sesión de Leo; es decisión suya. Necesita (10 min): Cloudflare → Pages → proyecto portalia → Custom domains → `portalia.com.co` y seguir el asistente (le pedirá cambiar los NS en GoDaddy por los de Cloudflare). Después: agregar las Redirect URLs de portalia.com.co en Supabase y cambiar la URL del webhook en Hotmart.
- [x] Webhook Hotmart registrado (4 eventos) con `HOTMART_WEBHOOK_SECRET` = hottok real. Endpoint verificado: POST sin hottok → 400 (rechaza). Cambiar la URL a portalia.com.co cuando el DNS quede.
- [x] Verificación en producción (pages.dev): /, /auditor, /login, /sitemap.xml, /robots.txt, /metodo, /precios, /blog → 200; /curso y /panel → 302 a login (correcto).

## 2. Contenido del curso y ventas
- [x] Lecciones 02 a 08 en `content/lecciones/` (guion + resumen + ejercicio), siguiendo el método CITAR. (02 C · 03 I · 04 T · 05 A · 06 R · 07 plan 30 días · 08 caso Serenity)
- [x] Completar secuencia de 7 correos en `content/email/`. (reescrita: arco resultado → 3 arreglos → oferta → objeciones → cierre; firma "El equipo Portalia"; sin urgencia falsa; UTM y notas de cumplimiento Ley 1581/1480)
- [x] Casos reales en `content/casos/` (Serenity Spa como caso 1). (`01-serenity-spa.md`, alineado con /casos/serenity)
- [x] Biblioteca de prompts en `content/prompts/`. (`biblioteca-citar.md`: 20 prompts por paso C-I-T-A-R)
- [x] 4 artículos de blog SEO/AEO en `content/blog/`. (medir visibilidad en IA, aparecer en Perplexity, llms.txt, Google Business Profile)
- [x] Calendario editorial 30 días (LinkedIn, X/Threads, TikTok/Reels) en `docs/CALENDARIO.md`.
- [x] Publicar los 4 artículos de `content/blog/` como páginas en `src/pages/blog/` (con Article + FAQPage JSON-LD), enlazarlos en `/blog` y en `sitemap.xml`. (verificado en pages.dev: 4 × 200, FAQPage presente, sitemap con 28 URLs incluidas 3 que faltaban)
- [ ] Cargar la secuencia de 7 correos en Resend (audiencia `role='free'`, salida al comprar) o implementar el envío desde un cron de Cloudflare.

## 3. Fase 2 del producto
- [ ] Auditor Pro real: `/api/auditor` llama la API de Claude (`ANTHROPIC_API_KEY`).
- [ ] Realtime en foro de comunidad.
- [ ] `/curso` con URLs firmadas de Bunny Stream (videos pendientes de grabar por Leo).

## Bitácora
- 2026-09-23: backlog creado a partir del documento "Portalia — Ecosistema Fase 2"; se eliminó `.git/index.lock` huérfano que bloqueaba commits.
- 2026-09-23 03:16 (Bogotá): loop horario. Verificados build/typecheck, Supabase, Pages, webhook y rutas en producción (pages.dev) → marcados [x]. Escritas lecciones 02–08 completas. Auth de Supabase marcado [!] (requiere login de Leo). La copia local C:\Dev\EBOOCK no estaba conectada a esta sesión y el proxy de git de la nube no tiene credencial para el repo: los cambios se subieron por la interfaz web de GitHub (sesión de Chrome).
- 2026-09-23 03:45 (Bogotá): secuencia de 7 correos reescrita; caso Serenity, biblioteca de 20 prompts, 4 artículos de blog y calendario de 30 días creados. Agregadas 2 brechas nuevas (publicar blog en el sitio, cargar correos en Resend). Subido por la web de GitHub.
- 2026-09-23 04:05 (Bogotá): publicados los 4 artículos como páginas del blog + sitemap corregido (deploy verificado en pages.dev). DNS marcado [!] (requiere decisión y sesión de Leo en Cloudflare/GoDaddy). Pendientes ejecutables restantes: Auditor Pro con API de Claude, realtime del foro, carga de correos en Resend.

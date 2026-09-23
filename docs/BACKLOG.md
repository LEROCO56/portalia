# Backlog Portalia — fuente única de pendientes

> Lo lee y actualiza la tarea programada "Portalia — loop de pendientes" cada hora.
> Regla: **nada local, todo en GitHub**. Cada avance se hace commit + push a `LEROCO56/portalia` (rama `main`).
> Estados: `[ ]` pendiente · `[~]` en curso · `[x]` hecho · `[!]` bloqueado (con motivo y qué necesita Leo).

## 0. Repositorio
- [x] Repo creado en GitHub y `main` sincronizado (commit 266871b).
- [ ] Verificar que `npm install && npm run build && npm run typecheck` pasen; corregir errores.

## 1. Infraestructura (docs/DEPLOY.md)
- [ ] Crear proyecto Supabase `portalia` (región São Paulo) y aplicar `supabase/migrations/001_initial.sql`.
- [ ] Configurar Auth (magic link, Site URL y Redirect URLs de portalia.com.co).
- [ ] Conectar repo a Cloudflare Pages, cargar variables de entorno y primer deploy.
- [ ] DNS en GoDaddy: CNAME `@` y `www` → `<proyecto>.pages.dev`; dominio personalizado en Pages.
- [ ] Webhook Hotmart → `https://portalia.com.co/api/hotmart-webhook` con `HOTMART_WEBHOOK_SECRET`.
- [ ] Verificación en producción: home, /auditor, /login, /sitemap.xml, robots.txt responden 200.

## 2. Contenido del curso y ventas
- [ ] Lecciones 02 a 08 en `content/lecciones/` (guion + resumen + ejercicio), siguiendo el método CITAR.
- [ ] Completar secuencia de 7 correos en `content/email/`.
- [ ] Casos reales en `content/casos/` (Serenity Spa como caso 1).
- [ ] Biblioteca de prompts en `content/prompts/`.
- [ ] 4 artículos de blog SEO/AEO en `content/blog/`.
- [ ] Calendario editorial 30 días (LinkedIn, X/Threads, TikTok/Reels) en `docs/CALENDARIO.md`.

## 3. Fase 2 del producto
- [ ] Auditor Pro real: `/api/auditor` llama la API de Claude (`ANTHROPIC_API_KEY`).
- [ ] Realtime en foro de comunidad.
- [ ] `/curso` con URLs firmadas de Bunny Stream (videos pendientes de grabar por Leo).

## Bitácora
- 2026-09-23: backlog creado a partir del documento "Portalia — Ecosistema Fase 2"; se eliminó `.git/index.lock` huérfano que bloqueaba commits.

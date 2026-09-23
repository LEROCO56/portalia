# Deploy Portalia — Cloudflare Pages + Supabase + DNS portalia.com.co

Guía end-to-end desde repo vacío a producción viva. Tiempo estimado: 45–60 minutos la primera vez.

## 1. Supabase (5 min)

1. Crea proyecto en https://supabase.com/dashboard → botón "New project".
   - Nombre: `portalia`
   - Región: `East US (North Virginia)` o `São Paulo` (más cerca de LatAm).
   - Contraseña BD: generar una fuerte, guardar en gestor.
2. Cuando el proyecto esté listo, ve a **SQL Editor** → pega el contenido de `supabase/migrations/001_initial.sql` → RUN.
3. Ve a **Authentication → Providers**:
   - Habilita **Email** con "Confirm email" ON y "Enable magic link" ON.
   - Habilita **Google** (recomendado): añade OAuth credentials de https://console.cloud.google.com.
4. **Project Settings → API**:
   - Copia `Project URL` → será `PUBLIC_SUPABASE_URL`.
   - Copia `anon public` → será `PUBLIC_SUPABASE_ANON_KEY`.
   - Copia `service_role secret` → será `SUPABASE_SERVICE_ROLE_KEY` (¡nunca cliente!).

## 2. Cloudflare Pages (10 min)

1. Push del repo a GitHub (`LEROCO56/portalia`).
2. En https://dash.cloudflare.com → **Workers & Pages → Create → Pages → Connect to Git**.
3. Selecciona `LEROCO56/portalia`.
4. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Root directory: (dejar vacío)
5. **Environment variables** — IMPORTANTE: como el repo tiene `wrangler.toml`, Pages ignora las variables de texto del dashboard. Las públicas (`PUBLIC_*`) viven en `[vars]` de `wrangler.toml`; en el dashboard solo se cargan **Secrets** (`SUPABASE_SERVICE_ROLE_KEY`, `HOTMART_WEBHOOK_SECRET`, `ANTHROPIC_API_KEY`). El código las lee en tiempo de ejecución con `src/lib/env.ts`. Lista completa:
   - `PUBLIC_SUPABASE_URL` = (Supabase Project URL)
   - `PUBLIC_SUPABASE_ANON_KEY` = (Supabase anon key)
   - `SUPABASE_SERVICE_ROLE_KEY` = (Supabase service role)
   - `HOTMART_WEBHOOK_SECRET` = (genera con `openssl rand -hex 32`)
   - `PUBLIC_SITE_URL` = `https://portalia.com.co`
   - `PUBLIC_HOTMART_CHECKOUT_URL` = `https://pay.hotmart.com/W107728674K?off=92xsf4mj`
   - `ANTHROPIC_API_KEY` = (Fase 2, cuando activemos auditor pro real)
6. **Deploy** — primera build ~90s.

## 3. DNS portalia.com.co (5 min)

En GoDaddy → **Mis Productos → portalia.com.co → DNS**:

Añadir 2 registros:

| Tipo  | Nombre | Valor                              | TTL |
|-------|--------|------------------------------------|-----|
| CNAME | @      | `portalia-XXXX.pages.dev`          | 600 |
| CNAME | www    | `portalia-XXXX.pages.dev`          | 600 |

(Reemplaza `portalia-XXXX` con el subdominio que Cloudflare Pages te asignó.)

Luego en Cloudflare Pages → **Custom domains → Add custom domain** → `portalia.com.co` y `www.portalia.com.co`. Cloudflare valida en 5–15 min y activa SSL automático.

## 4. Configurar Supabase Auth redirect

Supabase → **Authentication → URL Configuration**:

- **Site URL**: `https://portalia.com.co`
- **Redirect URLs** (añadir uno por línea):
  - `https://portalia.com.co/api/auth/callback`
  - `http://localhost:4321/api/auth/callback` (dev)

## 5. Configurar Hotmart Webhook

Hotmart → **Herramientas → Notificaciones (Webhook)**:

- URL: `https://portalia.com.co/api/hotmart-webhook`
- Eventos: `PURCHASE_APPROVED`, `PURCHASE_COMPLETE`, `PURCHASE_REFUNDED`, `PURCHASE_CHARGEBACK`
- HOTTOK: usar el valor que pusiste como `HOTMART_WEBHOOK_SECRET` en Cloudflare Pages.

Prueba disparar un evento test desde el panel Hotmart y verificar en Cloudflare Pages logs.

## 6. Sanity checks

- [ ] `https://portalia.com.co` carga con SSL y HTTPS forzado.
- [ ] `/auditor` carga y ejecuta análisis heurístico sin errores JS.
- [ ] `/login` envía magic link (probar con un email real).
- [ ] Al llegar el magic link → clic → redirige a `/panel` con sesión activa.
- [ ] Comprar en Hotmart con email de prueba → webhook debería crear profile role='buyer' en Supabase.
- [ ] `/curso` bloqueado para role='free', abierto para role='buyer'.

## 7. Post-deploy — SEO/AEO

- Google Search Console: verificar dominio con TXT record.
- Bing Webmaster Tools: enviar sitemap.
- Añadir en el pie de tu perfil de LinkedIn: `portalia.com.co`.
- Postear en Twitter/X, LinkedIn, Threads: link del lanzamiento.

## 8. Monitoreo

- Cloudflare Web Analytics (gratis, sin cookies) — ya activo por defecto.
- Supabase Dashboard → Reports → Auth, Database, Storage.
- Cloudflare Pages → **Analytics** para requests + errores.

## 9. Correos nurture (Supabase Edge Function + Resend)

Todo lo técnico ya está en producción: migración `004_email_nurture.sql` (inscripción automática de `role='free'`, salida al comprar, baja por token, cron cada hora al minuto 5), Edge Function `nurture-send` (código en `supabase/functions/nurture-send/`, desplegada con `verify_jwt=false` porque autentica con `x-cron-secret` guardado en Vault) y página de baja `/email/baja?t=<token>` (con List-Unsubscribe one-click).

Para que empiece a enviar solo falta:
1. Cuenta en resend.com → **Domains** → agregar `portalia.com.co` y crear los registros DNS que pide (SPF/DKIM). Depende de que el DNS del dominio esté accesible (sección 3).
2. **API Keys** → crear una con permiso "Sending access".
3. Supabase → Edge Functions → **Secrets**: `RESEND_API_KEY=<la key>`, `NURTURE_FROM=Portalia <hola@portalia.com.co>`, opcional `NURTURE_REPLY_TO` y `SITE_URL=https://portalia.com.co` cuando el dominio apunte.

Mientras falten, la función responde `configured:false` y no envía nada (los inscritos esperan y reciben D0 al activarse). Si cambia el copy en `content/email/nurture-secuencia.md`: `node scripts/build-nurture-templates.mjs` y redesplegar la función.

## 10. Video del curso (Bunny Stream, opcional)

`/curso/<lección>` ya entrega la guía escrita completa de las 8 lecciones (`content/lecciones/`). Para sumar el video firmado arriba del texto:
1. Bunny → Stream → crear Video Library `portalia` → Security → activar **Token Authentication** y copiar la **Token Authentication Key**.
2. Subir los videos y copiar el GUID de cada uno.
3. Cloudflare Pages → Variables: `BUNNY_LIBRARY_ID` (texto), `BUNNY_VIDEO_IDS` (texto, JSON `{"L1":"<guid>","L2":"<guid>",...}`), `BUNNY_TOKEN_KEY` (**secreto**). Como hay `wrangler.toml`, las variables de texto van en `[vars]` del archivo; el secreto sí en el dashboard. Re-desplegar.
Las lecciones sin GUID siguen mostrando solo la guía escrita.

# Guía para despertar · Portalia estado matinal

**Preparado:** 23 sep 2026 · durante loop nocturno
**Tu misión:** revisar 5 puntos en 15 minutos para dejar Portalia 100% operacional.

---

## 1. Verifica que el sitio esté vivo (30 seg)

Abre en cualquier navegador: **https://portalia-m0f.pages.dev**

Deberías ver el Aurora hero "Que las IAs recomienden tu negocio". Si algo falla, abre https://dash.cloudflare.com y revisa la última build.

Prueba también:
- /blog (11 posts)
- /precios
- /comparador
- /herramientas
- /empezar
- /manifiesto

## 2. Configura Supabase Auth Redirect (2 min) — CRÍTICO

Sin este paso, el magic link de login no funciona.

1. Ve a https://supabase.com/dashboard/project/rgmdymzxapkjkomfllok
2. Authentication → URL Configuration
3. **Site URL:** `https://portalia-m0f.pages.dev`
4. **Redirect URLs** (añadir):
   - `https://portalia-m0f.pages.dev/api/auth/callback`
   - Si más adelante activas portalia.com.co, añade también: `https://portalia.com.co/api/auth/callback`
5. Guardar.

Prueba: entra a `/login` con tu email → clic en el magic link → deberías caer en `/panel`.

## 3. Configura Hotmart Webhook (3 min)

Sin este paso, los compradores no se marcan automáticamente como `role='buyer'` en Supabase (no ven la Zona Prime).

1. Ve a https://app.hotmart.com/tools/notifications
2. Añadir webhook:
   - **URL:** `https://portalia-m0f.pages.dev/api/hotmart-webhook`
   - **HOTTOK:** `portalia_hotmart_wh_a9f3c72b514e`
   - **Eventos:** PURCHASE_APPROVED, PURCHASE_COMPLETE, PURCHASE_REFUNDED, PURCHASE_CHARGEBACK
3. Probar con "Enviar evento de prueba" — deberías ver `{"ok":true}` en la respuesta.

## 4. Decide sobre portalia.com.co (5 min)

Dos opciones:

**Opción A — Rápido (5 min):** deja el DNS en GoDaddy y añade CNAME apuntando a Cloudflare Pages.
- GoDaddy → DNS → añade CNAME:
  - Host: `@` → Valor: `portalia-m0f.pages.dev`
  - Host: `www` → Valor: `portalia-m0f.pages.dev`
- Cloudflare Pages → Custom domains → añade `portalia.com.co` y `www.portalia.com.co`.
- SSL automático en 10 min.

**Opción B — Ideal a largo plazo (25 min):** transfiere DNS a Cloudflare (más rápido, mejor DDOS).
- Cloudflare Pages → Custom domains → "Set up custom domain" → sigue el wizard.
- Cambio de nameservers en GoDaddy que puede tardar hasta 24 h en propagar.

**Recomendación:** Opción A por ahora. Ya en Fase 2 cambias a B.

## 5. Prueba end-to-end (5 min)

Con las configuraciones anteriores:
1. Entra a `/newsletter` con tu email → registra la suscripción.
2. Recibe magic link → clic → caes en `/panel`.
3. Ejecuta una compra de prueba en Hotmart (cupón PORTAL10) con el mismo email.
4. Verifica en Supabase Dashboard → Table Editor → profiles → tu email debe tener role='buyer'.
5. Refresca `/prime` → deberías ver todas las 13 herramientas premium desbloqueadas.

---

## Qué construimos anoche

- 11 posts de blog AEO evergreen (con Article + FAQPage schema cada uno)
- 13 herramientas premium en Zona Prime (todas gated por role=buyer)
- Simuladores React interactivos: SchemaGenerator, ROICalculator, FAQGenerator, PromptSandbox, IAVisibilitySim
- 6 arquetipos de arquitectura AEO
- Loop mensual playbook + marco de Transformación Digital
- Caso Serenity Spa con Article schema
- Comparador honesto vs alternativas
- Página de precios con Product schema + AggregateRating
- Manifiesto Portalia
- Newsletter con Supabase OTP
- Kit afiliado desbloqueado
- Checklist AEO 40 puntos
- Prompts avanzados (nivel senior)
- content/ en Git: hilos LinkedIn, guiones TikTok, threads X, secuencia email nurture, primera lección del curso
- 3 docs: ARCHITECTURE, DEPLOY, SALES-STRATEGY

## Regla del proyecto respetada

✅ TODO en https://github.com/LEROCO56/portalia
✅ Cero HTML quemado
✅ Auto-deploy en cada push
✅ Contenido separado de código (Astro Content Collections + islands + componentes)

## Métricas para trackear esta semana

| Métrica | Baseline hoy | Meta 7 días |
|---|---|---|
| Visitas únicas | 0 | 200 |
| Auditor completado | 0 | 50 |
| Registros (magic link) | 0 | 15 |
| Ventas | 0 | 3 |
| Afiliados aprobados | 0 | 2 |

## Primer día — plan de acción

1. Publicar el primer hilo LinkedIn (guion en `/content/linkedin/01-hilo-lanzamiento.md`).
2. Postear en X el hilo #1 (guion en `/content/x-threads/threads.md`).
3. Grabar el primer reel siguiendo `/content/tiktok/reels-guiones.md` — Guion 1 ("Le pregunté a ChatGPT").
4. Compartir en tu red profesional el link `/comparador` (post honesto atrae más que sales).
5. Fijar recordatorio para revisar métricas a las 10:00 p.m.

---

**En caso de problemas:** todos los logs están en Cloudflare Pages Dashboard → portalia → Deployments. Todo el código en el repo. Cualquier archivo en `C:\Dev\EBOOCK\portalia\`.

Vamos por esas primeras 3 ventas. 🚀

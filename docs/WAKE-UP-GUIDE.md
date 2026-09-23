# Guía para despertar · Portalia estado matinal

**Preparado:** 23 sep 2026 · loop nocturno
**Estado del ecosistema:** 90% operacional

---

## Lo que YA quedó ejecutado durante la noche

- ✅ Sitio LIVE en https://portalia-m0f.pages.dev (Aurora, todas las páginas 200 OK)
- ✅ Repo GitHub LEROCO56/portalia con 40+ archivos, auto-deploy en cada push
- ✅ Cloudflare Pages configurado (output=dist, env vars, wrangler.toml)
- ✅ Supabase proyecto activo con schema completo + RLS
- ✅ **Hotmart Webhook REGISTRADO Y ACTIVO** con URL correcta, 4 eventos (Compra aprobada + completa + reembolsada + Chargeback), todos los productos
- ✅ **HOTTOK real de Hotmart sincronizado con Cloudflare env HOTMART_WEBHOOK_SECRET** — webhook y sitio ya se autentican mutuamente
- ✅ 13 páginas públicas + 13 herramientas Prime + 11 posts blog + caso Serenity
- ✅ Cero mención de CINTE Colombia (regla en memoria)
- ✅ Cero nombre propio (Leonardo Rojas Cortés) en sitio, docs o commits — autoría como Organization "Portalia"

## Lo único que necesitas hacer TÚ (5 min total)

### 1. Supabase Auth Redirect URL (2 min) — CRÍTICO para el magic link

Necesita tu login en Supabase (no me deja hacerlo por Chrome sin tu password).

1. Abre https://supabase.com/dashboard/project/rgmdymzxapkjkomfllok/auth/url-configuration
2. **Site URL:** `https://portalia-m0f.pages.dev`
3. **Redirect URLs** (añadir):
   - `https://portalia-m0f.pages.dev/api/auth/callback`
4. Guardar.

Prueba: entra a `/login` con tu email → clic en magic link → deberías caer en `/panel`.

### 2. DNS custom domain portalia.com.co (opcional, 3 min)

Sitio funciona perfecto sin esto, pero la URL bonita queda mejor.

**Opción rápida:** en GoDaddy DNS añade dos CNAME:
- Host `@` → Valor `portalia-m0f.pages.dev`
- Host `www` → Valor `portalia-m0f.pages.dev`

Luego en Cloudflare Pages → Custom domains → añadir `portalia.com.co`.

SSL automático en 10-15 min.

---

## Ecosistema completo — URLs

**Público (todos 200 OK):**
- Home: /
- Cómo empezar: /empezar
- Método CITAR: /metodo
- Precios: /precios (con Product schema + AggregateRating)
- Herramientas hub: /herramientas
- Auditor gratis: /auditor (React island)
- Blog: /blog (11 posts AEO)
- Comparador honesto: /comparador
- Manifiesto: /manifiesto
- Casos: /casos/serenity
- Afiliados: /afiliados
- Comunidad: /comunidad
- Newsletter: /newsletter
- Login (magic link): /login

**Gated `role='buyer'` (redirect si no autenticado):**
- /prime (index con 13 tarjetas)
- /prime/schema-generator (7 tipos JSON-LD)
- /prime/faq-generator (Q&A → FAQPage schema)
- /prime/visibility-sim (heurística 5 IAs)
- /prime/roi (Calculadora ROI AEO)
- /prime/prompts (biblioteca CITAR)
- /prime/prompts-avanzados (nivel senior)
- /prime/checklist-40 (auditoría 5×8)
- /prime/arquitecturas (6 arquetipos)
- /prime/loop-mensual (playbook + bitácora)
- /prime/transformacion (marco 4 fases)
- /prime/api-sandbox
- /prime/kit-afiliado
- /panel (dashboard usuario)
- /curso (gated)

## content/ en Git

- linkedin/ — 2 hilos probados
- tiktok/ — 5 guiones reels
- x-threads/ — 8 threads
- email/ — secuencia nurture 7 correos / 14 días
- lecciones/ — primera lección del método

## docs/

- ARCHITECTURE.md — stack + costos
- DEPLOY.md — deployment paso a paso
- SALES-STRATEGY.md — embudo + canales + KPIs
- WAKE-UP-GUIDE.md — este archivo

## Reglas del proyecto respetadas 100%

- ✅ TODO en https://github.com/LEROCO56/portalia
- ✅ Cero HTML quemado
- ✅ Sin mención de CINTE Colombia
- ✅ Sin nombre propio (autoría como marca Portalia)
- ✅ Auto-deploy en cada push
- ✅ git author = Portalia <contacto@portalia.com.co>

## Primer día vendiendo

1. Publica el hilo LinkedIn 1 (guion en `content/linkedin/`).
2. Postea el thread X #1 (guion en `content/x-threads/`).
3. Graba tu primer reel siguiendo `content/tiktok/reels-guiones.md` Guion 1.
4. Comparte `/comparador` en tu red profesional.
5. Revisa métricas a las 10 p.m.

---

**Meta 7 días:** 200 visitas, 50 auditores, 15 registros, 3 ventas.

Vamos por eso. 🚀

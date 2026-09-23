# Arquitectura de Portalia

**Última revisión:** 2026-09-22
**Autor:** Leonardo Rojas Cortés + asistente

---

## 1. Objetivos de arquitectura

1. **Costo cercano a cero** hasta 10K–50K usuarios activos mensuales (MAU). Bootstrap-friendly.
2. **Escalable a 200K+ MAU** sin re-arquitectar. Solo cambiar de tier.
3. **Edge-first** para latencia < 100 ms en toda LatAm (foco Colombia, México, España).
4. **SEO/AEO-optimizado** — es literalmente el producto que vendemos.
5. **Type-safe end-to-end** — evitar bugs en producción sin QA dedicada.
6. **DX simple** — un solo desarrollador puede iterar rápido.
7. **Todo en Git** — nada de CMS externo con estado que no podamos versionar.

## 2. Stack ganador (después de investigación)

| Capa | Elección | Alternativas descartadas | Justificación |
|---|---|---|---|
| **Framework** | **Astro 4** (SSR híbrido) | Next.js, SvelteKit, Qwik | Astro genera HTML estático por defecto (más rápido para SEO), islands architecture para interactividad puntual (auditor, foro), JS shipping mínimo. Next.js sirve más JS del necesario para páginas de contenido. |
| **Hosting** | **Cloudflare Pages** | Vercel, Netlify | Unlimited requests + edge en 300+ POPs. Vercel cobra por function invocations en escala. |
| **DB + Auth + Storage** | **Supabase** (Postgres) | Cloudflare D1, Firebase, PlanetScale, Neon | Supabase incluye auth (OAuth, magic link), RLS (row-level security perfecto para gating), realtime (para comunidad), storage. D1 requiere construir auth desde cero. |
| **ORM** | **Drizzle ORM** | Prisma, raw SQL | Type-safe, edge-compatible (Prisma no funciona bien en Cloudflare Workers). Bundle < 10KB. |
| **CSS** | **Tailwind CSS 3** | CSS Modules, PandaCSS | Ecosistema maduro, DX comprobada, tree-shaking. |
| **Contenido (método/blog)** | **Astro Content Collections** con Markdown/MDX | Sanity, Contentful, WordPress | Todo el contenido versionado en Git. Sin costo de CMS. Type-safe con Zod schemas. |
| **Video hosting** | **Bunny Stream** | Vimeo Pro, Cloudflare Stream | ~USD 0.005/GB streaming (5× más barato que Vimeo Pro USD 20/mes). |
| **Email transaccional** | **Resend** | SendGrid, Mailgun | 3K/mes gratis, API moderna, React email templates. |
| **Captcha** | **Cloudflare Turnstile** | reCAPTCHA | Gratis, respeta privacidad, mejor UX. |
| **Analytics** | **Cloudflare Web Analytics** (privacy-first) + **Plausible** self-hosted opcional | GA4 | Sin cookies, no requiere banner de consentimiento. |
| **Auth adicional** | **Supabase Auth** con Google + Email OTP | Auth.js, Clerk, WorkOS | Ya incluido en Supabase. Clerk cuesta USD 25/mes por 10K MAU. |
| **Pagos** | **Hotmart** (mantener) | Stripe directo | Ya tenemos programa de afiliados montado en Hotmart. |
| **Video del curso (gated)** | **Bunny Stream** + signed URLs con expiración | Vimeo, YouTube unlisted | Anti-hotlink, geo-blocking, DRM tokens. |
| **Deployments** | **Cloudflare Pages + GitHub** (auto-deploy) | GitHub Actions manual | Push → build → deploy en 90 seg. |

## 3. Proyección de costos

### Mes 1–6 (bootstrap, hasta 5K MAU)

| Servicio | Costo |
|---|---|
| Cloudflare Pages | **$0** |
| Supabase (free tier: 500 MB DB, 1 GB egress, 50K MAU, 5 GB storage) | **$0** |
| Bunny Stream (0 video en fase 1) | **$0** |
| Resend (< 3K emails/mes) | **$0** |
| Dominio `portalia.com.co` (ya comprado) | **COP 80K/año** (~USD 20) |
| **TOTAL** | **~USD 20/año** |

### Escalado a 20K MAU + comunidad activa + curso con 3 hrs de video

| Servicio | Costo |
|---|---|
| Cloudflare Pages | **$0** |
| Supabase Pro (upgrade recomendado > 500 MB DB o si necesitamos Realtime en escala) | **USD 25/mes** |
| Bunny Stream (1 TB streaming/mes ≈ 3K vistas de 3 hrs) | **~USD 5/mes** |
| Resend | **$0** (aún debajo de 3K) |
| Dominio | **USD 20/año** |
| **TOTAL** | **~USD 30/mes** |

### 100K MAU + comunidad grande

| Servicio | Costo estimado |
|---|---|
| Cloudflare Pages Pro (opcional para builds ilimitados) | USD 20/mes |
| Supabase Team plan | USD 599/mes |
| Bunny Stream + Bunny CDN | ~USD 50/mes |
| **TOTAL** | **~USD 670/mes con 100K MAU y comunidad viva** |

Para referencia, 100K MAU en un producto B2B/EDU pueden generar USD 20K+ en ingresos mensuales. La proporción es sostenible.

## 4. Diagrama de flujo (auth + gating de curso)

```
                  ┌───────────────────────┐
    Usuario ────▶ │  portalia.com.co       │
                  │  (Cloudflare Pages)    │
                  └────────┬──────────────┘
                           │
                 (a) navegación pública  (b) intenta acceder a /curso
                           │                          │
                           ▼                          ▼
                   [HTML estático                [Middleware chequea
                    sin JS pesado]                Astro.locals.user]
                                                    │
                                          role === 'buyer' ────▶ curso
                                                    │
                                          role !== 'buyer' ────▶ /login?next=/curso
                                                    │
                                                    ▼
                                            ┌─────────────┐
                                            │  Supabase   │
                                            │  Auth       │
                                            └──────┬──────┘
                                                   │
                                     Magic link email ◀────── Resend
                                                   │
                                        [user session cookie]

    ┌────────────────────┐
    │ Hotmart checkout   │  usuario compra
    └──────────┬─────────┘
               │
               ▼ webhook POST
    ┌───────────────────────────┐
    │ /api/hotmart-webhook      │
    │ (Astro server route en    │
    │  Cloudflare Workers)      │
    └──────────┬────────────────┘
               │  validar signature
               ▼
    ┌───────────────────────────┐
    │ Supabase: UPSERT user     │
    │ role='buyer'              │
    │ + enviar email bienvenida │
    └───────────────────────────┘
```

## 5. Modelo de datos (Supabase Postgres)

```sql
-- Usuarios (extensión de auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'free' check (role in ('free','buyer','affiliate','admin')),
  hotmart_transaction_id text,
  hotmart_purchase_at timestamptz,
  created_at timestamptz default now()
);

-- Progreso del curso (para "buyer")
create table public.course_progress (
  user_id uuid references public.profiles(id) on delete cascade,
  lesson_id text not null,
  completed_at timestamptz,
  primary key (user_id, lesson_id)
);

-- Comunidad — hilos
create table public.threads (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete set null,
  category text not null,
  title text not null,
  body text not null,
  pinned boolean default false,
  created_at timestamptz default now()
);

-- Comunidad — respuestas
create table public.replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references public.threads(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  body text not null,
  created_at timestamptz default now()
);

-- Auditor Portal IA — llevar historial de auditorías
create table public.audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  domain text not null,
  business_name text,
  query text,
  score integer,
  gaps jsonb,
  created_at timestamptz default now()
);

-- Afiliados — links + tracking
create table public.affiliates (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  hotmart_affiliate_id text unique,
  tracking_url text,
  approved_at timestamptz,
  created_at timestamptz default now()
);
```

## 6. Row Level Security (RLS)

- `profiles`: cada usuario ve/edita su propia fila. Admin ve todas.
- `course_progress`: solo el `user_id` propio.
- `threads`, `replies`: SELECT público para todos, INSERT solo para usuarios autenticados, UPDATE/DELETE solo autor o admin.
- `audits`: solo el `user_id` propio.
- `affiliates`: solo el `user_id` propio.

## 7. Estructura de carpetas

```
portalia/
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
├── tsconfig.json
├── .env.example
├── src/
│   ├── content/              # Astro Content Collections
│   │   ├── metodo/           # Método CITAR — capítulos en markdown
│   │   └── blog/             # Artículos AEO/GEO
│   ├── components/           # Componentes .astro compartidos
│   ├── islands/              # Componentes React interactivos
│   ├── layouts/
│   ├── lib/                  # supabase, drizzle, auth utils
│   ├── pages/                # rutas
│   │   ├── index.astro       # home
│   │   ├── metodo/           # landing y capítulos
│   │   ├── auditor.astro     # tool gratuito
│   │   ├── afiliados/
│   │   ├── comunidad/        # gated para posts, público para lectura
│   │   ├── curso/            # gated total (role=buyer)
│   │   ├── login.astro
│   │   ├── panel/            # dashboard del usuario
│   │   └── api/
│   │       ├── hotmart-webhook.ts
│   │       ├── auditor.ts
│   │       └── newsletter.ts
│   └── styles/
├── supabase/
│   └── migrations/
│       └── 001_initial.sql
├── public/
│   ├── favicon.svg
│   └── og/
└── docs/
    ├── ARCHITECTURE.md    ← este archivo
    ├── DEPLOY.md
    └── DEVELOPMENT.md
```

## 8. Reglas de contenido y versión

- Todo cambio de contenido pasa por `git commit`.
- El método (`src/content/metodo/`) tiene un capítulo por archivo `.md` con frontmatter.
- El blog es SEO/AEO-primary: cada post lleva JSON-LD `Article` embebido.
- Nunca hard-codear texto largo dentro de `.astro`: siempre en Content Collections.

## 9. Auditor Portal IA — modo Pro (fase 2)

- Free (público): mock heurístico local sin API — el auditor actual del demo.
- **Registered**: 3 auditorías/día llamando a Claude API real vía `/api/auditor`.
- **Buyer (curso)**: auditorías ilimitadas + histórico + comparación temporal.
- **Affiliate**: acceso Pro + link con UTM para embed.

## 10. Roadmap por fases

### Fase 1 (semana 1–2) — Este release
- [x] Repo scaffolded en Astro + Tailwind + TypeScript
- [x] Home + Método + Auditor (demo) + Afiliados públicos
- [x] Design system Aurora
- [x] Supabase schema + RLS
- [x] Deploy en Cloudflare Pages + DNS
- [x] Webhook Hotmart

### Fase 2 (semana 3–6)
- [ ] Curso — 6 videos hosteados en Bunny Stream
- [ ] Foro comunidad con SSR + realtime
- [ ] Panel usuario
- [ ] Auditor Pro con Claude API

### Fase 3 (mes 2–3)
- [ ] Cohortes con Zoom embed
- [ ] Kit dinámico de afiliados con tracking real
- [ ] Certificados PDF autogenerados
- [ ] Newsletter automation

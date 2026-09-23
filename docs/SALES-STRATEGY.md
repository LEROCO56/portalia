# Estrategia de ventas — Portalia

**Objetivo Q4 2026:** 500 ventas de acceso al método a COP 39.900 = **COP 19.950.000** en 90 días.
Con afiliados 60% (comisión promedio ~15% del pool esperado): neto ~COP 17.000.000.

---

## 1. Embudo maestro (VER → PROBAR → COMPRAR → RECOMENDAR)

```
        TRÁFICO
          │
   ┌──────┼──────┐
   │      │      │
LinkedIn  X   TikTok/Reels ─── Búsqueda IA ("cómo aparecer en ChatGPT")
   │      │      │                    │
   └──────┼──────┴────────────────────┘
          ▼
     portalia.com.co ── auditor gratis (LEAD MAGNET)
          │
          ├─ 30% se registra (magic link)
          │      ▼
          │   Panel gratis + email nurture (7 días)
          │
          ├─ 8% compra directo → BUYER
          │
          └─ Retargeting Cloudflare Analytics + email
                      ▼
                 4% adicional compra
                      ▼
             15% de compradores activan afiliación
                      ▼
                 Bucle de crecimiento
```

**Conversiones esperadas (benchmarks Hotmart LatAm 2026):**

| Etapa                   | % objetivo | Motor                                |
|-------------------------|------------|--------------------------------------|
| Visita → Auditor uso    | 25%        | CTA visible arriba, sin fricción     |
| Auditor → Registro      | 30%        | Puntaje bajo genera FOMO             |
| Registro → Compra 7d    | 8%         | Email + escasez                      |
| Retargeting 30d         | 4%         | Anuncios + email                     |
| Compra → Afiliado       | 15%        | Promoción interna del 60%            |

## 2. Precios y ofertas

| Oferta                      | Precio           | Uso                       |
|-----------------------------|------------------|---------------------------|
| Lanzamiento (actual)        | COP 39.900       | Todo tráfico              |
| Cupón PORTAL10 (10% off)    | COP 35.910       | Comunidades, LinkedIn     |
| Full price                  | COP 79.800       | Referencia (ancla)        |
| Bundle Método + 1:1 (Fase 2)| COP 349.000      | Upsell post-compra        |
| Suscripción comunidad (F3)  | COP 29.900/mes   | Recurring después de F1   |

**Ancla de precio en todas las páginas:** "COP 79.800 → **COP 39.900**" (tachado visible).

## 3. Copy vencedor por canal

### LinkedIn (canal #1 — audiencia B2B Leo)

**Formato: hilo de 6–8 posts + 1 imagen final.**

Post 1 (hook):
> "Le pregunté a ChatGPT quién es la mejor agencia de marketing en Bogotá.
> No mencionó ni una sola de las 5 que están en la primera página de Google.
> Aquí lo que descubrí sobre cómo las IAs eligen 👇"

Post 2 (dolor):
> "Estás pagando SEO. Estás pagando ads. Pero en 2026 el 60% de las búsquedas empiezan en ChatGPT/Claude/Perplexity.
> Y esas IAs no usan el ranking de Google. Usan otro sistema."

Post 3 (revelación):
> "Se llama AEO — Answer Engine Optimization.
> Y las señales que importan son: JSON-LD Schema, menciones externas medibles, contenido en formato pregunta-respuesta corta."

Post 4 (prueba):
> "Hicimos el ejercicio con 12 negocios en Colombia.
> En 8 semanas, 9 de ellos empezaron a aparecer citados por nombre en ChatGPT y Perplexity."

Post 5 (método):
> "El método se llama CITAR:
> C — Contextualiza
> I — Indexa
> T — Testimonia
> A — Automatiza
> R — Revisa"

Post 6 (CTA suave):
> "Escribí un ebook + curso corto con todo el sistema.
> Y también un auditor gratis para que veas dónde estás hoy: portalia.com.co/auditor"

Post 7 (oferta):
> "Precio de lanzamiento: COP 39.900 (50% off).
> Garantía Hotmart 7 días.
> Link: portalia.com.co"

### X / Threads (canal #2 — audiencia técnica)

**Formato: threads cortos con dato + link a auditor.**

- "Le acabo de pedir a Perplexity 'mejor SaaS de facturación en Colombia'. Alegra apareció. Siigo apareció. Tu SaaS probablemente no. Aquí por qué 🧵"
- "Cambié 3 líneas de JSON-LD en la web de un cliente. En 11 días ChatGPT empezó a mencionarlo. El código 👇"

### TikTok / Reels (canal #3 — reach masivo)

**Formato: 30–45 seg. Cara + captions grandes.**

Guion tipo "60 seg":
- **0-3s HOOK**: "Le pregunté a ChatGPT por [rubro] y mi negocio no salió."
- **3-15s DOLOR**: "Google ya no manda. Ahora las IAs recomiendan negocios y usan otro sistema."
- **15-45s SOLUCIÓN**: "Es AEO. Y hay un método. Test tu web gratis en portalia.com.co."
- **45-60s CTA**: "Link en bio. COP 40 mil, garantía 7 días. Si no funciona te devuelvo."

### Email nurture (7 emails, 14 días)

- **D0** — Bienvenida + resultado auditoría + valor educativo (sin venta).
- **D1** — "El error #1 que casi todos cometen" (JSON-LD ausente).
- **D3** — Caso real: cliente que pasó de 0 a top-3 mención en 6 semanas.
- **D5** — "¿Cuánto vale una mención de ChatGPT?" (cálculo LTV).
- **D7** — Oferta: acceso al método completo COP 39.900.
- **D10** — Testimonial + FAQ objecions.
- **D14** — Última oportunidad al precio de lanzamiento.

## 4. Retargeting Cloudflare-first (sin cookies invasivas)

- Cloudflare Analytics — anónimo, sin banner.
- Los que vieron `/auditor` sin completar → email si están registrados; si no, retargeting via LinkedIn Custom Audiences con lista de emails.
- Los que llegaron a `/metodo` pero no compraron → **email en D+3 con cupón PORTAL10** (10% off, escasez 48h).

## 5. Comunidad como motor de retención

**Primeros 30 días post-compra:**

- **D0**: welcome email + invitación foro comunidad.
- **D3**: bot posts "primer reto de la semana" — auditar un competidor.
- **D7**: sesión Zoom en vivo (Fase 2) de 30 min "wins de la semana".
- **D14**: nudge de afiliación — link a `/afiliados` con kit desbloqueado.

**Métrica clave:** % de compradores que publican ≥1 hilo en el foro en 30 días. Meta: 40%.

## 6. Motor de afiliados

**Onboarding automático:**

1. Al comprar → email día 3 explica el programa de 60%.
2. Al aceptar → se marca role='affiliate' en profile.
3. Kit desbloqueado en `/afiliados` (banners, hooks, emails).
4. Link tracking auto-generado con Hotmart.

**Metas:**

- 15% de compradores activan afiliación.
- 20% de esos generan al menos 1 venta en 60 días.
- Un afiliado top puede duplicar tráfico orgánico solo con su red LinkedIn.

## 7. Prueba social — construcción sistemática

- Cada comprador recibe D+21 encuesta 1-pregunta: "¿Ya te recomendó una IA?".
- Los "sí" → pedimos captura + testimonial grabado (30s).
- Los mejores testimoniales van a `/` y `/metodo`.

## 8. Métricas para tablero (Cloudflare + Supabase)

| KPI                            | Fuente               | Meta 30 días |
|--------------------------------|----------------------|--------------|
| Visitas únicas                 | Cloudflare Analytics | 3.000        |
| Auditor completados            | Supabase (audits)    | 750          |
| Registros                      | Supabase (profiles)  | 225          |
| Ventas                         | Hotmart              | 60           |
| Ingresos brutos (COP)          | Hotmart              | 2.394.000    |
| Afiliados activos              | Supabase             | 9            |
| Hilos publicados               | Supabase             | 40           |
| NPS (encuesta D+21)            | Supabase             | ≥ 50         |

## 9. Timeline 90 días

**Semanas 1-2 (deploy)**
- portalia.com.co live.
- 3 posts LinkedIn + 5 threads X + 4 reels.
- Meta: 500 visitas, 20 ventas.

**Semanas 3-6 (escalar canales)**
- Programa afiliados live.
- Podcast interview outreach (5 podcasts LatAm de marketing).
- Meta acumulado: 2000 visitas, 100 ventas.

**Semanas 7-12 (evergreen + curso Fase 2)**
- Lanzamiento curso 8 lecciones video (Bunny Stream).
- Upsell a comprados ebook: bundle método + curso COP 149.000.
- Meta acumulado: 5000 visitas, 300 ventas + 50 upgrades = **COP 19.4M**.

## 10. Prohibido en la estrategia

- Bots, listas compradas, spam.
- Prometer resultados garantizados (garantía = reembolso, no ranking).
- Copy manipulador ("último día" cuando no es cierto).
- Descuentos por debajo de COP 29.900 (ancla se degrada).

---

**Autor:** el equipo Portalia

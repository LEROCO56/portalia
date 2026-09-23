# Secuencia de email nurture — 7 correos en 14 días

**Objetivo:** convertir el 8 % de los registrados (usaron el Auditor) en compradores del método en los primeros 7 días y otro 4 % entre D8 y D14 (ver `docs/SALES-STRATEGY.md`).

**Herramienta:** Resend (broadcast + audiencia segmentada). Plantillas en texto plano con formato mínimo: se entregan mejor y se leen como un correo de persona, no de publicidad.

**Segmento:** `role = 'free'` y `days_since_signup <= 14`. Salida automática de la secuencia al comprar (webhook Hotmart → `role = 'buyer'`).

**Firma:** "El equipo Portalia" (regla del proyecto: sin nombre propio en sitio, correos ni commits).

**Variables:** `{{first_name}}`, `{{score}}` (último puntaje del Auditor), `{{fecha_fin_lanzamiento}}` (solo si hay una fecha real de cierre de precio; si no, usar la versión "sin fecha" indicada en D7 y D14).

**Enlaces:** siempre con UTM → `https://portalia.com.co/?utm_source=email&utm_medium=nurture&utm_campaign=dNN` (cambiar `dNN` por el día). Mientras el dominio no apunte, usar `portalia-m0f.pages.dev`.

**Arco narrativo:** D0 resultado → D1, D3, D5 los 3 arreglos de mayor impacto (uno por paso I, I y T del método CITAR) → D7 oferta → D10 objeciones → D14 cierre.

---

## D0 — Resultado y promesa (inmediato tras registro)

**Asunto:** Tu puntaje en el Auditor: {{score}}/100
**Preheader:** Qué significa y los 3 arreglos que más lo mueven.

Hola, {{first_name}}:

Tu web sacó **{{score}}/100** en el Auditor Portalia.

Ese número mide qué tan fácil le queda a una IA (ChatGPT, Claude, Gemini, Perplexity) entender quién eres y recomendarte. No mide qué tan bonita es tu web ni qué tan bien vendes.

Lo común es que los negocios arranquen por debajo de 50. La buena noticia: la mayor parte del puntaje depende de 3 arreglos que puedes hacer tú, sin programador y sin pauta.

En los próximos días te mandamos uno por correo:

1. Que la IA sepa **qué eres** (mañana).
2. Que la IA tenga **respuestas tuyas para citar** (D3).
3. Que **otros confirmen** lo que dices de ti (D5).

Cada uno cabe en una tarde.

Si quieres ver el detalle de tu auditoría otra vez: {{link_auditor}}

El equipo Portalia

---

## D1 — Arreglo #1: la declaración de entidad

**Asunto:** Para la IA, tu web todavía no es un negocio
**Preheader:** 30 minutos y un bloque de código lo resuelven.

Hola, {{first_name}}:

Cuando una IA lee tu web se pregunta tres cosas: **¿qué es esto?, ¿dónde y para quién?, ¿qué lo diferencia?**

Si la respuesta está en frases como "pasión por la excelencia", no puede responder ninguna. Por eso te ignora.

El arreglo tiene dos partes:

**1. Una frase que te identifique sin ambigüedad.**
> [Nombre] es [tipo de negocio] en [ciudad] que ayuda a [cliente] a [resultado] mediante [diferencial verificable].

**2. Esa misma frase, en lenguaje de máquina.** Pega esto en el `<head>` de tu web con tus datos:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Tu Negocio",
  "description": "Tu frase de arriba, igualita.",
  "url": "https://tunegocio.com",
  "telephone": "+57-...",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "...",
    "addressLocality": "Tu ciudad",
    "addressCountry": "CO"
  },
  "sameAs": ["https://www.instagram.com/tunegocio"]
}
</script>
```

Si no tienes local físico, cambia `LocalBusiness` por `Organization`.

¿No quieres escribirlo a mano? El generador gratis lo arma por ti: {{link_herramientas}}

Luego vuelve a correr el Auditor y mira cuánto se movió tu puntaje.

El equipo Portalia

---

## D3 — Arreglo #2: respuestas que la IA pueda citar

**Asunto:** Las IAs citan respuestas, no párrafos
**Preheader:** El formato que más se repite en las respuestas de ChatGPT y Perplexity.

Hola, {{first_name}}:

Las IAs arman sus respuestas con fragmentos cortos que respondan una pregunta concreta. Si tu web tiene párrafos largos y ninguna pregunta respondida, no les das nada para citar.

**El arreglo:**

1. Abre el WhatsApp de tu negocio y copia las 8 preguntas que más te hacen los clientes (precios, horarios, cómo funciona, para quién es).
2. Respóndelas en tu web en 40 a 100 palabras cada una: **la respuesta primero**, el detalle después.
3. Envuélvelas en `FAQPage` (el generador de FAQ lo hace por ti: {{link_herramientas}}).

Un detalle que casi todos pasan por alto: las preguntas y respuestas tienen que verse en la página, no solo estar en el código.

Esto fue lo que más movió la aguja en el caso de Serenity Spa, un spa de barrio en Bogotá que pasó de no aparecer en ninguna IA a estar en el top 3 de ChatGPT y Perplexity en 8 semanas. El caso completo, con lo que hicieron semana por semana: {{link_caso_serenity}}

El equipo Portalia

---

## D5 — Arreglo #3: que otros lo confirmen

**Asunto:** La IA no te cree solo a ti
**Preheader:** 5 menciones bien puestas valen más que 50 en cualquier lado.

Hola, {{first_name}}:

Con los arreglos 1 y 2, la IA ya sabe qué dices de ti. Falta lo que más pesa: que **otras fuentes** digan lo mismo.

**El arreglo, en una semana:**

- Reclama y completa tus perfiles clave: Google Business Profile, Bing Places, LinkedIn de empresa.
- Regístrate en 2 o 3 directorios **de tu nicho** (no genéricos): TripAdvisor si es turismo o bienestar, Doctoralia si es salud, Clutch si eres agencia, Capterra si es software.
- Usa en todos **el mismo nombre, la misma dirección y el mismo teléfono**, escritos igual. Si en un lado eres "Spa Serenity" y en otro "Serenity Spa & Wellness", para la IA pueden ser dos negocios distintos.
- Pide a tus últimos 20 clientes una reseña que diga **qué servicio tomaron y en qué ciudad**. Una reseña descriptiva le da material a la IA; un "excelente 👍" no.

Lo que no recomendamos: comprar reseñas o crear perfiles falsos. Viola las reglas de las plataformas y puede costarte el perfil.

Con estos 3 arreglos ya tienes lo básico. El método completo te lleva de lo básico a un sistema que se sostiene solo. Mañana no te escribimos; el D7 te contamos qué incluye.

El equipo Portalia

---

## D7 — Oferta directa

**Asunto:** El método completo, por COP 39.900
**Preheader:** Lo que ya aplicaste es el 30 %. Esto es el resto.

Hola, {{first_name}}:

Esta semana hiciste (o tienes a mano) los 3 arreglos de mayor impacto. Son la base. Lo que suele faltar es el sistema para que no se quede en un esfuerzo de una tarde:

**Qué incluye Portalia:**
- El método **CITAR** completo en 8 lecciones: Contextualizar, Indexar, Testimoniar, Automatizar y Revisar, más un plan de 30 días día por día.
- Plantillas listas para copiar: `LocalBusiness`, `FAQPage`, `Article`, `robots.txt` para IAs.
- Biblioteca de prompts para investigar, redactar y revisar contenido citable.
- Auditor Pro: auditorías ilimitadas e histórico de puntaje.
- Comunidad de negocios aplicando el método.
- Programa de afiliados con 60 % de comisión si lo recomiendas.

**Precio:** ~~COP 79.800~~ **COP 39.900** (precio de lanzamiento).
*Con fecha real de cierre:* "El precio de lanzamiento va hasta el {{fecha_fin_lanzamiento}}."
*Sin fecha definida:* omitir la línea anterior; no inventar urgencia.

Si vienes de una comunidad o de LinkedIn, el cupón **PORTAL10** te da 10 % adicional.

**Garantía Hotmart de 7 días:** si no te sirve, pides el reembolso completo desde Hotmart, sin preguntas.

→ {{link_checkout}}

¿Dudas antes de comprar? Responde este correo; lo lee una persona del equipo.

El equipo Portalia

---

## D10 — Objeciones

**Asunto:** "¿Esto sirve para mi tipo de negocio?"
**Preheader:** Las 4 preguntas que más nos hacen, respondidas corto.

Hola, {{first_name}}:

Estas son las preguntas que más nos llegan antes de comprar:

**¿Sirve si soy un negocio local?**
Sí. Suele ser donde más rápido se ve movimiento, porque hay menos negocios compitiendo por la mención local en las IAs que en Google Maps.

**¿Cuánto tarda?**
Las primeras menciones suelen aparecer entre la semana 2 y la 6 después de publicar schema y conseguir menciones. Consolidarte toma de 3 a 4 meses de constancia. No hay garantía de posición: cada categoría y ciudad compite distinto.

**¿Y si ya pago SEO?**
Lo complementa, no lo reemplaza. El SEO te trae desde el buscador; esto te trae desde el asistente. Muchas mejoras (datos estructurados, contenido claro) sirven para ambos.

**¿Qué pasa cuando cambien los modelos?**
Las señales base (datos estructurados, menciones externas coherentes, respuestas claras) han sido estables. El paso R del método es justamente revisar cada mes y ajustar, y los miembros reciben las actualizaciones.

¿Tienes una pregunta que no está aquí? Responde este correo.

→ {{link_checkout}}

El equipo Portalia

---

## D14 — Cierre de la secuencia

**Asunto:** Último correo de esta serie
**Preheader:** Después de hoy solo recibes el boletín mensual.

Hola, {{first_name}}:

Este es el último correo de la serie.

Resumen de lo que viste:
1. Declaración de entidad + `LocalBusiness`.
2. Respuestas cortas con `FAQPage`.
3. Menciones externas coherentes.

Si ya los aplicaste, vuelve a correr el Auditor y compara con tu {{score}} inicial: {{link_auditor}}

Si quieres el sistema completo para sostener y medir esto mes a mes, el método sigue disponible en COP 39.900 con garantía de 7 días: {{link_checkout}}
*Con fecha real de cierre:* agregar "El precio de lanzamiento termina el {{fecha_fin_lanzamiento}}; después queda en COP 79.800."

Si decides que no es para ti, todo bien: desde ahora solo recibirás el boletín mensual con hallazgos sobre cómo recomiendan las IAs. Puedes darte de baja cuando quieras con el enlace al final de cualquier correo.

Gracias por leernos estos días.

El equipo Portalia

---

## Notas de campaña

- **Envío:** 8:30 a. m. hora Bogotá. D0 inmediato.
- **Salida:** al comprar, el contacto sale de la secuencia y entra a la de bienvenida de compradores.
- **Cumplimiento:** enlace de baja en todos los correos y remitente identificable (Ley 1581 de 2012, habeas data). Nada de urgencia falsa ni cifras de resultados que no estén documentadas en un caso publicado (Ley 1480 de 2011, publicidad engañosa).
- **Métricas objetivo:** apertura ≥ 45 %, clic ≥ 8 %, conversión acumulada de la secuencia ≥ 6 %.
- **Prueba A/B sugerida:** asunto de D7 ("El método completo, por COP 39.900" vs. "Lo que ya aplicaste es el 30 %").

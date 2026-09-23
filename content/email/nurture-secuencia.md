# Secuencia de email nurture — 7 correos en 14 días

**Objetivo:** convertir 8% de los que se registraron (usaron el auditor) en compradores del método en 7 días. Otro 4% en el retargeting D8-D14.

**Herramienta:** Resend + templates React (fase 2). Por ahora, editorial en Resend Dashboard.

**Segmento:** registered_at < 14 days, has_purchased = false.

---

## D0 — Bienvenida (envío inmediato tras registro)

**Asunto:** Tu resultado del Auditor Portal IA está aquí 👀

Hola {{first_name}},

Tu auditoría dio {{score}}/100.

No es un mal puntaje. La mayoría de negocios en Colombia arrancan entre 30 y 45.

Pero significa que las IAs están dejando mucho valor tuyo sin capturar.

En los próximos 7 días te voy a mandar 4 correos cortos con los 3 arreglos que dan más resultado por menos esfuerzo. Sin humo, sin venta.

Si al final te interesa el método completo, tendrás la puerta.

Mañana viene el primero: el error #1 que casi todos cometen.

Un abrazo,
Leo
portalia.com.co

---

## D1 — Error #1

**Asunto:** El error del 92% (y cómo se arregla en 30 minutos)

Ayer te dije que había 3 arreglos que dan más resultado. Este es el #1.

92% de las webs LatAm que audité no tienen JSON-LD Schema.org. Ni una línea.

¿Qué es? Un pequeño bloque de código que le dice a la IA:

"Este sitio es una Organization/LocalBusiness. Se llama X. Está en Y. Su rubro es Z."

Sin ese bloque, tu web es texto suelto para la IA. Con él, se convierte en una entidad reconocible.

Tiempo de implementación: 30 minutos.
Impacto en tu puntaje AEO: +10 a +15.

Te dejo aquí una plantilla base para copiar y pegar en la etiqueta `<head>` de tu web:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Tu Negocio",
  "url": "https://tunegocio.com",
  "logo": "https://tunegocio.com/logo.png",
  "sameAs": [
    "https://www.linkedin.com/company/tunegocio",
    "https://www.instagram.com/tunegocio"
  ]
}
</script>
```

Pruébalo. Yo estaré por acá si necesitas ayuda.

Leo

---

## D3 — Caso real

**Asunto:** De 0 a top 3 en ChatGPT en 6 semanas

En marzo tomé el caso de un negocio de Bogotá. Puntaje AEO al iniciar: 28.

Aplicamos CITAR paso a paso — sin tocar el SEO, sin cambiar pauta, sin rediseño.

- Semana 2: JSON-LD implementado. Puntaje sube a 48.
- Semana 4: Perplexity empieza a citarlo por nombre.
- Semana 6: Aparece en ChatGPT y en Claude en top 3 respuestas de su categoría.

Facturación septiembre vs marzo: +40%.

No es magia. Es método aplicado.

El método completo con plantillas para tu caso está en portalia.com.co (COP 39.900).

Pero antes: mañana viene el segundo arreglo. Aún no te vendo nada 😉

Leo

---

## D5 — Valor de una mención IA

**Asunto:** ¿Cuánto vale una mención en ChatGPT?

Este es un cálculo rápido.

Si tu ticket promedio es COP 500.000 y conviertes 1 de cada 10 consultas en cliente:

- Una mención en ChatGPT que aparece 30 veces al mes = 3 clientes = COP 1.500.000 ese mes.
- Aparecer en 5 consultas relacionadas = COP 7.500.000/mes.
- Y esto es residual: mientras las señales AEO se mantengan, la IA sigue citándote.

Comparado con COP 39.900 del método → ROI en 24 horas si le pegas a UNA sola consulta.

Sin garantías de resultado — depende de tu implementación. Pero la aritmética es clara.

Link con precio de lanzamiento (activo por pocos días): portalia.com.co

Leo

---

## D7 — Oferta directa

**Asunto:** Precio de lanzamiento vs precio normal

Te escribo directo hoy.

Hasta el domingo el método Portalia está en COP 39.900. El lunes vuelve a su precio normal: COP 79.800.

Qué incluye:
- Ebook de 120+ páginas con el método CITAR paso a paso.
- Plantillas JSON-LD, FAQPage, Article para copiar y pegar.
- Acceso a la comunidad Portalia (foro con otros aplicando el método).
- Auditor Portal IA Pro (auditorías ilimitadas + histórico).
- Programa afiliados 60% (revendes y comisionas).

Garantía Hotmart 7 días: si no te sirve, reembolso completo.

→ Comprar: portalia.com.co (usa el cupón PORTAL10 para 10% adicional).

Cualquier duda antes de comprar, responde este correo directo. Yo leo.

Leo

---

## D10 — Testimonios + FAQ objeciones

**Asunto:** "¿Esto sirve para mi rubro?" — resolvemos objeciones

Recibí tres preguntas repetidas en los últimos 5 días. Aquí las respuestas cortas.

**"¿Esto sirve si soy negocio local?"**
Sí — es donde más rápido se ve resultado. Menos competencia por la mención local en las IAs que en Google Maps.

**"¿Cuánto tarda?"**
Primeras menciones entre 2 y 6 semanas. Consolidación (top 3) en 3–4 meses.

**"¿Y si ya hago SEO?"**
Perfecto. AEO es complementario, no reemplazo. El SEO trae del buscador; el AEO trae del asistente.

**"¿Cambia si cambian los modelos?"**
Las señales base (Schema.org, menciones externas, contenido estructurado) son estables. Portalia se mantiene actualizado y los miembros reciben updates cuando algo mueve.

Link: portalia.com.co
Precio de lanzamiento vence el domingo.

Leo

---

## D14 — Última oportunidad

**Asunto:** Última llamada: sube el precio el lunes

Este es el último correo de esta secuencia.

Mañana domingo a las 11:59 p.m. hora Colombia sube el precio de COP 39.900 a COP 79.800.

Si venías considerándolo, hoy es el momento.

Si decidiste que no es para ti, todo bien — sigues recibiendo el newsletter mensual con hallazgos AEO. Puedes darte de baja cuando quieras.

Si quieres entrar antes de que suba: portalia.com.co

Gracias por leer estos días.

Leo

---

## Notas de campaña

- Personalización mínima: {{first_name}} y {{score}} (del auditor).
- Enviar a las 8:30 a.m. Bogotá.
- Configurar en Resend con broadcast + audience segmentado por role='free' AND days_since_signup <= 14.
- Métrica de éxito: open rate ≥ 45%, click-through ≥ 8%, conversión total secuencia ≥ 6%.

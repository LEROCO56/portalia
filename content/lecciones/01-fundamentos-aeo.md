# Lección 1 — Fundamentos AEO/GEO

**Duración estimada:** 22 min video + 15 min lectura.
**Estado:** Guion listo. Video pendiente de grabación (Fase 2).

---

## Objetivo de la lección

Al terminar sabes:
1. Qué es AEO/GEO y por qué NO es lo mismo que SEO.
2. Cómo funcionan por dentro los "answer engines" (ChatGPT, Claude, Gemini, Perplexity, Copilot).
3. Las 3 señales fundamentales que determinan si una IA te cita o te ignora.
4. Cómo medir hoy tu presencia en las IAs (con qué preguntas y en cuáles).

---

## Contexto: por qué esto importa AHORA

En 2020 era ciencia ficción. En 2023 empezó. En 2026 es realidad medible:

**El 60% de las búsquedas complejas empiezan en un asistente de IA, no en Google.**

Las categorías donde más pega:
- Comparativas ("¿mejor X para Y?")
- Recomendaciones ("¿qué me recomiendas para Z?")
- Cómo hacer algo ("¿cómo lo mejor W?")
- Compras de consideración larga (SaaS, servicios profesionales, autos, propiedades)
- Búsquedas locales de servicio ("mejor plomero en [barrio]")

**Si tu negocio depende de ser encontrado en cualquiera de esas categorías, y no aparece en las IAs, te está pasando algo silencioso y grave:**

Tus clientes potenciales están preguntando. La IA responde. Y tú no estás en la respuesta.

---

## AEO vs SEO — la diferencia clave

**SEO (Search Engine Optimization):**
- Objetivo: aparecer arriba en una LISTA de resultados.
- Optimizas para: clicks, dwell time, backlinks, keywords, meta descriptions.
- El buscador te da 10 resultados. El usuario elige.

**AEO (Answer Engine Optimization) / GEO (Generative Engine Optimization):**
- Objetivo: ser CITADO en la respuesta.
- Optimizas para: entidades, datos estructurados, menciones externas, formato Q&A.
- La IA da 1 respuesta con 2-4 fuentes citadas. Estás o no estás.

**Analogía:** SEO es como estar en el estante de la tienda. AEO es como que el vendedor te recomiende directo.

---

## Cómo funcionan por dentro los answer engines

Cuando un usuario le pregunta a ChatGPT "¿mejor agencia de marketing en Bogotá?", pasan 4 cosas en milisegundos:

**1. Recuperación (retrieval).**
El modelo (o su capa RAG) busca en su índice web fuentes potencialmente relevantes. Aquí importa QUE TU URL exista en el índice.

**2. Selección de fuentes.**
De todas las fuentes recuperadas, la IA selecciona las más "autoritativas". Aquí las señales que pesan:
   - ¿Tienes structured data que confirma que eres una Organization/LocalBusiness?
   - ¿Hay menciones externas coherentes de ti como esa entidad?
   - ¿Tu contenido responde específicamente a esa consulta?

**3. Síntesis.**
La IA compone la respuesta usando fragmentos de las fuentes seleccionadas. Si tu contenido está en formato "respuesta corta + dato + fuente", tienes más probabilidad de que se incluya.

**4. Atribución.**
Muchas IAs (Perplexity siempre, ChatGPT con búsqueda, Copilot) muestran las fuentes citadas. Ese es tu premio.

---

## Las 3 señales fundamentales

### Señal 1 — Structured data (Schema.org)

Es un vocabulario estándar para describir tu web como entidad. La IA lo lee de tu HTML y lo trata como declaración autoritativa.

**Tipos que más importan para AEO:**
- `Organization` o `LocalBusiness` — quién eres.
- `FAQPage` — respuestas a preguntas que la IA puede citar directo.
- `Article` — para posts de blog.
- `Product` — para productos.
- `Person` — para autores/expertos.

**Ejemplo mínimo Organization:**

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Tu Negocio",
  "url": "https://tunegocio.com",
  "logo": "https://tunegocio.com/logo.png",
  "sameAs": [
    "https://linkedin.com/company/tunegocio",
    "https://twitter.com/tunegocio"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+57-1-234-5678",
    "contactType": "customer service"
  }
}
```

Va dentro del `<head>` como `<script type="application/ld+json">…</script>`.

### Señal 2 — Menciones externas

La IA no confía solo en lo que TÚ dices de ti. Necesita que OTROS lo confirmen.

Tipos de menciones que más pesan:
- Directorios de nicho (Capterra, G2, Yelp, PáginasAmarillas, etc.).
- Foros donde tu negocio se discute (Reddit, Quora, foros locales).
- Wikipedia (si aplica).
- Prensa local con schema.org/Article que te menciona.
- Blogs de terceros con enlace y mención por nombre.

**Regla:** 5 menciones diversas > 50 en la misma fuente.

### Señal 3 — Formato Q&A corto

Las IAs prefieren fragmentos de 40-100 palabras que respondan preguntas específicas.

**Estructura ganadora:**
- Pregunta (H2 o H3).
- Respuesta directa (1 párrafo corto).
- Dato de soporte o ejemplo.
- Opcionalmente: enlace interno a más detalle.

**Empaquetado:** siempre con `FAQPage` schema alrededor.

---

## Ejercicio de la lección — mide dónde estás hoy

Toma 5 consultas donde te gustaría aparecer.

Ejemplo para una cafetería:
1. "mejor café de especialidad en [tu ciudad]"
2. "cafeterías con espacio para trabajar en [tu ciudad]"
3. "dónde tomar café con leche vegetal en [tu ciudad]"
4. "café para regalar a un amante del café en [tu ciudad]"
5. "cafeterías nuevas en [tu ciudad] 2026"

Pregunta cada una en 5 IAs:
- ChatGPT (con búsqueda habilitada)
- Claude
- Gemini
- Perplexity
- Copilot

Anota:
- Cuántas de las 25 combinaciones te nombran.
- Qué competidores aparecen consistentemente.
- Qué fuentes cita la IA cuando responde.

Ese es tu baseline. Lo mides otra vez en 30 días.

---

## Próxima lección

**Lección 2 — Paso C del método CITAR: Contextualizar tu negocio.**
Vamos a construir tu declaración de entidad. Cómo escribir el `Organization` schema perfecto para tu caso, con el ejercicio en vivo sobre 3 negocios reales.

---

**Autor:** el equipo Portalia

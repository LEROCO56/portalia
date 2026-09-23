# Lección 3 — Paso I del método CITAR: Indexar con Schema.org

**Duración estimada:** 29 min video + 30 min ejercicio.

---

## Objetivo de la lección

Al terminar tienes publicado en tu web:
1. Un bloque `LocalBusiness` (u `Organization`) completo, construido desde tu ficha NAP+.
2. Un bloque `FAQPage` con al menos 8 preguntas reales.
3. Un `robots.txt` que deja entrar a los rastreadores de IA que te convienen.
4. La validación de todo lo anterior, sin errores.

---

## Guion del video

### 1. Qué es "indexar" para una IA (0:00 – 4:00)

En la lección 2 escribiste quién eres en lenguaje humano. Ahora lo declaramos en **lenguaje de máquina**. Schema.org es un vocabulario acordado por los grandes buscadores; JSON-LD es la forma de escribirlo dentro de tu HTML.

No es magia ni garantía: es **eliminar ambigüedad**. Le das a la IA los datos ya estructurados, en vez de obligarla a adivinarlos.

### 2. El bloque de entidad (4:00 – 13:00)

Para negocios con local físico usa el subtipo más específico de `LocalBusiness` (por ejemplo `DaySpa`, `Dentist`, `AutoRepair`, `AccountingService`). Si no tienes local, usa `Organization` o `ProfessionalService`.

```json
{
  "@context": "https://schema.org",
  "@type": "DaySpa",
  "@id": "https://serenityspa.com.co/#negocio",
  "name": "Serenity Spa",
  "description": "Spa de relajación en Chapinero, Bogotá, especializado en masajes terapéuticos para oficinistas con dolor de espalda.",
  "url": "https://serenityspa.com.co",
  "telephone": "+57-601-000-0000",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Calle 63 # 10-24",
    "addressLocality": "Bogotá",
    "addressRegion": "Cundinamarca",
    "addressCountry": "CO"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 4.6486, "longitude": -74.0628 },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    "opens": "09:00", "closes": "19:00"
  }],
  "areaServed": "Bogotá",
  "sameAs": [
    "https://www.instagram.com/serenityspa",
    "https://www.tripadvisor.co/..."
  ]
}
```

*(Datos de ejemplo: reemplázalos por los tuyos.)*

**Claves que más pesan:**
- `description` = tu declaración de entidad de la lección 2, palabra por palabra.
- `@id` estable: permite que otros bloques (FAQ, artículos) apunten a la misma entidad.
- `sameAs`: los perfiles externos que confirman que eres tú. Es el puente hacia el paso T.

### 3. FAQPage: la palanca con mejor relación esfuerzo/resultado (13:00 – 20:00)

Toma tus 10 consultas semilla y respóndelas en la web con formato corto (40 a 100 palabras, respuesta primero, dato después). Luego envuélvelas en `FAQPage`:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "¿Cuánto cuesta un masaje terapéutico en Serenity Spa?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Un masaje terapéutico de 60 minutos cuesta entre COP 120.000 y COP 150.000 según la técnica. Incluye valoración inicial de postura."
    }
  }]
}
```

**Reglas de oro:**
- La pregunta y la respuesta deben estar **visibles** en la página, no solo en el JSON.
- Una pregunta = una respuesta concreta. Nada de "contáctanos para más información".
- Usa el generador de FAQ de Portalia Prime para acelerar el borrador.

### 4. robots.txt para IAs (20:00 – 25:00)

Si bloqueas a los rastreadores de IA, no pueden leerte. Revisa tu `robots.txt` y decide conscientemente. Configuración recomendada para un negocio que quiere ser citado:

```
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://tunegocio.com/sitemap.xml
```

Deja por fuera (con `Disallow`) solo las zonas privadas: panel de clientes, carrito, admin.

### 5. Validar (25:00 – 29:00)

1. Pega tu URL en el **Validador de Schema.org** (validator.schema.org) → cero errores.
2. Pásala por la **Prueba de resultados enriquecidos** de Google.
3. Corre el **Auditor Portalia** y compara el puntaje antes y después.

---

## Resumen

- Schema.org traduce tu declaración de entidad a un formato que las IAs leen sin adivinar.
- `LocalBusiness`/`Organization` + `FAQPage` cubren el 80% del impacto.
- `description` = declaración de entidad; `sameAs` = perfiles que te confirman.
- Sin rastreadores permitidos en `robots.txt`, nada de lo anterior sirve.

---

## Ejercicio

1. Arma tu bloque de entidad con el Generador de Schema de Portalia (o a mano con la plantilla de arriba).
2. Escribe 8 respuestas cortas para tus consultas semilla y publícalas en una sección de preguntas frecuentes.
3. Envuélvelas en `FAQPage`.
4. Revisa tu `robots.txt` y abre acceso a los rastreadores de IA.
5. Valida todo y corre el Auditor. Guarda el puntaje: es tu nuevo punto de comparación.

**Entregable:** URL publicada + captura del validador sin errores + puntaje del Auditor.

---

## Próxima lección

**Lección 4 — Paso T: Testimoniar.** Lo que tú dices de ti ya está en orden. Ahora necesitamos que otros lo confirmen.

---

**Autor:** el equipo Portalia

# Biblioteca de prompts Portalia — método CITAR

**Para qué:** 20 prompts probados para aplicar cada paso del método con ChatGPT, Claude, Gemini o Perplexity.
**Cómo usarlos:** copia, reemplaza lo que está entre `[corchetes]` y pega. Funcionan mejor en una conversación nueva.
**Regla de oro:** la IA te da el borrador; tú verificas cada dato y pones la experiencia propia. Nunca publiques cifras que no puedas respaldar.

---

## C — Contextualizar

### C1. Declaración de entidad
```
Eres un consultor de posicionamiento. Con estos datos de mi negocio:
- Nombre: [nombre]
- Qué vendo: [servicios/productos]
- Ciudad/zona: [ciudad, barrio]
- Cliente ideal: [quién]
- Diferencial comprobable: [dato concreto, certificación, años, especialidad]
Escribe 3 versiones de una declaración de entidad de máximo 45 palabras con la estructura:
"[Nombre] es [tipo de negocio] en [zona] que ayuda a [cliente] a [resultado] mediante [diferencial]".
Sin adjetivos vacíos (excelencia, pasión, calidad). Español colombiano.
```

### C2. Prueba de fuego
```
Lee esta descripción de un negocio: "[declaración]".
1) ¿Qué tipo de negocio es? 2) ¿Dónde opera? 3) ¿Para quién es? 4) ¿En qué se diferencia?
Si alguna respuesta no se puede deducir con certeza, dímelo y explica qué palabra falta.
```

### C3. Consultas semilla
```
Soy [tipo de negocio] en [ciudad]. Dame 20 preguntas que un cliente real le haría a un asistente de IA
antes de contratar algo como lo mío. Agrúpalas en: categoría + lugar, problema, comparación y decisión (precio/tiempos).
Escríbelas como las teclearía una persona, no como palabras clave.
```

### C4. "Sobre nosotros" para máquinas
```
Reescribe este texto de "Sobre nosotros": [pegar texto].
Estructura: 1) declaración de entidad, 2) datos duros (año, equipo, certificaciones, cobertura),
3) servicios con nombre y rango de precio, 4) para quién SÍ y para quién NO es.
Máximo 250 palabras. No inventes datos: marca con [COMPLETAR] lo que falte.
```

---

## I — Indexar

### I1. Schema de entidad
```
Genera un bloque JSON-LD de Schema.org para este negocio. Usa el subtipo más específico de LocalBusiness
que exista (o Organization si no tiene local). Datos: [pegar ficha NAP+ y declaración de entidad].
Incluye @id, description (igual a la declaración), address, geo si la tengo, openingHoursSpecification,
priceRange y sameAs con estas URLs: [perfiles]. Devuelve solo el JSON válido.
```

### I2. Preguntas frecuentes desde WhatsApp
```
Estas son preguntas reales que me hacen clientes por WhatsApp: [pegar 20–30 mensajes, sin datos personales].
Agrúpalas por tema y devuélveme las 10 más frecuentes, redactadas como pregunta clara.
```

### I3. Respuestas citables
```
Responde cada pregunta en 40 a 90 palabras. La primera frase debe responder directamente.
Después, un dato o condición concreta. Usa solo esta información de mi negocio: [datos].
Si falta información para responder, escribe [COMPLETAR: qué falta]. Preguntas: [lista].
```

### I4. FAQPage
```
Convierte estas preguntas y respuestas en un bloque JSON-LD FAQPage válido. No cambies el texto. [pegar]
```

### I5. Revisión técnica
```
Revisa este JSON-LD como validador de Schema.org: [pegar]. Lista errores de sintaxis, propiedades mal escritas,
tipos inexistentes y propiedades recomendadas que faltan. Devuelve la versión corregida.
```

---

## T — Testimoniar

### T1. Mapa de fuentes
```
Soy [tipo de negocio] en [ciudad], Colombia. Lista 15 fuentes donde un asistente de IA podría encontrar
menciones de negocios como el mío: directorios de nicho, medios locales, blogs del sector, foros y comunidades.
Para cada una: tipo, por qué es relevante y cómo aparecer de forma legítima. No incluyas servicios de reseñas pagas.
```

### T2. Propuesta de alianza cruzada
```
Escribe un mensaje corto y cordial para proponerle a [negocio complementario] crear juntos una guía
"[título, ej.: 5 lugares para desconectarse en Chapinero]" donde cada uno mencione al otro.
Tono cercano, español colombiano, máximo 120 palabras, con una propuesta concreta de fecha.
```

### T3. Pedido de reseña descriptiva
```
Escribe 3 versiones de un mensaje de WhatsApp para pedirle una reseña a un cliente que tomó [servicio].
Pídele que cuente qué servicio tomó y en qué ciudad/barrio, sin sonar a guion. Máximo 60 palabras.
```

### T4. Dato propio para prensa
```
Tengo estos datos de mi operación: [cifras reales]. Propón 3 ángulos de "dato curioso" que un medio local
o un blog del sector podría publicar, con un titular y un párrafo de 60 palabras para cada uno.
No exageres ni extrapoles más allá de los datos.
```

---

## A — Automatizar

### A1. Investigación de la consulta
```
Actúa como un cliente en [ciudad] que busca [servicio]. Responde a: "[consulta semilla]".
Luego dime: qué fuentes usarías, qué negocios mencionarías y qué información concreta te faltó para decidir.
```

### A2. Borrador de artículo AEO
```
Con esta declaración de entidad: [pegar] y este dato propio: [pegar], escribe un artículo que responda
"[pregunta]" con esta estructura: respuesta corta (40–80 palabras); ¿por qué? / ¿de qué depende?;
un dato de nuestra experiencia; 3 preguntas relacionadas con respuesta de 40–60 palabras; cierre con siguiente paso.
Español colombiano, frases cortas, sin superlativos ni promesas no comprobables.
```

### A3. Revisión como motor de respuestas
```
Revisa este texto como si fueras un motor de respuestas decidiendo si citarlo: [pegar].
¿La respuesta corta responde sin rodeos? ¿Qué afirmaciones no tienen respaldo? ¿Qué frase citarías textual?
Sugiere cambios concretos, línea por línea.
```

### A4. Reutilización 1 → 5
```
A partir de este artículo: [pegar], crea: 1) post de LinkedIn (máx. 1.200 caracteres),
2) guion de reel de 30 s con hook en los primeros 3 s, 3) publicación para Google Business Profile (máx. 300 caracteres),
4) mensaje de difusión para WhatsApp (máx. 400 caracteres), 5) respuesta útil para un foro donde alguien preguntó lo mismo
(sin enlace forzado).
```

---

## R — Revisar

### R1. Registro de la matriz
```
Te voy a pegar las respuestas de 5 IAs a la consulta "[consulta]". Para cada una dime:
puntaje 0 (no me nombra), 1 (me nombra entre otros), 2 (me recomienda primero o me enlaza),
competidores mencionados y fuentes citadas. Devuélvelo en tabla. Mi negocio es [nombre].
```

### R2. Diagnóstico del mes
```
Mes anterior: matriz [x/50], Auditor [y/100], menciones nuevas [n], piezas publicadas [m].
Mes actual: matriz [..], Auditor [..], menciones [..], piezas [..].
Con el árbol de decisión del método CITAR (técnico → paso I; sin confirmación externa → paso T;
datos viejos → paso C; solo consultas de marca → paso A), dime el ajuste prioritario del próximo mes y por qué.
```

### R3. Análisis de competidor citado
```
La IA está recomendando a [competidor] para "[consulta]". Revisa su web pública [URL] y dime qué señales
tiene que yo no: datos estructurados, respuestas cortas, menciones externas visibles, reseñas.
Propón 3 acciones concretas para mí (sin copiar su contenido).
```

---

**Autor:** el equipo Portalia

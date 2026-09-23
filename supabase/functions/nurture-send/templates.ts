// ARCHIVO GENERADO por scripts/build-nurture-templates.mjs — no editar a mano.
// Fuente: content/email/nurture-secuencia.md
export type NurtureTemplate = { day: number; key: string; subject: string; preheader: string; body: string };
export const TEMPLATES: NurtureTemplate[] = [
  {
    "day": 0,
    "key": "d00",
    "subject": "Tu puntaje en el Auditor: {{score}}/100",
    "preheader": "Qué significa y los 3 arreglos que más lo mueven.",
    "body": "Hola, {{first_name}}:\n\nTu web sacó **{{score}}/100** en el Auditor Portalia.\n\nEse número mide qué tan fácil le queda a una IA (ChatGPT, Claude, Gemini, Perplexity) entender quién eres y recomendarte. No mide qué tan bonita es tu web ni qué tan bien vendes.\n\nLo común es que los negocios arranquen por debajo de 50. La buena noticia: la mayor parte del puntaje depende de 3 arreglos que puedes hacer tú, sin programador y sin pauta.\n\nEn los próximos días te mandamos uno por correo:\n\n1. Que la IA sepa **qué eres** (mañana).\n2. Que la IA tenga **respuestas tuyas para citar** (D3).\n3. Que **otros confirmen** lo que dices de ti (D5).\n\nCada uno cabe en una tarde.\n\nSi quieres ver el detalle de tu auditoría otra vez: {{link_auditor}}\n\nEl equipo Portalia"
  },
  {
    "day": 1,
    "key": "d01",
    "subject": "Para la IA, tu web todavía no es un negocio",
    "preheader": "30 minutos y un bloque de código lo resuelven.",
    "body": "Hola, {{first_name}}:\n\nCuando una IA lee tu web se pregunta tres cosas: **¿qué es esto?, ¿dónde y para quién?, ¿qué lo diferencia?**\n\nSi la respuesta está en frases como \"pasión por la excelencia\", no puede responder ninguna. Por eso te ignora.\n\nEl arreglo tiene dos partes:\n\n**1. Una frase que te identifique sin ambigüedad.**\n> [Nombre] es [tipo de negocio] en [ciudad] que ayuda a [cliente] a [resultado] mediante [diferencial verificable].\n\n**2. Esa misma frase, en lenguaje de máquina.** Pega esto en el `<head>` de tu web con tus datos:\n\n```html\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"LocalBusiness\",\n  \"name\": \"Tu Negocio\",\n  \"description\": \"Tu frase de arriba, igualita.\",\n  \"url\": \"https://tunegocio.com\",\n  \"telephone\": \"+57-...\",\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"streetAddress\": \"...\",\n    \"addressLocality\": \"Tu ciudad\",\n    \"addressCountry\": \"CO\"\n  },\n  \"sameAs\": [\"https://www.instagram.com/tunegocio\"]\n}\n</script>\n```\n\nSi no tienes local físico, cambia `LocalBusiness` por `Organization`.\n\n¿No quieres escribirlo a mano? El generador gratis lo arma por ti: {{link_herramientas}}\n\nLuego vuelve a correr el Auditor y mira cuánto se movió tu puntaje.\n\nEl equipo Portalia"
  },
  {
    "day": 3,
    "key": "d03",
    "subject": "Las IAs citan respuestas, no párrafos",
    "preheader": "El formato que más se repite en las respuestas de ChatGPT y Perplexity.",
    "body": "Hola, {{first_name}}:\n\nLas IAs arman sus respuestas con fragmentos cortos que respondan una pregunta concreta. Si tu web tiene párrafos largos y ninguna pregunta respondida, no les das nada para citar.\n\n**El arreglo:**\n\n1. Abre el WhatsApp de tu negocio y copia las 8 preguntas que más te hacen los clientes (precios, horarios, cómo funciona, para quién es).\n2. Respóndelas en tu web en 40 a 100 palabras cada una: **la respuesta primero**, el detalle después.\n3. Envuélvelas en `FAQPage` (el generador de FAQ lo hace por ti: {{link_herramientas}}).\n\nUn detalle que casi todos pasan por alto: las preguntas y respuestas tienen que verse en la página, no solo estar en el código.\n\nEsto fue lo que más movió la aguja en el caso de Serenity Spa, un spa de barrio en Bogotá que pasó de no aparecer en ninguna IA a estar en el top 3 de ChatGPT y Perplexity en 8 semanas. El caso completo, con lo que hicieron semana por semana: {{link_caso_serenity}}\n\nEl equipo Portalia"
  },
  {
    "day": 5,
    "key": "d05",
    "subject": "La IA no te cree solo a ti",
    "preheader": "5 menciones bien puestas valen más que 50 en cualquier lado.",
    "body": "Hola, {{first_name}}:\n\nCon los arreglos 1 y 2, la IA ya sabe qué dices de ti. Falta lo que más pesa: que **otras fuentes** digan lo mismo.\n\n**El arreglo, en una semana:**\n\n- Reclama y completa tus perfiles clave: Google Business Profile, Bing Places, LinkedIn de empresa.\n- Regístrate en 2 o 3 directorios **de tu nicho** (no genéricos): TripAdvisor si es turismo o bienestar, Doctoralia si es salud, Clutch si eres agencia, Capterra si es software.\n- Usa en todos **el mismo nombre, la misma dirección y el mismo teléfono**, escritos igual. Si en un lado eres \"Spa Serenity\" y en otro \"Serenity Spa & Wellness\", para la IA pueden ser dos negocios distintos.\n- Pide a tus últimos 20 clientes una reseña que diga **qué servicio tomaron y en qué ciudad**. Una reseña descriptiva le da material a la IA; un \"excelente 👍\" no.\n\nLo que no recomendamos: comprar reseñas o crear perfiles falsos. Viola las reglas de las plataformas y puede costarte el perfil.\n\nCon estos 3 arreglos ya tienes lo básico. El método completo te lleva de lo básico a un sistema que se sostiene solo. Mañana no te escribimos; el D7 te contamos qué incluye.\n\nEl equipo Portalia"
  },
  {
    "day": 7,
    "key": "d07",
    "subject": "El método completo, por COP 39.900",
    "preheader": "Lo que ya aplicaste es el 30 %. Esto es el resto.",
    "body": "Hola, {{first_name}}:\n\nEsta semana hiciste (o tienes a mano) los 3 arreglos de mayor impacto. Son la base. Lo que suele faltar es el sistema para que no se quede en un esfuerzo de una tarde:\n\n**Qué incluye Portalia:**\n- El método **CITAR** completo en 8 lecciones: Contextualizar, Indexar, Testimoniar, Automatizar y Revisar, más un plan de 30 días día por día.\n- Plantillas listas para copiar: `LocalBusiness`, `FAQPage`, `Article`, `robots.txt` para IAs.\n- Biblioteca de prompts para investigar, redactar y revisar contenido citable.\n- Auditor Pro: auditorías ilimitadas e histórico de puntaje.\n- Comunidad de negocios aplicando el método.\n- Programa de afiliados con 60 % de comisión si lo recomiendas.\n\n**Precio:** ~~COP 79.800~~ **COP 39.900** (precio de lanzamiento).\n\nSi vienes de una comunidad o de LinkedIn, el cupón **PORTAL10** te da 10 % adicional.\n\n**Garantía Hotmart de 7 días:** si no te sirve, pides el reembolso completo desde Hotmart, sin preguntas.\n\n→ {{link_checkout}}\n\n¿Dudas antes de comprar? Responde este correo; lo lee una persona del equipo.\n\nEl equipo Portalia"
  },
  {
    "day": 10,
    "key": "d10",
    "subject": "\"¿Esto sirve para mi tipo de negocio?\"",
    "preheader": "Las 4 preguntas que más nos hacen, respondidas corto.",
    "body": "Hola, {{first_name}}:\n\nEstas son las preguntas que más nos llegan antes de comprar:\n\n**¿Sirve si soy un negocio local?**\nSí. Suele ser donde más rápido se ve movimiento, porque hay menos negocios compitiendo por la mención local en las IAs que en Google Maps.\n\n**¿Cuánto tarda?**\nLas primeras menciones suelen aparecer entre la semana 2 y la 6 después de publicar schema y conseguir menciones. Consolidarte toma de 3 a 4 meses de constancia. No hay garantía de posición: cada categoría y ciudad compite distinto.\n\n**¿Y si ya pago SEO?**\nLo complementa, no lo reemplaza. El SEO te trae desde el buscador; esto te trae desde el asistente. Muchas mejoras (datos estructurados, contenido claro) sirven para ambos.\n\n**¿Qué pasa cuando cambien los modelos?**\nLas señales base (datos estructurados, menciones externas coherentes, respuestas claras) han sido estables. El paso R del método es justamente revisar cada mes y ajustar, y los miembros reciben las actualizaciones.\n\n¿Tienes una pregunta que no está aquí? Responde este correo.\n\n→ {{link_checkout}}\n\nEl equipo Portalia"
  },
  {
    "day": 14,
    "key": "d14",
    "subject": "Último correo de esta serie",
    "preheader": "Después de hoy solo recibes el boletín mensual.",
    "body": "Hola, {{first_name}}:\n\nEste es el último correo de la serie.\n\nResumen de lo que viste:\n1. Declaración de entidad + `LocalBusiness`.\n2. Respuestas cortas con `FAQPage`.\n3. Menciones externas coherentes.\n\nSi ya los aplicaste, vuelve a correr el Auditor y compara con tu {{score}} inicial: {{link_auditor}}\n\nSi quieres el sistema completo para sostener y medir esto mes a mes, el método sigue disponible en COP 39.900 con garantía de 7 días: {{link_checkout}}\n\nSi decides que no es para ti, todo bien: desde ahora solo recibirás el boletín mensual con hallazgos sobre cómo recomiendan las IAs. Puedes darte de baja cuando quieras con el enlace al final de cualquier correo.\n\nGracias por leernos estos días.\n\nEl equipo Portalia"
  }
];

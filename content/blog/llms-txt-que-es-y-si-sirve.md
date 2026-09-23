---
title: "llms.txt: qué es, cómo se hace y si de verdad sirve"
description: "El archivo llms.txt propone un resumen de tu sitio pensado para modelos de lenguaje. Qué sabemos, qué no y si vale la pena en un negocio pequeño."
slug: llms-txt-que-es-y-si-sirve
date: 2026-09-23
author: Portalia
keywords: ["llms.txt", "llms.txt qué es", "archivo para IA", "AEO técnico"]
---

# llms.txt: qué es, cómo se hace y si de verdad sirve

**Respuesta corta:** `llms.txt` es una propuesta de estándar para poner en la raíz de tu web un archivo Markdown que resume tu sitio y enlaza las páginas más importantes, pensado para que un modelo de lenguaje lo entienda rápido. Es barato de hacer (20 minutos), pero no reemplaza lo que sí tiene efecto comprobado: datos estructurados, respuestas claras y menciones externas.

## ¿De dónde sale?

Es una propuesta abierta publicada en 2024 (llmstxt.org). La idea: los sitios están llenos de menús, scripts y publicidad que estorban a un modelo; un archivo limpio en `/llms.txt` le daría lo esencial.

## ¿Cómo se ve?

```markdown
# Serenity Spa

> Spa de relajación en Chapinero, Bogotá, especializado en masajes terapéuticos
> para oficinistas con dolor de espalda.

## Servicios
- [Masaje terapéutico](https://serenityspa.com.co/masaje-terapeutico): 60 y 90 minutos, con valoración de postura.
- [Precios](https://serenityspa.com.co/precios): tarifas actualizadas.

## Preguntas frecuentes
- [FAQ](https://serenityspa.com.co/preguntas): pagos, parqueadero, cancelaciones.
```

*(Ejemplo ilustrativo.)*

## ¿Las IAs lo leen?

Aquí hay que ser honestos: **no hay confirmación pública de que los grandes asistentes lo usen de forma sistemática** para decidir qué recomendar. Algunas herramientas y documentaciones técnicas lo adoptaron, sobre todo para que asistentes de programación lean documentación. Para un negocio local, su efecto sobre las recomendaciones no está demostrado.

## Entonces, ¿lo hago?

Sí, si ya tienes lo básico. El orden correcto:

1. `LocalBusiness`/`Organization` y `FAQPage` en JSON-LD.
2. `robots.txt` abierto a rastreadores de IA.
3. Menciones externas coherentes.
4. **Después**, `llms.txt` como complemento.

Hacerlo cuesta poco y te obliga a un ejercicio útil: resumir tu negocio en 3 líneas y elegir tus 5 páginas más importantes. Esa claridad sí se nota en todo lo demás.

## Errores comunes

- Poner en `llms.txt` información que no está en la web visible o que la contradice.
- Pensar que reemplaza al `robots.txt` (no lo hace: `robots.txt` controla acceso; `llms.txt` es solo un resumen).
- Dejarlo desactualizado: si cambias precios o servicios, actualízalo.

## Preguntas relacionadas

**¿Dónde lo subo?**
En la raíz: `https://tunegocio.com/llms.txt`, como texto plano o Markdown.

**¿Existe `llms-full.txt`?**
La propuesta contempla una versión extendida con el contenido completo. Para un negocio pequeño, con la versión corta basta.

**¿Afecta mi SEO?**
No hay evidencia de que afecte el posicionamiento en Google, ni para bien ni para mal.

---

Revisa si tu sitio tiene lo básico con el [Auditor gratis](/auditor).

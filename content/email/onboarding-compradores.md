# Secuencia de onboarding para compradores — 4 correos en 21 días

**Objetivo (docs/SALES-STRATEGY.md §5, §6 y §7):** que el comprador avance en el curso, publique su primer hilo en la comunidad (meta: 40 % en 30 días), conozca el programa de afiliados (meta: 15 % lo activa) y, al día 21, nos diga si una IA ya lo recomendó (fuente de testimonios y del NPS del tablero).

**Segmento:** `role in ('buyer','affiliate')`, contado desde `hotmart_purchase_at`. Entra por el webhook de Hotmart (compra aprobada). Sale si hay reembolso o contracargo (el webhook devuelve `role='free'`) o al darse de baja.

**Herramienta:** la misma Edge Function del nurture (`nurture-send`), con una segunda pista de plantillas. Formato: texto casi plano, igual que el nurture.

**Firma:** "El equipo Portalia". Sin nombre propio.

**Variables:** `{{first_name}}`, `{{link_curso}}`, `{{link_comunidad}}`, `{{link_nuevo_hilo}}`, `{{link_afiliados}}`, `{{link_auditor}}`, `{{link_encuesta_si}}`, `{{link_encuesta_aun_no}}`. Todos los enlaces llevan `utm_source=email&utm_medium=onboarding&utm_campaign=bNN`.

**Reglas:** no se promete posición en ninguna IA; la garantía es de reembolso (7 días por Hotmart), no de resultados. No se anuncia la sesión en vivo del D7 hasta que exista una fecha real (Fase 2); cuando exista, se agrega como correo aparte.

**Arco:** B0 bienvenida y primer paso → B3 reto de la semana (auditar a un competidor) → B14 programa de afiliados → B21 pregunta única.

---

## B0 — Bienvenida (inmediato tras la compra)

**Asunto:** Ya tienes acceso: empieza por aquí
**Preheader:** 3 pasos para tu primera semana con el método CITAR.

Hola, {{first_name}}:

Gracias por confiar en Portalia. Tu acceso ya está activo con el correo con el que compraste.

Para que la primera semana rinda, te proponemos solo 3 pasos:

1. **Lee la lección 1** (15 minutos). Entiendes por qué las IAs recomiendan a unos negocios y a otros no: {{link_curso}}
2. **Corre el Auditor sobre tu web** y guarda el puntaje. Es tu punto de partida para medir el avance: {{link_auditor}}
3. **Preséntate en la comunidad.** Una línea basta: qué negocio tienes, en qué ciudad y qué puntaje sacaste. Los demás miembros comparten lo que les funcionó en negocios parecidos al tuyo: {{link_nuevo_hilo}}

Si en algún momento te trabas, responde este correo. Lo lee una persona del equipo.

Y recuerda: tienes 7 días de garantía por Hotmart. Si el método no es para ti, pides el reembolso completo desde Hotmart.

El equipo Portalia

---

## B3 — Reto de la semana

**Asunto:** Reto: audita a tu competidor más fuerte
**Preheader:** 10 minutos que te dicen por dónde empezar.

Hola, {{first_name}}:

El reto de esta semana es corto y suele abrir los ojos:

1. Piensa en el competidor que más clientes te quita.
2. Pásalo por el Auditor: {{link_auditor}}
3. Compara su puntaje con el tuyo, paso por paso (C, I, T, A, R).

Casi siempre aparece un paso donde él tiene algo que tú no: un bloque `LocalBusiness`, una sección de preguntas frecuentes, reseñas que dicen qué servicio tomaron. Ese es tu primer arreglo, y la lección del curso que lo explica está marcada con la misma letra: {{link_curso}}

Cuando lo tengas, cuéntalo en la comunidad con los dos puntajes. Sin nombrar al competidor si prefieres: {{link_comunidad}}

El equipo Portalia

---

## B14 — Programa de afiliados

**Asunto:** Si Portalia te sirvió, puedes ganar el 60 % recomendándolo
**Preheader:** Kit listo, enlace propio y pago por Hotmart.

Hola, {{first_name}}:

Llevas dos semanas con el método. Si te ha servido, hay otra forma de sacarle provecho: recomendarlo.

**Cómo funciona el programa de afiliados:**
- Ganas el **60 %** de cada venta que llegue por tu enlace.
- Hotmart te da el enlace, registra las ventas y te paga. Nosotros no manejamos tu dinero.
- Al activarte se desbloquea el kit en la página de afiliados: textos para LinkedIn y WhatsApp, ideas de publicaciones y respuestas a las preguntas frecuentes.

Lo que mejor funciona no es publicar el enlace sin más, sino contar tu caso: qué puntaje tenías, qué arreglaste y qué cambió.

Lo que no hacemos: spam, listas compradas ni promesas de resultados garantizados. Un afiliado que lo haga sale del programa.

Todos los detalles y el kit: {{link_afiliados}}

El equipo Portalia

---

## B21 — Una pregunta

**Asunto:** ¿Ya te recomendó una IA?
**Preheader:** Un clic. Nos ayuda a mejorar el método.

Hola, {{first_name}}:

Una sola pregunta, respóndela con un clic:

**¿Alguna IA (ChatGPT, Claude, Gemini, Perplexity) ya mencionó o recomendó tu negocio?**

→ Sí: {{link_encuesta_si}}
→ Todavía no: {{link_encuesta_aun_no}}

Si es "todavía no", es normal a estas alturas: las primeras menciones suelen aparecer entre la semana 2 y la 6 y dependen de la categoría y la ciudad. Al hacer clic te mostramos qué revisar primero.

Si es "sí", te vamos a pedir una captura de la respuesta. Con tu permiso, la usamos (con tu nombre o de forma anónima, como prefieras) para mostrar casos reales.

Gracias por estar aquí.

El equipo Portalia

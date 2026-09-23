import { useState } from 'react';

interface PromptTemplate {
  id: string;
  category: 'auditar' | 'contenido' | 'competencia' | 'schema' | 'estrategia';
  title: string;
  description: string;
  prompt: string;
  useWith: string[];
}

const PROMPTS: PromptTemplate[] = [
  {
    id: 'p1', category: 'auditar', title: 'Auditar visibilidad IA de mi negocio',
    description: 'Diagnóstico rápido: qué IAs te nombran y por qué.',
    prompt: `Eres un consultor AEO senior. Voy a darte el nombre de mi negocio, mi rubro y mi ciudad. Necesito que:

1. Analices si tienes conocimiento explícito sobre este negocio y, si lo tienes, qué información específica.
2. Simules 5 consultas típicas que un cliente potencial haría, donde este negocio DEBERÍA aparecer.
3. Para cada consulta, dime honestamente si mencionarías este negocio primero, en top-3, o si no lo mencionarías.
4. Explica qué SEÑALES tienes o te faltan para recomendarlo.

Negocio: [NOMBRE]
Rubro: [RUBRO]
Ciudad: [CIUDAD]
Sitio web: [URL]`,
    useWith: ['ChatGPT', 'Claude', 'Gemini'],
  },
  {
    id: 'p2', category: 'competencia', title: 'Análisis competitivo AEO',
    description: 'Identifica quién domina tu categoría en las IAs y por qué.',
    prompt: `Actúa como analista competitivo AEO. Necesito mapear cómo las IAs perciben mi categoría vs mis 3 principales competidores.

Para cada uno de: [MI NEGOCIO], [COMPETIDOR 1], [COMPETIDOR 2], [COMPETIDOR 3], responde estas 5 consultas y dime a cuál mencionarías primero para cada una:

1. "mejor [categoría] en [ciudad]"
2. "[categoría] que [beneficio diferenciador]"
3. "recomendaciones de [categoría] cerca de [zona]"
4. "cuál es el más [atributo] de [categoría]"
5. "opciones de [categoría] con [servicio específico]"

Al final, dame 3 acciones concretas y no obvias que puedo tomar para desplazar a los 2 competidores mejor posicionados.`,
    useWith: ['ChatGPT', 'Claude'],
  },
  {
    id: 'p3', category: 'contenido', title: 'Generador de FAQPage AEO-optimizado',
    description: 'Crea 15 pares Q&A listos para publicar con FAQPage schema.',
    prompt: `Actúa como redactor AEO especializado. Genera 15 pares pregunta-respuesta para el negocio descrito abajo. Cada respuesta debe:

- Tener entre 40 y 80 palabras.
- Empezar con una afirmación directa (no "puedes considerar..." sino "sí, porque...").
- Incluir un dato específico, precio, dato local o número cuando aplique.
- Terminar con un cierre de acción o próximo paso.

Devuelve en formato JSON válido de FAQPage schema.org, listo para pegar en un bloque <script type="application/ld+json">.

Negocio: [NOMBRE]
Rubro: [RUBRO]
Ciudad: [CIUDAD]
Servicios: [LISTA]
Diferenciadores: [3 puntos]`,
    useWith: ['Claude', 'ChatGPT'],
  },
  {
    id: 'p4', category: 'schema', title: 'Micro-auditoría de schema en 30 segundos',
    description: 'Pega tu HTML y recibe qué schemas faltan.',
    prompt: `Eres experto en Schema.org / structured data. Voy a darte el HTML del <head> de mi página. Necesito:

1. Enumera cada @type de schema que ya está presente.
2. Enumera qué schemas críticos para AEO le faltan a esta página (Organization/LocalBusiness, BreadcrumbList, WebSite con potentialAction, y si aplica: FAQPage, Article, Product, HowTo).
3. Para cada faltante, dame el JSON-LD mínimo viable pre-llenado con los datos que puedas inferir del HTML.

HTML del <head>:
\`\`\`
[PEGA AQUÍ]
\`\`\``,
    useWith: ['Claude', 'ChatGPT'],
  },
  {
    id: 'p5', category: 'estrategia', title: 'Plan de menciones externas (link semilla)',
    description: 'Un playbook de 30 días para conseguir tus primeras 10 menciones externas.',
    prompt: `Eres experto en digital PR y AEO. Diseña un plan de 30 días con acciones diarias que un solo emprendedor pueda ejecutar solo, sin presupuesto de PR, para conseguir 10 menciones externas medibles del negocio abajo.

Cada mención debe:
- Ser en una fuente distinta.
- Incluir el nombre del negocio (no solo el link).
- Provenir idealmente de: directorios de nicho, foros locales, subreddits o comunidades relevantes, blog invitado, entrevista podcast pequeño, testimonio en herramienta que use, etc.
- No ser spam ni granja de links.

Devuelve en formato tabla: Día | Acción | Fuente objetivo | Tiempo estimado | Métrica de éxito.

Negocio: [NOMBRE]
Rubro: [RUBRO]
Ciudad: [CIUDAD]
Recursos: solo tiempo, sin presupuesto.`,
    useWith: ['ChatGPT', 'Claude', 'Gemini'],
  },
  {
    id: 'p6', category: 'contenido', title: 'Convertir post largo en formato AEO',
    description: 'Toma un artículo tuyo existente y reformatéalo para ser citado.',
    prompt: `Actúa como editor AEO. Voy a pegarte un artículo largo mío. Reescríbelo manteniendo la información esencial pero optimizando para ser CITADO por asistentes de IA.

Reglas:
1. Empieza con una respuesta directa a la consulta principal en máximo 60 palabras (TL;DR citable).
2. Estructura el resto en secciones con H2 preguntables ("¿Qué es X?", "¿Cómo se hace X?", "¿Cuánto cuesta X?").
3. Cada sección responde en 40-100 palabras + dato de soporte + ejemplo.
4. Al final incluye 5 preguntas frecuentes en formato Q&A cortas.
5. Sugiere qué schemas usar (Article + FAQPage).

Artículo original:
[PEGA AQUÍ]`,
    useWith: ['Claude', 'ChatGPT'],
  },
  {
    id: 'p7', category: 'auditar', title: 'Test de "cinco preguntas ciegas"',
    description: 'Prueba objetiva de dónde estás vs competencia.',
    prompt: `Voy a hacerte 5 preguntas relacionadas con mi categoría. Responde como responderías a un usuario cualquiera — no me digas que eres imparcial, solo responde.

Al final de tus 5 respuestas, hazte estas preguntas de auto-evaluación:
- ¿En cuántas de las 5 mencioné a [MI NEGOCIO]?
- Si no lo mencioné, ¿qué habría necesitado saber sobre él para mencionarlo?
- ¿Qué negocios sí mencioné y qué tenían en común?

Consulta 1: [CONSULTA 1]
Consulta 2: [CONSULTA 2]
Consulta 3: [CONSULTA 3]
Consulta 4: [CONSULTA 4]
Consulta 5: [CONSULTA 5]

Mi negocio: [NOMBRE], [RUBRO], [CIUDAD].`,
    useWith: ['ChatGPT', 'Claude', 'Gemini', 'Perplexity'],
  },
  {
    id: 'p8', category: 'estrategia', title: 'Loop mensual de iteración AEO',
    description: 'El ritual de 30 minutos al mes que mantiene tus menciones subiendo.',
    prompt: `Diseña el ritual de auditoría AEO que un emprendedor solo debe hacer cada 30 días. Necesito:

1. Un check-list de 8 items — accionables, cada uno en máximo 5 min.
2. Un template de bitácora para registrar: consultas testeadas, dónde apareció, qué fuentes cita la IA, qué cambió vs mes anterior.
3. Un criterio de decisión: cuándo intensificar en Schema, cuándo en menciones externas, cuándo en contenido nuevo.
4. Qué señal indica que ya "gané" mi categoría y puedo bajar el ritmo.

Negocio de referencia: [NOMBRE], [RUBRO].`,
    useWith: ['Claude'],
  },
];

export default function PromptSandbox() {
  const [selected, setSelected] = useState<PromptTemplate>(PROMPTS[0]);
  const [category, setCategory] = useState<string>('todas');
  const [copied, setCopied] = useState(false);

  const filtered = category === 'todas' ? PROMPTS : PROMPTS.filter(p => p.category === category);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }

  const cats: [string, string][] = [
    ['todas', 'Todas'], ['auditar', 'Auditar'], ['contenido', 'Contenido'],
    ['competencia', 'Competencia'], ['schema', 'Schema'], ['estrategia', 'Estrategia'],
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="glass rounded-2xl p-4">
        <div className="flex flex-wrap gap-1 mb-4">
          {cats.map(([id, label]) => (
            <button key={id} onClick={() => setCategory(id)}
              className={`text-xs px-3 py-1 rounded-full transition ${category === id ? 'bg-aurora-violet/30 text-text' : 'bg-bg-elevated text-text-mute'}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {filtered.map(p => (
            <button key={p.id} onClick={() => setSelected(p)}
              className={`w-full text-left p-3 rounded-lg transition ${selected.id === p.id ? 'bg-aurora-violet/20 border border-aurora-violet/40' : 'bg-bg-elevated hover:bg-bg-elevated/80'}`}>
              <p className="text-sm font-semibold">{p.title}</p>
              <p className="text-xs text-text-mute mt-1">{p.description}</p>
            </button>
          ))}
        </div>
      </aside>

      <section className="glass rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="kicker mb-1">{selected.category}</p>
            <h3 className="font-display text-xl font-semibold">{selected.title}</h3>
            <p className="text-sm text-text-soft mt-1">{selected.description}</p>
            <div className="mt-3 flex gap-1 flex-wrap">
              {selected.useWith.map(w => <span key={w} className="chip">{w}</span>)}
            </div>
          </div>
          <button onClick={() => copy(selected.prompt)} className="btn-primary text-xs px-4 py-1.5 shrink-0">
            {copied ? '✓ Copiado' : 'Copiar prompt'}
          </button>
        </div>
        <pre className="text-xs bg-bg-elevated rounded-lg p-4 overflow-auto max-h-[500px] whitespace-pre-wrap leading-relaxed"><code>{selected.prompt}</code></pre>
        <p className="text-xs text-text-mute mt-3">
          Reemplaza los <code className="text-aurora-cyan">[MARCADORES]</code> con tus datos reales. Pega el prompt en la IA marcada.
        </p>
      </section>
    </div>
  );
}

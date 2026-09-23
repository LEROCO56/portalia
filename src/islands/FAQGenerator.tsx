import { useState, useMemo } from 'react';

interface QA { id: string; q: string; a: string; }

export default function FAQGenerator() {
  const [items, setItems] = useState<QA[]>([
    { id: '1', q: '¿Cuánto cuesta el servicio?', a: 'El servicio inicia en COP X y varía según el alcance. Contáctanos para una cotización personalizada en menos de 24 horas.' },
    { id: '2', q: '¿Cuánto tarda la implementación?', a: 'La implementación típica toma entre 2 y 4 semanas dependiendo del tamaño del proyecto. Trabajamos en sprints de 1 semana con entregables visibles.' },
  ]);
  const [copied, setCopied] = useState(false);

  function add() {
    setItems([...items, { id: crypto.randomUUID(), q: '', a: '' }]);
  }
  function del(id: string) {
    setItems(items.filter(x => x.id !== id));
  }
  function upd(id: string, field: 'q' | 'a', v: string) {
    setItems(items.map(x => x.id === id ? { ...x, [field]: v } : x));
  }

  const schema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.filter(x => x.q && x.a).map(x => ({
      '@type': 'Question',
      name: x.q,
      acceptedAnswer: { '@type': 'Answer', text: x.a },
    })),
  }), [items]);

  const embed = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(embed);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }

  const inputClass = 'w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-aurora-violet transition';

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="glass rounded-2xl p-6">
        <h3 className="font-display text-lg font-semibold mb-4">Preguntas y respuestas</h3>
        <div className="space-y-4">
          {items.map((it, i) => (
            <div key={it.id} className="glass rounded-xl p-4 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-widest text-text-mute">Q&A #{i + 1}</span>
                <button onClick={() => del(it.id)} className="text-xs text-red-400 hover:text-red-300">Eliminar</button>
              </div>
              <input className={inputClass} placeholder="Pregunta" value={it.q} onChange={e => upd(it.id, 'q', e.target.value)} />
              <textarea className={inputClass} rows={3} placeholder="Respuesta (40-80 palabras)" value={it.a} onChange={e => upd(it.id, 'a', e.target.value)} />
              <p className="text-xs text-text-mute">{it.a.split(/\s+/).filter(Boolean).length} palabras</p>
            </div>
          ))}
        </div>
        <button onClick={add} className="btn-ghost text-sm px-5 py-2 mt-4">+ Añadir Q&A</button>
        <p className="mt-3 text-xs text-text-mute">Rango dulce: 8-15 Q&A. Menos de 5 Google no lo considera. Más de 25 diluye peso.</p>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg font-semibold">JSON-LD listo</h3>
          <button onClick={copy} className="btn-primary text-xs px-4 py-1.5">{copied ? '✓ Copiado' : 'Copiar'}</button>
        </div>
        <pre className="text-xs bg-bg-elevated rounded-lg p-4 overflow-auto max-h-[520px]"><code>{embed}</code></pre>
      </div>
    </div>
  );
}

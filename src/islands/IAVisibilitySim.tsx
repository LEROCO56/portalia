import { useState } from 'react';

// Simulador "cómo te ve una IA" — heurística en cliente que emula un scoring de crawler AEO.
export default function IAVisibilitySim() {
  const [url, setUrl] = useState('');
  const [nombre, setNombre] = useState('');
  const [tieneJsonLd, setTieneJsonLd] = useState(false);
  const [tieneFAQ, setTieneFAQ] = useState(false);
  const [tieneBreadcrumb, setTieneBreadcrumb] = useState(false);
  const [tieneMenciones, setTieneMenciones] = useState(0); // 0,1,2 → ninguna, algunas, muchas
  const [tieneQAFormat, setTieneQAFormat] = useState(false);
  const [tieneAutor, setTieneAutor] = useState(false);
  const [tieneHttps, setTieneHttps] = useState(true);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<null | {
    score: number;
    porIA: Record<string, { menciona: boolean; motivo: string }>;
  }>(null);

  function score() {
    let s = 0;
    if (tieneJsonLd) s += 22;
    if (tieneFAQ) s += 14;
    if (tieneBreadcrumb) s += 6;
    s += tieneMenciones * 12;
    if (tieneQAFormat) s += 12;
    if (tieneAutor) s += 6;
    if (tieneHttps) s += 8;
    if (nombre && nombre.length > 2) s += 4;
    return Math.min(100, s);
  }

  function analizar() {
    setRunning(true);
    setTimeout(() => {
      const total = score();
      const porIA: Record<string, { menciona: boolean; motivo: string }> = {
        ChatGPT: {
          menciona: total >= 55,
          motivo: total >= 55
            ? 'Tienes structured data y algo de menciones — te incluye entre las opciones.'
            : 'Falta señal externa. ChatGPT prioriza fuentes con múltiples menciones cruzadas.',
        },
        Claude: {
          menciona: total >= 60,
          motivo: total >= 60
            ? 'Buen contexto declarado. Claude te menciona citando tu propia web como fuente.'
            : 'Claude es especialmente exigente con schema y autoría. Reforzar Author + Organization.',
        },
        Gemini: {
          menciona: total >= 50,
          motivo: total >= 50
            ? 'Gemini indexa datos estructurados agresivamente — apareces cuando hay match temático.'
            : 'Añadir Schema.org y BreadcrumbList sube tu visibilidad en Gemini rápido.',
        },
        Perplexity: {
          menciona: total >= 48,
          motivo: total >= 48
            ? 'Perplexity te cita porque tienes formato Q&A + fuentes distribuidas.'
            : 'Perplexity necesita menciones externas de calidad. Es el motor que más las pesa.',
        },
        Copilot: {
          menciona: total >= 65,
          motivo: total >= 65
            ? 'Copilot te lista en respuestas B2B por el schema Organization + autoría.'
            : 'Copilot filtra fuerte para B2B: schema completo, autor identificable y HTTPS.',
        },
      };
      setResult({ score: total, porIA });
      setRunning(false);
    }, 900);
  }

  function reset() {
    setResult(null);
  }

  const label = 'block text-xs uppercase tracking-widest text-text-mute mb-1';
  const input = 'w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-aurora-violet transition';
  const toggle = 'flex items-center justify-between glass rounded-xl px-4 py-3 cursor-pointer';

  if (result) {
    const color = result.score >= 65 ? 'text-emerald-300' : result.score >= 45 ? 'text-amber-300' : 'text-red-300';
    return (
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <p className="kicker mb-2">Puntaje simulado</p>
          <p className={`font-display text-6xl font-semibold ${color}`}>{result.score}<span className="text-text-mute text-2xl">/100</span></p>
        </div>
        <div className="grid gap-3">
          {Object.entries(result.porIA).map(([ia, r]) => (
            <div key={ia} className="glass rounded-xl p-4 flex items-start gap-4">
              <span className={`text-2xl shrink-0 ${r.menciona ? 'text-emerald-400' : 'text-red-400'}`}>
                {r.menciona ? '✓' : '✕'}
              </span>
              <div>
                <p className="font-semibold">{ia} {r.menciona ? 'te menciona' : 'no te menciona hoy'}</p>
                <p className="text-sm text-text-soft mt-1">{r.motivo}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={reset} className="btn-ghost text-sm px-5 py-2">Volver a simular</button>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div><label className={label}>URL de tu web</label><input className={input} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://minegocio.com" /></div>
        <div><label className={label}>Nombre del negocio</label><input className={input} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Café Origen Bogotá" /></div>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        {[
          ['JSON-LD Schema.org presente en el head', tieneJsonLd, setTieneJsonLd],
          ['FAQPage schema con al menos 5 preguntas', tieneFAQ, setTieneFAQ],
          ['BreadcrumbList schema', tieneBreadcrumb, setTieneBreadcrumb],
          ['Contenido en formato pregunta-respuesta corta', tieneQAFormat, setTieneQAFormat],
          ['Página incluye Author identificable', tieneAutor, setTieneAutor],
          ['HTTPS activo', tieneHttps, setTieneHttps],
        ].map(([labelStr, val, setter]) => (
          <label key={labelStr as string} className={toggle}>
            <span className="text-sm">{labelStr as string}</span>
            <input type="checkbox" checked={val as boolean}
              onChange={e => (setter as (v: boolean) => void)(e.target.checked)}
              className="w-5 h-5 accent-aurora-violet" />
          </label>
        ))}
      </div>

      <div>
        <label className={label}>¿Cuántas menciones externas tienes de tu negocio?</label>
        <select className={input} value={tieneMenciones} onChange={e => setTieneMenciones(Number(e.target.value))}>
          <option value={0}>Ninguna medible</option>
          <option value={1}>Entre 1 y 5 fuentes</option>
          <option value={2}>Más de 5 fuentes distintas</option>
        </select>
      </div>

      <button onClick={analizar} disabled={running} className="btn-primary w-full py-3 justify-center">
        {running ? 'Simulando…' : 'Simular cómo me ven las IAs'}
      </button>
    </div>
  );
}

import { useState } from 'react';

interface AuditResult {
  score: number;
  gaps: { title: string; detail: string; severity: 'high' | 'mid' | 'low'; step?: string }[];
  wins: string[];
  summary?: string;
  plan?: string[];
  tier?: 'guest' | 'free' | 'pro';
  engine?: string;
  fallback?: boolean;
}

// Respaldo local si el endpoint no responde (sin red, error del servidor).
function analyzeHeuristic(domain: string, business: string, query: string): AuditResult {
  const gaps: AuditResult['gaps'] = [];
  let score = 45;
  const clean = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const hasHttps = domain.startsWith('https://');
  if (!hasHttps) gaps.push({ title: 'Sin HTTPS explícito', detail: 'Las IAs desconfían de fuentes no cifradas.', severity: 'high' });
  else score += 8;

  if (!business || business.length < 3) {
    gaps.push({ title: 'Nombre de negocio ambiguo', detail: 'Sin un nombre claro, las IAs no pueden asociar la mención.', severity: 'high' });
  } else {
    score += 10;
  }

  if (!query || query.length < 10) {
    gaps.push({ title: 'Consulta objetivo poco definida', detail: 'Debes tener 3–5 consultas semilla que quieres que la IA responda con tu nombre.', severity: 'mid' });
  } else {
    score += 8;
  }

  // Heurísticas ciegas típicas
  gaps.push({
    title: 'Schema.org Organization no verificado',
    detail: 'La mayoría de webs LatAm carecen de JSON-LD Organization + FAQPage. Es la señal #1 para que una IA te "entienda".',
    severity: 'high',
  });
  gaps.push({
    title: 'Ausencia de menciones externas medibles',
    detail: 'Sin menciones en directorios y foros de nicho, las IAs no tienen contexto para recomendarte.',
    severity: 'mid',
  });
  gaps.push({
    title: 'Contenido no optimizado AEO/GEO',
    detail: 'Tu contenido probablemente responde en párrafos largos. Las IAs prefieren respuestas cortas + listas.',
    severity: 'mid',
  });

  const wins: string[] = [];
  if (clean.length < 30) wins.push('Dominio corto y memorable — favorece citación.');
  if (hasHttps) wins.push('HTTPS activo.');
  wins.push('Tienes página web (~30% de negocios LatAm todavía no la tiene).');

  score = Math.min(72, Math.max(20, score));

  return { score, gaps, wins, fallback: true };
}

export default function AuditorForm() {
  const [domain, setDomain] = useState('');
  const [business, setBusiness] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auditor', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ domain, business, query }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data && typeof data.score === 'number') setResult(data as AuditResult);
      else if (data?.reason) setError(data.reason);
      else setResult(analyzeHeuristic(domain, business, query));
    } catch {
      setResult(analyzeHeuristic(domain, business, query));
    }
    setLoading(false);
  }

  if (result) {
    const color = result.score >= 60 ? 'text-emerald-300' : result.score >= 40 ? 'text-amber-300' : 'text-red-300';
    return (
      <div className="glass rounded-2xl p-6 md:p-8">
        <div className="flex items-baseline gap-4">
          <p className="text-sm uppercase tracking-widest text-text-mute">Puntaje AEO</p>
          <p className={`font-display text-5xl font-semibold ${color}`}>{result.score}<span className="text-text-mute text-2xl">/100</span></p>
        </div>
        <p className="mt-2 text-xs text-text-mute">
          {result.fallback
            ? 'Diagnóstico estimado (no pudimos leer tu web en este momento).'
            : 'Medido leyendo tu página, robots.txt, sitemap.xml, llms.txt y schema JSON-LD.'}
        </p>
        {result.summary && <p className="mt-5 text-sm text-text-soft leading-relaxed">{result.summary}</p>}
        {result.plan && result.plan.length > 0 && (
          <div className="mt-6 glass rounded-xl p-5">
            <p className="kicker mb-3">Tu plan de 30 días (Auditor Pro)</p>
            <ol className="space-y-2 list-decimal list-inside text-sm text-text-soft">
              {result.plan.map((p, i) => <li key={i}>{p}</li>)}
            </ol>
          </div>
        )}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <p className="kicker mb-3 text-red-300/70">Gaps detectados</p>
            <ul className="space-y-3">
              {result.gaps.map((g, i) => (
                <li key={i} className="glass rounded-xl p-4">
                  <p className="font-semibold text-sm">{g.step && <span className="text-aurora-cyan mr-1">[{g.step}]</span>}{g.title}</p>
                  <p className="text-xs text-text-soft mt-1">{g.detail}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="kicker mb-3">Aciertos</p>
            <ul className="space-y-2">
              {result.wins.map((w, i) => (
                <li key={i} className="text-sm text-text-soft flex gap-2"><span className="text-aurora-cyan">✓</span>{w}</li>
              ))}
            </ul>
            {result.tier !== 'pro' && (
            <div className="mt-6 p-4 rounded-xl border border-aurora-violet/40 bg-aurora-violet/10">
              <p className="text-sm font-semibold">Auditor Pro (miembros)</p>
              <p className="mt-1 text-xs text-text-soft">
                Los miembros del método reciben, además de este diagnóstico, un resumen y un plan
                de 30 días escrito con IA, auditorías ilimitadas e historial de puntajes.
              </p>
              <a href="/metodo" className="mt-3 inline-block text-xs text-aurora-cyan">Ver método →</a>
            </div>
            )}
          </div>
        </div>
        <button onClick={() => setResult(null)} className="mt-6 btn-ghost text-sm px-5 py-2">
          Auditar otra web
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass rounded-2xl p-6 md:p-8 space-y-4">
      <div>
        <label className="block text-xs uppercase tracking-widest text-text-mute mb-2">URL de tu web</label>
        <input
          required
          type="text"
          inputMode="url"
          placeholder="https://minegocio.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-aurora-violet transition"
        />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest text-text-mute mb-2">Nombre del negocio</label>
        <input
          required
          type="text"
          placeholder="Ej: Café Origen Bogotá"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-aurora-violet transition"
        />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest text-text-mute mb-2">¿Qué consulta quieres que la IA responda con tu nombre?</label>
        <input
          required
          type="text"
          placeholder="Ej: mejor café de especialidad en Bogotá"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-aurora-violet transition"
        />
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3 justify-center disabled:opacity-50">
        {loading ? 'Analizando…' : 'Auditar mi web (gratis)'}
      </button>
      <p className="text-xs text-text-mute text-center">
        Leemos tu web en vivo (schema, robots.txt, sitemap, llms.txt, contenido). Los miembros reciben además un plan de 30 días con IA.
      </p>
    </form>
  );
}

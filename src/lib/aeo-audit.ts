// Auditor Pro — análisis real de señales AEO de un sitio + recomendaciones con Claude.
// 1) Descarga la página, robots.txt, llms.txt y sitemap.xml del dominio (servidor, Workers).
// 2) Calcula un puntaje determinístico con señales verificables (no inventa datos).
// 3) Si hay ANTHROPIC_API_KEY, Claude prioriza los gaps y redacta un plan CITAR de 30 días.

export type Severity = 'high' | 'mid' | 'low';
export interface Gap { title: string; detail: string; severity: Severity; step?: 'C' | 'I' | 'T' | 'A' | 'R' }
export interface AuditSignals {
  finalUrl: string;
  status: number;
  https: boolean;
  title: string | null;
  metaDescription: string | null;
  h1Count: number;
  lang: string | null;
  jsonLdTypes: string[];
  hasOrganization: boolean;
  hasLocalBusiness: boolean;
  hasFAQPage: boolean;
  hasSameAs: boolean;
  questionHeadings: number;
  wordCount: number;
  robotsTxt: boolean;
  blockedAIBots: string[];
  llmsTxt: boolean;
  sitemap: boolean;
  canonical: boolean;
  ogTags: boolean;
  businessNameInPage: boolean;
}
export interface AuditResult {
  score: number;
  gaps: Gap[];
  wins: string[];
  signals: AuditSignals;
  plan?: string[];
  summary?: string;
  engine: 'signals' | 'signals+claude';
}

const AI_BOTS = ['GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'ClaudeBot', 'Claude-Web', 'anthropic-ai', 'PerplexityBot', 'Google-Extended', 'CCBot', 'Bingbot'];
const UA = 'PortaliaAuditor/1.0 (+https://portalia.com.co/auditor)';

export function normalizeUrl(input: string): URL {
  const raw = input.trim();
  const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('protocolo_no_permitido');
  const host = url.hostname.toLowerCase();
  // Evitar SSRF hacia redes internas o hosts sin dominio público.
  if (
    host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal') || !host.includes('.') ||
    /^(10|127|0)\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host) || host.startsWith('[')
  ) throw new Error('host_no_permitido');
  return url;
}

async function fetchText(url: string, timeoutMs = 8000): Promise<{ ok: boolean; status: number; text: string; finalUrl: string }> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html,text/plain,*/*' }, redirect: 'follow', signal: ctrl.signal });
    const text = (await res.text()).slice(0, 600_000);
    return { ok: res.ok, status: res.status, text, finalUrl: res.url || url };
  } catch {
    return { ok: false, status: 0, text: '', finalUrl: url };
  } finally {
    clearTimeout(t);
  }
}

function collectTypes(node: unknown, out: Set<string>, flags: { sameAs: boolean }) {
  if (Array.isArray(node)) { node.forEach((n) => collectTypes(n, out, flags)); return; }
  if (node && typeof node === 'object') {
    const obj = node as Record<string, unknown>;
    const t = obj['@type'];
    if (typeof t === 'string') out.add(t);
    if (Array.isArray(t)) t.forEach((x) => typeof x === 'string' && out.add(x));
    if (obj.sameAs) flags.sameAs = true;
    Object.values(obj).forEach((v) => collectTypes(v, out, flags));
  }
}

/** Qué bots de IA quedan bloqueados en la raíz por robots.txt (análisis simple por grupos). */
export function blockedBots(robots: string): string[] {
  const groups: { agents: string[]; disallowRoot: boolean }[] = [];
  let cur: { agents: string[]; disallowRoot: boolean } | null = null;
  let lastWasAgent = false;
  for (const rawLine of robots.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, '').trim();
    if (!line) continue;
    const [k, ...rest] = line.split(':');
    const key = k.trim().toLowerCase();
    const val = rest.join(':').trim();
    if (key === 'user-agent') {
      if (!cur || !lastWasAgent) { cur = { agents: [], disallowRoot: false }; groups.push(cur); }
      cur.agents.push(val.toLowerCase());
      lastWasAgent = true;
    } else {
      lastWasAgent = false;
      if (cur && key === 'disallow' && val === '/') cur.disallowRoot = true;
    }
  }
  const star = groups.find((g) => g.agents.includes('*'));
  return AI_BOTS.filter((bot) => {
    const own = groups.find((g) => g.agents.includes(bot.toLowerCase()));
    return own ? own.disallowRoot : !!star?.disallowRoot;
  });
}

export async function collectSignals(target: URL, business: string): Promise<AuditSignals> {
  const origin = target.origin;
  const [page, robots, llms, sitemap] = await Promise.all([
    fetchText(target.toString()),
    fetchText(`${origin}/robots.txt`, 5000),
    fetchText(`${origin}/llms.txt`, 5000),
    fetchText(`${origin}/sitemap.xml`, 5000),
  ]);
  const html = page.text;
  const pick = (re: RegExp) => html.match(re)?.[1]?.trim() ?? null;

  const types = new Set<string>();
  const flags = { sameAs: false };
  for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { collectTypes(JSON.parse(m[1].trim()), types, flags); } catch { /* JSON-LD inválido: se ignora */ }
  }
  const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const headings = [...html.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi)].map((m) => m[1].replace(/<[^>]+>/g, '').trim());
  const typeList = [...types];
  const localTypes = ['LocalBusiness', 'Restaurant', 'Store', 'ProfessionalService', 'HealthAndBeautyBusiness', 'DaySpa', 'MedicalBusiness', 'LegalService', 'FoodEstablishment', 'HomeAndConstructionBusiness'];
  const robotsOk = robots.ok && !/<html/i.test(robots.text);
  const llmsOk = llms.ok && llms.text.trim().length > 20 && !/<html/i.test(llms.text);

  return {
    finalUrl: page.finalUrl,
    status: page.status,
    https: page.finalUrl.startsWith('https://'),
    title: pick(/<title[^>]*>([\s\S]*?)<\/title>/i),
    metaDescription: pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ?? pick(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i),
    h1Count: (html.match(/<h1[\s>]/gi) ?? []).length,
    lang: pick(/<html[^>]+lang=["']([^"']+)["']/i),
    jsonLdTypes: typeList,
    hasOrganization: typeList.some((t) => t === 'Organization' || t === 'Corporation') || typeList.some((t) => localTypes.includes(t)),
    hasLocalBusiness: typeList.some((t) => localTypes.includes(t)),
    hasFAQPage: typeList.includes('FAQPage'),
    hasSameAs: flags.sameAs,
    questionHeadings: headings.filter((h) => /\?\s*$|^¿/.test(h)).length,
    wordCount: text.split(' ').filter(Boolean).length,
    robotsTxt: robotsOk,
    blockedAIBots: robotsOk ? blockedBots(robots.text) : [],
    llmsTxt: llmsOk,
    sitemap: sitemap.ok && /<(urlset|sitemapindex)/i.test(sitemap.text),
    canonical: /<link[^>]+rel=["']canonical["']/i.test(html),
    ogTags: /<meta[^>]+property=["']og:title["']/i.test(html),
    businessNameInPage: business.trim().length > 2 && text.toLowerCase().includes(business.trim().toLowerCase()),
  };
}

/** Puntaje 0–100 con pesos alineados a CITAR. Todo sale de señales medidas. */
export function scoreSignals(s: AuditSignals): { score: number; gaps: Gap[]; wins: string[] } {
  const gaps: Gap[] = [];
  const wins: string[] = [];
  let score = 0;
  const add = (ok: boolean, pts: number, win: string, gap: Gap) => { if (ok) { score += pts; wins.push(win); } else gaps.push(gap); };

  if (s.status === 0 || s.status >= 400) {
    gaps.push({ title: `La página no respondió bien (HTTP ${s.status || 'sin respuesta'})`, detail: 'Si el rastreador de Portalia no pudo leerla, los rastreadores de IA probablemente tampoco. Revisa hosting, bloqueos por país o firewall.', severity: 'high', step: 'I' });
  }
  add(s.https, 6, 'HTTPS activo.', { title: 'Sin HTTPS', detail: 'Activa certificado SSL y redirige todo a https://. Las IAs y Google penalizan fuentes no cifradas.', severity: 'high', step: 'I' });
  add(s.hasOrganization, 14, `Schema de entidad presente (${s.jsonLdTypes.slice(0, 4).join(', ')}).`, { title: 'Falta JSON-LD Organization / LocalBusiness', detail: 'Es la ficha de identidad que leen las IAs: nombre, url, logo, dirección, teléfono y sameAs. Paso C del método.', severity: 'high', step: 'C' });
  add(s.hasSameAs, 8, 'sameAs conecta tu web con perfiles externos.', { title: 'Sin sameAs en el schema', detail: 'Enlaza Google Business Profile, Instagram, LinkedIn y directorios en la propiedad sameAs para que la IA una tu entidad.', severity: 'mid', step: 'C' });
  add(s.hasFAQPage, 12, 'FAQPage detectada.', { title: 'Sin FAQPage', detail: 'Crea 6–10 preguntas reales de clientes con respuestas de 40–60 palabras y márcalas con FAQPage. Paso T.', severity: 'high', step: 'T' });
  add(s.questionHeadings >= 3, 8, `${s.questionHeadings} encabezados en forma de pregunta.`, { title: 'Contenido sin preguntas explícitas', detail: 'Usa H2/H3 con las preguntas que la gente le hace a ChatGPT y responde en la primera frase.', severity: 'mid', step: 'T' });
  add(s.blockedAIBots.length === 0 && s.robotsTxt, 10, 'robots.txt no bloquea a los bots de IA.', s.robotsTxt
    ? { title: `robots.txt bloquea bots de IA: ${s.blockedAIBots.join(', ')}`, detail: 'Si bloqueas GPTBot, ClaudeBot o PerplexityBot, esas IAs no pueden leer ni citar tu web. Permítelos explícitamente.', severity: 'high', step: 'I' }
    : { title: 'Sin robots.txt', detail: 'Publica un robots.txt que permita GPTBot, ClaudeBot, PerplexityBot y apunte a tu sitemap.', severity: 'mid', step: 'I' });
  add(s.sitemap, 8, 'sitemap.xml disponible.', { title: 'Sin sitemap.xml', detail: 'Sin sitemap los rastreadores descubren menos páginas. Publícalo y regístralo en Google Search Console y Bing Webmaster Tools (Copilot usa Bing).', severity: 'mid', step: 'I' });
  add(s.llmsTxt, 4, 'llms.txt publicado.', { title: 'Sin llms.txt', detail: 'Señal emergente y barata: un resumen en Markdown de quién eres y tus páginas clave. No es obligatorio, pero suma.', severity: 'low', step: 'I' });
  add(!!s.title && s.title.length >= 15 && s.title.length <= 70, 6, 'Título claro y de buena longitud.', { title: 'Título débil o ausente', detail: 'Usa "Servicio + ciudad | Marca" en 50–60 caracteres.', severity: 'mid', step: 'C' });
  add(!!s.metaDescription && s.metaDescription.length >= 70, 5, 'Meta description presente.', { title: 'Meta description ausente o corta', detail: 'Escribe 140–160 caracteres que respondan qué haces, para quién y dónde.', severity: 'low', step: 'C' });
  add(s.h1Count === 1, 4, 'Un único H1.', { title: s.h1Count === 0 ? 'Sin H1' : `${s.h1Count} H1 en la página`, detail: 'Un solo H1 que diga qué eres y dónde operas.', severity: 'low', step: 'C' });
  add(s.wordCount >= 400, 6, `Contenido suficiente (${s.wordCount} palabras).`, { title: `Poco texto (${s.wordCount} palabras)`, detail: 'Las IAs necesitan material para citar: servicios, precios orientativos, zona, diferenciales, casos.', severity: 'mid', step: 'T' });
  add(s.businessNameInPage, 5, 'El nombre del negocio aparece en la página.', { title: 'El nombre del negocio no aparece tal cual', detail: 'Usa exactamente el mismo nombre en web, schema, Google Business Profile y redes (consistencia de entidad).', severity: 'mid', step: 'C' });
  add(s.canonical && s.ogTags, 4, 'Canonical y Open Graph presentes.', { title: 'Faltan canonical u Open Graph', detail: 'Evitan duplicados y mejoran cómo se comparte y cita tu página.', severity: 'low', step: 'A' });
  // Menciones externas no se pueden medir desde la web: se deja como recordatorio del paso A.
  gaps.push({ title: 'Autoridad externa por verificar (paso A)', detail: 'Pregunta a ChatGPT, Perplexity y Gemini por tu consulta objetivo y anota quién aparece. Las menciones en directorios, prensa y foros no se ven desde tu web.', severity: 'mid', step: 'A' });

  const order: Record<Severity, number> = { high: 0, mid: 1, low: 2 };
  gaps.sort((a, b) => order[a.severity] - order[b.severity]);
  return { score: Math.max(0, Math.min(100, Math.round(score))), gaps, wins };
}

/** Pide a Claude un resumen y un plan de 30 días. Devuelve null si falla (el audit sigue válido). */
export async function claudePlan(apiKey: string, model: string, input: { business: string; query: string; score: number; signals: AuditSignals; gaps: Gap[] }): Promise<{ summary: string; plan: string[] } | null> {
  const prompt = `Eres el auditor AEO de Portalia (método CITAR: Claridad de entidad, Indexabilidad para IA, Texto que responde, Autoridad externa, Revisión mensual).
Negocio: ${input.business}
Consulta objetivo: ${input.query || '(no indicada)'}
Puntaje medido: ${input.score}/100
Señales medidas (JSON): ${JSON.stringify(input.signals)}
Gaps detectados: ${JSON.stringify(input.gaps.map((g) => `${g.step ?? ''} ${g.title}`))}

Responde SOLO un JSON válido con esta forma:
{"summary":"2-3 frases en español colombiano, directas, sin exagerar, explicando por qué hoy una IA recomendaría o no a este negocio para esa consulta","plan":["5 a 7 acciones concretas y ordenadas por impacto para los próximos 30 días, cada una empieza con verbo e indica el paso CITAR entre corchetes, ej: [C] ..."]}
No inventes datos que no estén en las señales. No prometas posiciones garantizadas.`;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model, max_tokens: 900, messages: [{ role: 'user', content: prompt }] }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = data.content?.find((c) => c.type === 'text')?.text ?? '';
    const json = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
    if (typeof json.summary !== 'string' || !Array.isArray(json.plan)) return null;
    return { summary: json.summary, plan: json.plan.filter((p: unknown) => typeof p === 'string').slice(0, 7) };
  } catch {
    return null;
  }
}

export async function runAudit(opts: { url: string; business: string; query: string; apiKey?: string; model?: string }): Promise<AuditResult> {
  const target = normalizeUrl(opts.url);
  const signals = await collectSignals(target, opts.business);
  const { score, gaps, wins } = scoreSignals(signals);
  const result: AuditResult = { score, gaps, wins, signals, engine: 'signals' };
  if (opts.apiKey) {
    const ai = await claudePlan(opts.apiKey, opts.model || 'claude-sonnet-4-5', { business: opts.business, query: opts.query, score, signals, gaps });
    if (ai) { result.summary = ai.summary; result.plan = ai.plan; result.engine = 'signals+claude'; }
  }
  return result;
}

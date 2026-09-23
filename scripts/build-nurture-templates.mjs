// Genera supabase/functions/nurture-send/templates.ts desde content/email/nurture-secuencia.md
// (el markdown es la fuente única del copy). Uso: node scripts/build-nurture-templates.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const md = readFileSync('content/email/nurture-secuencia.md', 'utf8');
const parts = md.split(/\n## /).slice(1);
const out = [];
for (const p of parts) {
  const m = p.match(/^D(\d+) — ([^\n]+)\n/);
  if (!m) continue;
  const day = Number(m[1]);
  const subject = (p.match(/\*\*Asunto:\*\* ([^\n]+)/) || [])[1];
  const preheader = (p.match(/\*\*Preheader:\*\* ([^\n]+)/) || [])[1];
  let body = p.split(/\*\*Preheader:\*\*[^\n]*\n/)[1].split(/\n---/)[0];
  // Las líneas de instrucciones internas (*Con fecha real...*, *Sin fecha...*) no se envían:
  // no hay fecha real de cierre definida, así que no se inventa urgencia.
  body = body.split('\n').filter((l) => !/^\*(Con|Sin) fecha/.test(l.trim())).join('\n').trim();
  if (!subject || !preheader || !body) throw new Error(`Correo D${day} incompleto`);
  out.push({ day, key: `d${String(day).padStart(2, '0')}`, subject, preheader, body });
}
if (out.length !== 7) throw new Error(`Se esperaban 7 correos y hay ${out.length}`);
const ts = `// ARCHIVO GENERADO por scripts/build-nurture-templates.mjs — no editar a mano.
// Fuente: content/email/nurture-secuencia.md
export type NurtureTemplate = { day: number; key: string; subject: string; preheader: string; body: string };
export const TEMPLATES: NurtureTemplate[] = ${JSON.stringify(out, null, 2)};
`;
writeFileSync('supabase/functions/nurture-send/templates.ts', ts);
console.log(out.map((t) => `D${t.day}: ${t.subject} (${t.body.length} car.)`).join('\n'));

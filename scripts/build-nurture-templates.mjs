// Genera las plantillas de la Edge Function `nurture-send` desde los markdown de content/email/
// (el markdown es la fuente única del copy). Uso: node scripts/build-nurture-templates.mjs
//   content/email/nurture-secuencia.md      → supabase/functions/nurture-send/templates.ts            (D0..D14, 7 correos)
//   content/email/onboarding-compradores.md → supabase/functions/nurture-send/onboarding-templates.ts (B0..B21, 4 correos)
import { readFileSync, writeFileSync } from 'node:fs';

function parse(file, letter, expected) {
  const md = readFileSync(file, 'utf8');
  const parts = md.split(/\n## /).slice(1);
  const out = [];
  for (const p of parts) {
    const m = p.match(new RegExp(`^${letter}(\\d+) — ([^\\n]+)\\n`));
    if (!m) continue;
    const day = Number(m[1]);
    const subject = (p.match(/\*\*Asunto:\*\* ([^\n]+)/) || [])[1];
    const preheader = (p.match(/\*\*Preheader:\*\* ([^\n]+)/) || [])[1];
    let body = p.split(/\*\*Preheader:\*\*[^\n]*\n/)[1].split(/\n---/)[0];
    // Las líneas de instrucciones internas (*Con fecha real...*, *Sin fecha...*) no se envían:
    // no hay fecha real de cierre definida, así que no se inventa urgencia.
    body = body.split('\n').filter((l) => !/^\*(Con|Sin) fecha/.test(l.trim())).join('\n').trim();
    if (!subject || !preheader || !body) throw new Error(`Correo ${letter}${day} incompleto en ${file}`);
    out.push({ day, key: `${letter.toLowerCase()}${String(day).padStart(2, '0')}`, subject, preheader, body });
  }
  if (out.length !== expected) throw new Error(`${file}: se esperaban ${expected} correos y hay ${out.length}`);
  return out;
}

function write(target, source, name, list) {
  const ts = `// ARCHIVO GENERADO por scripts/build-nurture-templates.mjs — no editar a mano.
// Fuente: ${source}
export type NurtureTemplate = { day: number; key: string; subject: string; preheader: string; body: string };
export const ${name}: NurtureTemplate[] = ${JSON.stringify(list, null, 2)};
`;
  writeFileSync(target, ts);
  console.log(list.map((t) => `${t.key}: ${t.subject} (${t.body.length} car.)`).join('\n'));
}

write('supabase/functions/nurture-send/templates.ts', 'content/email/nurture-secuencia.md', 'TEMPLATES',
  parse('content/email/nurture-secuencia.md', 'D', 7));
write('supabase/functions/nurture-send/onboarding-templates.ts', 'content/email/onboarding-compradores.md', 'ONBOARDING_TEMPLATES',
  parse('content/email/onboarding-compradores.md', 'B', 4));

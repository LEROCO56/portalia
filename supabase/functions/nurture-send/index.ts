// Edge Function `nurture-send` — envía la secuencia nurture de 7 correos (D0, D1, D3, D5, D7, D10, D14).
// La invoca pg_cron cada hora (migración 004) con el encabezado x-cron-secret.
// Secretos de la función (Supabase → Edge Functions → Secrets):
//   RESEND_API_KEY   (obligatorio para enviar; sin él la función solo reporta cuántos están pendientes)
//   NURTURE_FROM     p. ej. "Portalia <hola@portalia.com.co>" (dominio verificado en Resend)
//   NURTURE_REPLY_TO opcional; SITE_URL y CHECKOUT_URL opcionales (hay valores por defecto)
// SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY los inyecta Supabase automáticamente.
// Despliegue: supabase functions deploy nurture-send --no-verify-jwt (la autenticación es x-cron-secret).
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { TEMPLATES } from './templates.ts';

const SITE = (Deno.env.get('SITE_URL') || 'https://portalia-m0f.pages.dev').replace(/\/$/, '');
const CHECKOUT = Deno.env.get('CHECKOUT_URL') || 'https://pay.hotmart.com/W107728674K?off=92xsf4mj';
const BATCH = 40;
const SEND_HOUR_UTC = 13; // 8:30 a. m. Bogotá (UTC-5)
const SEND_MIN_UTC = 30;

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { 'Content-Type': 'application/json' } });

function utm(url: string, key: string) {
  const u = new URL(url);
  u.searchParams.set('utm_source', 'email');
  u.searchParams.set('utm_medium', 'nurture');
  u.searchParams.set('utm_campaign', key);
  return u.toString();
}

function checkoutLink(key: string) {
  const u = new URL(CHECKOUT);
  u.searchParams.set('src', `email-nurture-${key}`); // Hotmart reporta el origen de la venta con `src`
  return u.toString();
}

type Vars = Record<string, string>;

export function renderMarkdown(tpl: { key: string; subject: string; body: string }, score: number | null, vars: Vars) {
  let subject = tpl.subject;
  let body = tpl.body;
  if (score === null) {
    // Se registró sin correr el Auditor: D0 invita a medir; D14 no cita un puntaje inexistente.
    if (tpl.key === 'd00') subject = 'Antes de arreglar, mide: tu punto de partida';
    body = body
      .replace(
        /Tu web sacó \*\*\{\{score\}\}\/100\*\* en el Auditor Portalia\.\n\nEse número mide/,
        'Antes de cualquier arreglo conviene medir. El Auditor Portalia es gratis, tarda menos de un minuto y te da un puntaje de 0 a 100: {{link_auditor}}\n\nEse puntaje mide',
      )
      .replace(/Si quieres ver el detalle de tu auditoría otra vez: \{\{link_auditor\}\}\n\n/, '')
      .replace(/compara con tu \{\{score\}\} inicial/, 'mira cuánto mejoró tu puntaje');
  }
  const all: Vars = { ...vars, score: score === null ? '' : String(score) };
  const fill = (s: string) => s.replace(/\{\{(\w+)\}\}/g, (_, k) => all[k] ?? '');
  body = fill(body).replace(/^Hola, :/m, 'Hola:');
  return { subject: fill(subject), body };
}

export function toText(md: string, unsubscribe: string) {
  const t = md
    .replace(/~~(.+?)~~ \*\*(.+?)\*\*/g, '$2 (antes $1)')
    .replace(/```\w*\n?/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^> /gm, '   ');
  return `${t}\n\n—\nRecibes este correo porque te registraste en Portalia (portalia.com.co).\nDarte de baja: ${unsubscribe}`;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s: string) =>
  esc(s)
    .replace(/~~(.+?)~~/g, '<s>$1</s>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/(https:\/\/[^\s<)]+)/g, '<a href="$1" style="color:#4f46e5">$1</a>');

export function toHtml(md: string, preheader: string, unsubscribe: string) {
  const blocks: string[] = [];
  const chunks = md.split(/```\w*\n([\s\S]*?)```/);
  chunks.forEach((chunk, i) => {
    if (i % 2 === 1) {
      blocks.push(`<pre style="background:#f4f4f5;padding:12px;border-radius:6px;font-size:12px;overflow:auto">${esc(chunk)}</pre>`);
      return;
    }
    for (const para of chunk.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)) {
      const lines = para.split('\n');
      if (lines.every((l) => /^[-*] /.test(l))) {
        blocks.push(`<ul>${lines.map((l) => `<li>${inline(l.slice(2))}</li>`).join('')}</ul>`);
      } else if (lines.every((l) => /^\d+\. /.test(l))) {
        blocks.push(`<ol>${lines.map((l) => `<li>${inline(l.replace(/^\d+\. /, ''))}</li>`).join('')}</ol>`);
      } else if (lines.every((l) => l.startsWith('> '))) {
        blocks.push(`<blockquote style="border-left:3px solid #c7d2fe;margin:0;padding-left:12px">${lines.map((l) => inline(l.slice(2))).join('<br>')}</blockquote>`);
      } else {
        blocks.push(`<p>${lines.map((l) => (l.startsWith('> ') ? `<span style="display:block;border-left:3px solid #c7d2fe;padding-left:12px">${inline(l.slice(2))}</span>` : inline(l))).join('<br>')}</p>`);
      }
    }
  });
  return `<!doctype html><html lang="es"><body style="margin:0;background:#ffffff">
<span style="display:none;max-height:0;overflow:hidden">${esc(preheader)}</span>
<div style="max-width:560px;margin:0 auto;padding:24px 16px;font:16px/1.6 -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#18181b">
${blocks.join('\n')}
<hr style="border:none;border-top:1px solid #e4e4e7;margin:32px 0 12px">
<p style="font-size:12px;color:#71717a">Recibes este correo porque te registraste en Portalia (portalia.com.co). <a href="${unsubscribe}" style="color:#71717a">Darte de baja</a>.</p>
</div></body></html>`;
}

/** Fecha del próximo envío: día `day` contado desde el registro, a las 8:30 a. m. Bogotá. */
function nextSendAt(createdAt: string, day: number) {
  const d = new Date(createdAt);
  // Día calendario en Bogotá del registro.
  const bog = new Date(d.getTime() - 5 * 3600_000);
  const at = Date.UTC(bog.getUTCFullYear(), bog.getUTCMonth(), bog.getUTCDate() + day, SEND_HOUR_UTC, SEND_MIN_UTC);
  return new Date(Math.max(at, Date.now())).toISOString();
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'method' }, 405);
  const url = Deno.env.get('SUPABASE_URL')!;
  const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const db = createClient(url, service, { auth: { persistSession: false } });

  const secret = req.headers.get('x-cron-secret') || '';
  const { data: ok } = await db.rpc('nurture_cron_secret_ok', { p_secret: secret });
  if (!secret || ok !== true) return json({ error: 'unauthorized' }, 401);

  const { data: due, error } = await db
    .from('email_nurture')
    .select('user_id, step, unsubscribe_token, created_at, profiles!inner(email, full_name, role)')
    .is('stopped_at', null)
    .lte('next_send_at', new Date().toISOString())
    .order('next_send_at')
    .limit(BATCH);
  if (error) return json({ error: error.message }, 500);

  const resendKey = Deno.env.get('RESEND_API_KEY');
  const from = Deno.env.get('NURTURE_FROM');
  if (!resendKey || !from) {
    return json({ ok: true, configured: false, pending: due?.length ?? 0, note: 'Faltan RESEND_API_KEY o NURTURE_FROM: no se envía nada.' });
  }
  const replyTo = Deno.env.get('NURTURE_REPLY_TO');

  const result = { sent: 0, stopped: 0, skipped: 0, failed: 0 };
  for (const row of due ?? []) {
    const p = (Array.isArray(row.profiles) ? row.profiles[0] : row.profiles) as { email: string; full_name: string | null; role: string };
    if (p.role !== 'free') {
      await db.from('email_nurture').update({ stopped_at: new Date().toISOString(), stop_reason: 'compra' }).eq('user_id', row.user_id);
      result.stopped++;
      continue;
    }
    const tpl = TEMPLATES[row.step];
    if (!tpl) {
      await db.from('email_nurture').update({ stopped_at: new Date().toISOString(), stop_reason: 'completa' }).eq('user_id', row.user_id);
      result.stopped++;
      continue;
    }

    // Idempotencia: si ya existe el registro de este paso, no se reenvía.
    const { error: logErr } = await db.from('email_nurture_log').insert({ user_id: row.user_id, step: row.step });
    if (logErr) {
      result.skipped++;
    } else {
      const { data: audit } = await db
        .from('audits').select('score').eq('user_id', row.user_id)
        .order('created_at', { ascending: true }).limit(1).maybeSingle();
      const score = typeof audit?.score === 'number' ? audit.score : null;
      const unsubscribe = `${SITE}/email/baja?t=${row.unsubscribe_token}`;
      const vars: Vars = {
        first_name: (p.full_name || '').trim().split(/\s+/)[0] || '',
        link_auditor: utm(`${SITE}/auditor`, tpl.key),
        link_herramientas: utm(`${SITE}/herramientas`, tpl.key),
        link_caso_serenity: utm(`${SITE}/casos/serenity`, tpl.key),
        link_checkout: checkoutLink(tpl.key),
      };
      const { subject, body } = renderMarkdown(tpl, score, vars);
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `nurture-${row.user_id}-${row.step}` },
        body: JSON.stringify({
          from,
          to: [p.email],
          subject,
          text: toText(body, unsubscribe),
          html: toHtml(body, tpl.preheader, unsubscribe),
          ...(replyTo ? { reply_to: replyTo } : {}),
          headers: { 'List-Unsubscribe': `<${unsubscribe}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
          tags: [{ name: 'secuencia', value: 'nurture' }, { name: 'paso', value: tpl.key }],
        }),
      });
      if (!res.ok) {
        const msg = (await res.text()).slice(0, 300);
        await db.from('email_nurture_log').delete().eq('user_id', row.user_id).eq('step', row.step);
        await db.from('email_nurture').update({ last_error: `${res.status} ${msg}` }).eq('user_id', row.user_id);
        result.failed++;
        continue; // se reintenta en la próxima hora
      }
      const { id } = await res.json().catch(() => ({ id: null }));
      await db.from('email_nurture_log').update({ provider_id: id }).eq('user_id', row.user_id).eq('step', row.step);
      result.sent++;
    }

    const nextStep = row.step + 1;
    const next = TEMPLATES[nextStep];
    await db.from('email_nurture').update({
      step: nextStep,
      last_sent_at: new Date().toISOString(),
      last_error: null,
      ...(next
        ? { next_send_at: nextSendAt(row.created_at, next.day) }
        : { stopped_at: new Date().toISOString(), stop_reason: 'completa' }),
    }).eq('user_id', row.user_id);
  }
  return json({ ok: true, configured: true, due: due?.length ?? 0, ...result });
});

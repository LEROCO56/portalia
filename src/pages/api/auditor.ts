// Auditor Portal IA — endpoint real.
// - Invitados: auditoría por señales medidas (sin Claude, no se guarda).
// - Usuarios free: igual, máximo 3 al día, se guarda en historial.
// - Miembros (buyer/affiliate/admin): señales + resumen y plan de 30 días con Claude, ilimitado, se guarda.

import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '@/lib/supabase';
import { runAudit } from '@/lib/aeo-audit';
import { env } from '@/lib/env';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const body = (await request.json().catch(() => ({}))) as { domain?: string; business?: string; query?: string };
  const domain = (body.domain ?? '').toString().slice(0, 300);
  const business = (body.business ?? '').toString().slice(0, 120);
  const query = (body.query ?? '').toString().slice(0, 200);
  if (!domain || !business) return json({ error: 'missing_fields' }, 400);

  const user = locals.user;
  const isMember = !!user && ['buyer', 'affiliate', 'admin'].includes(user.role);
  const supabase = user ? createSupabaseServerClient(cookies) : null;

  if (user && !isMember && supabase) {
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const { count } = await supabase.from('audits').select('id', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', since);
    if ((count ?? 0) >= 3) return json({ error: 'limit_reached', reason: 'Llegaste a 3 auditorías en 24 horas. Los miembros del método tienen auditorías ilimitadas.' }, 429);
  }

  const apiKey = isMember ? env('ANTHROPIC_API_KEY') : undefined;
  const model = env('ANTHROPIC_MODEL');

  let result;
  try {
    result = await runAudit({ url: domain, business, query, apiKey, model });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'error';
    return json({ error: 'invalid_url', reason: msg === 'host_no_permitido' ? 'Esa dirección no es un sitio público.' : 'La URL no es válida.' }, 400);
  }

  if (user && supabase) {
    await supabase.from('audits').insert({
      user_id: user.id,
      domain: result.signals.finalUrl,
      business_name: business,
      query,
      score: result.score,
      gaps: { gaps: result.gaps, wins: result.wins, plan: result.plan ?? null, summary: result.summary ?? null, engine: result.engine },
    });
  }

  return json({ ...result, tier: isMember ? 'pro' : user ? 'free' : 'guest' });
};

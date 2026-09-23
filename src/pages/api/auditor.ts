// Auditor Pro — endpoint que llama a Claude API para miembros con role=buyer/admin.
// Free tier: heurístico en cliente (islands/AuditorForm.tsx). Este endpoint requiere autenticación.

import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '@/lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createSupabaseServerClient(cookies);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'buyer' && profile.role !== 'admin' && profile.role !== 'affiliate')) {
    return new Response(JSON.stringify({ error: 'forbidden', reason: 'membership_required' }), { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const { domain, business, query } = body ?? {};
  if (!domain || !business) {
    return new Response(JSON.stringify({ error: 'missing_fields' }), { status: 400 });
  }

  // TODO Fase 2: llamar a Claude API con la URL y devolver JSON estructurado.
  // Por ahora responder con placeholder estructurado.
  const result = {
    score: 62,
    gaps: [
      { title: 'JSON-LD Organization ausente', detail: 'Añadir schema.org/Organization con nombre, url, sameAs.', severity: 'high' },
      { title: 'FAQPage no detectada', detail: 'Las IAs priorizan páginas con FAQPage schema para citar respuestas.', severity: 'high' },
    ],
    wins: ['HTTPS activo', 'Meta description presente'],
    savedAt: new Date().toISOString(),
  };

  await supabase.from('audits').insert({
    user_id: user.id,
    domain,
    business_name: business,
    query,
    score: result.score,
    gaps: result.gaps,
  });

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};

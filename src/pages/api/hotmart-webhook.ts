// Hotmart Webhook — al confirmar compra, asigna role='buyer' al usuario en Supabase.
// Documentación Hotmart: https://developers.hotmart.com/docs/en/1.0.0/webhook/about-webhook/

import type { APIRoute } from 'astro';
import { createSupabaseAdminClient } from '@/lib/supabase';
import { env } from '@/lib/env';

export const POST: APIRoute = async ({ request }) => {
  const secret = env('HOTMART_WEBHOOK_SECRET');
  const hottok = request.headers.get('x-hotmart-hottok') || request.headers.get('hottok');

  // Sin secreto configurado no se acepta nada (antes se aceptaba cualquier petición).
  if (!secret || hottok !== secret) {
    return new Response(JSON.stringify({ ok: false, reason: 'invalid_signature' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return new Response('bad_payload', { status: 400 });
  }

  const event = payload?.event as string | undefined;
  const data = payload?.data ?? {};
  const buyerEmail: string | undefined = data?.buyer?.email;
  const transactionId: string | undefined = data?.purchase?.transaction;
  const purchaseStatus: string | undefined = data?.purchase?.status;

  if (!buyerEmail) {
    return new Response(JSON.stringify({ ok: false, reason: 'no_email' }), { status: 400 });
  }

  const isPaid = event === 'PURCHASE_APPROVED' || event === 'PURCHASE_COMPLETE' || purchaseStatus === 'APPROVED';
  const isRefunded = event === 'PURCHASE_REFUNDED' || event === 'PURCHASE_CHARGEBACK' || purchaseStatus === 'REFUNDED';

  const supabase = createSupabaseAdminClient();

  // Upsert profile por email (crea si no existe).
  const { data: existing } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('email', buyerEmail.toLowerCase())
    .maybeSingle();

  if (isPaid) {
    if (existing) {
      await supabase
        .from('profiles')
        .update({
          role: existing.role === 'admin' ? 'admin' : 'buyer',
          hotmart_transaction_id: transactionId,
          hotmart_purchase_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      // Crear el usuario en Supabase Auth y su profile.
      const { data: authUser } = await supabase.auth.admin.createUser({
        email: buyerEmail.toLowerCase(),
        email_confirm: true,
        user_metadata: {
          full_name: data?.buyer?.name ?? '',
        },
      });
      if (authUser?.user) {
        await supabase.from('profiles').upsert({
          id: authUser.user.id,
          email: buyerEmail.toLowerCase(),
          full_name: data?.buyer?.name ?? null,
          role: 'buyer',
          hotmart_transaction_id: transactionId,
          hotmart_purchase_at: new Date().toISOString(),
        });
      }
    }
  }

  if (isRefunded && existing) {
    await supabase.from('profiles').update({ role: 'free' }).eq('id', existing.id);
  }

  return new Response(JSON.stringify({ ok: true, event }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};

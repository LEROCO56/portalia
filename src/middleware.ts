// Astro middleware: injects the authenticated user into Astro.locals
// so every page can gate on role without duplicating logic.

import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from '@/lib/supabase';

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    const supabase = createSupabaseServerClient(context.cookies);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .eq('id', user.id)
        .single();

      context.locals.user = {
        id: user.id,
        email: user.email ?? profile?.email ?? '',
        role: (profile?.role as any) ?? 'free',
        full_name: profile?.full_name ?? null,
      };
    } else {
      context.locals.user = null;
    }
  } catch {
    // If env vars missing (dev without .env) — treat as guest, don't crash.
    context.locals.user = null;
  }

  return next();
});

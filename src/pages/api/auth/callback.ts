// Supabase Magic Link callback — intercambia el code por sesión y redirige.
import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '@/lib/supabase';

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') || '/panel';

  if (code) {
    const supabase = createSupabaseServerClient(cookies);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }
  }

  return redirect(next);
};

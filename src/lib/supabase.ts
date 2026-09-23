// Supabase clients — server-side (with cookies) + admin (service role).
// Used from Astro pages/API routes running on Cloudflare Workers edge.

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { AstroCookies } from 'astro';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export function createSupabaseServerClient(cookies: AstroCookies) {
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    throw new Error('Supabase env vars missing');
  }
  return createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      get(name: string) {
        return cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookies.set(name, value, { ...options, path: '/' });
      },
      remove(name: string, options: CookieOptions) {
        cookies.delete(name, { ...options, path: '/' });
      },
    },
  });
}

// Admin client — only for webhooks / server-only operations. NEVER expose.
export function createSupabaseAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE) {
    throw new Error('Supabase admin env vars missing');
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export type UserRole = 'guest' | 'free' | 'buyer' | 'affiliate' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  hotmart_transaction_id: string | null;
  created_at: string;
}

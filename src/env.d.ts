/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
  readonly HOTMART_WEBHOOK_SECRET: string;
  readonly ANTHROPIC_API_KEY: string;
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_HOTMART_CHECKOUT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Cloudflare Runtime bindings
declare namespace App {
  interface Locals extends Runtime {
    user: {
      id: string;
      email: string;
      role: 'guest' | 'free' | 'buyer' | 'affiliate' | 'admin';
      full_name: string | null;
    } | null;
  }
}

type Runtime = import('@astrojs/cloudflare').Runtime<{
  KV?: KVNamespace;
}>;

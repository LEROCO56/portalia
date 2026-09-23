import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://portalia.com.co',
  output: 'hybrid',
  adapter: cloudflare({
    imageService: 'compile',
    platformProxy: { enabled: true },
  }),
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    sitemap(),
  ],
  vite: {
    define: {
      'import.meta.env.PUBLIC_SITE_URL': JSON.stringify('https://portalia.com.co'),
    },
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});

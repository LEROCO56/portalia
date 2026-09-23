import type { APIRoute } from 'astro';

const pages = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/metodo', changefreq: 'weekly', priority: '0.9' },
  { loc: '/auditor', changefreq: 'weekly', priority: '0.9' },
  { loc: '/comunidad', changefreq: 'daily', priority: '0.8' },
  { loc: '/afiliados', changefreq: 'weekly', priority: '0.7' },
  { loc: '/blog', changefreq: 'weekly', priority: '0.8' },
  { loc: '/blog/que-es-aeo', changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog/schema-org-para-negocios', changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog/menciones-externas-sin-presupuesto', changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog/chatgpt-vs-perplexity-vs-claude', changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog/faqpage-que-si-funciona', changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog/negocio-local-aeo-guia', changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog/saas-b2b-aparecer-en-ia', changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog/auditor-aeo-como-funciona', changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog/como-aparecer-en-perplexity', changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog/como-medir-si-chatgpt-te-recomienda', changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog/google-business-profile-e-ias', changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog/llms-txt-que-es-y-si-sirve', changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog/aeo-colombia-2026', changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog/errores-fatales-aeo', changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog/robots-txt-para-ia', changefreq: 'monthly', priority: '0.7' },
  { loc: '/casos/serenity', changefreq: 'monthly', priority: '0.7' },
  { loc: '/precios', changefreq: 'weekly', priority: '0.9' },
  { loc: '/comparador', changefreq: 'monthly', priority: '0.7' },

  { loc: '/login', changefreq: 'monthly', priority: '0.3' },
  { loc: '/legal/terminos', changefreq: 'yearly', priority: '0.2' },
  { loc: '/legal/privacidad', changefreq: 'yearly', priority: '0.2' },
  { loc: '/legal/reembolsos', changefreq: 'yearly', priority: '0.2' },
];

export const GET: APIRoute = ({ site }) => {
  const base = site?.toString().replace(/\/$/, '') || 'https://portalia.com.co';
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url><loc>${base}${p.loc}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`
  )
  .join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'content-type': 'application/xml' } });
};

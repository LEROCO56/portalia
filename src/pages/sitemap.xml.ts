import type { APIRoute } from 'astro';

const pages = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/metodo', changefreq: 'weekly', priority: '0.9' },
  { loc: '/auditor', changefreq: 'weekly', priority: '0.9' },
  { loc: '/comunidad', changefreq: 'daily', priority: '0.8' },
  { loc: '/afiliados', changefreq: 'weekly', priority: '0.7' },
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

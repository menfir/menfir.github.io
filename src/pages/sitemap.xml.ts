// ponytail: hand-rolled instead of @astrojs/sitemap — eight pages from two
// collections doesn't justify a dependency. Add the integration if page types
// ever outgrow the STATIC list below.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const STATIC = ['/', '/articles', '/tools', '/about'];

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('astro.config.mjs must set `site` for the sitemap to build absolute URLs.');

  const articles = await getCollection('articles', ({ data }) => !data.draft);
  const tools = await getCollection('tools');

  const urls = [
    ...STATIC.map((path) => ({ path, lastmod: undefined as string | undefined })),
    ...articles.map((e) => ({
      path: `/articles/${e.id}`,
      lastmod: e.data.pubDate.toISOString().slice(0, 10),
    })),
    ...tools.map((e) => ({ path: `/tools/${e.id}`, lastmod: undefined })),
  ];

  // Trailing slash, to match exactly what <link rel="canonical"> emits — a sitemap
  // listing /about while the page declares /about/ points Google at two URLs.
  const withSlash = (p: string) => (p.endsWith('/') ? p : `${p}/`);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(({ path, lastmod }) => {
    const loc = new URL(withSlash(path), site).href;
    return `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;
  })
  .join('\n')}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};

import { readdir, readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';

const distDirectory = resolve('dist');
const siteUrl = 'https://lunatartas.es';

async function findHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const pathname = resolve(directory, entry.name);
      if (entry.isDirectory()) return findHtmlFiles(pathname);
      return entry.name.endsWith('.html') ? [pathname] : [];
    }),
  );
  return nested.flat();
}

function expectedHtmlPath(url) {
  const pathname = new URL(url).pathname;
  if (pathname === '/') return resolve(distDirectory, 'index.html');
  return resolve(distDirectory, pathname.slice(1), 'index.html');
}

const [sitemap, robots, htmlFiles] = await Promise.all([
  readFile(resolve(distDirectory, 'sitemap.xml'), 'utf8'),
  readFile(resolve(distDirectory, 'robots.txt'), 'utf8'),
  findHtmlFiles(distDirectory),
]);
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1],
);

if (urls.length === 0 || new Set(urls).size !== urls.length) {
  throw new Error('Sitemap must contain a non-empty, unique URL set');
}

for (const url of urls) {
  if (!url.startsWith(`${siteUrl}/`) || !new URL(url).pathname.endsWith('/')) {
    throw new Error(
      `Sitemap URL is not an apex HTTPS trailing-slash URL: ${url}`,
    );
  }
  if (url.includes('/_showcase/') || url.includes('draft')) {
    throw new Error(`Sitemap contains a technical or draft URL: ${url}`);
  }

  const html = await readFile(expectedHtmlPath(url), 'utf8');
  if (!html.includes(`<link rel="canonical" href="${url}">`)) {
    throw new Error(`Canonical does not match sitemap URL: ${url}`);
  }
  if (!html.includes('<meta name="robots" content="index,follow">')) {
    throw new Error(`Indexable sitemap URL is not indexable: ${url}`);
  }
}

if (robots !== `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`) {
  throw new Error(
    'robots.txt must allow crawl and reference the canonical sitemap',
  );
}

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const pathname = relative(distDirectory, file).replace(/\\/g, '/');
  if (pathname === '404.html' && !html.includes('content="noindex,nofollow"')) {
    throw new Error('404 page must be noindex,nofollow');
  }
}

console.log(`Crawl policy verified for ${urls.length} indexable URLs.`);

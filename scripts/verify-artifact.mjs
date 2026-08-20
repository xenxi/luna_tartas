import { access, readdir, readFile } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';

const dist = resolve(process.env.DIST_DIR ?? 'dist');
const siteOrigin = 'https://lunatartas.es';
const deploymentBase =
  (process.env.PAGES_BASE_PATH ?? '/').replace(/\/+$/, '') || '/';
const htmlFiles = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const pathname = join(directory, entry.name);
    if (entry.isDirectory()) await walk(pathname);
    else if (extname(entry.name) === '.html') htmlFiles.push(pathname);
  }
}

function routeFor(file) {
  const pathname = relative(dist, file).replaceAll('\\', '/');
  return pathname === 'index.html'
    ? '/'
    : `/${pathname.replace(/index\.html$/, '')}`;
}

function fail(message) {
  throw new Error(`Artifact contract failed: ${message}`);
}

function artifactRoute(href) {
  if (deploymentBase === '/') return href;
  if (href === deploymentBase) return '/';
  return href.startsWith(`${deploymentBase}/`)
    ? href.slice(deploymentBase.length)
    : href;
}

function isAllowedAnalyticsModule(tagName, src) {
  return (
    tagName === 'script' &&
    /^\/_astro\/Analytics(?:Consent|Instrumentation)\.astro_astro_type_script_[^/]+\.js$/i.test(
      src,
    )
  );
}

await walk(dist);
if (htmlFiles.length === 0) fail('no HTML pages found');

const available = new Set(htmlFiles.map(routeFor));
const pages = new Map();
for (const file of htmlFiles) {
  const route = routeFor(file);
  const html = await readFile(file, 'utf8');
  pages.set(route, html);

  if (!/^<!doctype html>/i.test(html)) fail(`${route} has no HTML doctype`);
  if (!/<main(?:\s|>)/i.test(html)) fail(`${route} has no main landmark`);
  if ((html.match(/<h1(?:\s|>)/gi) ?? []).length !== 1) {
    fail(`${route} must have exactly one h1`);
  }
  for (const match of html.matchAll(
    /<(script|style)\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi,
  )) {
    if (!isAllowedAnalyticsModule(match[1].toLowerCase(), match[2])) {
      fail(`${route} loads an unexpected client asset`);
    }
  }
  if (/\b(?:TBD|FIXTURE|draft)\b/i.test(html)) {
    fail(`${route} contains a non-public placeholder`);
  }
  for (const match of html.matchAll(/\b(?:href|src)="([^"]*)"/g)) {
    if (match[1].trim() === '') fail(`${route} contains an empty ${match[0]}`);
  }
}

for (const [route, html] of pages) {
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const target = artifactRoute(href.split('#')[0].split('?')[0]);
    if (
      target.startsWith('/_astro/') ||
      target.includes('/_astro/') ||
      target.endsWith('.xml') ||
      target.endsWith('.txt') ||
      target === '/catalog.json'
    )
      continue;
    if (!available.has(target)) fail(`${route} links to missing ${href}`);
  }
}

const home = pages.get('/');
if (home === undefined) fail('homepage is missing');
const productsPath =
  deploymentBase === '/' ? '/productos/' : `${deploymentBase}/productos/`;
if (!home.includes(`href="${productsPath}"`)) {
  fail('homepage has no products discovery CTA');
}

const catalog = JSON.parse(await readFile(join(dist, 'catalog.json'), 'utf8'));
if (!Array.isArray(catalog.products) || catalog.products.length === 0) {
  fail('catalog has no published product for the critical smoke');
}

for (const product of catalog.products) {
  if (
    typeof product.url !== 'string' ||
    !product.url.startsWith(`${siteOrigin}/`)
  ) {
    fail(`product ${product.id} has no canonical URL`);
  }
  const productPath = new URL(product.url).pathname;
  const productHtml = pages.get(productPath);
  if (productHtml === undefined) fail(`product ${product.id} page is missing`);
  if (!productHtml.includes(`<link rel="canonical" href="${product.url}">`)) {
    fail(`product ${product.id} canonical does not match catalog.json`);
  }
  if (!/href="https:\/\/wa\.me\/\d+\?text=[^"]+"/i.test(productHtml)) {
    fail(`product ${product.id} has no WhatsApp conversion CTA`);
  }
}

await access(join(dist, 'sitemap.xml'));
await access(join(dist, 'robots.txt'));
console.log(
  `Artifact contract PASS: ${htmlFiles.length} HTML pages, ${catalog.products.length} products, no empty links, placeholders, broken internal links, or missing critical CTAs.`,
);

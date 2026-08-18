import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';

const dist = resolve('dist');
const pages = [];
const deploymentBase = (process.env.PAGES_BASE_PATH ?? '/').replace(/\/+$/, '') || '/';

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (extname(entry.name) === '.html') pages.push(path);
  }
}

function pagePath(file) {
  const path = relative(dist, file).replaceAll('\\', '/');
  return path === 'index.html' ? '/' : `/${path.replace(/index\.html$/, '')}`;
}

function artifactPath(href) {
  if (deploymentBase === '/') return href;
  return href === deploymentBase
    ? '/'
    : href.startsWith(`${deploymentBase}/`)
      ? href.slice(deploymentBase.length)
      : href;
}

await walk(dist);
const available = new Set(pages.map(pagePath));
const incoming = new Map([...available].map((path) => [path, 0]));
const broken = [];
const breadcrumbIssues = [];
const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8');
const indexable = [
  ...sitemap.matchAll(/<loc>https:\/\/lunatartas\.es([^<]*)<\/loc>/g),
].map((match) => match[1]);

for (const file of pages) {
  const source = pagePath(file);
  const html = await readFile(file, 'utf8');
  const breadcrumb = html.match(/<nav class="breadcrumb"[\s\S]*?<\/nav>/)?.[0];
  if (
    available.has(source) &&
    source !== '/' &&
    indexable.includes(source) &&
    (breadcrumb === undefined ||
      (breadcrumb.match(/aria-current="page"/g) ?? []).length !== 1)
  ) {
    breadcrumbIssues.push(source);
  }
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (
      !href.startsWith('/') ||
      href.startsWith('//') ||
      href.startsWith('/wa.me')
    )
      continue;
    const path = artifactPath(href.split('#')[0].split('?')[0]);
    if (
      path.startsWith('/_astro/') ||
      path.endsWith('.xml') ||
      path.endsWith('.txt')
    )
      continue;
    if (!available.has(path)) {
      broken.push(`${source} -> ${href}`);
      continue;
    }
    if (path !== source) incoming.set(path, incoming.get(path) + 1);
  }
}

const orphaned = indexable.filter(
  (path) => path !== '/' && (incoming.get(path) ?? 0) === 0,
);

if (broken.length || orphaned.length || breadcrumbIssues.length) {
  console.error(
    JSON.stringify({ broken, orphaned, breadcrumbIssues }, null, 2),
  );
  process.exit(1);
}

console.log(
  `Link graph PASS: ${pages.length} HTML pages, ${indexable.length} indexable paths, 0 broken, 0 orphaned, 0 breadcrumb issues.`,
);

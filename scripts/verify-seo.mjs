import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const distDirectory = resolve('dist');
const requiredMeta = [
  '<link rel="canonical" href="https://lunatartas.es/',
  '<meta name="description" content="',
  '<meta name="robots" content="',
  '<meta property="og:title" content="',
  '<meta property="og:description" content="',
  '<meta property="og:url" content="https://lunatartas.es/',
  '<meta property="og:image" content="https://lunatartas.es/',
  '<meta name="twitter:card" content="summary_large_image">',
];

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const pathname = resolve(directory, entry.name);
      if (entry.isDirectory()) return htmlFiles(pathname);
      return entry.name === 'index.html' ? [pathname] : [];
    }),
  );
  return files.flat();
}

const files = await htmlFiles(distDirectory);

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const missing = requiredMeta.filter((value) => !html.includes(value));
  if (missing.length > 0) {
    throw new Error(
      `${file} is missing required metadata: ${missing.join(', ')}`,
    );
  }

  const canonicals = html.match(/<link rel="canonical"/g) ?? [];
  if (canonicals.length !== 1) {
    throw new Error(`${file} must have exactly one canonical link`);
  }
}

const socialImageMatch = (await readFile(files[0], 'utf8')).match(
  /<meta property="og:image" content="https:\/\/lunatartas\.es([^\"]+)"/,
);
if (socialImageMatch === null) throw new Error('No valid social image found');
await stat(resolve(distDirectory, `.${socialImageMatch[1]}`));

console.log(`SEO metadata verified in ${files.length} HTML pages.`);

import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const failures = [];

async function collectHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectHtml(path)));
    else if (entry.name.endsWith('.html')) files.push(path);
  }

  return files;
}

function text(value) {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/&(?:amp|lt|gt|quot|#39);/g, ' ')
    .trim();
}

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g)]
      .slice(1)
      .map((match) => [match[1], match[2] ?? match[3] ?? '']),
  );
}

const htmlFiles = await collectHtml(dist);

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const relativePath = relative(dist, file).replaceAll('\\', '/');
  const report = (message) =>
    failures.push(`${relativePath || '/index.html'}: ${message}`);

  if ((html.match(/<h1\b/g) ?? []).length !== 1)
    report('requires exactly one h1');
  for (const landmark of ['header', 'main', 'footer']) {
    if (!html.includes(`<${landmark}`)) report(`missing ${landmark} landmark`);
  }

  for (const tag of html.matchAll(/<img\b[^>]*>/g)) {
    const attrs = attributes(tag[0]);
    if (!attrs.alt?.trim()) report('image without alternative text');
  }

  for (const tag of html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)) {
    const attrs = attributes(tag[0]);
    if (!attrs.href?.trim()) report('link without href');
    if (!text(tag[1]) && !attrs['aria-label']?.trim())
      report('link without accessible name');
  }

  for (const tag of html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g)) {
    const attrs = attributes(tag[0]);
    if (!text(tag[1]) && !attrs['aria-label']?.trim())
      report('button without accessible name');
  }

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = [
    ...new Set(ids.filter((id, index) => ids.indexOf(id) !== index)),
  ];
  if (duplicateIds.length > 0)
    report(`duplicate id: ${duplicateIds.join(', ')}`);
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Accessibility audit PASS: ${htmlFiles.length} HTML files`);
}

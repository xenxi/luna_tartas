import { readdir, readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { relative, resolve } from 'node:path';
import { artifactPath } from './performance-paths.mjs';

const DIST = resolve('dist');
const DEPLOYMENT_BASE =
  process.env.ASTRO_BASE_PATH ?? process.env.PAGES_BASE_PATH ?? '/';
const BUDGETS = {
  htmlGzip: 50 * 1024,
  cssGzip: 50 * 1024,
  javascriptGzip: 30 * 1024,
  initialTransfer: 1.5 * 1024 * 1024,
  lcpImage: 300 * 1024,
  image: 200 * 1024,
};

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      return entry.isDirectory() ? filesIn(path) : entry.isFile() ? [path] : [];
    }),
  );
  return files.flat();
}

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([:\w-]+)(?:\s*=\s*"([^"]*)")?/g)].map(
      ([, name, value]) => [name.toLowerCase(), value ?? ''],
    ),
  );
}

function srcSetCandidates(srcset) {
  return srcset.split(',').map((value) => {
    const [url, descriptor] = value.trim().split(/\s+/, 2);
    return { url, width: Number.parseInt(descriptor, 10) || 0 };
  });
}

function candidateFor375px(srcset) {
  const candidates = srcSetCandidates(srcset).sort(
    (left, right) => left.width - right.width,
  );
  return candidates.find(({ width }) => width >= 375) ?? candidates.at(-1);
}

function localFile(url, page) {
  try {
    return artifactPath(url, DIST, DEPLOYMENT_BASE);
  } catch (error) {
    throw new Error(`${page}: ${error.message}`, { cause: error });
  }
}

async function fileSize(url, page) {
  return (await stat(localFile(url, page))).size;
}

function requireAtMost(value, limit, label) {
  if (value > limit) {
    throw new Error(`${label} is ${value} bytes; budget is ${limit} bytes`);
  }
}

async function gzipSize(file) {
  return gzipSync(await readFile(file)).length;
}

function picturesIn(html) {
  return [...html.matchAll(/<picture\b[^>]*>([\s\S]*?)<\/picture>/gi)].map(
    ([, contents]) => contents,
  );
}

async function auditPicture(contents, page) {
  const sources = [...contents.matchAll(/<source\b[^>]*>/gi)].map((match) =>
    attributes(match[0]),
  );
  const imgTag = contents.match(/<img\b[^>]*>/i)?.[0];
  if (imgTag === undefined)
    throw new Error(`${page}: picture has no img fallback`);
  const img = attributes(imgTag);
  const avif = sources.find(({ type }) => type === 'image/avif');
  const webp = sources.find(({ type }) => type === 'image/webp');

  if (!avif?.srcset || !webp?.srcset || !img.srcset || !img.src) {
    throw new Error(
      `${page}: responsive picture requires AVIF, WebP and JPEG srcset fallback`,
    );
  }
  if (!/\.jpe?g(?:$|[?#])/i.test(img.src)) {
    throw new Error(`${page}: picture fallback must be JPEG`);
  }
  if (!img.width || !img.height || !img.sizes) {
    throw new Error(
      `${page}: image requires width, height and sizes to avoid layout shift`,
    );
  }

  const priority = img.fetchpriority === 'high';
  if (priority && img.loading !== 'eager') {
    throw new Error(`${page}: LCP candidate must use loading=eager`);
  }
  if (!priority && img.loading !== 'lazy') {
    throw new Error(`${page}: non-LCP image must use loading=lazy`);
  }

  const selected = candidateFor375px(avif.srcset);
  if (selected === undefined)
    throw new Error(`${page}: AVIF srcset has no candidates`);
  const bytes = await fileSize(selected.url, page);
  requireAtMost(
    bytes,
    priority ? BUDGETS.lcpImage : BUDGETS.image,
    `${page}: selected image`,
  );
  return { priority, selectedBytes: bytes };
}

const htmlFiles = (await filesIn(DIST)).filter((file) =>
  file.endsWith('.html'),
);
const summaries = [];

for (const file of htmlFiles) {
  const page = relative(DIST, file).replaceAll('\\', '/');
  const html = await readFile(file, 'utf8');
  const htmlGzip = gzipSync(html).length;
  requireAtMost(htmlGzip, BUDGETS.htmlGzip, `${page}: HTML gzip`);

  const cssUrls = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/gi)]
    .map((match) => attributes(match[0]).href)
    .filter(Boolean);
  const scriptUrls = [
    ...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/gi),
  ].map(([, url]) => url);
  const cssGzip = (
    await Promise.all(cssUrls.map((url) => gzipSize(localFile(url, page))))
  ).reduce((sum, value) => sum + value, 0);
  const javascriptGzip = (
    await Promise.all(scriptUrls.map((url) => gzipSize(localFile(url, page))))
  ).reduce((sum, value) => sum + value, 0);
  requireAtMost(cssGzip, BUDGETS.cssGzip, `${page}: CSS gzip`);
  requireAtMost(
    javascriptGzip,
    BUDGETS.javascriptGzip,
    `${page}: JavaScript gzip`,
  );

  const pictures = picturesIn(html);
  const imageAudit = await Promise.all(
    pictures.map((picture) => auditPicture(picture, page)),
  );
  const lcpImages = imageAudit.filter(({ priority }) => priority);
  if (lcpImages.length > 1)
    throw new Error(`${page}: more than one high-priority image`);

  const eagerBytes = imageAudit
    .filter(({ priority }) => priority)
    .reduce((sum, { selectedBytes }) => sum + selectedBytes, 0);
  const initialTransfer =
    Buffer.byteLength(html) +
    (await Promise.all(cssUrls.map((url) => fileSize(url, page)))).reduce(
      (sum, value) => sum + value,
      0,
    ) +
    (await Promise.all(scriptUrls.map((url) => fileSize(url, page)))).reduce(
      (sum, value) => sum + value,
      0,
    ) +
    eagerBytes;
  requireAtMost(
    initialTransfer,
    BUDGETS.initialTransfer,
    `${page}: 375 px initial transfer`,
  );
  summaries.push({ page, pictures: pictures.length, initialTransfer });
}

if (htmlFiles.length === 0) throw new Error('dist contains no HTML pages');

const largestInitialTransfer = Math.max(
  ...summaries.map(({ initialTransfer }) => initialTransfer),
);
console.log(
  `Performance budgets: ${htmlFiles.length} HTML pages, ${summaries.reduce((sum, { pictures }) => sum + pictures, 0)} responsive pictures, largest 375 px initial transfer ${largestInitialTransfer} bytes`,
);

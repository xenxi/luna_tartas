import { readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const ASSET_ROOT = resolve('src/assets');
const RASTER_EXTENSIONS = new Set(['.avif', '.jpg', '.jpeg', '.png', '.webp']);
const LIMITS = {
  rasterBytes: 8 * 1024 * 1024,
  svgBytes: 250 * 1024,
  repositoryWarningBytes: 75 * 1024 * 1024,
  repositoryLimitBytes: 100 * 1024 * 1024,
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

const files = await filesIn(ASSET_ROOT);
let totalBytes = 0;

for (const file of files) {
  const info = await stat(file);
  const extension = file.slice(file.lastIndexOf('.')).toLowerCase();
  if (!RASTER_EXTENSIONS.has(extension) && extension !== '.svg') continue;

  totalBytes += info.size;
  const limit = extension === '.svg' ? LIMITS.svgBytes : LIMITS.rasterBytes;
  if (info.size > limit) {
    throw new Error(
      `${file} is ${info.size} bytes; ${extension} assets must not exceed ${limit} bytes`,
    );
  }
}

if (totalBytes > LIMITS.repositoryLimitBytes) {
  throw new Error(
    `Versioned source assets total ${totalBytes} bytes; repository limit is ${LIMITS.repositoryLimitBytes} bytes`,
  );
}
if (totalBytes > LIMITS.repositoryWarningBytes) {
  console.warn(
    `Source assets warning: ${totalBytes} bytes exceeds ${LIMITS.repositoryWarningBytes} bytes`,
  );
}

console.log(
  `Source assets: ${files.length} files, ${totalBytes} bytes (${Math.round(totalBytes / 1024)} KiB)`,
);

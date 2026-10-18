import { readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { sourceAssetPolicy } from './source-asset-policy.mjs';

const ASSET_ROOT = resolve(sourceAssetPolicy.root);
const LIMITS = {
  rasterBytes: 8 * 1024 * 1024,
  svgBytes: 250 * 1024,
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
  if (!sourceAssetPolicy.extensions.includes(extension)) continue;

  totalBytes += info.size;
  const limit = extension === '.svg' ? LIMITS.svgBytes : LIMITS.rasterBytes;
  if (info.size > limit) {
    throw new Error(
      `${file} is ${info.size} bytes; ${extension} assets must not exceed ${limit} bytes`,
    );
  }
}

if (totalBytes > sourceAssetPolicy.warningBytes) {
  console.warn(
    `Source assets warning: ${totalBytes} bytes exceeds ${sourceAssetPolicy.warningBytes} bytes. Review repository images; publication is allowed. Per-image and page-performance limits still apply.`,
  );
}

console.log(
  `Source assets: ${files.length} files, ${totalBytes} bytes (${Math.round(totalBytes / 1024)} KiB)`,
);

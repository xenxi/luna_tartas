import { execFileSync } from 'node:child_process';
import {
  mkdtempSync,
  mkdirSync,
  rmSync,
  writeFileSync,
  truncateSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const script = resolve('scripts/verify-assets.mjs');
const MiB = 1024 * 1024;

function checkAssets(sizes: number[], extension = 'jpg') {
  const directory = mkdtempSync(join(tmpdir(), 'luna-asset-budget-'));
  try {
    const assets = join(directory, 'src/assets');
    mkdirSync(assets, { recursive: true });
    sizes.forEach((size, index) => {
      const file = join(assets, `${index}.${extension}`);
      writeFileSync(file, '');
      truncateSync(file, size);
    });
    return execFileSync(process.execPath, [script], {
      cwd: directory,
      encoding: 'utf8',
      stdio: 'pipe',
    });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

describe('source asset publication budgets', () => {
  it('accepts catalog growth beyond the former 100 MiB total', () => {
    expect(checkAssets(Array(28).fill(4 * MiB))).toContain('117440512 bytes');
  });

  it('accepts the 256 MiB boundary', () => {
    expect(checkAssets(Array(32).fill(8 * MiB))).toContain('268435456 bytes');
  });

  it('rejects an aggregate above 256 MiB even when every image fits', () => {
    expect(() => checkAssets([...Array(32).fill(8 * MiB), 1])).toThrow(
      'repository limit is 268435456 bytes',
    );
  });

  it('still rejects a raster above 8 MiB', () => {
    expect(() => checkAssets([8 * MiB + 1])).toThrow(
      '.jpg assets must not exceed 8388608 bytes',
    );
  });

  it('accepts the SVG boundary and rejects an oversized SVG', () => {
    expect(checkAssets([250 * 1024], 'svg')).toContain('256000 bytes');
    expect(() => checkAssets([250 * 1024 + 1], 'svg')).toThrow(
      '.svg assets must not exceed 256000 bytes',
    );
  });
});

import { spawnSync } from 'node:child_process';
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
    return spawnSync(process.execPath, [script], {
      cwd: directory,
      encoding: 'utf8',
    });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

describe('source asset publication budgets', () => {
  it('accepts catalog growth beyond the former 100 MiB total', () => {
    const result = checkAssets(Array(28).fill(4 * MiB));
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('117440512 bytes');
    expect(result.stderr).toContain('publication is allowed');
  });

  it('accepts the 256 MiB boundary', () => {
    expect(checkAssets(Array(32).fill(8 * MiB)).status).toBe(0);
  });

  it('warns without blocking even above the former 256 MiB limit', () => {
    const result = checkAssets(Array(65).fill(8 * MiB));
    expect(result.status).toBe(0);
    expect(result.stderr).toContain('Source assets warning: 545259520 bytes');
  });

  it('warns only above 75 MiB', () => {
    const sizes = [...Array(9).fill(8 * MiB), 3 * MiB];
    expect(checkAssets(sizes).stderr).toBe('');
    expect(checkAssets([...sizes, 1]).stderr).toContain(
      'Source assets warning',
    );
  });

  it('still rejects a raster above 8 MiB', () => {
    const result = checkAssets([8 * MiB + 1]);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain(
      '.jpg assets must not exceed 8388608 bytes',
    );
  });

  it('accepts the SVG boundary and rejects an oversized SVG', () => {
    expect(checkAssets([250 * 1024], 'svg').status).toBe(0);
    const result = checkAssets([250 * 1024 + 1], 'svg');
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('.svg assets must not exceed 256000 bytes');
  });
});

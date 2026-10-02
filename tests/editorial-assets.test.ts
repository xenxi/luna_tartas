import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

function astroFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory()
      ? astroFiles(path)
      : entry.name.endsWith('.astro')
        ? [path]
        : [];
  });
}

describe('editorial image lifetime', () => {
  it('keeps static page images independent of mutable product media', () => {
    for (const file of astroFiles(resolve('src'))) {
      const source = readFileSync(file, 'utf8');
      for (const [, path] of source.matchAll(
        /import\s+\w+\s+from\s+['"]([^'"]+\/assets\/[^'"]+)['"]/g,
      )) {
        expect(
          path,
          `${file}: static image must have its own editorial asset`,
        ).not.toContain('/assets/catalog/');
        expect(
          existsSync(resolve(dirname(file), path)),
          `${file}: ${path}`,
        ).toBe(true);
      }
    }
  });
});

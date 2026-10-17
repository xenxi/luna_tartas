import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { expect, it } from 'vitest';

it('keeps the Studio index and contract generated from the authoritative YAML', () => {
  expect(() =>
    execFileSync(process.execPath, [
      'node_modules/tsx/dist/cli.mjs',
      'scripts/generate-studio-index.ts',
      '--check',
    ]),
  ).not.toThrow();
  const index = JSON.parse(readFileSync('catalog/index.json', 'utf8'));
  expect(index.contractVersion).toBe('3.0.0');
  expect(index.definition.profile).toBe('yaml-v2');
  expect(
    index.products.every((p: { blobSha: string }) =>
      /^[a-f0-9]{40}$/.test(p.blobSha),
    ),
  ).toBe(true);
});
it('exposes only published versioned thumbnails, never the internal index', () => {
  const route = readFileSync('src/pages/catalog/assets.json.ts', 'utf8');
  expect(route).toContain("p.status === 'published'");
  expect(route).not.toContain('catalog/index.json');
  expect(route).toContain('width: 320');
});

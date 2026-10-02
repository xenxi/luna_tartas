import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';
import { productSchema } from '../src/content/schemas/product';
import { parseCatalogYaml } from '../src/lib/catalog/source/yaml-loader';

const run = promisify(execFile);

function product(date: string) {
  return `id: studio-date-fixture
slug: studio-date-fixture
status: draft
context: FIXTURE
approval:
  source: Synthetic Studio serialization regression
  sourceDate: ${date}
  approvedBy: Test fixture
  approvedAt: ${date}
`;
}

describe('catalog YAML date compatibility', () => {
  it.each(['2026-10-02', '"2026-10-02"', "'2026-10-02'"])(
    'preserves the exact ISO date with %s',
    (date) => {
      const parsed = productSchema.parse(
        parseCatalogYaml(product(date), 'test.yml'),
      );
      expect(parsed.approval?.sourceDate).toBe('2026-10-02');
      expect(parsed.approval?.approvedAt).toBe('2026-10-02');
    },
  );

  it.each(['2026-02-31', '2026-13-01', '2026-10-02T00:00:00Z', '123', 'null'])(
    'still rejects invalid approval dates: %s',
    (date) => {
      expect(() =>
        productSchema.parse(parseCatalogYaml(product(date), 'test.yml')),
      ).toThrow();
    },
  );

  it('rejects duplicate YAML keys with the source path', () => {
    expect(() =>
      parseCatalogYaml('id: first\nid: second\n', 'duplicate.yml'),
    ).toThrow('duplicate.yml');
  });

  it('loads unquoted Studio dates through real Astro content sync', async () => {
    const cache = resolve('node_modules/.cache');
    await mkdir(cache, { recursive: true });
    const root = await mkdtemp(resolve(cache, 'catalog-yaml-'));
    const modulePath = (path: string) =>
      JSON.stringify(resolve(path).replaceAll('\\', '/'));
    try {
      await mkdir(resolve(root, 'src'), { recursive: true });
      await mkdir(resolve(root, 'products'));
      await writeFile(resolve(root, 'package.json'), '{"type":"module"}');
      await writeFile(resolve(root, 'astro.config.mjs'), 'export default {};');
      await writeFile(
        resolve(root, 'src/content.config.ts'),
        `
import { defineCollection } from 'astro:content';
import { productSchema } from ${modulePath('src/content/schemas/product.ts')};
import { yamlCollectionLoader } from ${modulePath('src/lib/catalog/source/yaml-loader.ts')};
export const collections = {
  products: defineCollection({ loader: yamlCollectionLoader('./products'), schema: productSchema }),
};
`,
      );
      const sourceFile = resolve(root, 'products/studio-date-fixture.yml');
      await writeFile(sourceFile, product('2026-10-02'));
      const args = [
        resolve('node_modules/astro/bin/astro.mjs'),
        'sync',
        '--root',
        root,
        '--force',
      ];
      await expect(run(process.execPath, args)).resolves.toBeDefined();

      await writeFile(sourceFile, product('2026-02-31'));
      await expect(run(process.execPath, args)).rejects.toMatchObject({
        stderr: expect.stringContaining('Must be a real calendar date'),
      });
    } finally {
      if (!root.startsWith(`${cache}${sep}`)) {
        throw new Error('Temporary fixture is outside the test cache');
      }
      await rm(root, { recursive: true, force: true });
    }
  }, 60_000);
});

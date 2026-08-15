import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import type { Catalog, DraftProduct } from '../src/lib/catalog/domain/model';
import { collectAssetIssues } from '../src/lib/catalog/source/assets';

const temporaryDirectories: string[] = [];

async function temporaryAssetRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'luna-catalog-assets-'));
  temporaryDirectories.push(root);
  return root;
}

function catalogWithMedia(
  src: string,
  gallery: readonly string[] = [],
): Catalog {
  const product: DraftProduct = {
    id: 'asset-product',
    slug: 'asset-product',
    status: 'draft',
    media: {
      cover: { src, alt: 'Synthetic cover for asset validation' },
      gallery: gallery.map((item) => ({
        src: item,
        alt: 'Synthetic gallery image for asset validation',
      })),
    },
  };
  return { categories: [], occasions: [], recipients: [], products: [product] };
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe('catalog asset resolver', () => {
  it('accepts a local, dimensioned and self-contained SVG', async () => {
    const root = await temporaryAssetRoot();
    await writeFile(
      join(root, 'cover.svg'),
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><path d="M0 0h1v1z"/></svg>',
    );
    await expect(
      collectAssetIssues(catalogWithMedia('cover.svg'), root),
    ).resolves.toEqual([]);
  });

  it('reports every missing cover and gallery file with its field', async () => {
    const root = await temporaryAssetRoot();
    const issues = await collectAssetIssues(
      catalogWithMedia('missing.svg', ['also-missing.png']),
      root,
    );
    expect(issues).toEqual([
      expect.objectContaining({
        code: 'asset-not-found',
        field: 'media.cover.src',
      }),
      expect.objectContaining({
        code: 'asset-not-found',
        field: 'media.gallery[0].src',
      }),
    ]);
  });

  it.each([
    ['<svg width="10" height="10"><script>alert(1)</script></svg>', 'scripts'],
    [
      '<svg width="10" height="10"><image href="https://example.test/a.png"/></svg>',
      'external',
    ],
  ])('rejects unsafe SVG content: %s', async (source, expected) => {
    const root = await temporaryAssetRoot();
    await writeFile(join(root, 'unsafe.svg'), source);
    const issues = await collectAssetIssues(
      catalogWithMedia('unsafe.svg'),
      root,
    );
    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'unsafe-svg',
          expected: expect.stringContaining(expected),
        }),
      ]),
    );
  });

  it('rejects malformed bytes and raster dimensions over 24 MP', async () => {
    const root = await temporaryAssetRoot();
    await writeFile(join(root, 'fake.png'), 'not a png');
    const oversized = Buffer.alloc(24);
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(oversized);
    oversized.write('IHDR', 12, 'ascii');
    oversized.writeUInt32BE(10_000, 16);
    oversized.writeUInt32BE(3_000, 20);
    await writeFile(join(root, 'oversized.png'), oversized);

    const issues = await collectAssetIssues(
      catalogWithMedia('fake.png', ['oversized.png']),
      root,
    );
    expect(issues.map(({ code }) => code)).toEqual(
      expect.arrayContaining(['invalid-image', 'asset-too-many-pixels']),
    );
  });

  it.each([
    [
      'sample.png',
      (() => {
        const bytes = Buffer.alloc(24);
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(bytes);
        bytes.write('IHDR', 12, 'ascii');
        bytes.writeUInt32BE(640, 16);
        bytes.writeUInt32BE(480, 20);
        return bytes;
      })(),
    ],
    [
      'sample.jpg',
      Buffer.from([
        0xff, 0xd8, 0xff, 0xc0, 0x00, 0x07, 0x08, 0x01, 0xe0, 0x02, 0x80,
      ]),
    ],
    [
      'sample.webp',
      (() => {
        const bytes = Buffer.alloc(30);
        bytes.write('RIFF', 0, 'ascii');
        bytes.write('WEBP', 8, 'ascii');
        bytes.write('VP8X', 12, 'ascii');
        bytes[24] = 0x7f;
        bytes[25] = 0x02;
        bytes[27] = 0xdf;
        bytes[28] = 0x01;
        return bytes;
      })(),
    ],
    [
      'sample.avif',
      (() => {
        const bytes = Buffer.alloc(40);
        bytes.write('ftyp', 4, 'ascii');
        bytes.write('avif', 8, 'ascii');
        bytes.write('ispe', 20, 'ascii');
        bytes.writeUInt32BE(640, 28);
        bytes.writeUInt32BE(480, 32);
        return bytes;
      })(),
    ],
  ])(
    'reads dimensions from supported raster headers: %s',
    async (name, bytes) => {
      const root = await temporaryAssetRoot();
      await writeFile(join(root, name), bytes);
      await expect(
        collectAssetIssues(catalogWithMedia(name), root),
      ).resolves.toEqual([]);
    },
  );

  it('enforces the 250 KiB SVG hard limit', async () => {
    const root = await temporaryAssetRoot();
    const padding = ' '.repeat(250 * 1024);
    await writeFile(
      join(root, 'large.svg'),
      `<svg width="10" height="10">${padding}</svg>`,
    );
    const issues = await collectAssetIssues(
      catalogWithMedia('large.svg'),
      root,
    );
    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'asset-too-large' }),
      ]),
    );
  });
});

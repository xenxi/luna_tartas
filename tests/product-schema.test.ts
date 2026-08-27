import { describe, expect, it } from 'vitest';
import {
  ASSET_LIMITS,
  productSchema,
  type ProductData,
} from '../src/content/schemas/product';
import {
  readSharedContractFixture,
  readYamlFixture,
} from './helpers/yaml-fixtures';

function readProduct(relativePath: string): unknown {
  return readYamlFixture(`products/${relativePath}`);
}

function diagnostics(relativePath: string): string[] {
  const result = productSchema.safeParse(readProduct(relativePath));

  if (result.success) {
    return [];
  }

  return result.error.issues.map((issue) => {
    const field = issue.path.length > 0 ? issue.path.join('.') : '$';
    return `${relativePath}:${field}: ${issue.message}`;
  });
}

function publishedFixture(): Record<string, unknown> {
  const draft = structuredClone(readProduct('valid/draft-fixed.yml')) as Record<
    string,
    unknown
  >;
  const { context: _fixtureContext, ...product } = draft;
  const media = product.media as Record<string, unknown>;
  const cover = media.cover as Record<string, unknown>;
  const gallery = media.gallery as Record<string, unknown>[];
  gallery[0] = { ...gallery[0], rights: structuredClone(cover.rights) };

  return { ...product, status: 'published' };
}

describe('product YAML schema', () => {
  it.each([
    ['valid/draft-minimal.yml', undefined],
    ['valid/draft-fixed.yml', 'fixed'],
    ['valid/draft-from.yml', 'from'],
    ['valid/draft-on-request.yml', 'on_request'],
  ])('accepts the non-publishable fixture %s', (relativePath, priceKind) => {
    const parsed: ProductData = productSchema.parse(readProduct(relativePath));

    expect(parsed.status).toBe('draft');
    if (parsed.status !== 'draft') {
      throw new Error('Expected a draft product fixture');
    }
    expect(parsed.context).toBe('FIXTURE');
    expect(parsed.price?.kind).toBe(priceKind);
  });

  it('accepts a complete published product without fixture context', () => {
    const parsed = productSchema.parse(publishedFixture());

    expect(parsed.status).toBe('published');
    if (parsed.status !== 'published') {
      throw new Error('Expected a published product');
    }
    expect(parsed.price.kind).toBe('fixed');
    expect(parsed.media.cover.rights.owner).toContain('sintético');
  });

  it.each([
    ['valid/draft-made-to-order.yml', 'draft', 'made-to-order', undefined],
    ['valid/draft-stock-zero.yml', 'draft', 'stock', 0],
    ['valid/draft-unavailable.yml', 'draft', 'unavailable', undefined],
    ['valid/archived-stock.yml', 'archived', 'stock', 4],
  ])(
    'accepts shared contract fixture %s',
    (relativePath, status, mode, quantity) => {
      const parsed = productSchema.parse(
        readSharedContractFixture(`products/${relativePath}`),
      );

      expect(parsed.status).toBe(status);
      expect(parsed.inventory?.mode).toBe(mode);
      expect(
        parsed.inventory?.mode === 'stock'
          ? parsed.inventory.quantity
          : undefined,
      ).toBe(quantity);
    },
  );

  it.each([
    'invalid/archived-fixture-context.yml',
    'invalid/made-to-order-with-quantity.yml',
    'invalid/stock-negative.yml',
    'invalid/stock-without-quantity.yml',
  ])('rejects shared contract fixture %s', (relativePath) => {
    expect(
      productSchema.safeParse(
        readSharedContractFixture(`products/${relativePath}`),
      ).success,
    ).toBe(false);
  });

  it('keeps inventory optional for existing documents', () => {
    const parsed = productSchema.parse(readProduct('valid/draft-minimal.yml'));

    expect(parsed.inventory).toBeUndefined();
  });

  it.each([
    ['name'],
    ['summary'],
    ['description'],
    ['categories'],
    ['price'],
    ['media'],
    ['customization'],
    ['approval'],
  ])('rejects a published product without %s', (field) => {
    const input = publishedFixture();
    delete input[field];

    const result = productSchema.safeParse(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === field)).toBe(
        true,
      );
    }
  });

  it('requires rights for every published media item', () => {
    const input = publishedFixture();
    const media = input.media as Record<string, unknown>;
    const cover = media.cover as Record<string, unknown>;
    delete cover.rights;

    const result = productSchema.safeParse(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual([
        'media',
        'cover',
        'rights',
      ]);
    }
  });

  it.each([
    ['invalid/float-amount.yml', 'price.amountMinor'],
    ['invalid/zero-amount.yml', 'price.amountMinor'],
    ['invalid/unsafe-amount.yml', 'price.amountMinor'],
    ['invalid/lowercase-currency.yml', 'price.currency'],
    ['invalid/incomplete-fixed.yml', 'price.currency'],
    ['invalid/on-request-with-amount.yml', 'price'],
    ['invalid/bad-media-path.yml', 'media.cover.src'],
    ['invalid/empty-alt.yml', 'media.cover.alt'],
    ['invalid/partial-customization.yml', 'customization.options'],
  ])('rejects %s with an actionable field path', (relativePath, field) => {
    const messages = diagnostics(relativePath);

    expect(messages).not.toHaveLength(0);
    expect(messages.some((message) => message.includes(`:${field}:`))).toBe(
      true,
    );
  });

  it('caps the initial gallery size', () => {
    const input = structuredClone(
      readProduct('valid/draft-fixed.yml'),
    ) as Record<string, unknown>;
    const media = input.media as Record<string, unknown>;
    const cover = media.cover as Record<string, unknown>;
    media.gallery = Array.from({ length: ASSET_LIMITS.galleryItems + 1 }, () =>
      structuredClone(cover),
    );

    const result = productSchema.safeParse(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(['media', 'gallery']);
    }
  });

  it('exports the source asset limits agreed for the catalog', () => {
    expect(ASSET_LIMITS).toEqual({
      rasterBytes: 8 * 1024 * 1024,
      rasterPixels: 24_000_000,
      svgBytes: 250 * 1024,
      galleryItems: 20,
    });
  });
});

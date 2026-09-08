import { describe, expect, it } from 'vitest';
import {
  productSchema,
  productLinksSchema,
} from '../src/content/schemas/product';
import { mapProduct } from '../src/lib/catalog/source/mapper';
import { projectProductLinks } from '../src/components/products/product-links';
import { readYamlFixture } from './helpers/yaml-fixtures';

const links = {
  tiktok: 'https://www.tiktok.com/@luna/video/123',
  instagram: 'https://www.instagram.com/p/ejemplo/',
  wallapop: 'https://es.wallapop.com/item/ejemplo-123',
  vinted: 'https://www.vinted.es/items/123-ejemplo',
};

describe('optional product platform links', () => {
  it('renders no platform entries when links are absent or empty', () => {
    expect(projectProductLinks()).toEqual([]);
    expect(projectProductLinks({})).toEqual([]);
    expect(projectProductLinks({ instagram: links.instagram })).toEqual([
      { platform: 'instagram', label: 'Instagram', href: links.instagram },
    ]);
  });

  it.each(['draft', 'published', 'archived'] as const)(
    'keeps links through the %s source adapter without sharing mutable objects',
    (status) => {
      const source = readYamlFixture(
        'products/valid/draft-fixed.yml',
      ) as Record<string, unknown>;
      const { context: _context, ...fixture } = source;
      const media = fixture.media as {
        cover: { rights: unknown };
        gallery: Record<string, unknown>[];
      };
      media.gallery = media.gallery.map((item) => ({
        ...item,
        rights: media.cover.rights,
      }));
      const data = productSchema.parse({ ...fixture, status, links });
      const product = mapProduct({
        collection: 'products',
        id: data.id,
        filePath: 'fixture.yml',
        data,
      });
      expect(product.links).toEqual(links);
      expect(product.links).not.toBe(data.links);
      expect(
        projectProductLinks(product.links).map((link) => link.label),
      ).toEqual(['TikTok', 'Instagram', 'Wallapop', 'Vinted']);
    },
  );

  it.each([
    'javascript:alert(1)',
    'http://www.instagram.com/p/123',
    'https://instagram.com.evil.example/p/123',
    'https://instagram.com@evil.example/p/123',
    'https://www.tiktok.com/@luna',
    'https://www.instagram.com/p/has space',
    'https://www.instagram.com/\\evil',
    '',
  ])('rejects unsafe or wrong-platform Instagram URL %s', (instagram) => {
    expect(productLinksSchema.safeParse({ instagram }).success).toBe(false);
  });

  it('accepts platform short links and rejects unknown fields', () => {
    expect(
      productLinksSchema.safeParse({ tiktok: 'https://vm.tiktok.com/abc/' })
        .success,
    ).toBe(true);
    expect(
      productLinksSchema.safeParse({ facebook: 'https://facebook.com/luna' })
        .success,
    ).toBe(false);
  });
});

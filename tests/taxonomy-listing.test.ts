import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type {
  Catalog,
  PublishedProduct,
  Taxonomy,
} from '../src/lib/catalog/domain/model';
import {
  getTaxonomiesWithProducts,
  projectTaxonomyIndex,
  projectTaxonomyLanding,
} from '../src/components/taxonomies/taxonomy-listing';

const taxonomy = (
  id: string,
  kind: Taxonomy['kind'],
  order: number,
  status: Taxonomy['status'] = 'published',
): Taxonomy => ({
  kind,
  id,
  slug: id,
  name: id,
  summary: `${id} summary`,
  description: `${id} description`,
  order,
  status,
});

const product = (
  id: string,
  categories: readonly string[],
  occasions: readonly string[],
  order: number,
  recipients: readonly string[] = [],
): PublishedProduct => ({
  id,
  slug: id,
  status: 'published',
  name: id,
  summary: `${id} summary`,
  description: `${id} description`,
  categories,
  occasions,
  recipients,
  price: { kind: 'on_request' },
  media: {
    cover: {
      src: `${id}.jpg`,
      alt: `${id} image`,
      rights: {
        owner: 'owner',
        licenseOrPermission: 'permission',
        evidence: 'evidence',
      },
    },
  },
  customization: { kind: 'none' },
  approval: {
    source: 'source',
    sourceDate: '2026-01-01',
    approvedBy: 'editor',
    approvedAt: '2026-01-01',
  },
  order,
});

const catalog: Catalog = {
  categories: [taxonomy('cakes', 'category', 1)],
  occasions: [
    taxonomy('birthday', 'occasion', 1),
    taxonomy('empty', 'occasion', 2),
    taxonomy('draft', 'occasion', 0, 'draft'),
  ],
  recipients: [
    taxonomy('family', 'recipient', 1),
    taxonomy('empty-recipient', 'recipient', 2),
    taxonomy('draft-recipient', 'recipient', 0, 'draft'),
  ],
  products: [
    product('second', ['cakes'], ['birthday'], 2, ['family']),
    product('first', ['cakes'], ['birthday'], 1, ['family']),
  ],
};

describe('shared taxonomy index and landings', () => {
  it('publishes only useful taxonomies in editorial order', () => {
    expect(
      getTaxonomiesWithProducts(catalog, 'occasion').map(({ id }) => id),
    ).toEqual(['birthday']);
    expect(
      projectTaxonomyIndex(catalog, 'occasion', 'productos').items,
    ).toEqual([
      {
        href: '/ocasiones/birthday/',
        name: 'birthday',
        summary: 'birthday summary',
        itemCountLabel: '2 productos',
      },
    ]);
  });

  it('projects related products in domain order for each taxonomy kind', () => {
    expect(
      projectTaxonomyLanding(
        catalog,
        'occasion',
        taxonomy('birthday', 'occasion', 1),
      ).products.map(({ href, name }) => ({ href, name })),
    ).toEqual([
      { href: '/productos/first/', name: 'first' },
      { href: '/productos/second/', name: 'second' },
    ]);
  });

  it('maps recipients to useful gift routes without publishing empty entries', () => {
    expect(
      getTaxonomiesWithProducts(catalog, 'recipient').map(({ id }) => id),
    ).toEqual(['family']);
    expect(projectTaxonomyIndex(catalog, 'recipient', 'ideas').items).toEqual([
      {
        href: '/regalos/family/',
        name: 'family',
        summary: 'family summary',
        itemCountLabel: '2 ideas',
      },
    ]);
    expect(
      projectTaxonomyLanding(
        catalog,
        'recipient',
        taxonomy('family', 'recipient', 1),
      ).products.map(({ href }) => href),
    ).toEqual(['/productos/first/', '/productos/second/']);
  });

  it('reuses the same static presentation pattern without hydration', () => {
    const index = readFileSync('src/pages/ocasiones/index.astro', 'utf8');
    const landing = readFileSync('src/pages/ocasiones/[slug].astro', 'utf8');
    const component = readFileSync(
      'src/components/taxonomies/TaxonomyLanding.astro',
      'utf8',
    );

    const giftIndex = readFileSync('src/pages/regalos/index.astro', 'utf8');
    const giftLanding = readFileSync('src/pages/regalos/[slug].astro', 'utf8');

    expect(index).toContain('<TaxonomyIndex');
    expect(landing).toContain('getStaticPaths');
    expect(giftIndex).toContain('<TaxonomyIndex');
    expect(giftLanding).toContain('getStaticPaths');
    expect(giftLanding).toContain("routes.taxonomyIndex('recipient')");
    expect(giftIndex).not.toMatch(/destinatari/i);
    expect(giftLanding).not.toMatch(/destinatari/i);
    expect(component).toContain('<ProductCard');
    expect(
      `${index}\n${landing}\n${giftIndex}\n${giftLanding}\n${component}`,
    ).not.toContain('client:');
  });
});

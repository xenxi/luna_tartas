import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type {
  Catalog,
  PublishedProduct,
  Taxonomy,
} from '../src/lib/catalog/domain/model';
import {
  getCategoriesWithProducts,
  projectCategoryIndex,
  projectCategoryLanding,
} from '../src/components/categories/category-listing';

const category = (
  id: string,
  order: number,
  status: Taxonomy['status'] = 'published',
): Taxonomy => ({
  kind: 'category',
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
  order: number,
): PublishedProduct => ({
  id,
  slug: id,
  status: 'published',
  name: id,
  summary: `${id} summary`,
  description: `${id} description`,
  categories,
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
  categories: [
    category('cakes', 1),
    category('empty', 2),
    category('draft', 0, 'draft'),
  ],
  occasions: [],
  recipients: [],
  products: [product('second', ['cakes'], 2), product('first', ['cakes'], 1)],
};

describe('category index and landings', () => {
  it('publishes only useful categories in editorial order', () => {
    expect(getCategoriesWithProducts(catalog).map(({ id }) => id)).toEqual([
      'cakes',
    ]);
    expect(projectCategoryIndex(catalog).items).toEqual([
      {
        href: '/categorias/cakes/',
        name: 'cakes',
        summary: 'cakes summary',
        itemCountLabel: '2 productos',
      },
    ]);
  });

  it('projects related published products in domain order', () => {
    expect(
      projectCategoryLanding(catalog, category('cakes', 1)).products.map(
        ({ href, name }) => ({ href, name }),
      ),
    ).toEqual([
      { href: '/productos/first/', name: 'first' },
      { href: '/productos/second/', name: 'second' },
    ]);
  });

  it('keeps category pages static and free of client hydration', () => {
    const index = readFileSync('src/pages/categorias/index.astro', 'utf8');
    const landing = readFileSync('src/pages/categorias/[slug].astro', 'utf8');

    expect(index).toContain('<CategoryIndex');
    expect(
      readFileSync(
        'src/components/categories/CategoryIndex.astro',
        'utf8',
      ).match(/<h1\b/g),
    ).toHaveLength(1);
    expect(landing).toContain('getStaticPaths');
    expect(landing).toContain('getProductsForTaxonomy');
    expect(`${index}\n${landing}`).not.toContain('client:');
  });
});

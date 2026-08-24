import {
  getFeaturedProducts,
  getPublishedProducts,
  getPublishedTaxonomies,
} from '../../lib/catalog/domain/queries';
import type { Catalog, PublishedProduct } from '../../lib/catalog/domain/model';
import { routes } from '../../lib/catalog/domain/routes';
import { formatPriceLabel } from '../catalog/price';

const MOSAIC_SIZE = 5;
const VERTICAL_CATEGORY_ID = 'tartas-de-panales';

export interface FeaturedMosaicItem {
  readonly id: string;
  readonly href: string;
  readonly name: string;
  readonly priceLabel: string;
  readonly mediaSource: {
    readonly src: string;
    readonly alt: string;
  };
  readonly primary: boolean;
}

export interface FeaturedProductsProjection {
  readonly eyebrow: string;
  readonly title: string;
  readonly intro: string;
  readonly action: {
    readonly href: string;
    readonly label: string;
  };
  readonly items: readonly FeaturedMosaicItem[];
}

export interface FeaturedMosaicSelectionOptions {
  readonly rng?: () => number;
}

function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(rng() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }

  return result;
}

function stableRng(catalog: Catalog): () => number {
  const seed = getFeaturedProducts(catalog)
    .map(({ id, order }) => `${id}:${order ?? ''}`)
    .join('|');
  let state = [...seed].reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
    2_166_136_261,
  );

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function selectCategoryRepresentatives(
  catalog: Catalog,
  featured: readonly PublishedProduct[],
  rng: () => number,
): PublishedProduct[] {
  const categoryIds = getPublishedTaxonomies(catalog, 'category')
    .map(({ id }) => id)
    .filter((categoryId) =>
      featured.some((product) => product.categories.includes(categoryId)),
    );
  const candidateCounts = new Map(
    categoryIds.map((categoryId) => [
      categoryId,
      featured.filter((product) => product.categories.includes(categoryId))
        .length,
    ]),
  );
  const selectedIds = new Set<string>();

  return categoryIds.flatMap((categoryId) => {
    const candidates = shuffle(
      featured.filter(
        (product) =>
          !selectedIds.has(product.id) &&
          product.categories.includes(categoryId),
      ),
      rng,
    ).sort((left, right) => {
      const leftFlexibility = Math.min(
        ...left.categories
          .map((id) => candidateCounts.get(id))
          .filter((count): count is number => count !== undefined),
      );
      const rightFlexibility = Math.min(
        ...right.categories
          .map((id) => candidateCounts.get(id))
          .filter((count): count is number => count !== undefined),
      );

      return rightFlexibility - leftFlexibility;
    });
    const chosen = candidates[0];
    if (chosen === undefined) return [];

    selectedIds.add(chosen.id);
    return [chosen];
  });
}

/**
 * Selects a stable, build-time editorial mix. A supplied RNG makes category
 * coverage and fallback behaviour deterministic in tests without client code.
 */
export function selectFeaturedProductMosaic(
  catalog: Catalog,
  options: FeaturedMosaicSelectionOptions = {},
): readonly PublishedProduct[] {
  const rng = options.rng ?? stableRng(catalog);
  const featured = getFeaturedProducts(catalog);
  const selected = selectCategoryRepresentatives(catalog, featured, rng);
  const selectedIds = new Set(selected.map(({ id }) => id));
  const remaining = shuffle(
    [
      ...featured.filter(({ id }) => !selectedIds.has(id)),
      ...getPublishedProducts(catalog).filter(
        (product) => !product.featured && !selectedIds.has(product.id),
      ),
    ],
    rng,
  );

  return [...selected, ...remaining].slice(0, MOSAIC_SIZE);
}

export function projectFeaturedProducts(
  catalog: Catalog,
): FeaturedProductsProjection | undefined {
  const selected = selectFeaturedProductMosaic(catalog);
  if (selected.length !== MOSAIC_SIZE) return undefined;

  const primary =
    selected.find((product) =>
      product.categories.includes(VERTICAL_CATEGORY_ID),
    ) ?? selected[0];
  const ordered = [
    primary,
    ...selected.filter((product) => product.id !== primary.id),
  ];

  return {
    eyebrow: 'INSPIRACIÓN QUE EMOCIONA',
    title: 'Ideas que emocionan',
    intro:
      'Regalos únicos y personalizados para cada historia, cada persona y cada ocasión.',
    action: {
      href: routes.products(),
      label: 'Ver más regalos',
    },
    items: ordered.map((product) => ({
      id: product.id,
      href: routes.product(product.slug),
      name: product.name,
      priceLabel: formatPriceLabel(product.price),
      mediaSource: {
        src: product.media.cover.src,
        alt: product.media.cover.alt,
      },
      primary: product.id === primary.id,
    })),
  };
}

import { getCollection, type CollectionEntry } from 'astro:content';
import { fileURLToPath } from 'node:url';
import { catalogConfig } from '../../../config/catalog';
import type { Catalog } from '../domain/model';
import type {
  CatalogCollection,
  CatalogSourceDto,
  SourceDocument,
} from './dto';
import type { ProductData } from '../../../content/schemas/product';
import type { TaxonomyData } from '../../../content/schemas/taxonomy';
import { loadCatalogSource } from './pipeline';

const assetRoot = fileURLToPath(
  new URL('../../../assets/catalog/', import.meta.url),
);

function sourceDocument<Collection extends CatalogCollection, Data>(
  collection: Collection,
  entry: CollectionEntry<Collection>,
): SourceDocument<Collection, Data> {
  return {
    collection,
    id: entry.id,
    filePath: entry.filePath,
    // Astro's generic collection helper exposes loader data as unknown here;
    // the configured collection schema has already validated this value.
    data: entry.data as Data,
  };
}

async function readCatalogSource(): Promise<CatalogSourceDto> {
  const [categories, occasions, recipients, products] = await Promise.all([
    getCollection('categories'),
    getCollection('occasions'),
    getCollection('recipients'),
    getCollection('products'),
  ]);

  return {
    categories: categories.map((entry) =>
      sourceDocument<'categories', TaxonomyData>('categories', entry),
    ),
    occasions: occasions.map((entry) =>
      sourceDocument<'occasions', TaxonomyData>('occasions', entry),
    ),
    recipients: recipients.map((entry) =>
      sourceDocument<'recipients', TaxonomyData>('recipients', entry),
    ),
    products: products.map((entry) =>
      sourceDocument<'products', ProductData>('products', entry),
    ),
  };
}

let catalogPromise: Promise<Catalog> | undefined;

export function loadCatalog(): Promise<Catalog> {
  catalogPromise ??= readCatalogSource().then((source) =>
    loadCatalogSource(source, {
      allowedCurrencies: catalogConfig.allowedCurrencies,
      assetRoot,
    }),
  );
  return catalogPromise;
}

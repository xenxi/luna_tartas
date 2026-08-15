import type { Catalog } from '../domain/model';
import type { CatalogSourceDto } from './dto';
import { mapCatalogSource } from './mapper';
import { validateCatalog, type CatalogValidationOptions } from './validate';

function compareById(
  left: { readonly id: string },
  right: { readonly id: string },
): number {
  return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
}

function sortCatalog(catalog: Catalog): Catalog {
  return {
    categories: [...catalog.categories].sort(compareById),
    occasions: [...catalog.occasions].sort(compareById),
    recipients: [...catalog.recipients].sort(compareById),
    products: [...catalog.products].sort(compareById),
  };
}

function deepFreeze<Value>(value: Value): Readonly<Value> {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

export async function loadCatalogSource(
  source: CatalogSourceDto,
  options: CatalogValidationOptions,
): Promise<Catalog> {
  const catalog = sortCatalog(mapCatalogSource(source));
  await validateCatalog(catalog, options);
  return deepFreeze(catalog);
}

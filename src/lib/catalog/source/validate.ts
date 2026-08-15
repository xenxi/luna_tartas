import type { Catalog } from '../domain/model';
import {
  CatalogValidationError,
  collectCatalogIssues,
} from '../domain/validation';
import { collectAssetIssues } from './assets';

export interface CatalogValidationOptions {
  readonly allowedCurrencies: readonly string[];
  readonly assetRoot: string;
}

export async function validateCatalog(
  catalog: Catalog,
  options: CatalogValidationOptions,
): Promise<Catalog> {
  const [domainIssues, assetIssues] = await Promise.all([
    collectCatalogIssues(catalog, options.allowedCurrencies),
    collectAssetIssues(catalog, options.assetRoot),
  ]);
  const issues = [...domainIssues, ...assetIssues];
  if (issues.length > 0) throw new CatalogValidationError(issues);
  return catalog;
}

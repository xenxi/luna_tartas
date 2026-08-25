import type {
  PublicCatalogProduct,
  PublicCatalogTaxonomy,
} from '../catalog/public-projection';
import type { TaxonomyKind } from '../catalog/domain/model';

export type SearchResultKind = 'product' | TaxonomyKind;

export interface SearchField {
  readonly value: string;
  readonly normalized: string;
  readonly weight: number;
}

interface SearchEntryBase {
  readonly key: string;
  readonly kind: SearchResultKind;
  readonly id: string;
  readonly name: string;
  readonly summary: string;
  readonly url: string;
  readonly normalizedName: string;
  readonly fields: readonly SearchField[];
}

export interface ProductSearchEntry extends SearchEntryBase {
  readonly kind: 'product';
  readonly product: PublicCatalogProduct;
}

export interface TaxonomySearchEntry extends SearchEntryBase {
  readonly kind: TaxonomyKind;
  readonly taxonomy: PublicCatalogTaxonomy;
}

export type SearchEntry = ProductSearchEntry | TaxonomySearchEntry;

export interface SearchIndex {
  readonly entries: readonly SearchEntry[];
}

export interface RankedSearchResult {
  readonly entry: SearchEntry;
  readonly score: number;
}

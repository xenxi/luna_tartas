import type { ProductData } from '../../../content/schemas/product';
import type { TaxonomyData } from '../../../content/schemas/taxonomy';

export type CatalogCollection =
  'categories' | 'occasions' | 'recipients' | 'products';

export interface SourceDocument<Collection extends CatalogCollection, Data> {
  readonly collection: Collection;
  readonly id: string;
  readonly filePath?: string;
  readonly data: Data;
}

export type TaxonomySourceDocument = SourceDocument<
  'categories' | 'occasions' | 'recipients',
  TaxonomyData
>;

export type ProductSourceDocument = SourceDocument<'products', ProductData>;

export interface CatalogSourceDto {
  readonly categories: readonly SourceDocument<'categories', TaxonomyData>[];
  readonly occasions: readonly SourceDocument<'occasions', TaxonomyData>[];
  readonly recipients: readonly SourceDocument<'recipients', TaxonomyData>[];
  readonly products: readonly ProductSourceDocument[];
}

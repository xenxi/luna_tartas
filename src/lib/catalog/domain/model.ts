export type PublicationStatus = 'draft' | 'published';
export type ProductStatus = PublicationStatus | 'archived';

export interface SeoMetadata {
  readonly title?: string;
  readonly description?: string;
}

export type TaxonomyKind = 'category' | 'occasion' | 'recipient';

export interface Taxonomy {
  readonly kind: TaxonomyKind;
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly summary: string;
  readonly description?: string;
  readonly status: PublicationStatus;
  readonly order: number;
  readonly seo?: SeoMetadata;
}

export interface PricedAmount {
  readonly amountMinor: number;
  readonly currency: string;
}

export type Price =
  | ({ readonly kind: 'fixed' } & PricedAmount)
  | ({ readonly kind: 'from' } & PricedAmount)
  | { readonly kind: 'on_request' };

export type Inventory =
  | { readonly mode: 'made-to-order' }
  | { readonly mode: 'stock'; readonly quantity: number }
  | { readonly mode: 'unavailable' };

export const DEFAULT_INVENTORY: Inventory = Object.freeze({
  mode: 'made-to-order',
});

export interface MediaRights {
  readonly owner: string;
  readonly licenseOrPermission: string;
  readonly evidence: string;
}

export interface DraftMediaItem {
  readonly src: string;
  readonly alt: string;
  readonly caption?: string;
  readonly rights?: MediaRights;
}

export interface PublishedMediaItem extends DraftMediaItem {
  readonly rights: MediaRights;
}

export interface DraftMediaCover extends DraftMediaItem {
  readonly category?: DraftMediaItem;
}

export interface PublishedMediaCover extends PublishedMediaItem {
  readonly category?: PublishedMediaItem;
}

export interface DraftMedia {
  readonly cover: DraftMediaCover;
  readonly gallery?: readonly DraftMediaItem[];
}

export interface PublishedMedia {
  readonly cover: PublishedMediaCover;
  readonly gallery?: readonly PublishedMediaItem[];
}

export type Customization =
  | { readonly kind: 'none' }
  | {
      readonly kind: 'available';
      readonly options: readonly string[];
      readonly description: string;
    };

export interface EditorialApproval {
  readonly source: string;
  readonly sourceDate: string;
  readonly approvedBy: string;
  readonly approvedAt: string;
}

interface ProductIdentity {
  readonly id: string;
  readonly slug: string;
  /**
   * Source documents may omit inventory for backwards compatibility. Catalog
   * adapters normalize that absence to DEFAULT_INVENTORY.
   */
  readonly inventory?: Inventory;
}

export interface DraftProduct extends ProductIdentity {
  readonly status: 'draft';
  readonly name?: string;
  readonly summary?: string;
  readonly description?: string;
  readonly categories?: readonly string[];
  readonly occasions?: readonly string[];
  readonly recipients?: readonly string[];
  readonly price?: Price;
  readonly media?: DraftMedia;
  readonly customization?: Customization;
  readonly featured?: boolean;
  readonly order?: number;
  readonly seo?: SeoMetadata;
  readonly approval?: EditorialApproval;
}

export interface PublishedProduct extends ProductIdentity {
  readonly status: 'published';
  readonly name: string;
  readonly summary: string;
  readonly description: string;
  readonly categories: readonly string[];
  readonly occasions?: readonly string[];
  readonly recipients?: readonly string[];
  readonly price: Price;
  readonly media: PublishedMedia;
  readonly customization: Customization;
  readonly featured?: boolean;
  readonly order?: number;
  readonly seo?: SeoMetadata;
  readonly approval: EditorialApproval;
}

export interface ArchivedProduct extends ProductIdentity {
  readonly status: 'archived';
  readonly name?: string;
  readonly summary?: string;
  readonly description?: string;
  readonly categories?: readonly string[];
  readonly occasions?: readonly string[];
  readonly recipients?: readonly string[];
  readonly price?: Price;
  readonly media?: DraftMedia;
  readonly customization?: Customization;
  readonly featured?: boolean;
  readonly order?: number;
  readonly seo?: SeoMetadata;
  readonly approval?: EditorialApproval;
}

export type Product = DraftProduct | PublishedProduct | ArchivedProduct;

export interface Catalog {
  readonly categories: readonly Taxonomy[];
  readonly occasions: readonly Taxonomy[];
  readonly recipients: readonly Taxonomy[];
  readonly products: readonly Product[];
}

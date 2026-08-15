export type PublicationStatus = 'draft' | 'published';

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

export interface DraftMedia {
  readonly cover: DraftMediaItem;
  readonly gallery?: readonly DraftMediaItem[];
}

export interface PublishedMedia {
  readonly cover: PublishedMediaItem;
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

export type Product = DraftProduct | PublishedProduct;

export interface Catalog {
  readonly categories: readonly Taxonomy[];
  readonly occasions: readonly Taxonomy[];
  readonly recipients: readonly Taxonomy[];
  readonly products: readonly Product[];
}

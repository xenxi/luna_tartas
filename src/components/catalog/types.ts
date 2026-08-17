import type { ProductAnalyticsData } from '../../lib/analytics/product';

export interface ResponsiveSourceProjection {
  readonly srcSet: string;
  readonly type: string;
  readonly media?: string;
}

export interface MediaProjection {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly sizes?: string;
  readonly sources?: readonly ResponsiveSourceProjection[];
  readonly caption?: string;
}

export type { ProductAnalyticsData } from '../../lib/analytics/product';

export interface ProductCardProjection {
  readonly href: string;
  readonly name: string;
  readonly summary: string;
  readonly priceLabel: string;
  readonly eyebrow?: string;
  readonly media?: MediaProjection;
  readonly analytics?: ProductAnalyticsData;
}

export interface TaxonomyCardProjection {
  readonly href: string;
  readonly name: string;
  readonly summary: string;
  readonly itemCountLabel?: string;
  readonly mediaSource?: {
    readonly src: string;
    readonly alt: string;
  };
  readonly media?: MediaProjection;
}

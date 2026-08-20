import type { PublishedProduct } from '../catalog/domain/model';

export interface ProductAnalyticsData {
  readonly productId: string;
  readonly productName: string;
  readonly category: string;
}

export function createProductAnalyticsData(
  product: PublishedProduct,
): ProductAnalyticsData {
  return {
    productId: product.id,
    productName: product.name,
    category: product.categories[0],
  };
}

import type { PublishedProduct } from '../catalog/domain/model';

export interface ProductAnalyticsData {
  readonly productId: string;
  readonly productName: string;
  readonly category: string;
  readonly sourcePage: string;
  readonly price?: number;
  readonly currency?: string;
  readonly listId?: string;
  readonly position?: number;
}

export function createProductAnalyticsData(
  product: PublishedProduct,
  sourcePage: string,
  context: Pick<ProductAnalyticsData, 'listId' | 'position'> = {},
): ProductAnalyticsData {
  const price =
    product.price.kind === 'on_request'
      ? {}
      : {
          price: product.price.amountMinor / 100,
          currency: product.price.currency,
        };

  return {
    productId: product.id,
    productName: product.name,
    category: product.categories[0],
    sourcePage,
    ...price,
    ...context,
  };
}

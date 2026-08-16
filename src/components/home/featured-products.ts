import { getFeaturedProducts } from '../../lib/catalog/domain/queries';
import type { Catalog, Price } from '../../lib/catalog/domain/model';
import { routes } from '../../lib/catalog/domain/routes';
import type { ProductCardProjection } from '../catalog/types';

export interface FeaturedProductsProjection {
  readonly title: string;
  readonly intro: string;
  readonly emptyMessage: string;
  readonly items: readonly ProductCardProjection[];
}

function formatAmount(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amountMinor / 100);
}

export function formatPriceLabel(price: Price): string {
  if (price.kind === 'on_request') return 'Consultar precio';

  const amount = formatAmount(price.amountMinor, price.currency);
  return price.kind === 'from' ? `Desde ${amount}` : amount;
}

export function projectFeaturedProducts(
  catalog: Catalog,
): FeaturedProductsProjection {
  return {
    title: 'Ideas para regalar',
    intro: 'Una selección de creaciones para encontrar tu próximo detalle.',
    emptyMessage: 'Pronto podrás descubrir aquí nuestras ideas destacadas.',
    items: getFeaturedProducts(catalog).map((product) => ({
      href: routes.product(product.slug),
      name: product.name,
      summary: product.summary,
      priceLabel: formatPriceLabel(product.price),
      eyebrow: 'Destacado',
    })),
  };
}

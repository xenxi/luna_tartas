import type { Price } from '../../lib/catalog/domain/model';
import type { PublicCatalogPrice } from '../../lib/catalog/public-projection';

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

export function formatPublicPriceLabel(price: PublicCatalogPrice): string {
  if (price.kind === 'on_request') return 'Consultar precio';

  const amount = Number(price.amount);
  if (
    !Number.isFinite(amount) ||
    amount < 0 ||
    typeof price.currency !== 'string'
  ) {
    throw new Error(
      'Public catalog price must include a valid amount and currency',
    );
  }

  const label = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: price.currency,
    maximumFractionDigits: 2,
  }).format(amount);
  return price.kind === 'from' ? `Desde ${label}` : label;
}

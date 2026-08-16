import type { Price } from '../../lib/catalog/domain/model';

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

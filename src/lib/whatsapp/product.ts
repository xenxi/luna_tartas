import { siteConfig } from '../../config/site';

export interface ProductWhatsAppInput {
  readonly number: string;
  /** Must be the public name of a published catalog product. */
  readonly productName: string;
  /** Must be the absolute canonical URL of that product detail page. */
  readonly productUrl: string;
}

export function buildProductWhatsAppMessage({
  productName,
  productUrl,
}: Pick<ProductWhatsAppInput, 'productName' | 'productUrl'>): string {
  const trimmedName = productName.trim();

  if (trimmedName === '') {
    throw new Error('Product name must be a non-empty string');
  }

  const canonicalUrl = validateCanonicalProductUrl(productUrl);

  return `Hola, me interesa ${trimmedName} 😊\n\nHe visto este producto en vuestra web:\n${canonicalUrl}\n\n¿Podríais darme más información sobre disponibilidad, precio y opciones de personalización?\n\n¡Gracias!`;
}

export function buildProductWhatsAppUrl({
  number,
  productName,
  productUrl,
}: ProductWhatsAppInput): string {
  if (!/^\d{8,15}$/.test(number)) {
    throw new Error(
      'WhatsApp number must contain 8–15 international digits without separators',
    );
  }

  const message = buildProductWhatsAppMessage({ productName, productUrl });
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function validateCanonicalProductUrl(value: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error('Product URL must be an absolute canonical URL');
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error('Product URL must be an absolute canonical URL');
  }

  if (
    url.protocol !== 'https:' ||
    url.origin !== siteConfig.siteUrl ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    !url.pathname.startsWith('/productos/') ||
    !url.pathname.endsWith('/')
  ) {
    throw new Error('Product URL must be an absolute canonical product URL');
  }

  return url.href;
}

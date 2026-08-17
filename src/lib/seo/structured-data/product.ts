import { getCanonicalUrl, siteConfig } from '../../../config/site';
import type { PublishedProduct } from '../../catalog/domain/model';
import { routes } from '../../catalog/domain/routes';

export interface ProductStructuredDataInput {
  readonly product: PublishedProduct;
  /** Public, optimized image URLs emitted by Astro for the visible gallery. */
  readonly imageUrls: readonly string[];
}

interface OfferJsonLd {
  readonly '@type': 'Offer';
  readonly url: string;
  readonly price: string;
  readonly priceCurrency: string;
}

interface AggregateOfferJsonLd {
  readonly '@type': 'AggregateOffer';
  readonly url: string;
  readonly lowPrice: string;
  readonly priceCurrency: string;
}

export interface ProductJsonLd {
  readonly '@context': 'https://schema.org';
  readonly '@type': 'Product';
  readonly '@id': string;
  readonly name: string;
  readonly description: string;
  readonly url: string;
  readonly image: readonly string[];
  readonly offers?: OfferJsonLd | AggregateOfferJsonLd;
}

function formatSchemaPrice(amountMinor: number): string {
  const units = Math.floor(amountMinor / 100);
  const cents = amountMinor % 100;
  return `${units}.${cents.toString().padStart(2, '0')}`;
}

function validateImageUrl(value: string): string {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error('Product JSON-LD image URLs must be absolute');
  }

  if (url.protocol !== 'https:' || url.origin !== siteConfig.siteUrl) {
    throw new Error(
      'Product JSON-LD image URLs must use the configured HTTPS origin',
    );
  }

  return url.href;
}

/**
 * Builds only claims that have an approved counterpart in the product page.
 *
 * `from` means the visible amount is a lower bound, so it uses AggregateOffer
 * without inventing a maximum price or offer count. `on_request` has no offer.
 */
export function createProductJsonLd({
  product,
  imageUrls,
}: ProductStructuredDataInput): ProductJsonLd {
  if (imageUrls.length === 0) {
    throw new Error('Product JSON-LD requires at least one visible image');
  }

  const url = getCanonicalUrl(routes.product(product.slug));
  const image = imageUrls.map(validateImageUrl);
  const document: ProductJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': url,
    name: product.name,
    description: product.description,
    url,
    image,
  };

  if (product.price.kind === 'fixed') {
    return {
      ...document,
      offers: {
        '@type': 'Offer',
        url,
        price: formatSchemaPrice(product.price.amountMinor),
        priceCurrency: product.price.currency,
      },
    };
  }

  if (product.price.kind === 'from') {
    return {
      ...document,
      offers: {
        '@type': 'AggregateOffer',
        url,
        lowPrice: formatSchemaPrice(product.price.amountMinor),
        priceCurrency: product.price.currency,
      },
    };
  }

  return document;
}

import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const distDirectory = resolve('dist');
const siteUrl = 'https://lunatartas.es';

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const pathname = resolve(directory, entry.name);
      if (entry.isDirectory()) return htmlFiles(pathname);
      return entry.name === 'index.html' ? [pathname] : [];
    }),
  );

  return files.flat();
}

function required(condition, message) {
  if (!condition) throw new Error(message);
}

function jsonLdDocuments(html, file) {
  const matches = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ];

  return matches.map((match) => {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      throw new Error(
        `${file} contains invalid JSON-LD: ${error instanceof Error ? error.message : 'parse failed'}`,
      );
    }
  });
}

function canonicalUrl(html, file) {
  const match = html.match(/<link rel="canonical" href="([^"]+)">/);
  required(match !== null, `${file} has no canonical URL`);
  return match[1];
}

function isProductPage(html) {
  return html.includes('<meta property="og:type" content="product">');
}

async function verifyProductDocument(document, canonical, file) {
  required(
    document['@context'] === 'https://schema.org',
    `${file} has an invalid Product context`,
  );
  required(
    document['@type'] === 'Product',
    `${file} has an invalid Product type`,
  );
  required(
    document['@id'] === canonical && document.url === canonical,
    `${file} Product URL differs from canonical`,
  );
  required(
    typeof document.name === 'string' && document.name.length > 0,
    `${file} Product has no name`,
  );
  required(
    typeof document.description === 'string' && document.description.length > 0,
    `${file} Product has no description`,
  );
  required(
    Array.isArray(document.image) && document.image.length > 0,
    `${file} Product has no images`,
  );
  required(
    !('aggregateRating' in document || 'review' in document),
    `${file} invents rating data`,
  );

  for (const image of document.image) {
    const url = new URL(image);
    required(
      url.origin === siteUrl && url.protocol === 'https:',
      `${file} Product image is not canonical HTTPS`,
    );
    await stat(resolve(distDirectory, `.${url.pathname}`));
  }

  if (!('offers' in document)) return;

  const offer = document.offers;
  required(offer.url === canonical, `${file} Offer URL differs from canonical`);
  required(
    offer.priceCurrency === 'EUR',
    `${file} Offer has an unsupported currency`,
  );
  required(
    !(
      'availability' in offer ||
      'shippingDetails' in offer ||
      'hasMerchantReturnPolicy' in offer
    ),
    `${file} invents commercial terms`,
  );

  if (offer['@type'] === 'Offer') {
    required(
      /^\d+\.\d{2}$/.test(offer.price),
      `${file} Offer price is invalid`,
    );
    return;
  }

  required(
    offer['@type'] === 'AggregateOffer',
    `${file} Offer type is invalid`,
  );
  required(
    /^\d+\.\d{2}$/.test(offer.lowPrice),
    `${file} AggregateOffer lowPrice is invalid`,
  );
  required(
    !('highPrice' in offer || 'offerCount' in offer),
    `${file} AggregateOffer invents price range data`,
  );
}

function verifyBreadcrumbDocument(document, canonical, file) {
  required(
    document['@context'] === 'https://schema.org',
    `${file} has an invalid BreadcrumbList context`,
  );
  required(
    document['@type'] === 'BreadcrumbList',
    `${file} has an invalid BreadcrumbList type`,
  );
  required(
    Array.isArray(document.itemListElement) &&
      document.itemListElement.length > 0,
    `${file} BreadcrumbList is empty`,
  );

  document.itemListElement.forEach((item, index) => {
    required(
      item['@type'] === 'ListItem',
      `${file} BreadcrumbList item type is invalid`,
    );
    required(
      item.position === index + 1,
      `${file} BreadcrumbList positions are invalid`,
    );
    required(
      typeof item.name === 'string' && item.name.length > 0,
      `${file} BreadcrumbList item name is invalid`,
    );
    required(
      typeof item.item === 'string' && item.item.startsWith(`${siteUrl}/`),
      `${file} BreadcrumbList item URL is invalid`,
    );
  });

  const current = document.itemListElement.at(-1);
  required(
    current.item === canonical,
    `${file} BreadcrumbList current item differs from canonical`,
  );
}

const files = await htmlFiles(distDirectory);
const productFiles = [];

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const documents = jsonLdDocuments(html, file);

  if (!isProductPage(html)) {
    required(
      documents.every((document) => document['@type'] !== 'Product'),
      `${file} publishes Product JSON-LD outside a product page`,
    );
    continue;
  }

  const canonical = canonicalUrl(html, file);
  const productDocument = documents.find(
    (document) => document['@type'] === 'Product',
  );
  const breadcrumbDocument = documents.find(
    (document) => document['@type'] === 'BreadcrumbList',
  );

  required(productDocument !== undefined, `${file} has no Product JSON-LD`);
  required(
    breadcrumbDocument !== undefined,
    `${file} has no BreadcrumbList JSON-LD`,
  );
  await verifyProductDocument(productDocument, canonical, file);
  verifyBreadcrumbDocument(breadcrumbDocument, canonical, file);
  productFiles.push(file);
}

required(productFiles.length > 0, 'No product pages were found to validate');
console.log(
  `Structured data verified in ${productFiles.length} product pages.`,
);

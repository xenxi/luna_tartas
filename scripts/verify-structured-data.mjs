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

async function verifyOrganizationDocument(document, canonical, file) {
  required(
    document['@context'] === 'https://schema.org',
    `${file} has an invalid Organization context`,
  );
  required(
    document['@type'] === 'Organization',
    `${file} has an invalid Organization type`,
  );
  required(
    document['@id'] === `${canonical}#organization`,
    `${file} Organization ID differs from canonical`,
  );
  required(
    document.name === 'Luna Tartas' && document.url === canonical,
    `${file} Organization identity differs from approved data`,
  );
  required(
    document.alternateName === 'Luna Estudio',
    `${file} Organization alternate name differs from approved data`,
  );
  required(
    Array.isArray(document.sameAs) &&
      document.sameAs.length === 1 &&
      document.sameAs[0] === 'https://www.instagram.com/lunatartas/',
    `${file} Organization social profile differs from approved data`,
  );
  required(
    typeof document.logo === 'string',
    `${file} Organization has no approved logo`,
  );

  const logo = new URL(document.logo);
  required(
    logo.origin === siteUrl && logo.protocol === 'https:',
    `${file} Organization logo is not canonical HTTPS`,
  );
  await stat(resolve(distDirectory, `.${logo.pathname}`));
  required(
    !(
      'legalName' in document ||
      'contactPoint' in document ||
      'founder' in document ||
      'telephone' in document ||
      'email' in document ||
      'address' in document
    ),
    `${file} Organization publishes unapproved identity data`,
  );
  required(
    !JSON.stringify(document).includes('TBD'),
    `${file} Organization contains a placeholder`,
  );
}

function verifyWebSiteDocument(document, canonical, organization, file) {
  required(
    document['@context'] === 'https://schema.org',
    `${file} has an invalid WebSite context`,
  );
  required(
    document['@type'] === 'WebSite',
    `${file} has an invalid WebSite type`,
  );
  required(
    document['@id'] === `${canonical}#website`,
    `${file} WebSite ID differs from canonical`,
  );
  required(
    document.name === 'Luna Tartas' &&
      document.alternateName === 'Luna Estudio' &&
      document.url === canonical,
    `${file} WebSite identity differs from approved data`,
  );
  required(
    document.publisher?.['@id'] === organization['@id'],
    `${file} WebSite publisher is not the Organization`,
  );
  required(
    !('potentialAction' in document),
    `${file} WebSite invents a search action`,
  );
  required(
    !JSON.stringify(document).includes('TBD'),
    `${file} WebSite contains a placeholder`,
  );
}

const files = await htmlFiles(distDirectory);
const productFiles = [];
const organizationDocuments = [];
const webSiteDocuments = [];
const homeFile = resolve(distDirectory, 'index.html');

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const documents = jsonLdDocuments(html, file);

  documents.forEach((document) => {
    if (document['@type'] === 'Organization') {
      organizationDocuments.push({ document, file, html });
    }
    if (document['@type'] === 'WebSite') {
      webSiteDocuments.push({ document, file, html });
    }
  });

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
required(
  organizationDocuments.length === 1 && webSiteDocuments.length === 1,
  'Global Organization and WebSite JSON-LD must each be emitted once',
);

const [
  { document: organization, file: organizationFile, html: organizationHtml },
] = organizationDocuments;
const [{ document: website, file: websiteFile, html: websiteHtml }] =
  webSiteDocuments;
required(
  organizationFile === homeFile && websiteFile === homeFile,
  'Global Organization and WebSite JSON-LD must be emitted on the homepage',
);
const homeCanonical = canonicalUrl(organizationHtml, organizationFile);
required(
  canonicalUrl(websiteHtml, websiteFile) === homeCanonical,
  'Organization and WebSite must share the homepage canonical URL',
);
await verifyOrganizationDocument(organization, homeCanonical, organizationFile);
verifyWebSiteDocument(website, homeCanonical, organization, websiteFile);
console.log(
  `Structured data verified in ${productFiles.length} product pages and the homepage identity.`,
);

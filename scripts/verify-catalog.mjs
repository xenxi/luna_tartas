import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const distDirectory = resolve('dist');
const siteUrl = 'https://lunatartas.es';
const catalogPath = resolve(distDirectory, 'catalog.json');
const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));

function requireAbsoluteSiteUrl(value, label) {
  if (typeof value !== 'string') {
    throw new Error(`${label} must be a string`);
  }

  const url = new URL(value);
  if (url.protocol !== 'https:' || url.origin !== siteUrl) {
    throw new Error(`${label} must use the configured HTTPS origin: ${value}`);
  }

  return url;
}

function productHtmlPath(url) {
  return resolve(distDirectory, url.pathname.slice(1), 'index.html');
}

if (
  catalog.schemaVersion !== '1.0' ||
  !Array.isArray(catalog.products) ||
  !catalog.taxonomies ||
  catalog.generatedAt !== undefined
) {
  throw new Error(
    'catalog.json must use schemaVersion 1.0 without generatedAt',
  );
}

const taxonomyBases = {
  category: '/categorias/',
  occasion: '/ocasiones/',
  recipient: '/regalos/',
};
const taxonomyIdsByKind = new Map();

for (const [kind, basePath] of Object.entries(taxonomyBases)) {
  const taxonomies = catalog.taxonomies[kind];
  if (!Array.isArray(taxonomies)) {
    throw new Error(`catalog.json must include a ${kind} taxonomy array`);
  }

  const ids = new Map();
  for (const taxonomy of taxonomies) {
    if (
      !taxonomy ||
      typeof taxonomy.id !== 'string' ||
      typeof taxonomy.name !== 'string' ||
      typeof taxonomy.summary !== 'string'
    ) {
      throw new Error(`catalog.json contains an incomplete ${kind} taxonomy`);
    }
    if (ids.has(taxonomy.id) || /draft/i.test(taxonomy.id)) {
      throw new Error(
        `catalog.json contains an invalid or duplicate ${kind}: ${taxonomy.id}`,
      );
    }

    const url = requireAbsoluteSiteUrl(
      taxonomy.url,
      `${kind} ${taxonomy.id} URL`,
    );
    if (!url.pathname.startsWith(basePath) || !url.pathname.endsWith('/')) {
      throw new Error(
        `${kind} ${taxonomy.id} URL is not canonical: ${taxonomy.url}`,
      );
    }
    ids.set(taxonomy.id, taxonomy.url);
  }
  taxonomyIdsByKind.set(kind, ids);
}

const productIds = new Set();
for (const product of catalog.products) {
  if (
    !product ||
    typeof product.id !== 'string' ||
    typeof product.name !== 'string' ||
    typeof product.summary !== 'string' ||
    !product.taxonomies ||
    !product.price ||
    !product.cover ||
    !product.customization
  ) {
    throw new Error('catalog.json contains an incomplete public product');
  }
  if (productIds.has(product.id) || /draft/i.test(product.id)) {
    throw new Error(
      `catalog.json contains an invalid or duplicate product: ${product.id}`,
    );
  }
  productIds.add(product.id);

  const productUrl = requireAbsoluteSiteUrl(
    product.url,
    `Product ${product.id} URL`,
  );
  if (
    !productUrl.pathname.startsWith('/productos/') ||
    !productUrl.pathname.endsWith('/')
  ) {
    throw new Error(
      `Product ${product.id} URL is not canonical: ${product.url}`,
    );
  }

  const htmlPath = productHtmlPath(productUrl);
  const html = await readFile(htmlPath, 'utf8');
  if (!html.includes(`<link rel="canonical" href="${product.url}">`)) {
    throw new Error(
      `Product ${product.id} does not match its generated HTML canonical`,
    );
  }

  const coverUrl = requireAbsoluteSiteUrl(
    product.cover.url,
    `Product ${product.id} cover URL`,
  );
  if (!coverUrl.pathname.startsWith('/_astro/')) {
    throw new Error(
      `Product ${product.id} cover is not an optimized Astro asset`,
    );
  }
  if (
    !Number.isInteger(product.cover.width) ||
    !Number.isInteger(product.cover.height)
  ) {
    throw new Error(`Product ${product.id} cover dimensions must be integers`);
  }
  await access(resolve(distDirectory, coverUrl.pathname.slice(1)));

  for (const [kind, taxonomies] of Object.entries(product.taxonomies)) {
    if (
      !['category', 'occasion', 'recipient'].includes(kind) ||
      !Array.isArray(taxonomies)
    ) {
      throw new Error(
        `Product ${product.id} has invalid public taxonomy relationships`,
      );
    }
    for (const taxonomy of taxonomies) {
      if (!taxonomy || typeof taxonomy.id !== 'string') {
        throw new Error(
          `Product ${product.id} has an incomplete ${kind} relationship`,
        );
      }
      const catalogTaxonomyUrl = taxonomyIdsByKind.get(kind)?.get(taxonomy.id);
      if (catalogTaxonomyUrl === undefined) {
        throw new Error(
          `Product ${product.id} references a non-public ${kind}: ${taxonomy.id}`,
        );
      }
      const taxonomyUrl = requireAbsoluteSiteUrl(
        taxonomy.url,
        `Product ${product.id} taxonomy URL`,
      );
      if (
        !taxonomyUrl.pathname.endsWith('/') ||
        taxonomy.url !== catalogTaxonomyUrl
      ) {
        throw new Error(`Product ${product.id} taxonomy URL is not canonical`);
      }
    }
  }
}

if (
  /approval|rights|evidence|licenseOrPermission|gallery|status/i.test(
    JSON.stringify(catalog),
  )
) {
  throw new Error(
    'catalog.json exposes non-public editorial or internal fields',
  );
}

console.log(
  `Catalog JSON: ${catalog.products.length} published products, ${productIds.size} HTML matches`,
);

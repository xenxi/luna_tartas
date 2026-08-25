import type { PublicCatalogDocument } from '../catalog/public-projection';

let cachedCatalogUrl: string | undefined;
let cachedCatalog: Promise<PublicCatalogDocument> | undefined;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPublicCatalog(value: unknown): value is PublicCatalogDocument {
  if (!isRecord(value) || value.schemaVersion !== '1.0') return false;
  if (!Array.isArray(value.products) || !isRecord(value.taxonomies)) {
    return false;
  }

  return (
    Array.isArray(value.taxonomies.category) &&
    Array.isArray(value.taxonomies.occasion) &&
    Array.isArray(value.taxonomies.recipient)
  );
}

async function requestCatalog(url: string): Promise<PublicCatalogDocument> {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok)
    throw new Error(`Catalog request failed (${response.status})`);

  const document: unknown = await response.json();
  if (!isPublicCatalog(document)) {
    throw new Error('Catalog response does not match schema 1.0');
  }
  return document;
}

export function loadPublicCatalog(url: string): Promise<PublicCatalogDocument> {
  if (cachedCatalog === undefined || cachedCatalogUrl !== url) {
    cachedCatalogUrl = url;
    cachedCatalog = requestCatalog(url).catch((error: unknown) => {
      cachedCatalog = undefined;
      throw error;
    });
  }
  return cachedCatalog;
}

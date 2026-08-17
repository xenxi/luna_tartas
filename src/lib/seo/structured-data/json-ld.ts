/**
 * Serializes a JSON-LD document safely for an inline script element.
 *
 * Escaping `<` prevents editorial content from closing the script element.
 */
export function serializeJsonLd(document: unknown): string {
  return JSON.stringify(document)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

import type { CatalogCollection } from './dto';

export interface CatalogSourceErrorContext {
  readonly collection: CatalogCollection;
  readonly entryId: string;
  readonly filePath?: string;
  readonly field: string;
}

export class CatalogSourceError extends Error {
  readonly context: CatalogSourceErrorContext;

  constructor(
    context: CatalogSourceErrorContext,
    message: string,
    options?: ErrorOptions,
  ) {
    const location =
      context.filePath ?? `${context.collection}/${context.entryId}`;
    super(`${location}:${context.field}: ${message}`, options);
    this.name = 'CatalogSourceError';
    this.context = context;
  }
}

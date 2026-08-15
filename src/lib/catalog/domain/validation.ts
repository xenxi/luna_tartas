import type {
  Catalog,
  DraftMediaItem,
  Product,
  Taxonomy,
  TaxonomyKind,
} from './model';

const IDENTIFIER_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type CatalogValidationIssueCode =
  | 'duplicate-id'
  | 'duplicate-slug'
  | 'invalid-id'
  | 'invalid-slug'
  | 'invalid-taxonomy-kind'
  | 'duplicate-reference'
  | 'missing-reference'
  | 'unpublished-reference'
  | 'invalid-publication'
  | 'invalid-alt'
  | 'invalid-price'
  | 'unsupported-currency';

export interface CatalogValidationIssue {
  readonly code: CatalogValidationIssueCode | string;
  readonly entity: string;
  readonly field: string;
  readonly value?: unknown;
  readonly expected: string;
}

function printable(value: unknown): string {
  if (value === undefined) return '';
  try {
    return `; received ${JSON.stringify(value)}`;
  } catch {
    return '; received an unserializable value';
  }
}

export class CatalogValidationError extends Error {
  readonly issues: readonly CatalogValidationIssue[];

  constructor(issues: readonly CatalogValidationIssue[]) {
    super(
      `Catalog validation failed with ${issues.length} issue${issues.length === 1 ? '' : 's'}:\n${issues
        .map(
          (issue) =>
            `- [${issue.code}] ${issue.entity}:${issue.field}${printable(issue.value)}; expected ${issue.expected}`,
        )
        .join('\n')}`,
    );
    this.name = 'CatalogValidationError';
    this.issues = [...issues];
  }
}

function issue(
  issues: CatalogValidationIssue[],
  code: CatalogValidationIssueCode,
  entity: string,
  field: string,
  value: unknown,
  expected: string,
): void {
  issues.push({ code, entity, field, value, expected });
}

function validateIdentity(
  issues: CatalogValidationIssue[],
  entities: readonly { readonly id: string; readonly slug: string }[],
  collection: string,
): void {
  const ids = new Map<string, number>();
  const slugs = new Map<string, number>();

  for (const entity of entities) {
    const label = `${collection}/${entity.id}`;
    if (!IDENTIFIER_PATTERN.test(entity.id) || entity.id.length > 80) {
      issue(
        issues,
        'invalid-id',
        label,
        'id',
        entity.id,
        '1–80 lowercase ASCII letters/numbers separated by single hyphens',
      );
    }
    if (!IDENTIFIER_PATTERN.test(entity.slug) || entity.slug.length > 80) {
      issue(
        issues,
        'invalid-slug',
        label,
        'slug',
        entity.slug,
        '1–80 lowercase ASCII letters/numbers separated by single hyphens',
      );
    }
    ids.set(entity.id, (ids.get(entity.id) ?? 0) + 1);
    slugs.set(entity.slug, (slugs.get(entity.slug) ?? 0) + 1);
  }

  for (const [id, count] of ids) {
    if (count > 1) {
      issue(
        issues,
        'duplicate-id',
        collection,
        'id',
        id,
        `a unique ID within ${collection} (found ${count})`,
      );
    }
  }
  for (const [slug, count] of slugs) {
    if (count > 1) {
      issue(
        issues,
        'duplicate-slug',
        collection,
        'slug',
        slug,
        `a unique slug within the ${collection} URL space (found ${count})`,
      );
    }
  }
}

function taxonomyIndex(
  issues: CatalogValidationIssue[],
  taxonomies: readonly Taxonomy[],
  collection: string,
  expectedKind: TaxonomyKind,
): Map<string, Taxonomy> {
  const index = new Map<string, Taxonomy>();
  for (const taxonomy of taxonomies) {
    if (taxonomy.kind !== expectedKind) {
      issue(
        issues,
        'invalid-taxonomy-kind',
        `${collection}/${taxonomy.id}`,
        'kind',
        taxonomy.kind,
        expectedKind,
      );
    }
    if (!index.has(taxonomy.id)) index.set(taxonomy.id, taxonomy);
  }
  return index;
}

function validateReferences(
  issues: CatalogValidationIssue[],
  product: Product,
  field: 'categories' | 'occasions' | 'recipients',
  index: ReadonlyMap<string, Taxonomy>,
): void {
  const references = product[field] ?? [];
  const seen = new Set<string>();
  for (const reference of references) {
    if (seen.has(reference)) {
      issue(
        issues,
        'duplicate-reference',
        `products/${product.id}`,
        field,
        reference,
        'each relationship ID at most once',
      );
      continue;
    }
    seen.add(reference);
    const target = index.get(reference);
    if (target === undefined) {
      issue(
        issues,
        'missing-reference',
        `products/${product.id}`,
        field,
        reference,
        `an existing ${field} ID`,
      );
    } else if (
      product.status === 'published' &&
      target.status !== 'published'
    ) {
      issue(
        issues,
        'unpublished-reference',
        `products/${product.id}`,
        field,
        reference,
        'a published taxonomy for a published product',
      );
    }
  }
}

function meaningfulAlt(item: DraftMediaItem): boolean {
  const alt = item.alt.trim();
  if (alt === '' || /\bTBD\b/i.test(alt)) return false;
  const filename =
    item.src
      .split('/')
      .at(-1)
      ?.replace(/\.[^.]+$/, '') ?? '';
  return alt.toLocaleLowerCase() !== filename.replace(/[-_]+/g, ' ');
}

function isApprovedText(value: unknown): value is string {
  return (
    typeof value === 'string' && value.trim() !== '' && !/\bTBD\b/i.test(value)
  );
}

function validatePublishedTaxonomy(
  issues: CatalogValidationIssue[],
  taxonomy: Taxonomy,
  collection: string,
): void {
  if (taxonomy.status !== 'published') return;
  const publicText = [
    ['name', taxonomy.name],
    ['summary', taxonomy.summary],
    ['description', taxonomy.description],
    ['seo.title', taxonomy.seo?.title],
    ['seo.description', taxonomy.seo?.description],
  ] as const;
  for (const [field, value] of publicText) {
    if (value !== undefined && !isApprovedText(value)) {
      issue(
        issues,
        'invalid-publication',
        `${collection}/${taxonomy.id}`,
        field,
        value,
        'approved non-empty public text without TBD placeholders',
      );
    }
  }
}

function validatePublishedProduct(
  issues: CatalogValidationIssue[],
  product: Product,
): void {
  if (product.status !== 'published') return;
  const entity = `products/${product.id}`;
  const requiredText = [
    ['name', product.name],
    ['summary', product.summary],
    ['description', product.description],
  ] as const;
  for (const [field, value] of requiredText) {
    if (
      typeof value !== 'string' ||
      value.trim() === '' ||
      /\bTBD\b/i.test(value)
    ) {
      issue(
        issues,
        'invalid-publication',
        entity,
        field,
        value,
        'approved non-empty text without TBD placeholders',
      );
    }
  }
  if (!Array.isArray(product.categories) || product.categories.length === 0) {
    issue(
      issues,
      'invalid-publication',
      entity,
      'categories',
      product.categories,
      'at least one category',
    );
  }
  if (product.media?.cover === undefined) {
    issue(
      issues,
      'invalid-publication',
      entity,
      'media.cover',
      undefined,
      'one valid cover image',
    );
  }
  const mediaItems = product.media
    ? [product.media.cover, ...(product.media.gallery ?? [])]
    : [];
  mediaItems.forEach((item, index) => {
    const field = index === 0 ? 'media.cover' : `media.gallery[${index - 1}]`;
    if (!meaningfulAlt(item)) {
      issue(
        issues,
        'invalid-alt',
        entity,
        `${field}.alt`,
        item.alt,
        'meaningful approved alternative text, not a filename or placeholder',
      );
    }
    if (
      item.rights === undefined ||
      !isApprovedText(item.rights.owner) ||
      !isApprovedText(item.rights.licenseOrPermission) ||
      !isApprovedText(item.rights.evidence)
    ) {
      issue(
        issues,
        'invalid-publication',
        entity,
        `${field}.rights`,
        item.rights,
        'owner, permission/license and evidence without placeholders',
      );
    }
    if (item.caption !== undefined && !isApprovedText(item.caption)) {
      issue(
        issues,
        'invalid-publication',
        entity,
        `${field}.caption`,
        item.caption,
        'approved caption text without TBD placeholders',
      );
    }
  });
  if (product.price === undefined) {
    issue(
      issues,
      'invalid-publication',
      entity,
      'price',
      undefined,
      'exactly one fixed, from or on_request price variant',
    );
  }
  if (product.customization === undefined) {
    issue(
      issues,
      'invalid-publication',
      entity,
      'customization',
      undefined,
      'an explicit customization capability',
    );
  } else if (
    product.customization.kind === 'available' &&
    (!isApprovedText(product.customization.description) ||
      product.customization.options.some((option) => !isApprovedText(option)))
  ) {
    issue(
      issues,
      'invalid-publication',
      entity,
      'customization',
      product.customization,
      'approved customization copy and options without placeholders',
    );
  }
  if (
    product.approval === undefined ||
    !isApprovedText(product.approval.source) ||
    !isApprovedText(product.approval.approvedBy)
  ) {
    issue(
      issues,
      'invalid-publication',
      entity,
      'approval',
      product.approval,
      'complete editorial approval without placeholders',
    );
  }
  const seoValues = [product.seo?.title, product.seo?.description];
  if (
    seoValues.some((value) => value !== undefined && !isApprovedText(value))
  ) {
    issue(
      issues,
      'invalid-publication',
      entity,
      'seo',
      product.seo,
      'approved SEO text without placeholders',
    );
  }
}

function validatePrice(
  issues: CatalogValidationIssue[],
  product: Product,
  allowedCurrencies: ReadonlySet<string>,
): void {
  const price = product.price;
  if (price === undefined) return;
  const entity = `products/${product.id}`;
  if (price.kind === 'on_request') return;
  if (!Number.isSafeInteger(price.amountMinor) || price.amountMinor <= 0) {
    issue(
      issues,
      'invalid-price',
      entity,
      'price.amountMinor',
      price.amountMinor,
      'a positive safe integer in minor currency units',
    );
  }
  if (!allowedCurrencies.has(price.currency)) {
    issue(
      issues,
      'unsupported-currency',
      entity,
      'price.currency',
      price.currency,
      `one of ${JSON.stringify([...allowedCurrencies])}`,
    );
  }
}

export function collectCatalogIssues(
  catalog: Catalog,
  allowedCurrencies: readonly string[],
): readonly CatalogValidationIssue[] {
  const issues: CatalogValidationIssue[] = [];
  validateIdentity(issues, catalog.categories, 'categories');
  validateIdentity(issues, catalog.occasions, 'occasions');
  validateIdentity(issues, catalog.recipients, 'recipients');
  validateIdentity(issues, catalog.products, 'products');

  const categories = taxonomyIndex(
    issues,
    catalog.categories,
    'categories',
    'category',
  );
  const occasions = taxonomyIndex(
    issues,
    catalog.occasions,
    'occasions',
    'occasion',
  );
  const recipients = taxonomyIndex(
    issues,
    catalog.recipients,
    'recipients',
    'recipient',
  );
  const currencies = new Set(allowedCurrencies);

  catalog.categories.forEach((taxonomy) =>
    validatePublishedTaxonomy(issues, taxonomy, 'categories'),
  );
  catalog.occasions.forEach((taxonomy) =>
    validatePublishedTaxonomy(issues, taxonomy, 'occasions'),
  );
  catalog.recipients.forEach((taxonomy) =>
    validatePublishedTaxonomy(issues, taxonomy, 'recipients'),
  );

  for (const product of catalog.products) {
    validateReferences(issues, product, 'categories', categories);
    validateReferences(issues, product, 'occasions', occasions);
    validateReferences(issues, product, 'recipients', recipients);
    validatePublishedProduct(issues, product);
    validatePrice(issues, product, currencies);
  }
  return issues;
}

export function assertValidCatalog(
  catalog: Catalog,
  allowedCurrencies: readonly string[],
): void {
  const issues = collectCatalogIssues(catalog, allowedCurrencies);
  if (issues.length > 0) throw new CatalogValidationError(issues);
}

import { getCanonicalUrl } from '../../../config/site';
import type { BreadcrumbItem } from '../navigation';

export interface BreadcrumbListInput {
  readonly items: readonly BreadcrumbItem[];
  readonly currentPath: string;
}

export interface BreadcrumbListJsonLd {
  readonly '@context': 'https://schema.org';
  readonly '@type': 'BreadcrumbList';
  readonly itemListElement: readonly {
    readonly '@type': 'ListItem';
    readonly position: number;
    readonly name: string;
    readonly item: string;
  }[];
}

function requiredLabel(value: string): string {
  if (value.trim() === '') {
    throw new Error('Breadcrumb JSON-LD labels must be non-empty');
  }

  return value.trim();
}

/** Builds a schema path from the same projection used by the visible breadcrumb. */
export function createBreadcrumbListJsonLd({
  items,
  currentPath,
}: BreadcrumbListInput): BreadcrumbListJsonLd {
  if (
    items.length === 0 ||
    items.some((item, index) =>
      index === items.length - 1
        ? item.current !== true
        : item.current === true,
    )
  ) {
    throw new Error(
      'Breadcrumb JSON-LD requires linked ancestors and one final current item',
    );
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: requiredLabel(item.label),
      item: getCanonicalUrl(item.current ? currentPath : item.href),
    })),
  };
}

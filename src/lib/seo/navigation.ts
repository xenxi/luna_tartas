import type { TaxonomyKind } from '../catalog/domain/model';
import { routes } from '../catalog/domain/routes';

export type BreadcrumbItem =
  | { readonly label: string; readonly href: string; readonly current?: false }
  | { readonly label: string; readonly current: true };

const taxonomyLabels: Record<TaxonomyKind, string> = {
  category: 'Categorías',
  occasion: 'Ocasiones',
  recipient: 'Regalos',
};

export function productBreadcrumb(
  productName: string,
): readonly BreadcrumbItem[] {
  return [
    { label: 'Inicio', href: routes.home() },
    { label: 'Productos', href: routes.products() },
    { label: productName, current: true },
  ];
}

export function productsBreadcrumb(): readonly BreadcrumbItem[] {
  return [
    { label: 'Inicio', href: routes.home() },
    { label: 'Productos', current: true },
  ];
}

export function faqBreadcrumb(): readonly BreadcrumbItem[] {
  return [
    { label: 'Inicio', href: routes.home() },
    { label: 'Preguntas frecuentes', current: true },
  ];
}

export function legalBreadcrumb(title: string): readonly BreadcrumbItem[] {
  return [
    { label: 'Inicio', href: routes.home() },
    { label: title, current: true },
  ];
}

export function taxonomyIndexBreadcrumb(
  kind: TaxonomyKind,
): readonly BreadcrumbItem[] {
  return [
    { label: 'Inicio', href: routes.home() },
    { label: taxonomyLabels[kind], current: true },
  ];
}

export function taxonomyBreadcrumb(
  kind: TaxonomyKind,
  taxonomyName: string,
): readonly BreadcrumbItem[] {
  return [
    { label: 'Inicio', href: routes.home() },
    {
      label: taxonomyLabels[kind],
      href: routes.taxonomyIndex(kind),
    },
    { label: taxonomyName, current: true },
  ];
}

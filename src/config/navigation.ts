import { routes } from '../lib/catalog/domain/routes';

export interface NavigationItem {
  readonly label: string;
  readonly href: string;
}

export const primaryNavigation: readonly NavigationItem[] = Object.freeze([
  { label: 'Inicio', href: routes.home() },
  { label: 'Productos', href: routes.products() },
  { label: 'Categorías', href: routes.taxonomyIndex('category') },
  { label: 'Ocasiones', href: routes.taxonomyIndex('occasion') },
  { label: 'Para regalar', href: routes.taxonomyIndex('recipient') },
]);

export function isCurrentNavigationPath(
  currentPath: string,
  destination: string,
): boolean {
  if (!currentPath.startsWith('/') || !destination.startsWith('/')) {
    return false;
  }

  const normalize = (path: string): string =>
    path === '/' ? path : `${path.replace(/\/+$/, '')}/`;
  const current = normalize(currentPath);
  const target = normalize(destination);

  return target === '/' ? current === target : current.startsWith(target);
}

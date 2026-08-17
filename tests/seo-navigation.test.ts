import { describe, expect, it } from 'vitest';
import {
  productBreadcrumb,
  productsBreadcrumb,
  taxonomyBreadcrumb,
  taxonomyIndexBreadcrumb,
} from '../src/lib/seo/navigation';

describe('semantic breadcrumb projections', () => {
  it('uses canonical internal routes and one current final item', () => {
    expect(productBreadcrumb('Tarta')).toEqual([
      { label: 'Inicio', href: '/' },
      { label: 'Productos', href: '/productos/' },
      { label: 'Tarta', current: true },
    ]);
    expect(taxonomyBreadcrumb('category', 'Bodas')).toEqual([
      { label: 'Inicio', href: '/' },
      { label: 'Categorías', href: '/categorias/' },
      { label: 'Bodas', current: true },
    ]);
  });

  it('covers index pages without inventing links for the current page', () => {
    expect(productsBreadcrumb()).toEqual([
      { label: 'Inicio', href: '/' },
      { label: 'Productos', current: true },
    ]);
    expect(taxonomyIndexBreadcrumb('recipient')).toEqual([
      { label: 'Inicio', href: '/' },
      { label: 'Regalos', current: true },
    ]);
  });
});

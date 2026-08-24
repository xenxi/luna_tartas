import { describe, expect, it } from 'vitest';
import { withBasePath, withoutBasePath } from '../src/lib/site/urls';

describe('deployment URL helpers', () => {
  it('prefixes internal paths only when Pages has a repository base', () => {
    expect(withBasePath('/categorias/', '/luna_tartas/')).toBe(
      '/luna_tartas/categorias/',
    );
    expect(withBasePath('/categorias/', '/')).toBe('/categorias/');
    expect(withBasePath('https://example.com/', '/luna_tartas/')).toBe(
      'https://example.com/',
    );
  });

  it('removes the repository base before comparing route paths', () => {
    expect(withoutBasePath('/luna_tartas/categorias/', '/luna_tartas/')).toBe(
      '/categorias/',
    );
    expect(withoutBasePath('/luna_tartas/', '/luna_tartas/')).toBe('/');
    expect(withoutBasePath('/categorias/', '/luna_tartas/')).toBe(
      '/categorias/',
    );
    expect(withoutBasePath('/categorias/', '/')).toBe('/categorias/');
    expect(withoutBasePath('/', '/')).toBe('/');
  });
});

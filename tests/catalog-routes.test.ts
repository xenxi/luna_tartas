import { describe, expect, it } from 'vitest';
import { routes, taxonomyBase } from '../src/lib/catalog/domain/routes';

describe('catalog routes', () => {
  it('matches the public SEO route contract', () => {
    expect(routes.home()).toBe('/');
    expect(routes.about()).toBe('/sobre-luna/');
    expect(routes.contact()).toBe('/contacto/');
    expect(routes.shipping()).toBe('/envios-y-entregas/');
    expect(routes.faq()).toBe('/preguntas-frecuentes/');
    expect(routes.products()).toBe('/productos/');
    expect(routes.search()).toBe('/buscar/');
    expect(routes.product('chocolate-cake')).toBe('/productos/chocolate-cake/');
    expect(routes.taxonomyIndex('category')).toBe('/categorias/');
    expect(routes.taxonomy('occasion', 'birthday')).toBe(
      '/ocasiones/birthday/',
    );
    expect(routes.taxonomyIndex('recipient')).toBe('/regalos/');
    expect(routes.taxonomy('recipient', 'family')).toBe('/regalos/family/');
    expect(routes.catalogJson()).toBe('/catalog.json');
    expect(taxonomyBase('recipient')).toBe('regalos');
  });

  it('rejects unsafe URL segments', () => {
    expect(() => routes.product('../draft')).toThrow(/lowercase kebab-case/);
    expect(() => routes.taxonomy('category', 'Not valid')).toThrow();
  });
});

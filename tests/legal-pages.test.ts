import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { legalPages } from '../src/content/legal';
import { routes } from '../src/lib/catalog/domain/routes';

const component = readFileSync('src/components/legal/LegalPage.astro', 'utf8');
const styles = readFileSync('src/components/legal/legal-page.css', 'utf8');
const privacyPage = readFileSync(
  'src/pages/politica-de-privacidad/index.astro',
  'utf8',
);
const termsPage = readFileSync(
  'src/pages/condiciones-del-servicio/index.astro',
  'utf8',
);

describe('public legal pages', () => {
  it('keeps both editorial documents centralized outside presentation', () => {
    expect(legalPages.privacy.hero.title).toBe('Política de privacidad');
    expect(legalPages.terms.hero.title).toBe('Condiciones del servicio');
    expect(legalPages.privacy.sections.length).toBeGreaterThanOrEqual(6);
    expect(legalPages.terms.sections.length).toBeGreaterThanOrEqual(8);
    expect(Object.isFrozen(legalPages)).toBe(true);
    expect(component).not.toContain('Google Analytics puede tratar');
    expect(component).not.toContain('El pedido queda confirmado');
  });

  it('publishes canonical, indexable routes through the shared layout', () => {
    expect(routes.privacy()).toBe('/politica-de-privacidad/');
    expect(routes.terms()).toBe('/condiciones-del-servicio/');
    expect(privacyPage).toContain('canonicalPath={routes.privacy()}');
    expect(termsPage).toContain('canonicalPath={routes.terms()}');
    expect(privacyPage).toContain('<LegalPage content={legalPages.privacy} />');
    expect(termsPage).toContain('<LegalPage content={legalPages.terms} />');
  });

  it('uses semantic, progressively enhanced navigation without client code', () => {
    expect(component).toContain('<article');
    expect(component).toContain('aria-label="Índice de la página"');
    expect(component).toContain('aria-labelledby={`${section.id}-title`}');
    expect(component).toContain('<Breadcrumb');
    expect(component).not.toContain('<script');
    expect(component).not.toContain('client:');
    expect(styles).toContain('@media (max-width: 47.99rem)');
    expect(styles).toContain('overflow-x: auto');
    expect(styles).toContain('scroll-snap-type: x proximity');
    expect(styles).toContain('@media (prefers-reduced-motion: reduce)');
  });
});

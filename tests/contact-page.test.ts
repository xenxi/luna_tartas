import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicContactConfig } from '../src/config/contact';
import { contactContent } from '../src/content/contact';
import { routes } from '../src/lib/catalog/domain/routes';

const component = readFileSync(
  new URL('../src/components/contact/ContactPage.astro', import.meta.url),
  'utf8',
);
const page = readFileSync(
  new URL('../src/pages/contacto/index.astro', import.meta.url),
  'utf8',
);
const styles = readFileSync(
  new URL('../src/components/contact/contact-page.css', import.meta.url),
  'utf8',
);
const footer = readFileSync(
  new URL('../src/components/site/SiteFooter.astro', import.meta.url),
  'utf8',
);

describe('contact page', () => {
  it('uses the approved public route, SEO metadata and contact configuration', () => {
    expect(routes.contact()).toBe('/contacto/');
    expect(contactContent.metadata.title).toBe('Contacto | LUNA');
    expect(contactContent.metadata.description).toMatch(/contacta/i);
    expect(contactContent.metadata.description).toMatch(
      /regalos personalizados/i,
    );
    expect(contactContent.metadata.description).toMatch(/Linares/i);
    expect(contactContent.metadata.description).toMatch(/WhatsApp/i);
    expect(contactContent.whatsapp.action.href).toBe(
      publicContactConfig.whatsapp.href,
    );
    expect(page).toContain('canonicalPath={routes.contact()}');
    expect(page).toContain('titleSuffix=""');
    expect(footer.match(/routes\.contact\(\)/g)).toHaveLength(2);
  });

  it('keeps WhatsApp primary, tracked and independent from client JavaScript', () => {
    expect(component).toContain("ctaLocation: 'contact-primary-cta'");
    expect(component).toContain("ctaLocation: 'contact-final-cta'");
    expect(component.match(/sourcePage: routes\.contact\(\)/g)).toHaveLength(2);
    expect(component).toContain('publicContactConfig.whatsapp.label');
    expect(component).not.toContain('<form');
    expect(component).not.toContain('<script');
    expect(component).not.toContain('client:');
  });

  it('publishes only real catalog topics and links shipping details', () => {
    const serialized = JSON.stringify(contactContent);

    expect(serialized).toContain('Tartas de pañales');
    expect(serialized).toContain('Papelería personalizada');
    expect(serialized).toContain('Láminas personalizadas');
    expect(serialized).toContain('Packs personalizados');
    expect(serialized).toContain('Linares, Jaén');
    expect(serialized).toContain(routes.shipping());
    expect(serialized).not.toMatch(/horario|tiempo de respuesta|dirección/i);
  });

  it('defines dedicated compact and wide responsive compositions', () => {
    expect(styles).toContain('@media (max-width: 47.99rem)');
    expect(styles).toContain('@media (max-width: 23.99rem)');
    expect(styles).toContain('@media (max-width: 63.99rem)');
    expect(styles).toContain("grid-template-areas:\n      'copy'\n      'art'");
    expect(styles).toContain('inline-size: 100%');
  });
});

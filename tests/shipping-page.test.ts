import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { shippingContent } from '../src/content/shipping';
import { routes } from '../src/lib/catalog/domain/routes';

const component = readFileSync(
  new URL('../src/components/shipping/ShippingPage.astro', import.meta.url),
  'utf8',
);
const page = readFileSync(
  new URL('../src/pages/envios-y-entregas/index.astro', import.meta.url),
  'utf8',
);
const styles = readFileSync(
  new URL('../src/components/shipping/shipping-page.css', import.meta.url),
  'utf8',
);

describe('shipping page', () => {
  it('publishes the approved delivery rules without invented conditions', () => {
    const serialized = JSON.stringify(shippingContent);

    expect(serialized).toContain('Entrega en mano en Linares');
    expect(serialized).toContain('Los gastos de envío no están incluidos.');
    expect(serialized).toContain('antes de confirmar');
    expect(serialized).not.toMatch(/24\/?48|envío gratuito|tarifa fija/i);
  });

  it('uses the shared route, metadata layout and WhatsApp analytics pattern', () => {
    expect(routes.shipping()).toBe('/envios-y-entregas/');
    expect(page).toContain('canonicalPath={routes.shipping()}');
    expect(page).toContain('titleSuffix=""');
    expect(component).toContain(
      "import ActionLink from '../ui/ActionLink.astro'",
    );
    expect(component).toContain("ctaLocation: 'shipping-final-cta'");
    expect(component).toContain('sourcePage: routes.shipping()');
  });

  it('keeps the mobile process readable as a horizontally snapping carousel', () => {
    expect(component).toContain(
      'aria-label="Pasos para preparar y recibir tu pedido"',
    );
    expect(styles).toContain('scroll-snap-type: x mandatory');
    expect(styles).toContain('/ 1.5');
    expect(styles).not.toMatch(/var\(--space-(?:7|9|14)\)/);
  });
});

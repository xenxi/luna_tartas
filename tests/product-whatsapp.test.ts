import { describe, expect, it } from 'vitest';
import {
  buildProductWhatsAppMessage,
  buildProductWhatsAppUrl,
} from '../src/lib/whatsapp/product';

const input = {
  number: '34697637180',
  productName: 'Lámina niño ñandú & mamá',
  productUrl: 'https://lunatartas.es/productos/lamina-nino-nandu/',
} as const;

describe('product WhatsApp builder', () => {
  it('builds the approved contextual message', () => {
    expect(buildProductWhatsAppMessage(input)).toBe(
      'Hola, me interesa Lámina niño ñandú & mamá 😊\n\nHe visto este producto en vuestra web:\nhttps://lunatartas.es/productos/lamina-nino-nandu/\n\n¿Podríais darme más información sobre disponibilidad, precio y opciones de personalización?\n\n¡Gracias!',
    );
  });

  it('encodes the message once and keeps the canonical URL in its text', () => {
    const url = new URL(buildProductWhatsAppUrl(input));
    const message = buildProductWhatsAppMessage(input);

    expect(url.origin).toBe('https://wa.me');
    expect(url.pathname).toBe('/34697637180');
    expect(url.searchParams.get('text')).toBe(message);
    expect(url.searchParams.get('text')).toContain(input.productUrl);
    expect(url.href).toContain('%C3%B1');
    expect(url.href).not.toContain('%25C3%25B1');
  });

  it.each([
    { ...input, number: '+34 697 63 71 80' },
    { ...input, productName: '   ' },
    { ...input, productUrl: '/productos/lamina-nino-nandu/' },
    {
      ...input,
      productUrl: 'https://lunatartas.es/productos/lamina-nino-nandu',
    },
    {
      ...input,
      productUrl:
        'https://lunatartas.es/productos/lamina-nino-nandu/?draft=true',
    },
    {
      ...input,
      productUrl: 'https://example.com/productos/lamina-nino-nandu/',
    },
  ])('rejects invalid product input', (invalidInput) => {
    expect(() => buildProductWhatsAppUrl(invalidInput)).toThrow();
  });
});

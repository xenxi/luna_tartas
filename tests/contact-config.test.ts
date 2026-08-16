import { describe, expect, it } from 'vitest';
import { validateWhatsAppConfig, whatsappConfig } from '../src/config/contact';

describe('approved WhatsApp direct contact', () => {
  it('normalizes the direct URL and preserves the approved Unicode message', () => {
    const url = new URL(whatsappConfig.href);

    expect(url.origin).toBe('https://wa.me');
    expect(url.pathname).toBe('/34697637180');
    expect(url.searchParams.get('text')).toBe(
      '¡Hola! 🌙 He visto vuestra web y tengo una idea para un regalo. ¿Me ayudáis a darle forma?',
    );
    expect(whatsappConfig.number).toBe('34697637180');
    expect(Object.isFrozen(whatsappConfig)).toBe(true);
  });

  it.each([
    ['missing configuration', undefined],
    ['formatted number', { number: '+34 697 63 71 80', message: 'Hola' }],
    ['short number', { number: '123', message: 'Hola' }],
    ['non-digit number', { number: '34697abc180', message: 'Hola' }],
    ['missing message', { number: '34697637180' }],
    ['empty message', { number: '34697637180', message: '   ' }],
  ])('rejects %s', (_case, value) => {
    expect(() => validateWhatsAppConfig(value)).toThrow();
  });
});

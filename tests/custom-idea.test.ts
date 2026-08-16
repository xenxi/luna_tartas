import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { customIdeaContent } from '../src/content/home/custom-idea';
import {
  buildCustomWhatsAppUrl,
  type CustomWhatsAppInput,
} from '../src/lib/whatsapp/custom';

const component = readFileSync(
  'src/components/home/CustomIdeaCta.astro',
  'utf8',
);
const page = readFileSync('src/pages/index.astro', 'utf8');

describe('home custom idea CTA', () => {
  it('builds one contextual WhatsApp URL without duplicating the number', () => {
    const input: CustomWhatsAppInput = {
      number: '34697637180',
      message: '¡Hola! 🌙 Tengo una idea para un regalo.',
    };
    const url = new URL(buildCustomWhatsAppUrl(input));

    expect(url.origin).toBe('https://wa.me');
    expect(url.pathname).toBe('/34697637180');
    expect(url.searchParams.get('text')).toBe(input.message);
    expect(url.searchParams.get('text')).not.toContain(input.number);
  });

  it.each([
    { number: '+34 697 63 71 80', message: 'Hola' },
    { number: '34697637180', message: '   ' },
  ])('rejects unsafe custom WhatsApp input', (input) => {
    expect(() => buildCustomWhatsAppUrl(input)).toThrow();
  });

  it('publishes the approved copy as a native link without JavaScript', () => {
    expect(customIdeaContent.title).toBe('Cuéntanos tu idea');
    expect(customIdeaContent.action.href).toMatch(
      /^https:\/\/wa\.me\/34697637180\?text=/,
    );
    expect(component).toContain('<ActionLink');
    expect(component).not.toContain('<form');
    expect(page).toContain('<CustomIdeaCta />');
  });
});

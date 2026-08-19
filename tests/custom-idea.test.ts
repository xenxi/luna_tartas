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
const styles = readFileSync('src/components/home/custom-idea.css', 'utf8');
const page = readFileSync('src/pages/index.astro', 'utf8');
const background = readFileSync('src/assets/home/custom-idea/fondo.png');
const image = readFileSync('src/assets/home/custom-idea/imagen-central.png');
const pinkCloud = readFileSync('src/assets/home/custom-idea/nube-rosa.png');
const blueCloud = readFileSync('src/assets/home/custom-idea/nube-azul.png');

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
    expect(customIdeaContent.title).toBe('¿Tienes algo en mente?');
    expect(customIdeaContent.copy).toBe(
      'Cuéntanos tu idea y te ayudamos a crear un regalo único e inolvidable.',
    );
    expect(customIdeaContent.action.href).toMatch(
      /^https:\/\/wa\.me\/34697637180\?text=/,
    );
    expect(component).toContain('<ActionLink');
    expect(component).toContain("event: 'custom_whatsapp_click'");
    expect(component).toContain('variant="secondary"');
    expect(component).toContain('custom-idea__whatsapp-icon');
    expect(component).toContain('src={lunaCloud}');
    expect(component).toContain('class="custom-idea__moon"');
    expect(component).toContain('variant="heart"');
    expect(component).toContain('variant="sparkle"');
    expect(component).not.toContain('<form');
    expect(component).not.toContain('ContentSection');
    expect(component).toContain('src={blushBackground}');
    expect(component).toContain('src={centralImage}');
    expect(component).toContain('src={pinkCloud}');
    expect(component).toContain('src={blueCloud}');
    expect(component).toContain("formats={['avif', 'webp']}");
    expect(component).toContain('loading="lazy"');
    expect(styles).toContain('--cta-height: clamp(12rem, 15vw, 15rem)');
    expect(styles).toContain('inline-size: min(92%, 93.75rem)');
    expect(styles).toContain('block-size: var(--art-height)');
    expect(styles).toContain(
      'inset-block-start: clamp(-1.75rem, -1.5vw, -1rem)',
    );
    expect(styles).not.toContain('border-radius: 45%');
    expect(page).toContain('<CustomIdeaCta />');
  });

  it('keeps the supplied photo, watercolor and rights metadata traceable', () => {
    expect(customIdeaContent.media.image).toEqual({
      alt: 'Manos preparando un regalo envuelto con un lazo rosa junto a unas flores delicadas.',
      sourceWidth: 1942,
      sourceHeight: 809,
    });
    expect(customIdeaContent.media.rights.owner).toBe(
      'Propietario del proyecto',
    );
    expect(customIdeaContent.media.rights.evidence).toContain('M8.9.8');
    expect(background.subarray(16, 24).readUInt32BE(0)).toBe(2172);
    expect(background.subarray(16, 24).readUInt32BE(4)).toBe(724);
    expect(image.subarray(16, 24).readUInt32BE(0)).toBe(1942);
    expect(image.subarray(16, 24).readUInt32BE(4)).toBe(809);
    expect(image[25]).toBe(6);
    expect(pinkCloud.subarray(16, 24).readUInt32BE(0)).toBe(1536);
    expect(pinkCloud.subarray(16, 24).readUInt32BE(4)).toBe(1024);
    expect(blueCloud.subarray(16, 24).readUInt32BE(0)).toBe(1731);
    expect(blueCloud.subarray(16, 24).readUInt32BE(4)).toBe(909);
  });
});

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { heroContent } from '../src/content/home/hero';

const component = readFileSync('src/components/home/Hero.astro', 'utf8');
const styles = readFileSync('src/components/home/hero.css', 'utf8');
const page = readFileSync('src/pages/index.astro', 'utf8');
const image = readFileSync('src/assets/home/tarta-hero.png');

describe('approved home hero', () => {
  it('centralizes the exact editorial hierarchy and approval metadata', () => {
    expect(heroContent.eyebrow).toBe('HECHO A MANO, CON AMOR');
    expect(heroContent.heading).toEqual(['Hecho para', 'alguien.']);
    expect(heroContent.claim).toBe('No para cualquiera.');
    expect(heroContent.copy.join(' ')).toBe(
      'Creamos regalos personalizados y pequeños detalles con mucho mimo, porque las personas especiales merecen algo pensado especialmente para ellas.',
    );
    expect(heroContent.primaryAction).toEqual({
      label: 'Descubrir regalos',
      href: '/productos/',
    });
    expect(heroContent.secondaryAction.label).toBe('Cuéntanos tu idea');
    expect(heroContent.secondaryAction.href).toMatch(
      /^https:\/\/wa\.me\/34697637180\?text=/,
    );
    expect(heroContent.benefits.map(({ label }) => label)).toEqual([
      'Personalizados con cariño',
      'Hechos a mano',
      'Materiales de calidad',
      'Envío y entrega con cuidado',
    ]);
    expect(heroContent.image.alt).toContain('Tarta de pañales artesanal');
    expect(heroContent.image.author).toBe('Luna');
    expect(heroContent.approval).toEqual({
      approvedBy: 'Responsable del proyecto',
      approvedAt: '2026-08-16',
    });
  });

  it('uses one two-line H1, a separate claim and both approved actions', () => {
    expect(component.match(/<h1\b/g)).toHaveLength(1);
    expect(component).toContain('{heroContent.heading[0]}');
    expect(component).toContain('{heroContent.heading[1]}');
    expect(component).toContain('{heroContent.claim}');
    expect(component).toContain('class="hero__eyebrow"');
    expect(component).toContain('class="hero__claim"');
    expect(component).toContain('heroContent.primaryAction.href');
    expect(component).toContain('heroContent.secondaryAction.href');
    expect(component).toContain('<Icon name="arrow-right" />');
    expect(component).toContain('class="hero__whatsapp"');
    expect(component).toContain('variant="secondary"');
    expect(page).toContain('<Hero />');
    expect(page).not.toContain('<h1');
    expect(styles).toContain("'title media'");
    expect(styles).toContain("'body media'");
    expect(styles).toContain('font-family: var(--font-script)');
    expect(styles).toContain('white-space: nowrap');
  });

  it('prioritizes the approved responsive media with intrinsic dimensions', () => {
    expect(component).toContain("formats={['avif', 'webp']}");
    expect(component).toContain('fallbackFormat="jpg"');
    expect(component).toContain(
      'widths={[320, 480, 640, 768, 960, 1200, 1672]}',
    );
    expect(component).toContain('loading="eager"');
    expect(component).toContain('fetchpriority="high"');
    expect(image.subarray(16, 24).readUInt32BE(0)).toBe(1672);
    expect(image.subarray(16, 24).readUInt32BE(4)).toBe(941);
    expect(styles).toContain('object-fit: cover');
    expect(styles).toContain('object-position: 58% 50%');
    expect(styles).toContain('border-radius: 0');
    expect(styles).toContain('box-shadow: none');
  });

  it('encapsulates the new composition to desktop and preserves mobile order', () => {
    expect(component.indexOf('hero__title')).toBeLessThan(
      component.indexOf('hero__media'),
    );
    expect(component.indexOf('hero__media')).toBeLessThan(
      component.indexOf('hero__body'),
    );
    expect(styles).toContain("'title'\n    'media'\n    'body'");
    expect(styles).toContain('@media (min-width: 60rem)');
    expect(styles).toContain('grid-template-columns: repeat(4');
    expect(styles).toContain('grid-template-columns: repeat(2, max-content)');
    expect(styles).toContain('inset: 0');
    expect(styles).toContain('inline-size: 100%');
  });

  it('publishes structured benefits, a delicate seal and a vector transition', () => {
    expect(component).toContain(
      '<ul class="hero__benefits" aria-label="Beneficios de Luna Tartas">',
    );
    expect(component).toContain('heroContent.benefits.map');
    expect(component).toContain('class="hero__benefit-icon"');
    expect(component).toContain('class="hero__seal" aria-hidden="true"');
    expect(component).toContain('Hecho<br />con amor');
    expect(component).toContain('class="hero__claim-stroke"');
    expect(component).toContain('class="hero__transition"');
    expect(component).toContain('class="hero__transition-line"');
    expect(component).toContain('class="hero__transition-cutout"');
    expect(component).toContain('class="hero__transition-heart"');
    expect(styles).toContain('fill: var(--color-canvas)');
    expect(component).not.toContain('hero-watercolor-cloud');
  });
});

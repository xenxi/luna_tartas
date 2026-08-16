import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { heroContent } from '../src/content/home/hero';

const component = readFileSync('src/components/home/Hero.astro', 'utf8');
const styles = readFileSync('src/components/home/hero.css', 'utf8');
const page = readFileSync('src/pages/index.astro', 'utf8');
const image = readFileSync('src/assets/home/tarta-hero.png');

describe('approved home hero', () => {
  it('keeps the handoff and approval metadata centralized', () => {
    expect(heroContent.heading).toBe('Hecho para alguien. No para cualquiera.');
    expect(heroContent.primaryAction).toEqual({
      label: 'Descubrir regalos',
      href: '/productos/',
    });
    expect(heroContent.secondaryAction.label).toBe('Cuéntanos tu idea');
    expect(heroContent.secondaryAction.href).toMatch(
      /^https:\/\/wa\.me\/34697637180\?text=/,
    );
    expect(heroContent.image.alt).toContain('Tarta de pañales artesanal');
    expect(heroContent.image.author).toBe('Luna');
    expect(heroContent.approval).toEqual({
      approvedBy: 'Responsable del proyecto',
      approvedAt: '2026-08-16',
    });
  });

  it('uses one H1 and publishes both approved destinations', () => {
    expect(component.match(/<h1\b/g)).toHaveLength(1);
    expect(component).toContain('heroContent.primaryAction.href');
    expect(component).toContain('heroContent.secondaryAction.href');
    expect(component).toContain('variant="secondary"');
    expect(page).toContain('<Hero />');
    expect(page).not.toContain('<h1');
    expect(component).toContain('headingLead');
    expect(component).toContain('headingEmphasis');
    expect(styles).toContain("'title media'");
    expect(styles).toContain("'body media'");
  });

  it('prioritizes responsive optimized media with intrinsic source dimensions', () => {
    expect(component).toContain("formats={['avif', 'webp']}");
    expect(component).toContain('fallbackFormat="jpg"');
    expect(component).toContain(
      'widths={[320, 480, 640, 768, 960, 1200, 1672]}',
    );
    expect(component).toContain('loading="eager"');
    expect(component).toContain('fetchpriority="high"');
    expect(image.subarray(16, 24).readUInt32BE(0)).toBe(1672);
    expect(image.subarray(16, 24).readUInt32BE(4)).toBe(941);
  });

  it('uses a mobile-specific order and protects the product focal point', () => {
    expect(component.indexOf('hero__title')).toBeLessThan(
      component.indexOf('hero__media'),
    );
    expect(component.indexOf('hero__media')).toBeLessThan(
      component.indexOf('hero__body'),
    );
    expect(styles).toContain("'title'\n    'media'\n    'body'");
    expect(styles).toContain('object-fit: cover');
    expect(styles).toContain('object-position: 100% 48%');
    expect(styles).toContain('@media (min-width: 60rem)');
  });

  it('connects the hero to the next chapter with an accessible ornament', () => {
    expect(component).toContain('<Ornament variant="thread"');
    expect(component).toContain('variant="underline"');
    expect(component.match(/motion="draw"/g)).toHaveLength(2);
    expect(component).toContain('class="hero__heading-underline"');
    expect(component).toContain('class="hero__transition"');
  });
});

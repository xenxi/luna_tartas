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
  });

  it('prioritizes responsive optimized media with intrinsic source dimensions', () => {
    expect(component).toContain("formats={['avif', 'webp']}");
    expect(component).toContain('fallbackFormat="jpg"');
    expect(component).toContain('widths={[480, 768, 1200, 1672]}');
    expect(component).toContain('loading="eager"');
    expect(component).toContain('fetchpriority="high"');
    expect(image.subarray(16, 24).readUInt32BE(0)).toBe(1672);
    expect(image.subarray(16, 24).readUInt32BE(4)).toBe(941);
  });

  it('preserves the full image and adds an opaque content surface on wide screens', () => {
    expect(styles).toContain('@media (min-width: 64rem)');
    expect(styles).toContain('block-size: auto');
    expect(styles).toContain('background: var(--color-canvas)');
    expect(styles).not.toContain('object-fit: cover');
  });
});

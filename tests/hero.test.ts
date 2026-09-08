import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { heroContent } from '../src/content/home/hero';
const component = readFileSync('src/components/home/Hero.astro', 'utf8');
const page = readFileSync('src/pages/index.astro', 'utf8');
const image = readFileSync('src/assets/home/hero-bunny-reference.png');
describe('home hero visual reference', () => {
  it('keeps editorial content and existing conversion routes centralized', () => {
    expect(heroContent.heading).toEqual(['Pequeños detalles', 'para momentos']);
    expect(heroContent.claim).toBe('grandes ♡');
    expect(heroContent.primaryAction.href).toBe('/productos/');
    expect(heroContent.secondaryAction.href).toMatch(
      /^https:\/\/wa\.me\/34697637180\?text=/,
    );
    expect(heroContent.benefits).toHaveLength(4);
    expect(heroContent.image.alt).toContain('Tarta de pañales artesanal');
  });
  it('uses one H1 and semantic, static actions and benefits', () => {
    expect(component.match(/<h1\b/g)).toHaveLength(1);
    expect(component).toContain('{heroContent.heading[0]}');
    expect(component).toContain('{heroContent.heading[1]}');
    expect(component).toContain('{heroContent.claim}');
    expect(component).toContain('heroContent.primaryAction.href');
    expect(component).toContain('heroContent.secondaryAction.href');
    expect(component).toContain('aria-label="Beneficios de Luna Tartas"');
    expect(component).toContain('heroContent.benefits.map');
    expect(component).not.toContain('client:');
    expect(page).toContain('<Hero />');
  });
  it('prioritizes optimized media and keeps the product photograph dimensions', () => {
    expect(component).toContain("formats={['avif', 'webp']}");
    expect(component).toContain('loading="eager"');
    expect(component).toContain('fetchpriority="high"');
    expect(image.readUInt32BE(16)).toBe(1817);
    expect(image.readUInt32BE(20)).toBe(866);
  });
});

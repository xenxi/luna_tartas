import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const globalStyles = readFileSync('src/styles/global.css', 'utf8');
const foundations = readFileSync('src/styles/foundations.css', 'utf8');
const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');
const tokens = readFileSync('src/styles/tokens.css', 'utf8');
const backdrop = readFileSync(
  'src/components/site/DecorativeBackdrop.astro',
  'utf8',
);
const backdropStyles = readFileSync(
  'src/components/site/decorative-backdrop.css',
  'utf8',
);
const taxonomyDiscovery = readFileSync(
  'src/components/home/taxonomy-discovery.css',
  'utf8',
);

describe('global presentation foundation', () => {
  it('keeps the global layer CSS-only and composes the approved foundation', () => {
    expect(globalStyles).toContain("@import url('./foundations.css')");
    expect(foundations).toContain('.container');
    expect(globalStyles).toContain('.prose');
    expect(globalStyles).toContain('.section');
    expect(globalStyles).toContain('prefers-reduced-motion: reduce');
    expect(globalStyles).not.toContain('overflow-x: scroll');
  });

  it('exposes a keyboard skip link and a stable main focus target', () => {
    expect(layout).toContain('class="skip-link"');
    expect(layout).toContain('href="#main-content"');
    expect(layout).toContain('id="main-content" tabindex="-1"');
  });

  it('provides a stable, non-interactive global decorative layer', () => {
    expect(layout).toContain('<DecorativeBackdrop />');
    expect(backdrop).toContain('aria-hidden="true"');
    expect(backdrop).not.toContain('client:');
    expect(backdropStyles).toContain('position: fixed');
    expect(backdropStyles).toContain('contain: strict');
    expect(backdropStyles).toContain('pointer-events: none');
    expect(backdropStyles).not.toMatch(/#[0-9a-f]{3,8}|rgb\(/i);
  });

  it('maps the Luna direction to source palette and semantic roles', () => {
    expect(tokens).toContain('--luna-cream: #fff9f3');
    expect(tokens).toContain('--luna-coral: #ea6175');
    expect(tokens).toContain('--luna-blue: #bcd5e9');
    expect(tokens).toContain('--luna-brown: #392723');
    expect(tokens).toContain('--color-canvas: var(--luna-cream)');
    expect(tokens).toContain('--color-surface-warm: var(--luna-blush-soft)');
    expect(tokens).toContain('--color-surface-calm: var(--luna-blue-soft)');
    expect(tokens).toContain('--color-decoration-blue: var(--luna-blue)');
    expect(tokens).toContain('--color-action: var(--luna-coral-dark)');
    expect(tokens).toContain('--font-script:');
    expect(tokens).not.toContain("'Times New Roman'");
    expect(tokens).toContain('--container-content: 72rem');
    expect(tokens).toContain('--container-visual: 80rem');
    expect(tokens).toContain('--measure-compact: 42ch');
    expect(tokens).toContain('--space-section-compact:');
    expect(tokens).toContain('--space-section-standard:');
    expect(tokens).toContain('--space-section-spacious:');
    expect(tokens).toContain('--font-size-display: clamp(');
    expect(tokens).toContain('5.25rem');
    expect(tokens).toContain('--button-min-block-size: 3rem');
    expect(tokens).toContain('--radius-action: 0.625rem');
    expect(tokens).toContain('--card-featured-min-block-size: clamp(');
    expect(tokens).toContain('--decoration-watercolor-size: clamp(');
    expect(tokens).toContain('--breakpoint-desktop: 64rem');
    expect(tokens).toContain('--z-decoration: 0');
    expect(tokens).not.toContain('--container-max:');
    expect(tokens).not.toContain('--space-section:');
    expect(foundations).toContain('.visual-container');
    expect(foundations).toContain('.prose--compact');
    expect(taxonomyDiscovery).toContain('var(--gutter)');
    expect(taxonomyDiscovery).toContain('var(--container-content)');
    expect(taxonomyDiscovery).not.toContain('var(--space-gutter)');
    expect(taxonomyDiscovery).not.toContain('var(--container-wide)');
  });

  it('keeps brand values centralized instead of hardcoding component colors', () => {
    const componentColorValues = /#[0-9a-f]{3,8}|rgb\(/i;
    const componentStyles = [
      readFileSync('src/components/taxonomies/taxonomies.css', 'utf8'),
      readFileSync('src/pages/productos/products.css', 'utf8'),
    ].join('\n');

    expect(componentStyles).not.toMatch(componentColorValues);
    expect(componentStyles).toContain('var(--color-border-subtle)');
  });
});

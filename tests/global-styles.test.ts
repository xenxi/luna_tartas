import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const globalStyles = readFileSync('src/styles/global.css', 'utf8');
const foundations = readFileSync('src/styles/foundations.css', 'utf8');
const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');
const tokens = readFileSync('src/styles/tokens.css', 'utf8');
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

  it('maps the atelier direction to semantic tokens and real containers', () => {
    expect(tokens).toContain('--color-canvas: #faf7f2');
    expect(tokens).toContain('--color-surface-rose: #f3dfdc');
    expect(tokens).toContain('--color-surface-sage: #e2e6df');
    expect(taxonomyDiscovery).toContain('var(--gutter)');
    expect(taxonomyDiscovery).toContain('var(--container-max)');
    expect(taxonomyDiscovery).not.toContain('var(--space-gutter)');
    expect(taxonomyDiscovery).not.toContain('var(--container-wide)');
  });
});

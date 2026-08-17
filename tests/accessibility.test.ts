import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('accessibility foundations', () => {
  it('keeps the skip target visibly focusable', async () => {
    const css = await readFile('src/styles/global.css', 'utf8');

    expect(css).toContain(':where(main:focus-visible)');
    expect(css).toContain('outline: 0.1875rem solid var(--color-focus)');
    expect(css).not.toContain(':where(main:focus)');
  });

  it('keeps the document shell keyboard and landmark contracts', async () => {
    const layout = await readFile('src/layouts/BaseLayout.astro', 'utf8');

    expect(layout).toContain('href="#main-content"');
    expect(layout).toContain('<main id="main-content" tabindex="-1">');
    expect(layout).toContain('<SiteHeader');
    expect(layout).toContain('<SiteFooter');
  });
});

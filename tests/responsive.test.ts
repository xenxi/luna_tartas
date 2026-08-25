import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(process.cwd());

describe('responsive contract', () => {
  it('keeps the supported viewport and reduced-motion foundations', () => {
    const foundations = readFileSync(
      resolve(root, 'src/styles/foundations.css'),
      'utf8',
    );
    const ui = readFileSync(resolve(root, 'src/components/ui/ui.css'), 'utf8');
    const tokens = readFileSync(resolve(root, 'src/styles/tokens.css'), 'utf8');
    expect(foundations).toContain('width: min(100% - (2 * var(--gutter))');
    expect(foundations).toContain('prefers-reduced-motion: reduce');
    expect(ui).toContain('min-block-size: var(--button-min-block-size)');
    expect(tokens).toContain('--button-min-block-size: 3rem');
    expect(ui).toContain('.ornament--draw path');
  });

  it('keeps responsive verification as a reproducible package command', () => {
    const packageJson = readFileSync(resolve(root, 'package.json'), 'utf8');
    expect(packageJson).toContain(
      '"verify:responsive": "node scripts/verify-responsive.mjs"',
    );
  });

  it('allows only analytics, catalog search and the scoped product gallery module', () => {
    const artifact = readFileSync(
      resolve(root, 'scripts/verify-artifact.mjs'),
      'utf8',
    );
    const responsive = readFileSync(
      resolve(root, 'scripts/verify-responsive.mjs'),
      'utf8',
    );
    expect(artifact).toContain('Analytics(?:Consent|Instrumentation)');
    expect(responsive).toContain('Analytics(?:Consent|Instrumentation)');
    expect(responsive).toContain('isAllowedProductGalleryModule');
    expect(artifact).toContain('isAllowedProductGalleryModule');
    expect(responsive).toContain('isAllowedSearchModule');
    expect(artifact).toContain('isAllowedSearchModule');
    expect(responsive).toContain('[data-product-gallery]');
    expect(responsive).toContain('ProductGallery\\.astro_astro_type_script_');
    expect(artifact).toContain('ProductGallery\\.astro_astro_type_script_');
    expect(artifact).toContain('unexpected client asset');
    expect(responsive).toContain('JavaScript cliente no permitido');
  });

  it('wraps long breadcrumbs instead of requiring horizontal scrolling', () => {
    const navigation = readFileSync(
      resolve(root, 'src/components/navigation/navigation.css'),
      'utf8',
    );

    expect(navigation).toContain('flex-wrap: wrap');
    expect(navigation).toContain('overflow-wrap: anywhere');
    expect(navigation).not.toContain('overflow-x: auto');
    expect(navigation).not.toContain('min-inline-size: max-content');
  });
});

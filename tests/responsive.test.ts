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
    expect(foundations).toContain('width: min(100% - (2 * var(--gutter))');
    expect(foundations).toContain('prefers-reduced-motion: reduce');
    expect(ui).toContain('min-block-size: 2.75rem');
    expect(ui).toContain('.ornament--draw path');
  });

  it('keeps responsive verification as a reproducible package command', () => {
    const packageJson = readFileSync(resolve(root, 'package.json'), 'utf8');
    expect(packageJson).toContain(
      '"verify:responsive": "node scripts/verify-responsive.mjs"',
    );
  });
});

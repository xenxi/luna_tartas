import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const button = readFileSync('src/components/ui/Button.astro', 'utf8');
const actionLink = readFileSync('src/components/ui/ActionLink.astro', 'utf8');
const icon = readFileSync('src/components/ui/Icon.astro', 'utf8');
const badge = readFileSync('src/components/ui/Badge.astro', 'utf8');
const styles = readFileSync('src/components/ui/ui.css', 'utf8');

describe('UI primitives', () => {
  it('keeps actions native, keyboard-sized and non-hydrated', () => {
    expect(button).toContain('<button');
    expect(button).toContain('disabled={disabled}');
    expect(actionLink).toContain('<a');
    expect(actionLink).toContain('href={href}');
    expect(styles).toContain('min-block-size: 2.75rem');
    expect(styles).toContain('prefers-reduced-motion: reduce');
    expect(button).not.toContain('client:');
    expect(actionLink).not.toContain('client:');
  });

  it('exposes explicit variants and accessible icon modes', () => {
    expect(button).toContain("'primary' | 'secondary' | 'quiet'");
    expect(actionLink).toContain("'primary' | 'secondary' | 'quiet'");
    expect(icon).toContain("aria-hidden={label ? undefined : 'true'}");
    expect(icon).toContain("role={label ? 'img' : undefined}");
    expect(icon).toContain('focusable="false"');
    expect(badge).toContain("'neutral' | 'success' | 'error'");
  });
});

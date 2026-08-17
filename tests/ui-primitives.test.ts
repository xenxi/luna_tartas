import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const button = readFileSync('src/components/ui/Button.astro', 'utf8');
const actionLink = readFileSync('src/components/ui/ActionLink.astro', 'utf8');
const icon = readFileSync('src/components/ui/Icon.astro', 'utf8');
const ornament = readFileSync('src/components/ui/Ornament.astro', 'utf8');
const badge = readFileSync('src/components/ui/Badge.astro', 'utf8');
const styles = readFileSync('src/components/ui/ui.css', 'utf8');

describe('UI primitives', () => {
  it('keeps actions native, keyboard-sized and non-hydrated', () => {
    expect(button).toContain('<button');
    expect(button).toContain('disabled={disabled}');
    expect(actionLink).toContain('<a');
    expect(actionLink).toContain('href={href}');
    expect(styles).toContain('min-block-size: var(--button-min-block-size)');
    expect(styles).toContain('border-radius: var(--radius-action)');
    expect(styles).toContain('border: var(--border-action)');
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

  it('keeps the reduced ornament vocabulary decorative and local', () => {
    expect(ornament).toContain("'thread' | 'underline' | 'dots'");
    expect(ornament).toContain("motion?: 'none' | 'draw'");
    expect(ornament).toContain("'ornament--draw': motion === 'draw'");
    expect(ornament).toContain('aria-hidden="true"');
    expect(ornament).toContain('focusable="false"');
    expect(ornament).not.toContain('label?:');
    expect(ornament).not.toContain('client:');
    expect(styles).toContain('.ornament--thread');
    expect(styles).toContain('.ornament--underline');
    expect(styles).toContain('.ornament--dots');
    expect(styles).toContain('var(--ornament-stroke)');
    expect(styles).toContain('@supports (animation-timeline: view())');
    expect(styles).toContain('animation-range: entry 0% entry 100%');
    expect(styles).toContain('@keyframes ornament-draw');
    expect(styles).toContain('stroke-dashoffset: 0');
  });
});

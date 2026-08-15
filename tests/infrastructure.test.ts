import { describe, expect, it } from 'vitest';
import config from '../astro.config.mjs';
import { siteConfig } from '../src/config/site';

describe('Astro static build contract', () => {
  it('keeps the canonical static output settings', () => {
    expect(config.site).toBe(siteConfig.siteUrl);
    expect(config.output).toBe('static');
    expect(config.build?.format).toBe('directory');
    expect(config.trailingSlash).toBe('always');
  });
});

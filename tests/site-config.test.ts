import { describe, expect, it } from 'vitest';
import {
  CONTENT_STATUS,
  getCanonicalUrl,
  getPublishableText,
  siteConfig,
  validateSiteConfig,
} from '../src/config/site';

const validConfig = {
  siteUrl: 'https://example.com',
  locale: 'es-ES',
  brandName: { status: CONTENT_STATUS.ready, value: 'Marca aprobada' },
};

describe('site configuration', () => {
  it('normalizes validated technical identity', () => {
    expect(validateSiteConfig(validConfig)).toEqual({
      siteUrl: 'https://example.com',
      locale: 'es-ES',
      language: 'es',
      brandName: { status: CONTENT_STATUS.ready, value: 'Marca aprobada' },
    });
  });

  it.each([
    ['missing configuration', undefined],
    ['missing site URL', { ...validConfig, siteUrl: undefined }],
    ['relative site URL', { ...validConfig, siteUrl: '/relative/' }],
    ['insecure site URL', { ...validConfig, siteUrl: 'http://example.com' }],
    [
      'site URL with credentials',
      { ...validConfig, siteUrl: 'https://user:pass@example.com' },
    ],
    [
      'site URL with a path',
      { ...validConfig, siteUrl: 'https://example.com/store/' },
    ],
    ['invalid locale', { ...validConfig, locale: 'not_a_locale' }],
    ['non-canonical locale', { ...validConfig, locale: 'ES-es' }],
    ['missing brand status', { ...validConfig, brandName: {} }],
    [
      'value attached to a pending brand',
      {
        ...validConfig,
        brandName: { status: CONTENT_STATUS.pending, value: 'Not publicable' },
      },
    ],
    [
      'empty approved brand',
      {
        ...validConfig,
        brandName: { status: CONTENT_STATUS.ready, value: ' ' },
      },
    ],
    [
      'placeholder approved as a brand',
      {
        ...validConfig,
        brandName: { status: CONTENT_STATUS.ready, value: 'TBD marca' },
      },
    ],
  ])('rejects %s', (_case, config) => {
    expect(() => validateSiteConfig(config)).toThrow();
  });

  it('keeps pending brand content out of the public projection', () => {
    expect(siteConfig.brandName).toEqual({ status: CONTENT_STATUS.pending });
    expect(getPublishableText(siteConfig.brandName)).toBeUndefined();
  });

  it('derives canonical URLs from the configured origin', () => {
    expect(getCanonicalUrl('/')).toBe(`${siteConfig.siteUrl}/`);
    expect(getCanonicalUrl('/categoria/')).toBe(
      `${siteConfig.siteUrl}/categoria/`,
    );
    expect(getCanonicalUrl('/luna_tartas/', '/luna_tartas')).toBe(
      `${siteConfig.siteUrl}/`,
    );
    expect(getCanonicalUrl('/luna_tartas/categoria/', '/luna_tartas/')).toBe(
      `${siteConfig.siteUrl}/categoria/`,
    );
    expect(() => getCanonicalUrl('//attacker.example/')).toThrow(
      'Canonical pathname must start with exactly one slash',
    );
    expect(() => getCanonicalUrl('/otra/', '/luna_tartas')).toThrow(
      'Canonical pathname must be inside the deployment base',
    );
  });
});

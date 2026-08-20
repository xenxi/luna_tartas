import { describe, expect, it } from 'vitest';
import {
  CONTENT_STATUS,
  getCanonicalUrl,
  getPublishableText,
  siteConfig,
  validateAnalyticsConfig,
  validateSiteConfig,
} from '../src/config/site';

const validConfig = {
  siteUrl: 'https://example.com',
  locale: 'es-ES',
  brandName: { status: CONTENT_STATUS.ready, value: 'Marca aprobada' },
  brandAlternateName: {
    status: CONTENT_STATUS.ready,
    value: 'Marca alternativa aprobada',
  },
  organizationSameAs: ['https://www.instagram.com/marca/'],
  analytics: {
    enabled: false,
    provider: 'ga4',
    consentRequired: true,
  },
};

describe('site configuration', () => {
  it('normalizes validated technical identity', () => {
    expect(validateSiteConfig(validConfig)).toEqual({
      siteUrl: 'https://example.com',
      locale: 'es-ES',
      language: 'es',
      brandName: { status: CONTENT_STATUS.ready, value: 'Marca aprobada' },
      brandAlternateName: {
        status: CONTENT_STATUS.ready,
        value: 'Marca alternativa aprobada',
      },
      organizationSameAs: ['https://www.instagram.com/marca/'],
      analytics: {
        enabled: false,
        provider: 'ga4',
        consentRequired: true,
      },
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
      'missing alternate brand status',
      { ...validConfig, brandAlternateName: {} },
    ],
    [
      'missing organization profiles',
      { ...validConfig, organizationSameAs: {} },
    ],
    [
      'relative organization profile',
      { ...validConfig, organizationSameAs: ['/marca/'] },
    ],
    [
      'duplicate organization profile',
      {
        ...validConfig,
        organizationSameAs: [
          'https://www.instagram.com/marca/',
          'https://www.instagram.com/marca/',
        ],
      },
    ],
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

  it('exposes only the approved public brand identity', () => {
    expect(getPublishableText(siteConfig.brandName)).toBe('Luna Tartas');
    expect(getPublishableText(siteConfig.brandAlternateName)).toBe(
      'Luna Estudio',
    );
    expect(siteConfig.organizationSameAs).toEqual([
      'https://www.instagram.com/lunatartas/',
    ]);
    expect(siteConfig.analytics).toEqual({
      enabled: true,
      provider: 'ga4',
      measurementId: 'G-DV6KHV0YMW',
      consentRequired: true,
    });
  });

  it.each([
    ['missing analytics configuration', undefined],
    [
      'enabled analytics without a Measurement ID',
      {
        enabled: true,
        provider: 'ga4',
        consentRequired: true,
      },
    ],
    [
      'disabled analytics with a production identifier',
      {
        enabled: false,
        provider: 'ga4',
        measurementId: 'G-ABCDEFGHIJ',
        consentRequired: true,
      },
    ],
    [
      'analytics with an invalid Measurement ID',
      {
        enabled: true,
        provider: 'ga4',
        measurementId: 'UA-123456-1',
        consentRequired: true,
      },
    ],
    [
      'analytics without mandatory consent',
      {
        enabled: false,
        provider: 'ga4',
        consentRequired: false,
      },
    ],
  ])('rejects %s analytics configuration', (_case, analytics) => {
    expect(() => validateAnalyticsConfig(analytics)).toThrow();
  });

  it('allows a valid public GA4 Measurement ID only when enabled', () => {
    expect(
      validateAnalyticsConfig({
        enabled: true,
        provider: 'ga4',
        measurementId: 'G-ABCDEFGHIJ',
        consentRequired: true,
      }),
    ).toEqual({
      enabled: true,
      provider: 'ga4',
      measurementId: 'G-ABCDEFGHIJ',
      consentRequired: true,
    });
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

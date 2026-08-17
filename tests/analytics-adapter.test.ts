import { describe, expect, it } from 'vitest';
import type { AnalyticsConfig } from '../src/config/site';
import {
  createAnalyticsAdapter,
  type AnalyticsDocument,
} from '../src/lib/analytics/adapter';
import {
  getAnalyticsConsent,
  getStoredAnalyticsConsent,
  setAnalyticsConsent,
} from '../src/lib/analytics/consent';
import { sanitizeAnalyticsEvent } from '../src/lib/analytics/events';

interface FakeScript {
  id: string;
  src: string;
  defer: boolean;
  async: boolean;
  onload: (() => void) | null;
  onerror: (() => void) | null;
}

function createDocument() {
  const scripts: FakeScript[] = [];
  const document = {
    getElementById: (id: string) =>
      scripts.find((script) => script.id === id) ?? null,
    createElement: () => ({
      id: '',
      src: '',
      defer: false,
      async: false,
      onload: null,
      onerror: null,
    }),
    head: {
      append: (script: FakeScript) => scripts.push(script),
    },
  } as unknown as AnalyticsDocument;

  return { document, scripts };
}

const disabledConfig: AnalyticsConfig = {
  enabled: false,
  provider: 'matomo',
  consentRequired: true,
  retentionMonths: 13,
};

const enabledConfig: AnalyticsConfig = {
  enabled: true,
  provider: 'matomo',
  endpoint: 'https://metrics.example.com',
  siteId: 'luna-production',
  consentRequired: true,
  retentionMonths: 13,
};

const validProductEvent = {
  name: 'view_item',
  product_id: 'tarta-panales',
  product_name: 'Tarta de pañales',
  category: 'tartas-de-panales',
  source_page: '/productos/tarta-panales/',
  price: 49.95,
  currency: 'EUR',
};

describe('analytics adapter', () => {
  it('defaults consent to denied and tolerates unavailable preference storage', () => {
    const storage = new Map<string, string>();
    const consentStorage = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    };

    expect(getAnalyticsConsent()).toBe('denied');
    expect(getStoredAnalyticsConsent(consentStorage)).toBeUndefined();
    expect(setAnalyticsConsent('granted', consentStorage)).toBe('granted');
    expect(getAnalyticsConsent(consentStorage)).toBe('granted');
    expect(getStoredAnalyticsConsent(consentStorage)).toBe('granted');
    expect(
      setAnalyticsConsent('granted', {
        getItem: () => {
          throw new Error('blocked');
        },
        setItem: () => {
          throw new Error('blocked');
        },
      }),
    ).toBe('granted');
  });

  it('does not load a script or queue an event when analytics is disabled', async () => {
    const { document, scripts } = createDocument();
    const queue: unknown[][] = [];
    const adapter = createAnalyticsAdapter(disabledConfig, {
      document,
      queue,
      hasConsent: () => true,
    });

    expect(adapter.track(validProductEvent)).toBe(false);
    await expect(adapter.load()).resolves.toBe(false);
    expect(queue).toEqual([]);
    expect(scripts).toEqual([]);
  });

  it('does not load a script or queue an event before consent', async () => {
    const { document, scripts } = createDocument();
    const queue: unknown[][] = [];
    const adapter = createAnalyticsAdapter(enabledConfig, {
      document,
      queue,
      hasConsent: () => false,
    });

    expect(adapter.track(validProductEvent)).toBe(false);
    await expect(adapter.load()).resolves.toBe(false);
    expect(queue).toEqual([]);
    expect(scripts).toEqual([]);
  });

  it('queues only a sanitized event and loads Matomo deferred after consent', async () => {
    const { document, scripts } = createDocument();
    const queue: unknown[][] = [];
    const adapter = createAnalyticsAdapter(enabledConfig, {
      document,
      queue,
      hasConsent: () => true,
    });

    const loading = adapter.load();
    expect(scripts).toHaveLength(1);
    expect(scripts[0]).toMatchObject({
      id: 'luna-matomo-tracker',
      src: 'https://metrics.example.com/matomo.js',
      defer: true,
      async: true,
    });
    scripts[0].onload?.();
    await expect(loading).resolves.toBe(true);

    expect(adapter.track(validProductEvent)).toBe(true);
    expect(scripts).toHaveLength(1);
    expect(queue).toEqual([
      ['disableCookies'],
      ['setDoNotTrack', true],
      ['setTrackerUrl', 'https://metrics.example.com/matomo.php'],
      ['setSiteId', 'luna-production'],
      [
        'trackEvent',
        'conversion',
        'view_item',
        undefined,
        undefined,
        validProductEvent,
      ],
    ]);
  });

  it('rejects payloads that contain prohibited fields or invalid paths', () => {
    expect(
      sanitizeAnalyticsEvent({
        ...validProductEvent,
        phone: '+34697637180',
      }),
    ).toBeUndefined();
    expect(
      sanitizeAnalyticsEvent({
        ...validProductEvent,
        source_page: '/productos/tarta-panales/?email=cliente@example.com',
      }),
    ).toBeUndefined();
    expect(
      sanitizeAnalyticsEvent({
        name: 'custom_whatsapp_click',
        cta_location: 'site-footer',
        source_page: '/',
      }),
    ).toEqual({
      name: 'custom_whatsapp_click',
      cta_location: 'site-footer',
      source_page: '/',
    });
  });
});

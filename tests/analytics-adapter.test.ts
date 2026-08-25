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
import { createGtagDispatcher } from '../src/lib/analytics/adapter';
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
  provider: 'ga4',
  consentRequired: true,
};

const enabledConfig: AnalyticsConfig = {
  enabled: true,
  provider: 'ga4',
  measurementId: 'G-ABCDEFGHIJ',
  consentRequired: true,
};

const validProductEvent = {
  name: 'view_item',
  item_id: 'tarta-panales',
  item_name: 'Tarta de pañales',
  item_category: 'tartas-de-panales',
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
    const commands: unknown[][] = [];
    const adapter = createAnalyticsAdapter(disabledConfig, {
      document,
      dispatch: (...command) => commands.push(command),
      hasConsent: () => true,
      isProduction: () => true,
    });

    expect(adapter.track(validProductEvent)).toBe(false);
    await expect(adapter.load()).resolves.toBe(false);
    expect(commands).toEqual([]);
    expect(scripts).toEqual([]);
  });

  it('does not load a script or queue an event before consent', async () => {
    const { document, scripts } = createDocument();
    const commands: unknown[][] = [];
    const adapter = createAnalyticsAdapter(enabledConfig, {
      document,
      dispatch: (...command) => commands.push(command),
      hasConsent: () => false,
      isProduction: () => true,
    });

    expect(adapter.track(validProductEvent)).toBe(false);
    await expect(adapter.load()).resolves.toBe(false);
    expect(commands).toEqual([]);
    expect(scripts).toEqual([]);
  });

  it('dispatches one sanitized event and loads Google tag once after consent', async () => {
    const { document, scripts } = createDocument();
    const commands: unknown[][] = [];
    const adapter = createAnalyticsAdapter(enabledConfig, {
      document,
      dispatch: (...command) => commands.push(command),
      hasConsent: () => true,
      isProduction: () => true,
    });

    const loading = adapter.load();
    expect(scripts).toHaveLength(1);
    expect(scripts[0]).toMatchObject({
      id: 'luna-ga4-tracker',
      src: 'https://www.googletagmanager.com/gtag/js?id=G-ABCDEFGHIJ',
      defer: true,
      async: true,
    });
    scripts[0].onload?.();
    await expect(loading).resolves.toBe(true);

    expect(adapter.track(validProductEvent)).toBe(true);
    expect(scripts).toHaveLength(1);
    expect(commands).toHaveLength(3);
    expect(Array.from(commands[0])).toEqual(['js', expect.any(Date)]);
    expect(Array.from(commands[1])).toEqual([
      'config',
      'G-ABCDEFGHIJ',
      {
        allow_ad_personalization_signals: false,
        allow_google_signals: false,
        anonymize_ip: true,
        send_page_view: false,
      },
    ]);
    expect(Array.from(commands[2])).toEqual([
      'event',
      'view_item',
      {
        item_id: 'tarta-panales',
        item_name: 'Tarta de pañales',
        item_category: 'tartas-de-panales',
      },
    ]);
  });

  it('pushes arguments objects through a gtag-compatible dispatcher', () => {
    const dataLayer: unknown[] = [];
    const dispatch = createGtagDispatcher({ dataLayer });

    dispatch('event', 'page_view', { page_path: '/' });

    expect(dataLayer).toHaveLength(1);
    expect(Array.from(dataLayer[0] as ArrayLike<unknown>)).toEqual([
      'event',
      'page_view',
      { page_path: '/' },
    ]);
    expect(Array.isArray(dataLayer[0])).toBe(false);
  });

  it('does not track on localhost or non-production origins', async () => {
    const { document, scripts } = createDocument();
    const commands: unknown[][] = [];
    const adapter = createAnalyticsAdapter(enabledConfig, {
      document,
      dispatch: (...command) => commands.push(command),
      hasConsent: () => true,
      isProduction: () => false,
    });

    expect(adapter.track(validProductEvent)).toBe(false);
    await expect(adapter.load()).resolves.toBe(false);
    expect(commands).toEqual([]);
    expect(scripts).toEqual([]);
  });

  it('rejects payloads that contain prohibited fields or invalid paths', () => {
    expect(
      sanitizeAnalyticsEvent({
        name: 'page_view',
        page_path: '/productos/?email=cliente@example.com',
      }),
    ).toBeUndefined();
    expect(
      sanitizeAnalyticsEvent({
        name: 'page_view',
        page_path: '/productos/#contacto',
      }),
    ).toBeUndefined();
    expect(
      sanitizeAnalyticsEvent({
        ...validProductEvent,
        phone: '+34697637180',
      }),
    ).toBeUndefined();
    expect(
      sanitizeAnalyticsEvent({
        ...validProductEvent,
        item_name: 'cliente@example.com',
      }),
    ).toBeUndefined();
    expect(
      sanitizeAnalyticsEvent({
        name: 'contact_whatsapp',
        source: 'site-footer',
      }),
    ).toEqual({
      name: 'contact_whatsapp',
      source: 'site-footer',
    });
    expect(
      sanitizeAnalyticsEvent({
        name: 'contact_whatsapp',
        source: 'site-footer',
        phone: '+34697637180',
      }),
    ).toBeUndefined();
    expect(
      sanitizeAnalyticsEvent({
        name: 'contact_whatsapp',
        source: 'site-footer',
        message: 'Quiero una tarta',
      }),
    ).toBeUndefined();
    expect(
      sanitizeAnalyticsEvent({
        name: 'search_query',
        query_length: 7,
        result_count: 4,
      }),
    ).toEqual({
      name: 'search_query',
      query_length: 7,
      result_count: 4,
    });
    expect(
      sanitizeAnalyticsEvent({
        name: 'search_query',
        query: 'cliente@example.com',
        query_length: 19,
        result_count: 0,
      }),
    ).toBeUndefined();
  });
});

import type { AnalyticsConfig } from '../../config/site';
import { getAnalyticsConsent } from './consent';
import {
  createAnalyticsAdapter,
  createGtagDispatcher,
  type AnalyticsDocument,
  type AnalyticsWindow,
} from './adapter';

function createBrowserRuntime(document: Document, window: Window) {
  const browserWindow = window as Window & AnalyticsWindow;
  let storage: Storage | undefined;

  try {
    storage = window.localStorage;
  } catch {
    storage = undefined;
  }

  return {
    document: document as AnalyticsDocument,
    dispatch: createGtagDispatcher(browserWindow),
    hasConsent: () => getAnalyticsConsent(storage) === 'granted',
    isProduction: () =>
      window.location.protocol === 'https:' &&
      window.location.hostname === 'lunatartas.es',
  };
}

function eventFromElement(
  element: HTMLElement,
  name: 'view_item' | 'contact_whatsapp',
): Record<string, unknown> | undefined {
  const { dataset } = element;
  const isProductEvent =
    name === 'view_item' || dataset.analyticsProductId !== undefined;
  const productId = dataset.analyticsProductId;
  const productName = dataset.analyticsProductName;
  const category = dataset.analyticsCategory;
  const event: Record<string, unknown> = { name };

  if (isProductEvent) {
    if (
      productId === undefined ||
      productName === undefined ||
      category === undefined
    ) {
      return undefined;
    }

    event.item_id = productId;
    event.item_name = productName;
    event.item_category = category;
  }

  if (name === 'contact_whatsapp') {
    if (dataset.analyticsCtaLocation === undefined) return undefined;
    event.source = dataset.analyticsCtaLocation;
  }

  return event;
}

export function bindAnalyticsInstrumentation(
  config: AnalyticsConfig,
  document: Document,
  window: Window,
): void {
  if (!config.enabled) return;

  const adapter = createAnalyticsAdapter(
    config,
    createBrowserRuntime(document, window),
  );
  let currentPageTracked = false;

  const trackCurrentPage = () => {
    if (currentPageTracked) return;
    currentPageTracked = true;

    trackSafely(adapter, {
      name: 'page_view',
      page_path: document.location.pathname,
    });

    document
      .querySelectorAll<HTMLElement>('[data-analytics-view-item]')
      .forEach((element) => {
        const event = eventFromElement(element, 'view_item');
        if (event !== undefined) trackSafely(adapter, event);
      });
  };

  trackCurrentPage();
  window.addEventListener('luna-analytics-consent-granted', trackCurrentPage, {
    once: true,
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest<HTMLElement>(
      '[data-analytics-contact-whatsapp]',
    );
    if (link === null) return;

    const payload = eventFromElement(link, 'contact_whatsapp');
    if (payload !== undefined) trackSafely(adapter, payload);
  });

  document.addEventListener('luna-analytics', (event) => {
    if (!(event instanceof CustomEvent)) return;
    if (typeof event.detail !== 'object' || event.detail === null) return;
    trackSafely(adapter, event.detail as Record<string, unknown>);
  });
}

export function trackSafely(
  adapter: ReturnType<typeof createAnalyticsAdapter>,
  event: Record<string, unknown>,
): void {
  try {
    adapter.track(event);
  } catch {
    // Analytics must never prevent the native link navigation.
  }
}

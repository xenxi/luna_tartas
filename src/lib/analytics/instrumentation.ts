import type { AnalyticsConfig } from '../../config/site';
import { getAnalyticsConsent } from './consent';
import { createAnalyticsAdapter, type AnalyticsDocument } from './adapter';

export interface AnalyticsWindow {
  _paq?: unknown[][];
}

function createBrowserRuntime(document: Document, window: Window) {
  const browserWindow = window as Window & AnalyticsWindow;
  const queue = (browserWindow._paq ??= []);
  let storage: Storage | undefined;

  try {
    storage = window.localStorage;
  } catch {
    storage = undefined;
  }

  return {
    document: document as AnalyticsDocument,
    queue,
    hasConsent: () => getAnalyticsConsent(storage) === 'granted',
  };
}

function eventFromElement(
  element: HTMLElement,
  name:
    'view_item' | 'select_item' | 'whatsapp_click' | 'custom_whatsapp_click',
): Record<string, unknown> | undefined {
  const { dataset } = element;
  const isProductEvent =
    name === 'view_item' || name === 'select_item' || name === 'whatsapp_click';
  const productId = dataset.analyticsProductId;
  const productName = dataset.analyticsProductName;
  const category = dataset.analyticsCategory;
  const sourcePage = dataset.analyticsSourcePage;

  if (sourcePage === undefined) {
    return undefined;
  }

  const event: Record<string, unknown> = {
    name,
    source_page: sourcePage,
  };

  if (isProductEvent) {
    if (
      productId === undefined ||
      productName === undefined ||
      category === undefined
    ) {
      return undefined;
    }

    event.product_id = productId;
    event.product_name = productName;
    event.category = category;
  }

  if (dataset.analyticsPrice !== undefined) {
    const price = Number(dataset.analyticsPrice);
    if (!Number.isFinite(price)) return undefined;
    event.price = price;
    event.currency = dataset.analyticsCurrency;
  }

  if (name === 'select_item') {
    const position = Number(dataset.analyticsPosition);
    if (
      dataset.analyticsListId === undefined ||
      !Number.isSafeInteger(position)
    ) {
      return undefined;
    }
    event.list_id = dataset.analyticsListId;
    event.position = position;
  }

  if (name === 'whatsapp_click' || name === 'custom_whatsapp_click') {
    if (dataset.analyticsCtaLocation === undefined) return undefined;
    event.cta_location = dataset.analyticsCtaLocation;
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

  document
    .querySelectorAll<HTMLElement>('[data-analytics-view-item]')
    .forEach((element) => {
      const event = eventFromElement(element, 'view_item');
      if (event !== undefined) trackSafely(adapter, event);
    });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest<HTMLElement>(
      '[data-analytics-select-item], [data-analytics-whatsapp-click], [data-analytics-custom-whatsapp-click]',
    );
    if (link === null) return;

    const name =
      link.dataset.analyticsWhatsappClick !== undefined
        ? 'whatsapp_click'
        : link.dataset.analyticsCustomWhatsappClick !== undefined
          ? 'custom_whatsapp_click'
          : 'select_item';
    const payload = eventFromElement(link, name);
    if (payload !== undefined) trackSafely(adapter, payload);
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

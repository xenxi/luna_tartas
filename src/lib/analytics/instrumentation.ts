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
  name: 'view_item' | 'select_item',
): Record<string, unknown> | undefined {
  const { dataset } = element;
  const productId = dataset.analyticsProductId;
  const productName = dataset.analyticsProductName;
  const category = dataset.analyticsCategory;
  const sourcePage = dataset.analyticsSourcePage;

  if (
    productId === undefined ||
    productName === undefined ||
    category === undefined ||
    sourcePage === undefined
  ) {
    return undefined;
  }

  const event: Record<string, unknown> = {
    name,
    product_id: productId,
    product_name: productName,
    category,
    source_page: sourcePage,
  };

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
      if (event !== undefined) adapter.track(event);
    });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest<HTMLElement>('[data-analytics-select-item]');
    if (link === null) return;

    const payload = eventFromElement(link, 'select_item');
    if (payload !== undefined) adapter.track(payload);
  });
}

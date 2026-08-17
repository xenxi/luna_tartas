import type { AnalyticsConfig } from '../../config/site';
import {
  getAnalyticsConsent,
  getStoredAnalyticsConsent,
  setAnalyticsConsent,
  type ConsentStorage,
} from './consent';
import { createAnalyticsAdapter } from './adapter';

export interface AnalyticsWindow {
  _paq?: unknown[][];
}

function createBrowserRuntime(
  document: Document,
  window: Window,
  storage?: ConsentStorage,
) {
  const browserWindow = window as Window & AnalyticsWindow;
  const queue = (browserWindow._paq ??= []);
  return {
    document,
    queue,
    hasConsent: () => getAnalyticsConsent(storage) === 'granted',
  };
}

export function bindAnalyticsConsentUi(
  config: AnalyticsConfig,
  document: Document,
  window: Window,
  storage?: ConsentStorage,
): void {
  const root = document.getElementById('analytics-consent');
  const reopen = document.getElementById('analytics-consent-reopen');
  if (root === null || reopen === null || !config.enabled) return;

  const accept = root.querySelector<HTMLButtonElement>(
    '[data-analytics-consent="accept"]',
  );
  const reject = root.querySelector<HTMLButtonElement>(
    '[data-analytics-consent="reject"]',
  );
  const revoke = root.querySelector<HTMLButtonElement>(
    '[data-analytics-consent="revoke"]',
  );
  if (accept === null || reject === null || revoke === null) return;

  const adapter = createAnalyticsAdapter(
    config,
    createBrowserRuntime(document, window, storage),
  );
  const sync = () => {
    const consent = getStoredAnalyticsConsent(storage);
    root.hidden = consent !== undefined;
    reopen.hidden = consent === undefined;
    revoke.hidden = consent !== 'granted';
    if (consent === 'granted') void adapter.load();
  };

  accept.addEventListener('click', () => {
    setAnalyticsConsent('granted', storage);
    sync();
  });
  reject.addEventListener('click', () => {
    setAnalyticsConsent('denied', storage);
    sync();
  });
  revoke.addEventListener('click', () => {
    setAnalyticsConsent('denied', storage);
    sync();
  });
  reopen.addEventListener('click', () => {
    root.hidden = false;
    reopen.hidden = true;
  });

  sync();
}

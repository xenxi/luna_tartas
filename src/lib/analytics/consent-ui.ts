import type { AnalyticsConfig } from '../../config/site';
import {
  getStoredAnalyticsConsent,
  setAnalyticsConsent,
  type ConsentStorage,
} from './consent';

export function bindAnalyticsConsentUi(
  config: AnalyticsConfig,
  document: Document,
  window: Window,
  storage?: ConsentStorage,
): void {
  if (storage === undefined) {
    try {
      storage = window.localStorage;
    } catch {
      storage = undefined;
    }
  }

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

  const sync = () => {
    const consent = getStoredAnalyticsConsent(storage);
    root.hidden = consent !== undefined;
    reopen.hidden = consent === undefined;
    revoke.hidden = consent !== 'granted';
  };

  accept.addEventListener('click', () => {
    setAnalyticsConsent('granted', storage);
    sync();
    window.dispatchEvent(new Event('luna-analytics-consent-granted'));
  });
  reject.addEventListener('click', () => {
    setAnalyticsConsent('denied', storage);
    sync();
  });
  revoke.addEventListener('click', () => {
    setAnalyticsConsent('denied', storage);
    window.location.reload();
  });
  reopen.addEventListener('click', () => {
    root.hidden = false;
    reopen.hidden = true;
  });

  sync();
}

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
  const status = document.getElementById('analytics-consent-status');
  const reopen = document.getElementById('analytics-consent-reopen');
  if (root === null || status === null || reopen === null || !config.enabled)
    return;

  const accept = root.querySelector<HTMLButtonElement>(
    '[data-analytics-consent="accept"]',
  );
  const reject = root.querySelector<HTMLButtonElement>(
    '[data-analytics-consent="reject"]',
  );
  const revoke = root.querySelector<HTMLButtonElement>(
    '[data-analytics-consent="revoke"]',
  );
  const grantedStatus = status.querySelector<HTMLElement>(
    '[data-analytics-consent-status="granted"]',
  );
  const deniedStatus = status.querySelector<HTMLElement>(
    '[data-analytics-consent-status="denied"]',
  );
  if (
    accept === null ||
    reject === null ||
    revoke === null ||
    grantedStatus === null ||
    deniedStatus === null
  )
    return;

  const sync = () => {
    const consent = getStoredAnalyticsConsent(storage);
    root.hidden = consent !== undefined;
    status.hidden = consent === undefined;
    reopen.hidden = consent === undefined;
    revoke.hidden = consent !== 'granted';
    grantedStatus.hidden = consent !== 'granted';
    deniedStatus.hidden = consent !== 'denied';
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
    status.hidden = true;
  });

  sync();
}

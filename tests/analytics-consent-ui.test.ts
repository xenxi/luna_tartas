import { describe, expect, it } from 'vitest';
import type { AnalyticsConfig } from '../src/config/site';
import { bindAnalyticsConsentUi } from '../src/lib/analytics/consent-ui';

class FakeControl {
  hidden = false;
  readonly dataset: Record<string, string> = {};
  private readonly listeners = new Map<string, () => void>();

  addEventListener(type: string, listener: () => void): void {
    this.listeners.set(type, listener);
  }

  click(): void {
    this.listeners.get('click')?.();
  }
}

const config: AnalyticsConfig = {
  enabled: true,
  provider: 'ga4',
  measurementId: 'G-ABCDEFGHIJ',
  consentRequired: true,
};

describe('analytics consent UI state', () => {
  it('fixes only the undecided state and returns decisions or editing to normal flow', () => {
    const region = new FakeControl();
    const accept = new FakeControl();
    const reject = new FakeControl();
    const revoke = new FakeControl();
    const granted = new FakeControl();
    const denied = new FakeControl();
    const reopen = new FakeControl();

    const root = Object.assign(new FakeControl(), {
      closest: () => region,
      querySelector: (selector: string) =>
        selector.includes('accept')
          ? accept
          : selector.includes('reject')
            ? reject
            : selector.includes('revoke')
              ? revoke
              : null,
    });
    const status = Object.assign(new FakeControl(), {
      querySelector: (selector: string) =>
        selector.includes('granted') ? granted : denied,
    });
    const elements: Record<string, FakeControl> = {
      'analytics-consent': root,
      'analytics-consent-status': status,
      'analytics-consent-reopen': reopen,
    };
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    };

    bindAnalyticsConsentUi(
      config,
      {
        getElementById: (id: string) => elements[id] ?? null,
      } as unknown as Document,
      {} as Window,
      storage,
    );

    expect(region.dataset.analyticsConsentState).toBe('pending');
    expect(root.hidden).toBe(false);
    expect(status.hidden).toBe(true);

    reject.click();
    expect(region.dataset.analyticsConsentState).toBe('decided');
    expect(root.hidden).toBe(true);
    expect(status.hidden).toBe(false);

    reopen.click();
    expect(region.dataset.analyticsConsentState).toBe('editing');
    expect(root.hidden).toBe(false);
    expect(status.hidden).toBe(true);
  });
});

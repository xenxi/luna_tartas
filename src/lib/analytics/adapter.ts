import type { AnalyticsConfig } from '../../config/site';
import { sanitizeAnalyticsEvent, type AnalyticsEvent } from './events';

export const MATOMO_TRACKER_SCRIPT_ID = 'luna-matomo-tracker';

export type AnalyticsDocument = Pick<
  Document,
  'getElementById' | 'createElement' | 'head'
>;

export interface AnalyticsRuntime {
  document: AnalyticsDocument;
  queue: unknown[][];
  hasConsent(): boolean;
}

export interface AnalyticsAdapter {
  load(): Promise<boolean>;
  track(event: unknown): boolean;
}

function hasActiveMatomoConfig(
  config: AnalyticsConfig,
): config is AnalyticsConfig & {
  enabled: true;
  endpoint: string;
  siteId: string;
} {
  return (
    config.enabled &&
    typeof config.endpoint === 'string' &&
    typeof config.siteId === 'string' &&
    config.consentRequired
  );
}

function configureMatomo(
  config: AnalyticsConfig & { enabled: true; endpoint: string; siteId: string },
  queue: unknown[][],
): void {
  const trackerUrl = new URL('matomo.php', `${config.endpoint}/`).href;

  if (queue.some((command) => command[0] === 'setSiteId')) return;

  queue.push(
    ['disableCookies'],
    ['setDoNotTrack', true],
    ['setTrackerUrl', trackerUrl],
    ['setSiteId', config.siteId],
  );
}

function appendTracker(
  config: AnalyticsConfig & { enabled: true; endpoint: string; siteId: string },
  document: AnalyticsDocument,
): Promise<boolean> {
  if (document.getElementById(MATOMO_TRACKER_SCRIPT_ID)) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.id = MATOMO_TRACKER_SCRIPT_ID;
    script.src = new URL('matomo.js', `${config.endpoint}/`).href;
    script.defer = true;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.append(script);
  });
}

function toMatomoCommand(event: AnalyticsEvent): unknown[] {
  return ['trackEvent', 'conversion', event.name, undefined, undefined, event];
}

export function createAnalyticsAdapter(
  config: AnalyticsConfig,
  runtime: AnalyticsRuntime,
): AnalyticsAdapter {
  const activeConfig = hasActiveMatomoConfig(config) ? config : undefined;
  const canUseAnalytics = () =>
    activeConfig !== undefined && runtime.hasConsent();

  return Object.freeze({
    load(): Promise<boolean> {
      if (!canUseAnalytics()) return Promise.resolve(false);

      if (activeConfig === undefined) return Promise.resolve(false);

      configureMatomo(activeConfig, runtime.queue);
      return appendTracker(activeConfig, runtime.document);
    },

    track(event: unknown): boolean {
      if (!canUseAnalytics()) return false;

      const sanitizedEvent = sanitizeAnalyticsEvent(event);
      if (sanitizedEvent === undefined) return false;

      if (activeConfig === undefined) return false;

      configureMatomo(activeConfig, runtime.queue);
      runtime.queue.push(toMatomoCommand(sanitizedEvent));
      void appendTracker(activeConfig, runtime.document);
      return true;
    },
  });
}

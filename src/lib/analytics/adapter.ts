import type { AnalyticsConfig } from '../../config/site';
import { sanitizeAnalyticsEvent } from './events';

export const GA4_TRACKER_SCRIPT_ID = 'luna-ga4-tracker';

export type AnalyticsDocument = Pick<
  Document,
  'getElementById' | 'createElement' | 'head'
>;

export interface AnalyticsRuntime {
  document: AnalyticsDocument;
  dispatch(...command: unknown[]): void;
  hasConsent(): boolean;
  isProduction(): boolean;
}

export interface AnalyticsAdapter {
  load(): Promise<boolean>;
  track(event: unknown): boolean;
}

function hasActiveGa4Config(
  config: AnalyticsConfig,
): config is AnalyticsConfig & {
  enabled: true;
  measurementId: string;
} {
  return (
    config.enabled &&
    config.provider === 'ga4' &&
    typeof config.measurementId === 'string' &&
    config.consentRequired
  );
}

function configureGa4(
  config: AnalyticsConfig & { enabled: true; measurementId: string },
  runtime: AnalyticsRuntime,
): void {
  runtime.dispatch('js', new Date());
  runtime.dispatch('config', config.measurementId, {
    allow_ad_personalization_signals: false,
    allow_google_signals: false,
    anonymize_ip: true,
    send_page_view: false,
  });
}

function appendTracker(
  config: AnalyticsConfig & { enabled: true; measurementId: string },
  document: AnalyticsDocument,
): Promise<boolean> {
  if (document.getElementById(GA4_TRACKER_SCRIPT_ID)) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.id = GA4_TRACKER_SCRIPT_ID;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.measurementId)}`;
    script.defer = true;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.append(script);
  });
}

export function createAnalyticsAdapter(
  config: AnalyticsConfig,
  runtime: AnalyticsRuntime,
): AnalyticsAdapter {
  const activeConfig = hasActiveGa4Config(config) ? config : undefined;
  const canUseAnalytics = () =>
    activeConfig !== undefined &&
    runtime.hasConsent() &&
    runtime.isProduction();
  let configured = false;

  const configure = () => {
    if (configured || activeConfig === undefined) return;
    configureGa4(activeConfig, runtime);
    configured = true;
  };

  return Object.freeze({
    load(): Promise<boolean> {
      if (!canUseAnalytics()) return Promise.resolve(false);

      if (activeConfig === undefined) return Promise.resolve(false);

      configure();
      return appendTracker(activeConfig, runtime.document);
    },

    track(event: unknown): boolean {
      if (!canUseAnalytics()) return false;

      const sanitizedEvent = sanitizeAnalyticsEvent(event);
      if (sanitizedEvent === undefined) return false;

      if (activeConfig === undefined) return false;

      configure();
      const { name, ...parameters } = sanitizedEvent;
      runtime.dispatch('event', name, parameters);
      void appendTracker(activeConfig, runtime.document);
      return true;
    },
  });
}

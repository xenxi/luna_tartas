export type AnalyticsEventName = 'page_view' | 'view_item' | 'contact_whatsapp';

interface ProductEventPayload {
  item_id: string;
  item_name: string;
  item_category: string;
}

export type AnalyticsEvent =
  | { name: 'page_view'; page_path: string }
  | ({ name: 'view_item' } & ProductEventPayload)
  | ({
      name: 'contact_whatsapp';
      source: string;
    } & Partial<ProductEventPayload>);

const safeIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const safeTokenPattern = /^[a-z0-9][a-z0-9_-]{0,79}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSafeText(value: unknown, maximumLength: number): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length <= maximumLength &&
    value === value.trim() &&
    !/[\r\n\t]/.test(value) &&
    !/@/.test(value)
  );
}

function isCanonicalPath(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    (value === '/' || /^\/[a-z0-9/-]+\/$/.test(value)) &&
    !value.startsWith('//')
  );
}

function hasOnlyKeys(value: Record<string, unknown>, keys: readonly string[]) {
  return Object.keys(value).every((key) => keys.includes(key));
}

function hasProductPayload(
  value: Record<string, unknown>,
): value is Record<string, unknown> & ProductEventPayload {
  return (
    typeof value.item_id === 'string' &&
    safeIdPattern.test(value.item_id) &&
    isSafeText(value.item_name, 160) &&
    typeof value.item_category === 'string' &&
    safeIdPattern.test(value.item_category)
  );
}

export function sanitizeAnalyticsEvent(
  value: unknown,
): AnalyticsEvent | undefined {
  if (!isRecord(value) || typeof value.name !== 'string') return undefined;

  if (
    value.name === 'page_view' &&
    hasOnlyKeys(value, ['name', 'page_path']) &&
    isCanonicalPath(value.page_path)
  ) {
    return { name: 'page_view', page_path: value.page_path };
  }

  if (
    value.name === 'view_item' &&
    hasOnlyKeys(value, ['name', 'item_id', 'item_name', 'item_category']) &&
    hasProductPayload(value)
  ) {
    return {
      name: 'view_item',
      item_id: value.item_id,
      item_name: value.item_name,
      item_category: value.item_category,
    };
  }

  if (value.name === 'contact_whatsapp') {
    const productKeys = ['item_id', 'item_name', 'item_category'];
    const presentProductKeys = productKeys.filter((key) => key in value);
    if (
      !hasOnlyKeys(value, ['name', 'source', ...productKeys]) ||
      typeof value.source !== 'string' ||
      !safeTokenPattern.test(value.source) ||
      (presentProductKeys.length !== 0 &&
        (presentProductKeys.length !== productKeys.length ||
          !hasProductPayload(value)))
    ) {
      return undefined;
    }

    return {
      name: 'contact_whatsapp',
      source: value.source,
      ...(presentProductKeys.length === 0
        ? {}
        : {
            item_id: value.item_id,
            item_name: value.item_name,
            item_category: value.item_category,
          }),
    } as AnalyticsEvent;
  }

  return undefined;
}

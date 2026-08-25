export type AnalyticsEventName =
  | 'page_view'
  | 'view_item'
  | 'contact_whatsapp'
  | 'search_open'
  | 'search_query'
  | 'search_result_click'
  | 'search_no_results'
  | 'search_view_all';

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
    } & Partial<ProductEventPayload>)
  | { name: 'search_open'; source: string }
  | {
      name: 'search_query';
      query_length: number;
      result_count: number;
    }
  | {
      name: 'search_result_click';
      result_type: 'product' | 'category' | 'occasion' | 'recipient';
      result_id: string;
      result_position: number;
      query_length: number;
    }
  | { name: 'search_no_results'; query_length: number }
  | {
      name: 'search_view_all';
      query_length: number;
      result_count: number;
    };

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

function isSafeInteger(
  value: unknown,
  minimum: number,
  maximum: number,
): value is number {
  return (
    typeof value === 'number' &&
    Number.isSafeInteger(value) &&
    value >= minimum &&
    value <= maximum
  );
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

  if (
    value.name === 'search_open' &&
    hasOnlyKeys(value, ['name', 'source']) &&
    typeof value.source === 'string' &&
    safeTokenPattern.test(value.source)
  ) {
    return { name: 'search_open', source: value.source };
  }

  if (
    (value.name === 'search_query' || value.name === 'search_view_all') &&
    hasOnlyKeys(value, ['name', 'query_length', 'result_count']) &&
    isSafeInteger(value.query_length, 2, 120) &&
    isSafeInteger(value.result_count, 0, 10_000)
  ) {
    return {
      name: value.name,
      query_length: value.query_length,
      result_count: value.result_count,
    };
  }

  if (
    value.name === 'search_no_results' &&
    hasOnlyKeys(value, ['name', 'query_length']) &&
    isSafeInteger(value.query_length, 2, 120)
  ) {
    return { name: 'search_no_results', query_length: value.query_length };
  }

  if (
    value.name === 'search_result_click' &&
    hasOnlyKeys(value, [
      'name',
      'result_type',
      'result_id',
      'result_position',
      'query_length',
    ]) &&
    (value.result_type === 'product' ||
      value.result_type === 'category' ||
      value.result_type === 'occasion' ||
      value.result_type === 'recipient') &&
    typeof value.result_id === 'string' &&
    safeIdPattern.test(value.result_id) &&
    isSafeInteger(value.result_position, 1, 10_000) &&
    isSafeInteger(value.query_length, 2, 120)
  ) {
    return {
      name: 'search_result_click',
      result_type: value.result_type,
      result_id: value.result_id,
      result_position: value.result_position,
      query_length: value.query_length,
    };
  }

  return undefined;
}

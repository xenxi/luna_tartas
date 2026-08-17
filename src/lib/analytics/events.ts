export type AnalyticsEventName =
  'view_item' | 'select_item' | 'whatsapp_click' | 'custom_whatsapp_click';

interface ProductEventPayload {
  product_id: string;
  product_name: string;
  category: string;
  source_page: string;
  price?: number;
  currency?: string;
}

export type AnalyticsEvent =
  | ({ name: 'view_item' } & ProductEventPayload)
  | ({
      name: 'select_item';
      list_id: string;
      position: number;
    } & ProductEventPayload)
  | ({
      name: 'whatsapp_click';
      cta_location: string;
    } & ProductEventPayload)
  | {
      name: 'custom_whatsapp_click';
      cta_location: string;
      source_page: string;
    };

const productEventNames = new Set<AnalyticsEventName>([
  'view_item',
  'select_item',
  'whatsapp_click',
]);

const safeIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const safeTokenPattern = /^[a-z0-9][a-z0-9_-]{0,79}$/;
const currencyPattern = /^[A-Z]{3}$/;

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

function hasValidPrice(value: Record<string, unknown>): boolean {
  const hasPrice = 'price' in value;
  const hasCurrency = 'currency' in value;

  if (hasPrice !== hasCurrency) return false;
  if (!hasPrice) return true;

  return (
    typeof value.price === 'number' &&
    Number.isFinite(value.price) &&
    value.price > 0 &&
    Number.isSafeInteger(value.price * 100) &&
    typeof value.currency === 'string' &&
    currencyPattern.test(value.currency)
  );
}

function hasProductPayload(value: Record<string, unknown>): boolean {
  return (
    typeof value.product_id === 'string' &&
    safeIdPattern.test(value.product_id) &&
    isSafeText(value.product_name, 160) &&
    typeof value.category === 'string' &&
    safeIdPattern.test(value.category) &&
    isCanonicalPath(value.source_page) &&
    hasValidPrice(value)
  );
}

export function sanitizeAnalyticsEvent(
  value: unknown,
): AnalyticsEvent | undefined {
  if (!isRecord(value) || typeof value.name !== 'string') return undefined;

  if (productEventNames.has(value.name as AnalyticsEventName)) {
    const allowedKeys = [
      'name',
      'product_id',
      'product_name',
      'category',
      'source_page',
      'price',
      'currency',
    ];

    if (value.name === 'select_item') {
      allowedKeys.push('list_id', 'position');
    }

    if (value.name === 'whatsapp_click') {
      allowedKeys.push('cta_location');
    }

    if (!hasOnlyKeys(value, allowedKeys) || !hasProductPayload(value)) {
      return undefined;
    }

    const productPayload = {
      product_id: value.product_id,
      product_name: value.product_name,
      category: value.category,
      source_page: value.source_page,
      ...(value.price === undefined
        ? {}
        : { price: value.price, currency: value.currency }),
    } as ProductEventPayload;

    if (value.name === 'view_item') {
      return { name: 'view_item', ...productPayload };
    }

    if (
      value.name === 'select_item' &&
      typeof value.list_id === 'string' &&
      safeTokenPattern.test(value.list_id) &&
      typeof value.position === 'number' &&
      Number.isSafeInteger(value.position) &&
      value.position > 0
    ) {
      return {
        name: 'select_item',
        ...productPayload,
        list_id: value.list_id,
        position: value.position,
      };
    }

    if (
      value.name === 'whatsapp_click' &&
      typeof value.cta_location === 'string' &&
      safeTokenPattern.test(value.cta_location)
    ) {
      return {
        name: 'whatsapp_click',
        ...productPayload,
        cta_location: value.cta_location,
      };
    }

    return undefined;
  }

  if (
    value.name === 'custom_whatsapp_click' &&
    hasOnlyKeys(value, ['name', 'cta_location', 'source_page']) &&
    typeof value.cta_location === 'string' &&
    safeTokenPattern.test(value.cta_location) &&
    isCanonicalPath(value.source_page)
  ) {
    return {
      name: 'custom_whatsapp_click',
      cta_location: value.cta_location,
      source_page: value.source_page,
    };
  }

  return undefined;
}

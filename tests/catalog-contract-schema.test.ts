import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function schema(name: string): unknown {
  return JSON.parse(readFileSync(`schemas/${name}.schema.json`, 'utf8'));
}

function valuesForKey(value: unknown, key: string): unknown[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => valuesForKey(item, key));
  }
  if (value === null || typeof value !== 'object') return [];
  return Object.entries(value).flatMap(([current, child]) => [
    ...(current === key ? [child] : []),
    ...valuesForKey(child, key),
  ]);
}

describe('generated catalog contract', () => {
  it('publishes a versioned product schema with archived and inventory', () => {
    const product = schema('product') as Record<string, unknown>;

    expect(product['x-contractVersion']).toBe('2.0.0');
    expect(valuesForKey(product, 'const')).toEqual(
      expect.arrayContaining([
        'draft',
        'published',
        'archived',
        'made-to-order',
        'stock',
        'unavailable',
      ]),
    );
  });

  it('publishes the same version on the standalone inventory schema', () => {
    const inventory = schema('inventory') as Record<string, unknown>;

    expect(inventory['x-contractVersion']).toBe('2.0.0');
    expect(valuesForKey(inventory, 'const')).toEqual(
      expect.arrayContaining(['made-to-order', 'stock', 'unavailable']),
    );
  });
});

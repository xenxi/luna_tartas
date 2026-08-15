import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getCollection } = vi.hoisted(() => ({
  getCollection: vi.fn(async (_collection: string) => []),
}));

vi.mock('astro:content', () => ({ getCollection }));

import { loadCatalog } from '../src/lib/catalog/source/load';

describe('catalog source loading', () => {
  beforeEach(() => {
    getCollection.mockClear();
  });

  it('loads every collection once and reuses one catalog promise', async () => {
    const first = loadCatalog();
    const second = loadCatalog();

    expect(second).toBe(first);
    await expect(first).resolves.toEqual({
      categories: [],
      occasions: [],
      recipients: [],
      products: [],
    });
    expect(getCollection.mock.calls.map(([collection]) => collection)).toEqual([
      'categories',
      'occasions',
      'recipients',
      'products',
    ]);
  });
});

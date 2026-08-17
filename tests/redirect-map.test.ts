import { describe, expect, it } from 'vitest';
import {
  loadRedirectMap,
  validateRedirectMap,
} from '../scripts/redirect-map.mjs';
import legacyGoneWorker, {
  isLegacyGonePath,
} from '../infra/cloudflare/legacy-gone-worker.mjs';

describe('M9.2 redirect migration map', () => {
  it('has one explicit decision per known legacy route without chains or loops', async () => {
    const rows = await loadRedirectMap();

    expect(validateRedirectMap(rows)).toEqual([]);
    expect(rows).toHaveLength(16);
    expect(new Set(rows.map(({ source_path }) => source_path)).size).toBe(
      rows.length,
    );
  });

  it('preserves campaign queries only on semantically equivalent redirects', async () => {
    const rows = await loadRedirectMap();
    const redirects = rows.filter(({ decision }) => decision === 'redirect');
    const gone = rows.filter(({ decision }) => decision === 'gone');

    expect(redirects).toHaveLength(6);
    expect(redirects.every(({ status_code }) => status_code === '301')).toBe(
      true,
    );
    expect(
      redirects.every(({ query_policy }) => query_policy === 'preserve'),
    ).toBe(true);
    expect(gone).toHaveLength(9);
    expect(gone.every(({ status_code }) => status_code === '410')).toBe(true);
    expect(gone.every(({ query_policy }) => query_policy === 'discard')).toBe(
      true,
    );
  });

  it('materializes every retired route as an edge 410 decision', async () => {
    const rows = await loadRedirectMap();
    const gone = rows.filter(({ decision }) => decision === 'gone');

    for (const row of gone) {
      const samplePath = row.source_path.replace('{id}', '2001');
      expect(isLegacyGonePath(samplePath), samplePath).toBe(true);
      const response = await legacyGoneWorker.fetch(
        new Request(`https://lunatartas.es${samplePath}?private=discarded`),
      );
      expect(response.status, samplePath).toBe(410);
      expect(response.headers.get('x-robots-tag'), samplePath).toBe('noindex');
    }
  });
});

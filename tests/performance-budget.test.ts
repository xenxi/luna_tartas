import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { artifactPath } from '../scripts/performance-paths.mjs';

describe('performance budget contract', () => {
  it('uses modern responsive formats with a JPEG fallback for catalog media', async () => {
    const projection = await readFile(
      'src/components/catalog/media-projection.ts',
      'utf8',
    );
    const media = await readFile(
      'src/components/catalog/ResponsiveMedia.astro',
      'utf8',
    );

    expect(projection).toContain("format: 'avif'");
    expect(projection).toContain("format: 'webp'");
    expect(projection).toContain("format: 'jpg'");
    expect(media).toContain('srcset={media.srcSet}');
    expect(media).toContain('width={media.width}');
    expect(media).toContain('height={media.height}');
  });

  it('makes source and built-artifact budgets executable in CI', async () => {
    const packageJson = await readFile('package.json', 'utf8');
    const ci = await readFile('.github/workflows/ci.yml', 'utf8');
    const performance = await readFile(
      'scripts/verify-performance.mjs',
      'utf8',
    );

    expect(packageJson).toContain('"verify:assets"');
    expect(packageJson).toContain('"verify:performance"');
    expect(ci).toContain('npm run verify:assets');
    expect(ci).toContain('npm run verify:performance');
    expect(performance).toContain('lcpImage: 300 * 1024');
    expect(performance).toContain('initialTransfer: 1.5 * 1024 * 1024');
  });

  it('maps root public URLs to the artifact root', () => {
    expect(artifactPath('/_astro/site.css?hash=1', 'dist')).toBe(
      resolve('dist/_astro/site.css'),
    );
  });

  it('strips a repository base before resolving the physical artifact path', () => {
    expect(artifactPath('/repo/_astro/site.css', 'dist', '/repo/')).toBe(
      resolve('dist/_astro/site.css'),
    );
  });
});

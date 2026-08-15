import { describe, expect, it } from 'vitest';

const sourceFiles = import.meta.glob('../src/**/*.{ts,astro}', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function source(relativePath: string): string {
  const contents = sourceFiles[relativePath];
  if (contents === undefined) {
    throw new Error(`${relativePath}: source file not found`);
  }
  return contents;
}

describe('catalog dependency boundaries', () => {
  it('keeps the domain independent from Astro, schemas and presentation', () => {
    const domain = Object.entries(sourceFiles)
      .filter(([path]) => path.includes('/lib/catalog/domain/'))
      .map(([, contents]) => contents)
      .join('\n');

    expect(domain).not.toMatch(
      /\b(?:import|export)\b[^;]*(?:astro|content|pages|components|layouts)/,
    );
  });

  it('runs the catalog gate from static generation', () => {
    expect(source('../src/pages/index.astro')).toMatch(
      /await\s+loadCatalog\s*\(\s*\)/,
    );
  });

  it('confines Content Collections reads to the catalog source loader', () => {
    const directReaders = Object.entries(sourceFiles).flatMap(
      ([path, contents]) => {
        if (path.endsWith('/content.config.ts')) {
          return [];
        }
        return /(?:astro:content|getCollection\s*\()/.test(contents)
          ? [path]
          : [];
      },
    );

    expect(directReaders).toEqual(['../src/lib/catalog/source/load.ts']);
  });
});

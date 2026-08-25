import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type {
  PublicCatalogDocument,
  PublicCatalogProduct,
  PublicCatalogTaxonomy,
} from '../src/lib/catalog/public-projection';
import { normalizeQuery } from '../src/lib/search/normalize-query';
import { localizePublicUrl } from '../src/lib/search/public-url';
import { rankSearchResults } from '../src/lib/search/rank-results';
import { createSearchIndex } from '../src/lib/search/search-index';

const taxonomy = (
  id: string,
  name: string,
  kind: 'categorias' | 'ocasiones' | 'regalos',
): PublicCatalogTaxonomy => ({
  id,
  name,
  summary: `${name} para momentos especiales`,
  url: `https://lunatartas.es/${kind}/${id}/`,
});

const category = taxonomy(
  'laminas-personalizadas',
  'Láminas personalizadas',
  'categorias',
);
const babyShower = taxonomy('baby-shower', 'Baby shower', 'ocasiones');
const recipient = taxonomy('bebe', 'Para bebés', 'regalos');

function product(
  id: string,
  name: string,
  summary: string,
  occasions: readonly PublicCatalogTaxonomy[] = [],
): PublicCatalogProduct {
  return {
    id,
    name,
    summary,
    url: `https://lunatartas.es/productos/${id}/`,
    taxonomies: {
      category: [category],
      occasion: occasions,
      recipient: occasions.length > 0 ? [recipient] : [],
    },
    price: { kind: 'fixed', amount: '12.00', currency: 'EUR' },
    cover: {
      url: `https://lunatartas.es/_astro/${id}.webp`,
      alt: name,
      width: 960,
      height: 720,
    },
    customization: {
      kind: 'available',
      options: ['Nombre'],
      description: 'Diseño personalizado',
    },
  };
}

const catalog: PublicCatalogDocument = {
  schemaVersion: '1.0',
  taxonomies: {
    category: [category],
    occasion: [babyShower],
    recipient: [recipient],
  },
  products: [
    product(
      'lamina-personalizada',
      'Lámina personalizada',
      'Un recuerdo ilustrado',
    ),
    product(
      'cuento-infantil',
      'Cuento infantil',
      'Una historia que incluye una lámina al final',
    ),
    product(
      'tarjeta-personalizada',
      'Tarjeta personalizada',
      'Una felicitación creada a medida',
    ),
    product(
      'tarta-panales',
      'Tarta de pañales personalizada',
      'Un regalo práctico para celebrar la llegada',
      [babyShower],
    ),
  ],
};

describe('global catalog search', () => {
  const index = createSearchIndex(catalog);

  it('normalizes accents, case, punctuation and repeated whitespace', () => {
    expect(normalizeQuery('  ¡LÁMINA... personalizada! ')).toBe(
      'lamina personalizada',
    );
    expect(normalizeQuery('Lámina')).toBe(normalizeQuery('lamina'));
  });

  it('ranks a strong name match above a weak summary match', () => {
    const products = rankSearchResults(index, 'lamina').filter(
      ({ entry }) => entry.kind === 'product',
    );
    expect(products.map(({ entry }) => entry.id).slice(0, 2)).toEqual([
      'lamina-personalizada',
      'cuento-infantil',
    ]);
  });

  it('finds linked products and the public occasion when searching a taxonomy', () => {
    const results = rankSearchResults(index, 'baby');
    expect(results.some(({ entry }) => entry.id === 'baby-shower')).toBe(true);
    expect(results.some(({ entry }) => entry.id === 'tarta-panales')).toBe(
      true,
    );
  });

  it('tolerates reasonable typographical errors without an external index', () => {
    expect(
      rankSearchResults(index, 'lamian').some(
        ({ entry }) => entry.id === 'lamina-personalizada',
      ),
    ).toBe(true);
    expect(
      rankSearchResults(index, 'tarta pañale').some(
        ({ entry }) => entry.id === 'tarta-panales',
      ),
    ).toBe(true);
    expect(
      rankSearchResults(index, 'tarta').some(
        ({ entry }) => entry.id === 'tarjeta-personalizada',
      ),
    ).toBe(false);
  });

  it('keeps public catalog URLs canonical and localizes only their deployment path', () => {
    const result = rankSearchResults(index, 'tarta')[0];
    expect(result?.entry.url).toBe(
      'https://lunatartas.es/productos/tarta-panales/',
    );
    expect(
      localizePublicUrl(
        result?.entry.url ?? '',
        'https://lunatartas.es',
        '/repo/',
      ),
    ).toBe('/repo/productos/tarta-panales/');
    expect(
      localizePublicUrl(
        'https://lunatartas.es/_image/?href=cover.jpg&f=webp',
        'https://lunatartas.es',
        '/',
      ),
    ).toBe('/_image/?href=cover.jpg&f=webp');
  });

  it('builds the index exclusively from the public projection supplied to it', () => {
    expect(index.entries.filter(({ kind }) => kind === 'product')).toHaveLength(
      catalog.products.length,
    );
    expect(index.entries.some(({ id }) => id === 'draft')).toBe(false);
  });
});

describe('search UI contracts', () => {
  const overlay = readFileSync(
    'src/components/search/SearchOverlay.astro',
    'utf8',
  );
  const panel = readFileSync('src/components/search/SearchPanel.astro', 'utf8');
  const client = readFileSync('src/components/search/search-client.ts', 'utf8');
  const page = readFileSync('src/pages/buscar/index.astro', 'utf8');

  it('opens a native modal, restores focus and closes through native Escape behavior', () => {
    expect(overlay).toContain('<dialog');
    expect(client).toContain('dialog.showModal()');
    expect(client).toContain('dialog.close()');
    expect(client).toContain("event.key === 'Escape'");
    expect(client).toContain("dialog.addEventListener('close'");
    expect(client).toContain('returnFocus?.focus()');
  });

  it('supports combobox semantics, arrows, Enter, empty and failure states', () => {
    expect(panel).toContain('role="combobox"');
    expect(panel).toContain('role="listbox"');
    expect(client).toContain("event.key === 'ArrowDown'");
    expect(client).toContain("event.key === 'ArrowUp'");
    expect(client).toContain("event.key === 'Enter'");
    expect(client).toContain('renderEmpty()');
    expect(client).toContain('renderError()');
  });

  it('publishes one shareable non-indexable search route', () => {
    expect(page).toContain('canonicalPath={routes.search()}');
    expect(page).toContain('robots="noindex,follow"');
    expect(client).toContain("parameters.get('q')");
    expect(client).toContain("window.addEventListener('popstate'");
  });
});

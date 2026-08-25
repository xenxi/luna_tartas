import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  FAVORITES_STORAGE_KEY,
  createFavoritesStore,
  type FavoritesStorage,
} from '../src/lib/favorites/storage';

class MemoryStorage implements FavoritesStorage {
  readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

describe('favorites storage', () => {
  it('reads an empty store without creating data', () => {
    const storage = new MemoryStorage();
    const store = createFavoritesStore(storage);

    expect(store.getFavorites()).toEqual([]);
    expect(store.getFavoriteCount()).toBe(0);
    expect(storage.values.has(FAVORITES_STORAGE_KEY)).toBe(false);
  });

  it('adds, removes and toggles stable product slugs', () => {
    const storage = new MemoryStorage();
    const store = createFavoritesStore(storage);

    expect(store.addFavorite('lamina-personalizada-a5')).toEqual([
      'lamina-personalizada-a5',
    ]);
    expect(store.addFavorite('lamina-personalizada-a5')).toEqual([
      'lamina-personalizada-a5',
    ]);
    expect(store.toggleFavorite('tarta-de-panales')).toEqual([
      'lamina-personalizada-a5',
      'tarta-de-panales',
    ]);
    expect(store.toggleFavorite('lamina-personalizada-a5')).toEqual([
      'tarta-de-panales',
    ]);
    expect(store.removeFavorite('tarta-de-panales')).toEqual([]);
  });

  it('repairs duplicates and ignores invalid stored values', () => {
    const storage = new MemoryStorage();
    storage.values.set(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(['valido', 'valido', 12, '', 'NO-VALIDO', null]),
    );
    const store = createFavoritesStore(storage);

    expect(store.getFavorites()).toEqual(['valido']);
    expect(storage.values.get(FAVORITES_STORAGE_KEY)).toBe('["valido"]');
  });

  it('recovers from corrupt JSON and removes the unusable value', () => {
    const storage = new MemoryStorage();
    storage.values.set(FAVORITES_STORAGE_KEY, '{not-json');
    const store = createFavoritesStore(storage);

    expect(store.getFavorites()).toEqual([]);
    expect(storage.values.has(FAVORITES_STORAGE_KEY)).toBe(false);
  });

  it('keeps the current page interaction usable when storage is unavailable', () => {
    const store = createFavoritesStore(null);

    store.addFavorite('cuento-infantil-personalizado');
    expect(store.isFavorite('cuento-infantil-personalizado')).toBe(true);
    expect(store.getFavoriteCount()).toBe(1);
    store.clearFavorites();
    expect(store.getFavorites()).toEqual([]);
  });
});

describe('favorites UI contracts', () => {
  const button = readFileSync(
    'src/components/favorites/FavoriteButton.astro',
    'utf8',
  );
  const client = readFileSync('src/lib/favorites/client.ts', 'utf8');
  const page = readFileSync('src/pages/favoritos/index.astro', 'utf8');
  const pageComponent = readFileSync(
    'src/components/favorites/FavoritesPage.astro',
    'utf8',
  );
  const styles = readFileSync('src/components/favorites/favorites.css', 'utf8');

  it('uses accessible native buttons and synchronizes every matching control', () => {
    expect(button).toContain('<button');
    expect(button).toContain('aria-pressed="false"');
    expect(button).toContain('data-favorite-toggle');
    expect(client).toContain(
      'querySelectorAll<HTMLButtonElement>(\n    BUTTON_SELECTOR',
    );
    expect(client).toContain("button.setAttribute('aria-pressed'");
    expect(client).toContain("button.setAttribute('aria-label'");
    expect(client).toContain('preserveFocusAfterRemoval');
  });

  it('updates counts and synchronizes current and external tabs without polling', () => {
    expect(client).toContain(
      "FAVORITES_CHANGE_EVENT = 'luna:favorites-change'",
    );
    expect(client).toContain("window.addEventListener('storage'");
    expect(client).toContain('FAVORITES_STORAGE_KEY');
    expect(client).toContain("'[data-favorites-count]'");
    expect(client).not.toContain('setInterval');
  });

  it('publishes a non-indexable static page that reuses ProductCard', () => {
    expect(page).toContain('canonicalPath={routes.favorites()}');
    expect(page).toContain('robots="noindex,follow"');
    expect(pageComponent).toContain('<ProductCard product={product} />');
    expect(pageComponent).toContain('data-favorite-item');
    expect(pageComponent).toContain('data-favorites-empty');
    expect(pageComponent).toContain('Descubrir productos');
  });

  it('prevents an empty-to-filled flash and respects reduced motion', () => {
    expect(styles).toContain(
      'html:not([data-favorites-ready]) .favorite-button',
    );
    expect(styles).toContain('prefers-reduced-motion: reduce');
    expect(styles).toContain('transform: scale(1.12)');
  });
});

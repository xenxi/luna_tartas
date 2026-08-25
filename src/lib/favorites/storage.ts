export const FAVORITES_STORAGE_KEY = 'luna:favorites:v1';

const PRODUCT_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface FavoritesStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface FavoritesStore {
  getFavorites(): readonly string[];
  isFavorite(productId: string): boolean;
  addFavorite(productId: string): readonly string[];
  removeFavorite(productId: string): readonly string[];
  toggleFavorite(productId: string): readonly string[];
  replaceFavorites(productIds: unknown): readonly string[];
  clearFavorites(): void;
  getFavoriteCount(): number;
}

export function normalizeFavorites(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return [
    ...new Set(
      value.filter(
        (item): item is string =>
          typeof item === 'string' && PRODUCT_ID_PATTERN.test(item),
      ),
    ),
  ];
}

function readBrowserStorage(): FavoritesStorage | null {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function createFavoritesStore(
  storage: FavoritesStorage | null = readBrowserStorage(),
): FavoritesStore {
  let memory: string[] = [];

  const persist = (favorites: readonly string[]): readonly string[] => {
    memory = [...favorites];

    try {
      storage?.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(memory));
    } catch {
      // The in-memory copy keeps the interaction usable for this page view.
    }

    return [...memory];
  };

  const getFavorites = (): readonly string[] => {
    if (storage === null) return [...memory];

    let raw: string | null;
    try {
      raw = storage.getItem(FAVORITES_STORAGE_KEY);
    } catch {
      return [...memory];
    }

    if (raw === null) {
      memory = [];
      return [];
    }

    try {
      const parsed: unknown = JSON.parse(raw);
      const normalized = normalizeFavorites(parsed);
      memory = normalized;

      if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
        persist(normalized);
      }

      return [...memory];
    } catch {
      memory = [];
      try {
        storage.removeItem(FAVORITES_STORAGE_KEY);
      } catch {
        // A corrupt value is safely ignored even when it cannot be removed.
      }
      return [];
    }
  };

  const replaceFavorites = (productIds: unknown): readonly string[] =>
    persist(normalizeFavorites(productIds));

  return {
    getFavorites,
    isFavorite: (productId) => getFavorites().includes(productId),
    addFavorite: (productId) => {
      const favorites = getFavorites();
      return PRODUCT_ID_PATTERN.test(productId) &&
        !favorites.includes(productId)
        ? persist([...favorites, productId])
        : favorites;
    },
    removeFavorite: (productId) =>
      persist(getFavorites().filter((favorite) => favorite !== productId)),
    toggleFavorite: (productId) => {
      const favorites = getFavorites();
      if (!PRODUCT_ID_PATTERN.test(productId)) return favorites;
      return favorites.includes(productId)
        ? persist(favorites.filter((favorite) => favorite !== productId))
        : persist([...favorites, productId]);
    },
    replaceFavorites,
    clearFavorites: () => {
      memory = [];
      try {
        storage?.removeItem(FAVORITES_STORAGE_KEY);
      } catch {
        // Clearing the in-memory copy is sufficient for graceful degradation.
      }
    },
    getFavoriteCount: () => getFavorites().length,
  };
}

export const favoritesStore = createFavoritesStore();

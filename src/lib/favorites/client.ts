import { FAVORITES_STORAGE_KEY, favoritesStore } from './storage';

export const FAVORITES_CHANGE_EVENT = 'luna:favorites-change';

const BUTTON_SELECTOR = '[data-favorite-toggle]';
const REMOVE_DURATION = 180;

function favoriteLabel(productName: string, active: boolean): string {
  return `${active ? 'Quitar' : 'Añadir'} ${productName} ${
    active ? 'de' : 'a'
  } favoritos`;
}

function formattedCount(count: number): string {
  return count > 99 ? '99+' : String(count);
}

function syncButtons(document: Document, favorites: ReadonlySet<string>): void {
  for (const button of document.querySelectorAll<HTMLButtonElement>(
    BUTTON_SELECTOR,
  )) {
    const productId = button.dataset.productId;
    const productName = button.dataset.productName;
    if (productId === undefined || productName === undefined) continue;

    const active = favorites.has(productId);
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', favoriteLabel(productName, active));
    button.toggleAttribute('data-favorite-active', active);

    const label = button.querySelector<HTMLElement>('[data-favorite-label]');
    if (label !== null) {
      label.textContent = active
        ? 'Guardado en favoritos'
        : 'Guardar en favoritos';
    }
  }
}

function syncCounters(document: Document, count: number): void {
  for (const counter of document.querySelectorAll<HTMLElement>(
    '[data-favorites-count]',
  )) {
    counter.textContent = formattedCount(count);
    counter.hidden = count === 0;
  }

  for (const link of document.querySelectorAll<HTMLElement>(
    '[data-favorites-link]',
  )) {
    link.setAttribute(
      'aria-label',
      count === 0
        ? 'Favoritos, ninguno guardado'
        : `Favoritos, ${count} ${count === 1 ? 'producto guardado' : 'productos guardados'}`,
    );
  }
}

function setFavoritePageState(
  document: Document,
  window: Window,
  favorites: ReadonlySet<string>,
  animateRemoval: boolean,
): void {
  const root = document.querySelector<HTMLElement>('[data-favorites-page]');
  if (root === null) return;

  const renderVersion = Number(root.dataset.favoritesRenderVersion ?? '0') + 1;
  root.dataset.favoritesRenderVersion = String(renderVersion);
  const items = root.querySelectorAll<HTMLElement>('[data-favorite-item]');
  let hasAnimatedRemoval = false;

  for (const item of items) {
    const productId = item.dataset.productId;
    const visible = productId !== undefined && favorites.has(productId);

    if (visible) {
      item.hidden = false;
      item.classList.remove('is-removing');
      continue;
    }

    if (animateRemoval && !item.hidden) {
      hasAnimatedRemoval = true;
      item.classList.add('is-removing');
      window.setTimeout(() => {
        if (root.dataset.favoritesRenderVersion !== String(renderVersion))
          return;
        item.hidden = true;
        item.classList.remove('is-removing');
      }, REMOVE_DURATION);
    } else {
      item.hidden = true;
      item.classList.remove('is-removing');
    }
  }

  const count = favorites.size;
  const grid = root.querySelector<HTMLElement>('[data-favorites-grid]');
  const empty = root.querySelector<HTMLElement>('[data-favorites-empty]');
  const total = root.querySelector<HTMLElement>('[data-favorites-total]');

  if (grid !== null) grid.hidden = count === 0 && !hasAnimatedRemoval;
  if (total !== null) {
    total.textContent = `${count} ${count === 1 ? 'favorito' : 'favoritos'}`;
    total.hidden = count === 0;
  }

  const finalizeEmptyState = () => {
    if (root.dataset.favoritesRenderVersion !== String(renderVersion)) return;
    if (grid !== null) grid.hidden = count === 0;
    if (empty !== null) empty.hidden = count > 0;
  };

  if (hasAnimatedRemoval) {
    if (empty !== null) empty.hidden = true;
    window.setTimeout(finalizeEmptyState, REMOVE_DURATION);
  } else {
    finalizeEmptyState();
  }
}

function favoritesKnownByPage(document: Document): ReadonlySet<string> | null {
  const root = document.querySelector<HTMLElement>('[data-favorites-page]');
  if (root === null) return null;

  return new Set(
    [...root.querySelectorAll<HTMLElement>('[data-favorite-item]')]
      .map((item) => item.dataset.productId)
      .filter((id): id is string => id !== undefined),
  );
}

function sync(
  document: Document,
  window: Window,
  animateRemoval: boolean,
): void {
  let favorites = favoritesStore.getFavorites();
  const knownProducts = favoritesKnownByPage(document);

  if (knownProducts !== null) {
    const currentProducts = favorites.filter((id) => knownProducts.has(id));
    if (currentProducts.length !== favorites.length) {
      favorites = favoritesStore.replaceFavorites(currentProducts);
    }
  }

  const favoriteSet = new Set(favorites);
  syncButtons(document, favoriteSet);
  syncCounters(document, favoriteSet.size);
  setFavoritePageState(document, window, favoriteSet, animateRemoval);
  document.documentElement.dataset.favoritesReady = 'true';
}

function animateAddedFavorite(button: HTMLButtonElement): void {
  button.dataset.favoriteAnimating = 'true';
  button.addEventListener(
    'animationend',
    () => delete button.dataset.favoriteAnimating,
    { once: true },
  );
}

function preserveFocusAfterRemoval(
  button: HTMLButtonElement,
  document: Document,
  window: Window,
): void {
  const item = button.closest<HTMLElement>('[data-favorite-item]');
  if (item === null) return;

  const visibleItems = [
    ...document.querySelectorAll<HTMLElement>('[data-favorite-item]'),
  ].filter((candidate) => candidate !== item && !candidate.hidden);
  const nextButton = visibleItems
    .map((candidate) =>
      candidate.querySelector<HTMLButtonElement>(BUTTON_SELECTOR),
    )
    .find((candidate): candidate is HTMLButtonElement => candidate !== null);
  const emptyAction = document.querySelector<HTMLAnchorElement>(
    '[data-favorites-empty] a',
  );

  window.setTimeout(
    () => (nextButton ?? emptyAction)?.focus(),
    REMOVE_DURATION,
  );
}

export function initializeFavorites(document: Document, window: Window): void {
  if (document.documentElement.dataset.favoritesInitialized === 'true') {
    sync(document, window, false);
    return;
  }

  document.documentElement.dataset.favoritesInitialized = 'true';

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest<HTMLButtonElement>(BUTTON_SELECTOR);
    if (button === null) return;

    const productId = button.dataset.productId;
    if (productId === undefined) return;

    const wasFavorite = favoritesStore.isFavorite(productId);
    const favorites = favoritesStore.toggleFavorite(productId);
    const isFavorite = favorites.includes(productId);
    if (!wasFavorite && isFavorite) animateAddedFavorite(button);

    window.dispatchEvent(
      new CustomEvent(FAVORITES_CHANGE_EVENT, {
        detail: { productId, favorites },
      }),
    );

    if (wasFavorite && !isFavorite) {
      preserveFocusAfterRemoval(button, document, window);
    }
  });

  window.addEventListener(FAVORITES_CHANGE_EVENT, () => {
    sync(document, window, true);
  });

  window.addEventListener('storage', (event) => {
    if (event.key === FAVORITES_STORAGE_KEY || event.key === null) {
      sync(document, window, true);
    }
  });

  sync(document, window, false);
}

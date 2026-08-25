import { formatPublicPriceLabel } from '../catalog/price';
import type {
  PublicCatalogDocument,
  PublicCatalogTaxonomy,
} from '../../lib/catalog/public-projection';
import { loadPublicCatalog } from '../../lib/search/catalog-store';
import { normalizeQuery } from '../../lib/search/normalize-query';
import { localizePublicUrl } from '../../lib/search/public-url';
import { rankSearchResults } from '../../lib/search/rank-results';
import { createSearchIndex } from '../../lib/search/search-index';
import type {
  RankedSearchResult,
  SearchIndex,
  SearchResultKind,
} from '../../lib/search/types';

const OVERLAY_RESULT_LIMIT = 7;
const ANALYTICS_DELAY = 850;

type SearchMode = 'overlay' | 'page';

interface SearchConfiguration {
  readonly catalogUrl: string;
  readonly searchUrl: string;
  readonly productsUrl: string;
  readonly contactUrl: string;
  readonly basePath: string;
  readonly canonicalOrigin: string;
}

const kindLabels: Readonly<Record<SearchResultKind, string>> = {
  product: 'Productos',
  category: 'Categorías',
  occasion: 'Ocasiones',
  recipient: 'Para regalar',
};

const kindOrder: readonly SearchResultKind[] = [
  'product',
  'occasion',
  'category',
  'recipient',
];

function requiredElement<T extends Element>(
  root: ParentNode,
  selector: string,
): T {
  const element = root.querySelector<T>(selector);
  if (element === null) throw new Error(`Search requires ${selector}`);
  return element;
}

function requiredData(root: HTMLElement, key: keyof DOMStringMap): string {
  const value = root.dataset[key];
  if (value === undefined || value === '') {
    throw new Error(`Search requires data-${String(key)}`);
  }
  return value;
}

function configurationFrom(root: HTMLElement): SearchConfiguration {
  return {
    catalogUrl: requiredData(root, 'catalogUrl'),
    searchUrl: requiredData(root, 'searchUrl'),
    productsUrl: requiredData(root, 'productsUrl'),
    contactUrl: requiredData(root, 'contactUrl'),
    basePath: requiredData(root, 'basePath'),
    canonicalOrigin: requiredData(root, 'canonicalOrigin'),
  };
}

function element<K extends keyof HTMLElementTagNameMap>(
  document: Document,
  tagName: K,
  className?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tagName);
  if (className !== undefined) node.className = className;
  return node;
}

function analytics(document: Document, detail: Record<string, unknown>): void {
  document.dispatchEvent(new CustomEvent('luna-analytics', { detail }));
}

function queryUrl(searchUrl: string, query: string): string {
  const parameters = new URLSearchParams();
  if (query !== '') parameters.set('q', query);
  const suffix = parameters.toString();
  return suffix === '' ? searchUrl : `${searchUrl}?${suffix}`;
}

class SearchController {
  private readonly mode: SearchMode;
  private readonly config: SearchConfiguration;
  private readonly input: HTMLInputElement;
  private readonly form: HTMLFormElement;
  private readonly output: HTMLElement;
  private readonly status: HTMLElement;
  private readonly footer: HTMLElement;
  private readonly viewAll: HTMLAnchorElement;
  private catalog?: PublicCatalogDocument;
  private index?: SearchIndex;
  private loading?: Promise<void>;
  private selectedIndex = -1;
  private analyticsTimer?: number;
  private lastTrackedQuery = '';
  private lastNoResultsQuery = '';

  constructor(
    root: HTMLElement,
    private readonly document: Document,
    private readonly window: Window,
  ) {
    this.mode = requiredData(root, 'searchMode') as SearchMode;
    this.config = configurationFrom(root);
    this.input = requiredElement(root, '[data-search-input]');
    this.form = requiredElement(root, '[data-search-form]');
    this.output = requiredElement(root, '[data-search-output]');
    this.status = requiredElement(root, '[data-search-status]');
    this.footer = requiredElement(root, '[data-search-footer]');
    this.viewAll = requiredElement(root, '[data-search-view-all]');
    this.bind();
  }

  private bind(): void {
    this.input.addEventListener('input', () => {
      this.updatePageUrl(false);
      void this.loadAndRender();
    });
    this.input.addEventListener('keydown', (event) =>
      this.onInputKeydown(event),
    );
    this.form.addEventListener('submit', (event) => this.onSubmit(event));
    this.output.addEventListener('click', (event) => this.onOutputClick(event));
    this.viewAll.addEventListener('click', () => {
      const query = normalizeQuery(this.input.value);
      analytics(this.document, {
        name: 'search_view_all',
        query_length: query.length,
        result_count: this.currentResults().length,
      });
      this.trackQuery(true);
    });
  }

  private onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    const query = normalizeQuery(this.input.value);
    if (query.length < 2) {
      this.input.focus();
      return;
    }

    this.trackQuery(true);
    if (this.mode === 'overlay') {
      analytics(this.document, {
        name: 'search_view_all',
        query_length: query.length,
        result_count: this.currentResults().length,
      });
      this.window.location.assign(
        queryUrl(this.config.searchUrl, this.input.value.trim()),
      );
      return;
    }

    this.updatePageUrl(true);
    void this.loadAndRender();
  }

  private onOutputClick(event: MouseEvent): void {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const suggestion = target.closest<HTMLButtonElement>(
      '[data-search-suggestion]',
    );
    if (suggestion !== null) {
      this.input.value = suggestion.dataset.searchSuggestion ?? '';
      this.updatePageUrl(false);
      void this.loadAndRender();
      this.input.focus();
      return;
    }

    const result = target.closest<HTMLAnchorElement>('[data-search-option]');
    if (result === null) return;
    const query = normalizeQuery(this.input.value);
    analytics(this.document, {
      name: 'search_result_click',
      result_type: result.dataset.searchKind,
      result_id: result.dataset.searchId,
      result_position: Number(result.dataset.searchPosition),
      query_length: query.length,
    });
    this.trackQuery(true);
  }

  private onInputKeydown(event: KeyboardEvent): void {
    const options = this.options();
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (options.length === 0) return;
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      const startingIndex =
        this.selectedIndex < 0 ? (direction > 0 ? -1 : 0) : this.selectedIndex;
      this.select(
        (startingIndex + direction + options.length) % options.length,
      );
      return;
    }

    if (event.key === 'Enter' && this.selectedIndex >= 0) {
      const selected = options[this.selectedIndex];
      if (selected !== undefined) {
        event.preventDefault();
        selected.click();
      }
    }
  }

  private options(): readonly HTMLAnchorElement[] {
    return [
      ...this.output.querySelectorAll<HTMLAnchorElement>(
        '[data-search-option]',
      ),
    ];
  }

  private select(index: number): void {
    const options = this.options();
    this.selectedIndex = index;
    options.forEach((option, optionIndex) => {
      const selected = optionIndex === index;
      option.setAttribute('aria-selected', selected ? 'true' : 'false');
      option.classList.toggle('is-selected', selected);
    });
    const selected = options[index];
    if (selected !== undefined) {
      this.input.setAttribute('aria-activedescendant', selected.id);
      selected.scrollIntoView({ block: 'nearest' });
    }
  }

  private resetSelection(): void {
    this.selectedIndex = -1;
    this.input.removeAttribute('aria-activedescendant');
  }

  private currentResults(): readonly RankedSearchResult[] {
    return this.index === undefined
      ? []
      : rankSearchResults(this.index, this.input.value);
  }

  private async loadAndRender(): Promise<void> {
    if (this.index === undefined) {
      this.renderLoading();
      await this.load();
    }
    if (this.index !== undefined && this.catalog !== undefined) this.render();
  }

  async load(): Promise<void> {
    if (this.index !== undefined) return;
    if (this.loading !== undefined) return this.loading;

    this.loading = loadPublicCatalog(this.config.catalogUrl)
      .then((catalog) => {
        this.catalog = catalog;
        this.index = createSearchIndex(catalog);
      })
      .catch((error: unknown) => {
        console.error('LUNA catalog search could not load.', error);
        this.renderError();
      })
      .finally(() => {
        this.loading = undefined;
      });
    return this.loading;
  }

  private render(): void {
    this.resetSelection();
    const query = normalizeQuery(this.input.value);
    if (query.length < 2) {
      this.renderDiscovery(query.length === 1);
      return;
    }

    const results = this.currentResults();
    this.renderResults(results);
    this.scheduleQueryAnalytics(results.length);
  }

  private prepareOutput(role: 'listbox' | 'region'): void {
    this.output.replaceChildren();
    if (role === 'listbox') this.output.setAttribute('role', 'listbox');
    else this.output.removeAttribute('role');
    this.input.setAttribute(
      'aria-expanded',
      role === 'listbox' ? 'true' : 'false',
    );
  }

  private renderLoading(): void {
    this.prepareOutput('region');
    const loading = element(this.document, 'div', 'search-loading');
    loading.setAttribute('aria-label', 'Cargando catálogo');
    for (let index = 0; index < 3; index += 1)
      loading.append(element(this.document, 'span'));
    this.output.append(loading);
    this.footer.hidden = true;
    this.status.textContent = 'Cargando el catálogo de LUNA.';
  }

  private renderDiscovery(shortQuery: boolean): void {
    this.prepareOutput('region');
    const discovery = element(this.document, 'div', 'search-discovery');
    const heading = element(this.document, 'h3');
    heading.textContent = shortQuery
      ? 'Escribe una letra más para buscar'
      : 'Ideas para empezar';
    discovery.append(heading);

    const suggestions = element(this.document, 'div', 'search-suggestions');
    for (const taxonomy of this.discoveryTaxonomies()) {
      suggestions.append(this.suggestionButton(taxonomy.name, taxonomy.name));
    }
    discovery.append(suggestions);

    const guidedHeading = element(
      this.document,
      'p',
      'search-discovery__label',
    );
    guidedHeading.textContent = 'También puedes buscar por intención';
    discovery.append(guidedHeading);
    const guided = element(this.document, 'div', 'search-guided');
    for (const item of this.guidedSuggestions()) {
      guided.append(this.suggestionButton(item.label, item.query, true));
    }
    discovery.append(guided);
    this.output.append(discovery);
    this.footer.hidden = true;
    this.status.textContent = shortQuery
      ? 'Escribe al menos dos caracteres para mostrar resultados.'
      : 'Elige una sugerencia o escribe al menos dos caracteres.';
  }

  private discoveryTaxonomies(): readonly PublicCatalogTaxonomy[] {
    if (this.catalog === undefined) return [];
    return [
      ...this.catalog.taxonomies.occasion.slice(0, 2),
      ...this.catalog.taxonomies.recipient.slice(0, 2),
      ...this.catalog.taxonomies.category.slice(0, 2),
    ];
  }

  private guidedSuggestions(): readonly { label: string; query: string }[] {
    if (this.catalog === undefined) return [];
    const recipients = this.catalog.taxonomies.recipient;
    const occasions = this.catalog.taxonomies.occasion;
    const baby = recipients.find((item) =>
      normalizeQuery(item.name).includes('bebe'),
    );
    const special = recipients.find((item) =>
      normalizeQuery(item.name).includes('especial'),
    );
    const celebration = occasions[0];
    const suggestions = [
      special === undefined
        ? undefined
        : { label: 'Quiero hacer un regalo', query: special.name },
      baby === undefined
        ? undefined
        : { label: 'Es para un bebé', query: baby.name },
      celebration === undefined
        ? undefined
        : { label: 'Tengo una celebración', query: celebration.name },
      this.catalog.products.some(
        (item) => item.customization.kind === 'available',
      )
        ? { label: 'Quiero algo personalizado', query: 'personalizado' }
        : undefined,
    ];
    return suggestions.filter(
      (item): item is { label: string; query: string } => item !== undefined,
    );
  }

  private suggestionButton(
    label: string,
    query: string,
    guided = false,
  ): HTMLButtonElement {
    const button = element(
      this.document,
      'button',
      guided
        ? 'search-suggestion search-suggestion--guided'
        : 'search-suggestion',
    );
    button.type = 'button';
    button.dataset.searchSuggestion = query;
    button.textContent = label;
    return button;
  }

  private renderResults(results: readonly RankedSearchResult[]): void {
    this.prepareOutput('listbox');
    if (results.length === 0) {
      this.renderEmpty();
      return;
    }

    const visibleResults =
      this.mode === 'overlay'
        ? results.slice(0, OVERLAY_RESULT_LIMIT)
        : results;
    for (const kind of kindOrder) {
      const groupResults = visibleResults.filter(
        (result) => result.entry.kind === kind,
      );
      if (groupResults.length === 0) continue;
      const section = element(this.document, 'section', 'search-result-group');
      const heading = element(
        this.document,
        'h3',
        'search-result-group__title',
      );
      heading.id = `${this.input.id}-${kind}-heading`;
      heading.textContent = kindLabels[kind];
      section.setAttribute('role', 'group');
      section.setAttribute('aria-labelledby', heading.id);
      section.append(heading);
      const list = element(this.document, 'div', 'search-result-group__list');
      for (const result of groupResults) {
        const position = results.indexOf(result) + 1;
        list.append(this.resultLink(result, position));
      }
      section.append(list);
      this.output.append(section);
    }

    this.viewAll.href = queryUrl(
      this.config.searchUrl,
      this.input.value.trim(),
    );
    this.footer.hidden =
      this.mode === 'page' || results.length <= OVERLAY_RESULT_LIMIT;
    this.status.textContent = `${results.length} ${results.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}.`;
  }

  private resultLink(
    result: RankedSearchResult,
    position: number,
  ): HTMLAnchorElement {
    const { entry } = result;
    const link = element(
      this.document,
      'a',
      entry.kind === 'product'
        ? 'search-result search-result--product'
        : 'search-result search-result--taxonomy',
    );
    link.id = `${this.input.id}-option-${position}`;
    link.href = localizePublicUrl(
      entry.url,
      this.config.canonicalOrigin,
      this.config.basePath,
    );
    link.setAttribute('role', 'option');
    link.setAttribute('aria-selected', 'false');
    link.dataset.searchOption = '';
    link.dataset.searchKind = entry.kind;
    link.dataset.searchId = entry.id;
    link.dataset.searchPosition = String(position);

    if (entry.kind === 'product') {
      const media = element(this.document, 'span', 'search-result__media');
      const image = element(this.document, 'img');
      image.src = localizePublicUrl(
        entry.product.cover.url,
        this.config.canonicalOrigin,
        this.config.basePath,
      );
      image.alt = entry.product.cover.alt;
      image.width = entry.product.cover.width;
      image.height = entry.product.cover.height;
      image.loading = 'lazy';
      image.decoding = 'async';
      media.append(image);
      link.append(media);
    }

    const body = element(this.document, 'span', 'search-result__body');
    const name = element(this.document, 'span', 'search-result__name');
    name.textContent = entry.name;
    body.append(name);
    const summary = element(this.document, 'span', 'search-result__summary');
    summary.textContent = entry.summary;
    body.append(summary);

    if (entry.kind === 'product') {
      const meta = element(this.document, 'span', 'search-result__meta');
      const price = element(this.document, 'strong');
      price.textContent = formatPublicPriceLabel(entry.product.price);
      meta.append(price);
      const category = entry.product.taxonomies.category[0];
      if (category !== undefined) {
        const categoryLabel = element(this.document, 'span');
        categoryLabel.textContent = category.name;
        meta.append(categoryLabel);
      }
      if (entry.product.customization.kind === 'available') {
        const personalized = element(
          this.document,
          'span',
          'search-result__personalized',
        );
        personalized.textContent = 'Personalizable';
        meta.append(personalized);
      }
      body.append(meta);
    } else {
      const kind = element(this.document, 'span', 'search-result__kind');
      kind.textContent = kindLabels[entry.kind];
      body.append(kind);
    }

    link.append(body);
    const arrow = element(this.document, 'span', 'search-result__arrow');
    arrow.textContent = '→';
    arrow.setAttribute('aria-hidden', 'true');
    link.append(arrow);
    return link;
  }

  private renderEmpty(): void {
    this.prepareOutput('region');
    const empty = element(this.document, 'div', 'search-empty');
    const moon = element(this.document, 'span', 'search-empty__moon');
    moon.textContent = '☾';
    moon.setAttribute('aria-hidden', 'true');
    empty.append(moon);
    const heading = element(this.document, 'h3');
    heading.textContent = 'No hemos encontrado justo eso.';
    empty.append(heading);
    const copy = element(this.document, 'p');
    copy.textContent =
      'Prueba con otras palabras o cuéntanos tu idea. Seguro que podemos crear algo especial.';
    empty.append(copy);
    const actions = element(this.document, 'div', 'search-empty__actions');
    const products = element(
      this.document,
      'a',
      'action-link action-link--secondary',
    );
    products.href = this.config.productsUrl;
    products.textContent = 'Ver todos los productos';
    actions.append(products);
    const contact = element(
      this.document,
      'a',
      'action-link action-link--primary',
    );
    contact.href = this.config.contactUrl;
    contact.textContent = 'Cuéntanos tu idea';
    contact.dataset.analyticsContactWhatsapp = '';
    contact.dataset.analyticsCtaLocation = 'search-empty';
    actions.append(contact);
    empty.append(actions);
    this.output.append(empty);
    this.footer.hidden = true;
    this.status.textContent = 'No se han encontrado resultados.';
  }

  private renderError(): void {
    this.prepareOutput('region');
    const error = element(this.document, 'div', 'search-error');
    const heading = element(this.document, 'h3');
    heading.textContent = 'Ahora mismo no podemos abrir el catálogo.';
    error.append(heading);
    const copy = element(this.document, 'p');
    copy.textContent =
      'Puedes seguir explorando todos los productos mientras lo intentamos de nuevo.';
    error.append(copy);
    const link = element(
      this.document,
      'a',
      'action-link action-link--secondary',
    );
    link.href = this.config.productsUrl;
    link.textContent = 'Ver todos los productos';
    error.append(link);
    this.output.append(error);
    this.footer.hidden = true;
    this.status.textContent = 'No se ha podido cargar el catálogo.';
  }

  private scheduleQueryAnalytics(resultCount: number): void {
    if (this.analyticsTimer !== undefined)
      this.window.clearTimeout(this.analyticsTimer);
    this.analyticsTimer = this.window.setTimeout(() => {
      this.trackQuery(false, resultCount);
      if (resultCount === 0) this.trackNoResults();
    }, ANALYTICS_DELAY);
  }

  private trackNoResults(): void {
    const query = normalizeQuery(this.input.value);
    if (query.length < 2 || this.lastNoResultsQuery === query) return;
    this.lastNoResultsQuery = query;
    analytics(this.document, {
      name: 'search_no_results',
      query_length: query.length,
    });
  }

  private trackQuery(force: boolean, knownResultCount?: number): void {
    const query = normalizeQuery(this.input.value);
    if (query.length < 2 || (!force && query === this.lastTrackedQuery)) return;
    if (query === this.lastTrackedQuery) return;
    this.lastTrackedQuery = query;
    analytics(this.document, {
      name: 'search_query',
      query_length: query.length,
      result_count: knownResultCount ?? this.currentResults().length,
    });
  }

  private updatePageUrl(push: boolean): void {
    if (this.mode !== 'page') return;
    const url = queryUrl(this.config.searchUrl, this.input.value.trim());
    if (push) this.window.history.pushState({}, '', url);
    else this.window.history.replaceState({}, '', url);
  }

  setQueryFromLocation(): void {
    const parameters = new URLSearchParams(this.window.location.search);
    this.input.value = (parameters.get('q') ?? '').slice(0, 120);
  }

  focus(): void {
    this.input.focus();
  }

  start(): void {
    void this.loadAndRender();
  }
}

export function initializeGlobalSearch(
  document: Document,
  window: Window,
): void {
  const dialog = document.querySelector<HTMLDialogElement>(
    '[data-search-root][data-search-mode="overlay"]',
  );
  if (dialog === null || dialog.dataset.searchInitialized === 'true') return;
  dialog.dataset.searchInitialized = 'true';
  const controller = new SearchController(dialog, document, window);
  let returnFocus: HTMLElement | null = null;

  const open = (source: string) => {
    if (dialog.open) return;
    returnFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    dialog.showModal();
    document.documentElement.classList.add('search-is-open');
    analytics(document, { name: 'search_open', source });
    controller.start();
    window.requestAnimationFrame(() => controller.focus());
  };

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const trigger = target.closest<HTMLElement>('[data-search-trigger]');
    if (trigger !== null) open(trigger.dataset.searchSource ?? 'header');
    if (target === dialog) dialog.close();
  });
  requiredElement<HTMLButtonElement>(
    dialog,
    '[data-search-close]',
  ).addEventListener('click', () => dialog.close());
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && dialog.open) {
      event.preventDefault();
      dialog.close();
      return;
    }
    if (
      event.key.toLocaleLowerCase('es') !== 'k' ||
      (!event.metaKey && !event.ctrlKey)
    )
      return;
    event.preventDefault();
    open('keyboard');
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('search-is-open');
    returnFocus?.focus();
    returnFocus = null;
  });
}

export function initializeSearchPage(document: Document, window: Window): void {
  const root = document.querySelector<HTMLElement>(
    '[data-search-root][data-search-mode="page"]',
  );
  if (root === null || root.dataset.searchInitialized === 'true') return;
  root.dataset.searchInitialized = 'true';
  const controller = new SearchController(root, document, window);
  controller.setQueryFromLocation();
  controller.start();
  window.addEventListener('popstate', () => {
    controller.setQueryFromLocation();
    controller.start();
  });
}

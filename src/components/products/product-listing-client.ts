export function initProductListing(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>('[data-listing-search]');
  const input = form?.querySelector<HTMLInputElement>('input');
  const sort = root.querySelector<HTMLSelectElement>('[data-listing-sort]');
  const grid = root.querySelector<HTMLElement>('.card-list');
  const status = root.querySelector<HTMLElement>('[data-listing-status]');
  const empty = root.querySelector<HTMLElement>('[data-listing-empty]');
  const idea = root.querySelector<HTMLElement>('.product-listing__idea');
  if (!form || !input || !sort || !grid || !status || !empty || !idea) return;

  const items = Array.from(
    root.querySelectorAll<HTMLElement>('[data-listing-item]'),
  );
  const filters = Array.from(
    root.querySelectorAll<HTMLAnchorElement>('[data-listing-filter]'),
  );
  let occasion = '';
  const normalize = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('es')
      .trim();

  function update(): void {
    const words = normalize(input!.value).split(/\s+/).filter(Boolean);
    let count = 0;
    const ordered = [...items].sort((left, right) => {
      if (sort!.value === 'name')
        return (left.dataset.name ?? '').localeCompare(
          right.dataset.name ?? '',
          'es',
        );
      if (sort!.value.startsWith('price-')) {
        // Prices on request always follow priced products, in either direction.
        const a = left.dataset.price;
        const b = right.dataset.price;
        if (!a || !b) return a ? -1 : b ? 1 : 0;
        return (
          (Number(a) - Number(b)) * (sort!.value === 'price-desc' ? -1 : 1)
        );
      }
      return 0;
    });
    for (const item of ordered) {
      const matches =
        (!occasion ||
          (item.dataset.occasions ?? '').split(' ').includes(occasion)) &&
        words.every((word) =>
          normalize(item.dataset.search ?? '').includes(word),
        );
      item.hidden = !matches;
      if (matches) count++;
      grid!.insertBefore(item, idea!);
    }
    idea!.style.setProperty('--idea-columns', String(4 - (count % 4)));
    status!.textContent = `${count} ${count === 1 ? 'producto' : 'productos'}`;
    empty!.hidden = count > 0;
    for (const filter of filters) {
      if (filter.dataset.listingFilter === occasion)
        filter.setAttribute('aria-current', 'true');
      else filter.removeAttribute('aria-current');
    }
  }

  root
    .querySelector<HTMLElement>('[data-listing-sort-control]')
    ?.removeAttribute('hidden');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    update();
  });
  input.addEventListener('input', update);
  sort.addEventListener('change', update);
  for (const filter of filters) {
    filter.addEventListener('click', (event) => {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      )
        return;
      event.preventDefault();
      occasion = filter.dataset.listingFilter ?? '';
      update();
    });
  }
}

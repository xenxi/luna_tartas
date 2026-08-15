import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  isCurrentNavigationPath,
  primaryNavigation,
} from '../src/config/navigation';

const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');
const header = readFileSync('src/components/site/SiteHeader.astro', 'utf8');
const footer = readFileSync('src/components/site/SiteFooter.astro', 'utf8');
const navigation = readFileSync(
  'src/components/site/PrimaryNavigation.astro',
  'utf8',
);
const brand = readFileSync('src/components/site/BrandHomeLink.astro', 'utf8');
const styles = readFileSync('src/components/site/site.css', 'utf8');

describe('public site shell', () => {
  it('centralizes stable, trailing-slash primary destinations', () => {
    expect(primaryNavigation).toEqual([
      { label: 'Productos', href: '/productos/' },
      { label: 'Categorías', href: '/categorias/' },
      { label: 'Ocasiones', href: '/ocasiones/' },
      { label: 'Para regalar', href: '/regalos/' },
    ]);
    expect(Object.isFrozen(primaryNavigation)).toBe(true);
  });

  it('marks exact indexes and their descendants, but not sibling prefixes', () => {
    expect(isCurrentNavigationPath('/productos/', '/productos/')).toBe(true);
    expect(isCurrentNavigationPath('/productos/tarta/', '/productos/')).toBe(
      true,
    );
    expect(isCurrentNavigationPath('/productos-extra/', '/productos/')).toBe(
      false,
    );
    expect(isCurrentNavigationPath('/', '/')).toBe(true);
    expect(isCurrentNavigationPath('/productos/', '/')).toBe(false);
    expect(isCurrentNavigationPath('productos/', '/productos/')).toBe(false);
  });

  it('composes one header, main and footer around the page slot', () => {
    expect(layout).toContain('<SiteHeader currentPath={Astro.url.pathname} />');
    expect(layout).toContain('<main id="main-content" tabindex="-1">');
    expect(layout).toContain('<SiteFooter currentPath={Astro.url.pathname} />');
    expect(header).toContain('<header');
    expect(footer).toContain('<footer');
    expect(brand).toContain("isCurrent ? 'page' : undefined");
  });

  it('uses native disclosure with navigation available without JavaScript', () => {
    expect(header).toContain('<details class="site-menu">');
    expect(header).toContain('<summary>Menú</summary>');
    expect(navigation).toContain('<nav');
    expect(navigation).toContain("'page'");
    expect(header).not.toContain('<script');
    expect(navigation).not.toContain('client:');
    expect(styles).toContain('.site-menu:not([open]) > .primary-navigation');
  });

  it('never exposes pending brand or unconfirmed contact and legal data', () => {
    expect(brand).toContain("brandName ?? 'Inicio'");
    expect(brand).toContain('brandName ?');
    expect(`${layout}${header}${footer}${brand}`).not.toContain('TBD');
    expect(`${layout}${header}${footer}`).not.toMatch(
      /whatsapp|tel:|mailto:|copyright|dirección/i,
    );
  });
});

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
    expect(header).toContain('class="site-header__inner visual-container"');
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
    expect(header).toContain('class="site-navigation--desktop"');
    expect(styles).toContain('.site-navigation--desktop');
    expect(styles).toContain('.site-menu {');
    expect(styles).toContain('min-block-size: 5.5rem');
  });

  it('keeps the approved brand and unconfirmed legal data separated in the shell', () => {
    expect(brand).toContain('getPublishableText(siteConfig.brandName)');
    expect(brand).toContain('brandName ?');
    expect(`${layout}${header}${footer}${brand}`).not.toContain('TBD');
    expect(`${layout}${header}`).not.toMatch(/tel:|mailto:|dirección/i);
  });

  it('publishes the three approved Footer contacts as native links', () => {
    expect(footer).toContain('import { publicContactConfig }');
    expect(footer).toContain('publicContactConfig.whatsapp.href');
    expect(footer).toContain('publicContactConfig.email.href');
    expect(footer).toContain('publicContactConfig.instagram.href');
    expect(footer).toContain('<address class="site-footer__contact">');
    expect(footer).not.toContain('target="_blank"');
  });

  it('publishes the approved logo as the favicon without deriving a brand mark', () => {
    expect(layout).toContain(
      "import brandLogo from '../assets/brand/logo-luna-tartas.png';",
    );
    expect(layout).toContain(
      '<link rel="icon" type="image/png" href={brandLogo.src} />',
    );
  });

  it('renders the approved creator signature once at build time without hydration', () => {
    expect(footer).toContain('const buildYear = new Date().getUTCFullYear();');
    expect(footer).toContain('Hecho con mimo para Luna · Creado por');
    expect(footer).toContain('href="https://antoniomdm.dev/"');
    expect(footer).toContain('Antonio MDM');
    expect(footer).toContain('© {buildYear}');
    expect(footer).toContain('class="site-footer__copyright"');
    expect(footer).toContain('class="site-footer__signature"');
    expect(footer).not.toContain('target="_blank"');
    expect(footer).not.toContain('<script');
    expect(footer).not.toContain('client:');
    expect(styles).toContain('.site-footer__signature a:focus-visible');
  });
});

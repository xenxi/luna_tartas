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
const mobileNavigation = readFileSync(
  'src/components/site/MobileNavigation.astro',
  'utf8',
);
const brand = readFileSync('src/components/site/BrandHomeLink.astro', 'utf8');
const styles = readFileSync('src/components/site/site.css', 'utf8');

describe('public site shell', () => {
  it('centralizes stable, trailing-slash primary destinations', () => {
    expect(primaryNavigation).toEqual([
      { label: 'Inicio', href: '/' },
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
    expect(layout).toContain('<SiteFooter currentPath={Astro.url.pathname}>');
    expect(layout).toMatch(/<SiteFooter[^>]*>\s*<AnalyticsConsent \/>/);
    expect(footer).toContain('<slot />');
    expect(footer.indexOf('<slot />')).toBeLessThan(
      footer.indexOf('class="site-footer__closing visual-container"'),
    );
    expect(footer).not.toContain('<AnalyticsConsent />');
    expect(header).toContain('<header');
    expect(header).toContain('class="site-header__inner visual-container"');
    expect(footer).toContain('<footer');
    expect(brand).toContain(
      "import brandLogo from '../../assets/brand/logo-luna-tartas.png'",
    );
    expect(brand).toContain('<Image');
    expect(brand).toContain('width={230}');
    expect(brand).toContain('height={153}');
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
    expect(styles).toContain('min-block-size: 7.75rem');
    expect(styles).toContain('inline-size: 13rem');
    expect(styles).toContain('padding-block-start: 1.25rem');
    expect(styles).toContain('margin-inline-end: clamp(3.5rem, 7vw, 4.5rem)');
    expect(styles).toContain('calc((100vw - 86rem) / 2 + var(--space-2))');
    expect(styles).toMatch(
      /@media \(min-width: 60rem\) \{\s+\.site-header--home \{\s+position: absolute;/,
    );
    expect(styles).toContain('.primary-navigation--header a[aria-current=');
    expect(styles).toContain(
      ".primary-navigation--header a[aria-current='page']::before",
    );
    expect(styles).toContain('inset-inline: -1rem');
    expect(navigation).toContain('<span>Sobre Luna</span>');
    expect(navigation).toContain('primary-navigation__search');
    expect(navigation).not.toContain('<button');
  });

  it('keeps the five primary destinations available in a fixed mobile bar', () => {
    expect(layout).toContain(
      '<MobileNavigation currentPath={Astro.url.pathname} />',
    );
    expect(mobileNavigation).toContain('primaryNavigation.map');
    expect(mobileNavigation).toContain('aria-label="Navegación móvil"');
    expect(mobileNavigation).toContain("'page'");
    expect(mobileNavigation).not.toContain('<script');
    expect(styles).toContain('.mobile-navigation');
    expect(styles).toContain('position: fixed');
    expect(styles).toContain(
      'grid-template-columns: repeat(5, minmax(0, 1fr))',
    );
  });

  it('uses the official logo and non-interactive heart ornaments', () => {
    expect(header).toContain('<BrandHomeLink location="header" />');
    expect(footer).toContain(
      "import footerFlowers from '../../assets/site/footer-magnolia.png'",
    );
    expect(footer).toContain('variant="heart"');
    expect(footer).toContain('class="site-footer__flowers"');
    expect(footer).toContain('alt="Rama de magnolias rosas pintada a mano."');
    expect(header).toContain('class="site-header__divider" aria-hidden="true"');
    expect(header).toContain('preserveAspectRatio="none"');
    expect(header).toContain('focusable="false"');
    expect(header).toContain("'site-header--home': currentPath === '/'");
    expect(header).toContain('class="site-header__divider-fill"');
    expect(header).toContain('variant="heart"');
    expect(styles).toContain('.site-header__divider-line');
    expect(styles).toContain('.site-footer__heart path');
    expect(styles).toContain('pointer-events: none');
    expect(styles).not.toMatch(/#[0-9a-f]{3,8}|rgb\(/i);
  });

  it('keeps the approved brand and unconfirmed legal data separated in the shell', () => {
    expect(brand).toContain('getPublishableText(siteConfig.brandName)');
    expect(brand).toContain(
      "const accessibleBrandName = brandName ?? 'Luna Tartas'",
    );
    expect(brand).toContain('aria-label={accessibleBrandName}');
    expect(brand).toContain('alt={accessibleBrandName}');
    expect(`${layout}${header}${footer}${brand}`).not.toContain('TBD');
    expect(`${layout}${header}`).not.toMatch(/tel:|mailto:|dirección/i);
  });

  it('publishes the three approved Footer contacts as native links', () => {
    expect(footer).toContain('import { publicContactConfig }');
    expect(footer).toContain('publicContactConfig.whatsapp.href');
    expect(footer).toContain('publicContactConfig.email.href');
    expect(footer).toContain('publicContactConfig.instagram.href');
    expect(footer).toContain('<address aria-label="Canales de contacto">');
    expect(footer).not.toContain('target="_blank"');
  });

  it('composes the reference Footer with real navigation and icon-only contacts', () => {
    expect(footer).toContain('const footerProducts: readonly FooterLink[]');
    expect(footer).toContain('const footerOccasions: readonly FooterLink[]');
    expect(footer).toContain('aria-label="Navegación del pie"');
    expect(footer).toContain('<h2>Productos</h2>');
    expect(footer).toContain('<h2>Categorías</h2>');
    expect(footer).toContain('<h2>Información</h2>');
    expect(footer).toContain('<h2>Síguenos</h2>');
    expect(footer).toContain('Tartas de pañales');
    expect(footer).toContain('Papelería personalizada');
    expect(footer).toContain('Láminas personalizadas');
    expect(footer).toContain('Packs personalizados');
    expect(footer).toContain('Nacimiento');
    expect(footer).toContain('Baby shower');
    expect(footer).toContain('Cumpleaños');
    expect(footer).toContain('Primera Comunión');
    expect(footer).toContain('Y más');
    expect(footer).toContain('aria-label="Escríbenos por WhatsApp"');
    expect(footer).toContain('aria-label="Escríbenos por email"');
    expect(footer).toContain('aria-label="Síguenos en Instagram"');
    expect(footer.match(/<svg\b/g)).toHaveLength(3);
    expect(footer).toContain("'Sobre Luna'");
    expect(footer).toContain("'Cómo trabajamos'");
    expect(footer).toContain("'Preguntas frecuentes'");
    expect(footer).toContain("'Contacto'");
    expect(footer).toContain('Hecho a mano,<br />');
    expect(styles).toContain('font-family: var(--font-script)');
    expect(styles).toMatch(
      /\.site-footer__message\s*\{[^}]*overflow: visible;/s,
    );
    expect(styles).toMatch(
      /\.site-footer__flowers\s*\{[^}]*translate: 0 var\(--space-3\);/s,
    );
    expect(styles).toContain(
      'grid-template-columns: repeat(4, minmax(0, 1fr))',
    );
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

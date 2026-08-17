import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  createApprovedSiteIdentityJsonLd,
  createOrganizationJsonLd,
  createWebSiteJsonLd,
} from '../src/lib/seo/structured-data/organization';

const siteUrl = 'https://lunatartas.es/';
const logoUrl = 'https://lunatartas.es/_astro/logo-luna-tartas.png';

describe('organization structured data', () => {
  it('projects the approved public identity from the single site configuration', () => {
    const { organization, website } = createApprovedSiteIdentityJsonLd(logoUrl);

    expect(organization).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@id": "https://lunatartas.es/#organization",
        "@type": "Organization",
        "alternateName": "Luna Estudio",
        "logo": "https://lunatartas.es/_astro/logo-luna-tartas.png",
        "name": "Luna Tartas",
        "sameAs": [
          "https://www.instagram.com/lunatartas/",
        ],
        "url": "https://lunatartas.es/",
      }
    `);
    expect(website).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@id": "https://lunatartas.es/#website",
        "@type": "WebSite",
        "alternateName": "Luna Estudio",
        "name": "Luna Tartas",
        "publisher": {
          "@id": "https://lunatartas.es/#organization",
        },
        "url": "https://lunatartas.es/",
      }
    `);
    expect(JSON.stringify({ organization, website })).not.toMatch(
      /TBD|Antonio|legalName|contactPoint/i,
    );
  });

  it('omits optional properties that have not been approved', () => {
    const organization = createOrganizationJsonLd({
      name: 'Luna Tartas',
      url: siteUrl,
    });
    const website = createWebSiteJsonLd({
      name: 'Luna Tartas',
      url: siteUrl,
      publisherId: organization['@id'],
    });

    expect(organization).not.toHaveProperty('alternateName');
    expect(organization).not.toHaveProperty('logo');
    expect(organization).not.toHaveProperty('sameAs');
    expect(website).not.toHaveProperty('alternateName');
  });

  it.each([
    [
      'placeholder organization name',
      () => createOrganizationJsonLd({ name: 'TBD marca', url: siteUrl }),
    ],
    [
      'relative logo URL',
      () =>
        createOrganizationJsonLd({
          name: 'Luna Tartas',
          url: siteUrl,
          logoUrl: '/logo.png',
        }),
    ],
    [
      'relative publisher ID',
      () =>
        createWebSiteJsonLd({
          name: 'Luna Tartas',
          url: siteUrl,
          publisherId: '#organization',
        }),
    ],
  ])('rejects %s', (_case, createDocument) => {
    expect(createDocument).toThrow();
  });

  it('emits the global identity only from the homepage', () => {
    const home = readFileSync('src/pages/index.astro', 'utf8');
    const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');

    expect(home).toContain('createApprovedSiteIdentityJsonLd');
    expect(home).toContain('<JsonLd data={siteIdentity.organization} />');
    expect(home).toContain('<JsonLd data={siteIdentity.website} />');
    expect(home).toContain('logo-luna-tartas.png');
    expect(layout).not.toContain('Organization');
    expect(layout).not.toContain('WebSite');
  });
});

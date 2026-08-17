import {
  getCanonicalUrl,
  getPublishableText,
  siteConfig,
} from '../../../config/site';

const ORGANIZATION_FRAGMENT = '#organization';
const WEBSITE_FRAGMENT = '#website';

export interface OrganizationStructuredDataInput {
  readonly name: string;
  readonly alternateName?: string;
  readonly url: string;
  readonly logoUrl?: string;
  readonly sameAs?: readonly string[];
}

export interface OrganizationJsonLd {
  readonly '@context': 'https://schema.org';
  readonly '@type': 'Organization';
  readonly '@id': string;
  readonly name: string;
  readonly alternateName?: string;
  readonly url: string;
  readonly logo?: string;
  readonly sameAs?: readonly string[];
}

export interface WebSiteStructuredDataInput {
  readonly name: string;
  readonly alternateName?: string;
  readonly url: string;
  readonly publisherId: string;
}

export interface WebSiteJsonLd {
  readonly '@context': 'https://schema.org';
  readonly '@type': 'WebSite';
  readonly '@id': string;
  readonly name: string;
  readonly alternateName?: string;
  readonly url: string;
  readonly publisher: { readonly '@id': string };
}

function requiredText(value: string | undefined, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${field} must be a non-empty string`);
  }

  const text = value.trim();
  if (text.toUpperCase().includes('TBD')) {
    throw new Error(`${field} cannot contain a TBD placeholder`);
  }

  return text;
}

function absoluteHttpsUrl(value: string, field: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${field} must be an absolute HTTPS URL`);
  }

  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error(`${field} must be an absolute HTTPS URL`);
  }

  return url.href;
}

function canonicalSiteUrl(): string {
  return getCanonicalUrl();
}

export function createOrganizationJsonLd({
  name,
  alternateName,
  url,
  logoUrl,
  sameAs = [],
}: OrganizationStructuredDataInput): OrganizationJsonLd {
  const canonicalUrl = absoluteHttpsUrl(url, 'Organization URL');
  const document = {
    '@context': 'https://schema.org' as const,
    '@type': 'Organization' as const,
    '@id': `${canonicalUrl}${ORGANIZATION_FRAGMENT}`,
    name: requiredText(name, 'Organization name'),
    url: canonicalUrl,
  };

  const normalizedAlternateName =
    alternateName === undefined
      ? undefined
      : requiredText(alternateName, 'Organization alternateName');
  const normalizedLogoUrl =
    logoUrl === undefined
      ? undefined
      : absoluteHttpsUrl(logoUrl, 'Organization logo URL');
  const normalizedSameAs = sameAs.map((entry) =>
    absoluteHttpsUrl(entry, 'Organization sameAs URL'),
  );

  return {
    ...document,
    ...(normalizedAlternateName === undefined
      ? {}
      : { alternateName: normalizedAlternateName }),
    ...(normalizedLogoUrl === undefined ? {} : { logo: normalizedLogoUrl }),
    ...(normalizedSameAs.length === 0 ? {} : { sameAs: normalizedSameAs }),
  };
}

export function createWebSiteJsonLd({
  name,
  alternateName,
  url,
  publisherId,
}: WebSiteStructuredDataInput): WebSiteJsonLd {
  const canonicalUrl = absoluteHttpsUrl(url, 'WebSite URL');
  const document = {
    '@context': 'https://schema.org' as const,
    '@type': 'WebSite' as const,
    '@id': `${canonicalUrl}${WEBSITE_FRAGMENT}`,
    name: requiredText(name, 'WebSite name'),
    url: canonicalUrl,
    publisher: {
      '@id': absoluteHttpsUrl(publisherId, 'WebSite publisher ID'),
    },
  };

  return {
    ...document,
    ...(alternateName === undefined
      ? {}
      : {
          alternateName: requiredText(alternateName, 'WebSite alternateName'),
        }),
  };
}

/** Builds the global identity from the single approved site configuration. */
export function createApprovedSiteIdentityJsonLd(logoUrl?: string): {
  readonly organization: OrganizationJsonLd;
  readonly website: WebSiteJsonLd;
} {
  const name = getPublishableText(siteConfig.brandName);

  if (name === undefined) {
    throw new Error('Organization JSON-LD requires an approved brandName');
  }

  const alternateName = getPublishableText(siteConfig.brandAlternateName);
  const url = canonicalSiteUrl();
  const organization = createOrganizationJsonLd({
    name,
    alternateName,
    url,
    logoUrl,
    sameAs: siteConfig.organizationSameAs,
  });

  return {
    organization,
    website: createWebSiteJsonLd({
      name,
      alternateName,
      url,
      publisherId: organization['@id'],
    }),
  };
}

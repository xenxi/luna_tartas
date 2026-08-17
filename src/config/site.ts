export const CONTENT_STATUS = {
  ready: 'READY',
  pending: 'TBD',
} as const;

type PublishableText =
  | { status: typeof CONTENT_STATUS.pending }
  | { status: typeof CONTENT_STATUS.ready; value: string };

export interface SiteConfig {
  siteUrl: string;
  locale: string;
  language: string;
  brandName: PublishableText;
  brandAlternateName: PublishableText;
  organizationSameAs: readonly string[];
}

const configuredSite: unknown = {
  siteUrl: 'https://lunatartas.es',
  locale: 'es-ES',
  brandName: { status: CONTENT_STATUS.ready, value: 'Luna Tartas' },
  brandAlternateName: { status: CONTENT_STATUS.ready, value: 'Luna Estudio' },
  organizationSameAs: ['https://www.instagram.com/lunatartas/'],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateSiteUrl(value: unknown): string {
  if (typeof value !== 'string') {
    throw new Error('siteUrl is required and must be a string');
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error('siteUrl must be an absolute URL');
  }

  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== '/'
  ) {
    throw new Error('siteUrl must be a credential-free HTTPS origin');
  }

  return url.origin;
}

function validateLocale(value: unknown): { locale: string; language: string } {
  if (typeof value !== 'string') {
    throw new Error('locale is required and must be a string');
  }

  try {
    const locale = new Intl.Locale(value);

    if (locale.baseName !== value) {
      throw new Error('locale must use its canonical form');
    }

    return { locale: locale.baseName, language: locale.language };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'locale must use its canonical form'
    ) {
      throw error;
    }

    throw new Error('locale must be a valid BCP 47 language tag');
  }
}

function validatePublishableText(
  value: unknown,
  field: string,
): PublishableText {
  if (!isRecord(value)) {
    throw new Error(
      `${field} is required and must declare a publication status`,
    );
  }

  if (value.status === CONTENT_STATUS.pending) {
    if ('value' in value) {
      throw new Error(
        `${field} cannot contain a value while its status is TBD`,
      );
    }

    return { status: CONTENT_STATUS.pending };
  }

  if (value.status === CONTENT_STATUS.ready) {
    if (typeof value.value !== 'string' || value.value.trim() === '') {
      throw new Error(
        `${field} must contain a non-empty value when its status is READY`,
      );
    }

    if (value.value.toUpperCase().includes(CONTENT_STATUS.pending)) {
      throw new Error(`${field} cannot publish a TBD placeholder`);
    }

    return { status: CONTENT_STATUS.ready, value: value.value.trim() };
  }

  throw new Error(`${field} status must be READY or TBD`);
}

function validateOrganizationSameAs(value: unknown): readonly string[] {
  if (!Array.isArray(value)) {
    throw new Error(
      'organizationSameAs must be an array of absolute HTTPS URLs',
    );
  }

  const urls = value.map((entry) => {
    if (typeof entry !== 'string') {
      throw new Error(
        'organizationSameAs must contain only absolute HTTPS URLs',
      );
    }

    let url: URL;
    try {
      url = new URL(entry);
    } catch {
      throw new Error(
        'organizationSameAs must contain only absolute HTTPS URLs',
      );
    }

    if (url.protocol !== 'https:' || url.username || url.password) {
      throw new Error(
        'organizationSameAs must contain only absolute HTTPS URLs',
      );
    }

    return url.href;
  });

  if (new Set(urls).size !== urls.length) {
    throw new Error('organizationSameAs cannot contain duplicate URLs');
  }

  return Object.freeze(urls);
}

export function validateSiteConfig(value: unknown): SiteConfig {
  if (!isRecord(value)) {
    throw new Error('Site configuration is required');
  }

  const siteUrl = validateSiteUrl(value.siteUrl);
  const { locale, language } = validateLocale(value.locale);
  const brandName = validatePublishableText(value.brandName, 'brandName');
  const brandAlternateName = validatePublishableText(
    value.brandAlternateName,
    'brandAlternateName',
  );
  const organizationSameAs = validateOrganizationSameAs(
    value.organizationSameAs,
  );

  return Object.freeze({
    siteUrl,
    locale,
    language,
    brandName,
    brandAlternateName,
    organizationSameAs,
  });
}

export function getPublishableText(value: PublishableText): string | undefined {
  return value.status === CONTENT_STATUS.ready ? value.value : undefined;
}

export function getCanonicalUrl(pathname = '/', deploymentBase = '/'): string {
  if (!pathname.startsWith('/') || pathname.startsWith('//')) {
    throw new Error('Canonical pathname must start with exactly one slash');
  }

  if (!deploymentBase.startsWith('/') || deploymentBase.startsWith('//')) {
    throw new Error('Deployment base must start with exactly one slash');
  }

  const normalizedBase = deploymentBase.replace(/\/$/, '');
  let canonicalPathname = pathname;

  if (normalizedBase) {
    if (pathname === normalizedBase || pathname === `${normalizedBase}/`) {
      canonicalPathname = '/';
    } else if (pathname.startsWith(`${normalizedBase}/`)) {
      canonicalPathname = pathname.slice(normalizedBase.length);
    } else {
      throw new Error('Canonical pathname must be inside the deployment base');
    }
  }

  const url = new URL(canonicalPathname, siteConfig.siteUrl);

  if (url.origin !== siteConfig.siteUrl) {
    throw new Error('Canonical URL must stay on the configured site origin');
  }

  return url.href;
}

export const siteConfig = validateSiteConfig(configuredSite);

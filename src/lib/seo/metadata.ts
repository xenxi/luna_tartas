import { getCanonicalUrl, siteConfig } from '../../config/site';

const TITLE_SUFFIX = ' | Regalos personalizados';
const DEFAULT_DESCRIPTION =
  'Detalles personalizados hechos a mano para celebrar a alguien especial.';

export type MetadataPageType = 'website' | 'product';
export type MetadataRobots =
  'index,follow' | 'noindex,follow' | 'noindex,nofollow';

export interface SocialImage {
  readonly url: string;
  readonly alt: string;
}

export interface MetadataInput {
  readonly canonicalPath: string;
  readonly title: string;
  readonly description?: string;
  readonly fallbackDescription?: string;
  readonly image: SocialImage;
  readonly pageType?: MetadataPageType;
  readonly robots?: MetadataRobots;
  readonly titleSuffix?: string;
}

export interface PageMetadata {
  readonly title: string;
  readonly description: string;
  readonly canonicalUrl: string;
  readonly robots: MetadataRobots;
  readonly image: SocialImage;
  readonly pageType: MetadataPageType;
  readonly ogLocale: string;
}

function requiredText(value: string | undefined, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${field} must be a non-empty string`);
  }

  return value.trim();
}

function validateSocialImage(image: SocialImage): SocialImage {
  const alt = requiredText(image?.alt, 'Social image alt');
  const url = requiredText(image?.url, 'Social image URL');

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error('Social image URL must be absolute');
  }

  if (parsedUrl.protocol !== 'https:') {
    throw new Error('Social image URL must use HTTPS');
  }

  return Object.freeze({ url: parsedUrl.href, alt });
}

export function createPageMetadata(input: MetadataInput): PageMetadata {
  const title = requiredText(input.title, 'Metadata title');
  const description = requiredText(
    input.description ?? input.fallbackDescription ?? DEFAULT_DESCRIPTION,
    'Metadata description',
  );
  const robots = input.robots ?? 'index,follow';

  if (
    robots !== 'index,follow' &&
    robots !== 'noindex,follow' &&
    robots !== 'noindex,nofollow'
  ) {
    throw new Error(
      'Metadata robots must be index,follow, noindex,follow or noindex,nofollow',
    );
  }

  return Object.freeze({
    title: `${title}${input.titleSuffix ?? TITLE_SUFFIX}`,
    description,
    canonicalUrl: getCanonicalUrl(input.canonicalPath),
    robots,
    image: validateSocialImage(input.image),
    pageType: input.pageType ?? 'website',
    ogLocale: siteConfig.locale.replace('-', '_'),
  });
}

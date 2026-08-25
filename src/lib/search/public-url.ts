import { withBasePath } from '../site/urls';

export function localizePublicUrl(
  publicUrl: string,
  canonicalOrigin: string,
  basePath: string,
): string {
  const parsed = new URL(publicUrl);
  return parsed.origin === canonicalOrigin
    ? `${withBasePath(parsed.pathname, basePath)}${parsed.search}${parsed.hash}`
    : parsed.href;
}

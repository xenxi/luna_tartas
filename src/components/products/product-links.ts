import type { ProductLinks } from '../../lib/catalog/domain/model';

const platforms = [
  ['tiktok', 'TikTok'],
  ['instagram', 'Instagram'],
  ['wallapop', 'Wallapop'],
  ['vinted', 'Vinted'],
] as const;

export function projectProductLinks(links?: ProductLinks) {
  return platforms.flatMap(([platform, label]) => {
    const href = links?.[platform];
    return href ? [{ platform, label, href }] : [];
  });
}

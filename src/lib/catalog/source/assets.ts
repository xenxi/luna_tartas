import { readFile, realpath, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { ASSET_LIMITS } from '../../../content/schemas/product';
import type { Catalog, DraftMediaItem } from '../domain/model';
import type { CatalogValidationIssue } from '../domain/validation';

interface Dimensions {
  readonly width: number;
  readonly height: number;
}

function dimensionsAreValid(dimensions: Dimensions): boolean {
  return (
    Number.isSafeInteger(dimensions.width) &&
    Number.isSafeInteger(dimensions.height) &&
    dimensions.width > 0 &&
    dimensions.height > 0
  );
}

function pngDimensions(bytes: Buffer): Dimensions | undefined {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (
    bytes.length < 24 ||
    !bytes.subarray(0, 8).equals(signature) ||
    bytes.toString('ascii', 12, 16) !== 'IHDR'
  )
    return;
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

function jpegDimensions(bytes: Buffer): Dimensions | undefined {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return;
  const startOfFrame = new Set([
    0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce,
    0xcf,
  ]);
  let offset = 2;
  while (offset + 8 < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = bytes[offset + 1];
    offset += 2;
    if (
      marker === 0xd8 ||
      marker === 0xd9 ||
      (marker >= 0xd0 && marker <= 0xd7)
    ) {
      continue;
    }
    if (offset + 2 > bytes.length) return;
    const length = bytes.readUInt16BE(offset);
    if (length < 2 || offset + length > bytes.length) return;
    if (startOfFrame.has(marker) && length >= 7) {
      return {
        width: bytes.readUInt16BE(offset + 5),
        height: bytes.readUInt16BE(offset + 3),
      };
    }
    offset += length;
  }
}

function readUInt24LE(bytes: Buffer, offset: number): number {
  return bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16);
}

function webpDimensions(bytes: Buffer): Dimensions | undefined {
  if (
    bytes.length < 30 ||
    bytes.toString('ascii', 0, 4) !== 'RIFF' ||
    bytes.toString('ascii', 8, 12) !== 'WEBP'
  ) {
    return;
  }
  const chunk = bytes.toString('ascii', 12, 16);
  if (chunk === 'VP8X') {
    return {
      width: readUInt24LE(bytes, 24) + 1,
      height: readUInt24LE(bytes, 27) + 1,
    };
  }
  if (chunk === 'VP8 ' && bytes.length >= 30) {
    return {
      width: bytes.readUInt16LE(26) & 0x3fff,
      height: bytes.readUInt16LE(28) & 0x3fff,
    };
  }
  if (chunk === 'VP8L' && bytes[20] === 0x2f && bytes.length >= 25) {
    const b0 = bytes[21];
    const b1 = bytes[22];
    const b2 = bytes[23];
    const b3 = bytes[24];
    return {
      width: 1 + b0 + ((b1 & 0x3f) << 8),
      height: 1 + (b1 >> 6) + (b2 << 2) + ((b3 & 0x0f) << 10),
    };
  }
}

function avifDimensions(bytes: Buffer): Dimensions | undefined {
  if (bytes.length < 24 || bytes.toString('ascii', 4, 8) !== 'ftyp') return;
  const brands = bytes.toString('ascii', 8, Math.min(bytes.length, 32));
  if (!brands.includes('avif') && !brands.includes('avis')) return;
  const marker = bytes.indexOf(Buffer.from('ispe'));
  if (marker < 0 || marker + 16 > bytes.length) return;
  return {
    width: bytes.readUInt32BE(marker + 8),
    height: bytes.readUInt32BE(marker + 12),
  };
}

function svgDimensions(source: string): Dimensions | undefined {
  const svg = source.match(/<svg\b[^>]*>/i)?.[0];
  if (svg === undefined) return;
  const width = svg.match(
    /\bwidth\s*=\s*["']([0-9]+(?:\.[0-9]+)?)(?:px)?["']/i,
  );
  const height = svg.match(
    /\bheight\s*=\s*["']([0-9]+(?:\.[0-9]+)?)(?:px)?["']/i,
  );
  if (width && height) {
    return { width: Number(width[1]), height: Number(height[1]) };
  }
  const viewBox = svg.match(
    /\bviewBox\s*=\s*["']\s*[-+0-9.e]+[ ,]+[-+0-9.e]+[ ,]+([-+0-9.e]+)[ ,]+([-+0-9.e]+)\s*["']/i,
  );
  return viewBox
    ? { width: Number(viewBox[1]), height: Number(viewBox[2]) }
    : undefined;
}

function unsafeSvg(source: string): string | undefined {
  if (/<script\b/i.test(source)) return 'scripts are forbidden';
  if (/\son[a-z]+\s*=/i.test(source)) return 'event handlers are forbidden';
  if (
    /\b(?:href|xlink:href)\s*=\s*["']\s*(?:https?:|\/\/|data:|javascript:)/i.test(
      source,
    ) ||
    /url\(\s*["']?\s*(?:https?:|\/\/|data:|javascript:)/i.test(source)
  ) {
    return 'external or executable references are forbidden';
  }
  if (
    /@import\s+(?:url\()?\s*["']?\s*(?:https?:|\/\/|data:|javascript:)/i.test(
      source,
    ) ||
    /<!DOCTYPE\b[^>]*(?:SYSTEM|PUBLIC)|<!ENTITY\b[^>]*(?:SYSTEM|PUBLIC)/i.test(
      source,
    )
  ) {
    return 'external declarations are forbidden';
  }
}

function assetIssue(
  code: string,
  entity: string,
  field: string,
  value: unknown,
  expected: string,
): CatalogValidationIssue {
  return { code, entity, field, value, expected };
}

async function inspectAsset(
  root: string,
  productId: string,
  field: string,
  item: DraftMediaItem,
): Promise<readonly CatalogValidationIssue[]> {
  const entity = `products/${productId}`;
  const absoluteRoot = resolve(root);
  const absolutePath = resolve(absoluteRoot, item.src);
  if (!absolutePath.startsWith(`${absoluteRoot}${sep}`)) {
    return [
      assetIssue(
        'asset-outside-root',
        entity,
        `${field}.src`,
        item.src,
        'a relative path contained by src/assets/catalog',
      ),
    ];
  }

  let canonicalRoot: string;
  let canonicalPath: string;
  try {
    [canonicalRoot, canonicalPath] = await Promise.all([
      realpath(absoluteRoot),
      realpath(absolutePath),
    ]);
  } catch (error) {
    return [
      assetIssue(
        'asset-not-found',
        entity,
        `${field}.src`,
        item.src,
        `an existing readable image under ${absoluteRoot} (${error instanceof Error ? error.message : 'read failed'})`,
      ),
    ];
  }
  if (
    canonicalPath !== canonicalRoot &&
    !canonicalPath.startsWith(`${canonicalRoot}${sep}`)
  ) {
    return [
      assetIssue(
        'asset-outside-root',
        entity,
        `${field}.src`,
        item.src,
        'an asset whose resolved filesystem target remains inside src/assets/catalog',
      ),
    ];
  }
  const info = await stat(canonicalPath);
  if (!info.isFile()) {
    return [
      assetIssue(
        'asset-not-file',
        entity,
        `${field}.src`,
        item.src,
        'a regular image file',
      ),
    ];
  }

  const extension = extname(item.src).toLowerCase();
  const isSvg = extension === '.svg';
  const byteLimit = isSvg ? ASSET_LIMITS.svgBytes : ASSET_LIMITS.rasterBytes;
  const issues: CatalogValidationIssue[] = [];
  if (info.size > byteLimit) {
    return [
      assetIssue(
        'asset-too-large',
        entity,
        `${field}.src`,
        `${item.src} (${info.size} bytes)`,
        `at most ${byteLimit} bytes`,
      ),
    ];
  }
  const bytes = await readFile(canonicalPath);

  let dimensions: Dimensions | undefined;
  if (isSvg) {
    const source = bytes.toString('utf8');
    const unsafe = unsafeSvg(source);
    if (unsafe !== undefined) {
      issues.push(
        assetIssue(
          'unsafe-svg',
          entity,
          `${field}.src`,
          item.src,
          `an SVG without unsafe content: ${unsafe}`,
        ),
      );
    }
    dimensions = svgDimensions(source);
  } else if (extension === '.png') {
    dimensions = pngDimensions(bytes);
  } else if (extension === '.jpg' || extension === '.jpeg') {
    dimensions = jpegDimensions(bytes);
  } else if (extension === '.webp') {
    dimensions = webpDimensions(bytes);
  } else if (extension === '.avif') {
    dimensions = avifDimensions(bytes);
  }

  if (dimensions === undefined || !dimensionsAreValid(dimensions)) {
    issues.push(
      assetIssue(
        'invalid-image',
        entity,
        `${field}.src`,
        item.src,
        `valid ${extension.slice(1).toUpperCase()} content with readable positive dimensions`,
      ),
    );
  } else if (
    !isSvg &&
    dimensions.width * dimensions.height > ASSET_LIMITS.rasterPixels
  ) {
    issues.push(
      assetIssue(
        'asset-too-many-pixels',
        entity,
        `${field}.src`,
        `${dimensions.width}x${dimensions.height}`,
        `at most ${ASSET_LIMITS.rasterPixels} pixels`,
      ),
    );
  }
  return issues;
}

export async function collectAssetIssues(
  catalog: Catalog,
  assetRoot: string,
): Promise<readonly CatalogValidationIssue[]> {
  const inspections: Promise<readonly CatalogValidationIssue[]>[] = [];
  for (const product of catalog.products) {
    if (product.media === undefined) continue;
    inspections.push(
      inspectAsset(assetRoot, product.id, 'media.cover', product.media.cover),
    );
    product.media.gallery?.forEach((item, index) => {
      inspections.push(
        inspectAsset(assetRoot, product.id, `media.gallery[${index}]`, item),
      );
    });
  }
  return (await Promise.all(inspections)).flat();
}

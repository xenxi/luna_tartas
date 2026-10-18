import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { parse } from 'yaml';
import { format } from 'prettier';
import { productSchema } from '../src/content/schemas/product';
import { taxonomySchema } from '../src/content/schemas/taxonomy';
import { sourceAssetPolicy } from './source-asset-policy.mjs';

const check = process.argv.includes('--check');
const gitSha = (bytes: Buffer) =>
  createHash('sha1')
    .update(`blob ${bytes.length}\0`)
    .update(bytes)
    .digest('hex');
async function records(collection: string) {
  const directory = `src/content/${collection}`;
  return Promise.all(
    (await readdir(directory))
      .filter((f) => !f.startsWith('_') && /\.ya?ml$/.test(f))
      .sort()
      .map(async (file) => {
        const sourcePath = `${directory}/${file}`;
        const bytes = await readFile(sourcePath);
        const data = parse(bytes.toString('utf8'));
        (collection === 'products' ? productSchema : taxonomySchema).parse(
          data,
        );
        return {
          data,
          sourcePath,
          blobSha: gitSha(
            Buffer.from(bytes.toString('utf8').replace(/\r\n/g, '\n')),
          ),
        };
      }),
  );
}
const products = await Promise.all(
  (await records('products')).map(async ({ data: p, ...source }) => ({
    ...source,
    id: p.id,
    slug: p.slug,
    name: p.name ?? p.id,
    status: p.status,
    price: p.price ?? null,
    inventory: p.inventory ?? { mode: 'made-to-order' },
    categories: p.categories ?? [],
    order: p.order ?? null,
    featured: p.featured ?? false,
    cover: p.media?.cover
      ? {
          src: p.media.cover.src,
          alt: p.media.cover.alt,
          blobSha: gitSha(
            await readFile(`src/assets/catalog/${p.media.cover.src}`),
          ),
        }
      : null,
  })),
);
const taxonomies = (
  await Promise.all(
    ['categories', 'occasions', 'recipients'].map(async (collection) =>
      (await records(collection)).map(({ data: p, ...source }) => ({
        ...source,
        collection,
        id: p.id,
        slug: p.slug,
        name: p.name,
        summary: p.summary,
        status: p.status,
        order: p.order,
      })),
    ),
  )
).flat();
const contract = {
  contract: 'store-catalog',
  version: '3.0.0',
  profile: 'yaml-v2',
  documentFormat: 'yaml',
  capabilities: ['inventory', 'archived', 'product-links', 'media-gallery'],
  productPath: 'src/content/products/',
  assetRoot: 'src/assets/catalog/',
  schemaPath: 'schemas/product.schema.json',
  indexPath: 'catalog/index.json',
  sourceAssets: sourceAssetPolicy,
};
async function artifact(path: string, data: object, timestamp = false) {
  const previous = await readFile(path, 'utf8')
    .then((s) => JSON.parse(s))
    .catch(() => null);
  if (timestamp && previous) delete previous.generatedAt;
  const canonical = (value: unknown): string =>
    JSON.stringify(value, (_, v) =>
      v && typeof v === 'object' && !Array.isArray(v)
        ? Object.fromEntries(
            Object.entries(v).sort(([a], [b]) => a.localeCompare(b)),
          )
        : v,
    );
  if (check) {
    if (canonical(previous) !== canonical(data))
      throw new Error(`${path}: generated drift; run npm run studio:generate`);
  } else {
    await mkdir(path.split('/').slice(0, -1).join('/'), { recursive: true });
    await writeFile(
      path,
      await format(
        JSON.stringify(
          {
            ...data,
            ...(timestamp ? { generatedAt: new Date().toISOString() } : {}),
          },
          null,
          2,
        ),
        { parser: 'json' },
      ),
    );
  }
}
await artifact('schemas/store-catalog.json', contract);
await artifact(
  'catalog/index.json',
  {
    contract: 'store-catalog',
    contractVersion: '3.0.0',
    definition: contract,
    products,
    taxonomies,
  },
  true,
);

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'astro/zod';
import { format } from 'prettier';
import { inventorySchema, productSchema } from '../src/content/schemas/product';

export const CATALOG_CONTRACT_VERSION = '2.0.0';

const outputs = [
  {
    file: 'product.schema.json',
    id: 'https://lunatartas.es/schemas/product.schema.json',
    title: 'Luna Tartas product source contract',
    schema: productSchema,
  },
  {
    file: 'inventory.schema.json',
    id: 'https://lunatartas.es/schemas/inventory.schema.json',
    title: 'Luna Tartas inventory source contract',
    schema: inventorySchema,
  },
] as const;

async function serialize(output: (typeof outputs)[number]): Promise<string> {
  const generated = z.toJSONSchema(output.schema, {
    target: 'draft-2020-12',
    unrepresentable: 'any',
  });
  return format(
    JSON.stringify({
      ...generated,
      $id: output.id,
      title: output.title,
      'x-contractVersion': CATALOG_CONTRACT_VERSION,
    }),
    { parser: 'json' },
  );
}

async function main(): Promise<void> {
  const check = process.argv.includes('--check');
  const schemaDirectory = path.resolve('schemas');
  await mkdir(schemaDirectory, { recursive: true });
  const drift: string[] = [];

  for (const output of outputs) {
    const filePath = path.join(schemaDirectory, output.file);
    const expected = await serialize(output);
    if (check) {
      const current = await readFile(filePath, 'utf8').catch(() => '');
      if (current !== expected) drift.push(output.file);
    } else {
      await writeFile(filePath, expected, 'utf8');
    }
  }

  if (drift.length > 0) {
    throw new Error(
      `Generated catalog schema drift: ${drift.join(', ')}. Run npm run schema:generate.`,
    );
  }
}

await main();

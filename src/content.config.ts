import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { productSchema } from './content/schemas/product';
import { taxonomySchema } from './content/schemas/taxonomy';

function defineYamlCollection<
  Schema extends typeof taxonomySchema | typeof productSchema,
>(base: string, schema: Schema) {
  return defineCollection({
    loader: glob({
      pattern: '**/[^_]*.{yml,yaml}',
      base,
      generateId: ({ data, entry }) =>
        typeof data.id === 'string' ? data.id : entry,
    }),
    schema,
  });
}

const categories = defineYamlCollection(
  './src/content/categories',
  taxonomySchema,
);
const occasions = defineYamlCollection(
  './src/content/occasions',
  taxonomySchema,
);
const recipients = defineYamlCollection(
  './src/content/recipients',
  taxonomySchema,
);
const products = defineYamlCollection('./src/content/products', productSchema);

export const collections = { categories, occasions, recipients, products };

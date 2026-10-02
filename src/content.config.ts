import { defineCollection } from 'astro:content';
import { productSchema } from './content/schemas/product';
import { taxonomySchema } from './content/schemas/taxonomy';
import { yamlCollectionLoader } from './lib/catalog/source/yaml-loader';

function defineYamlCollection<
  Schema extends typeof taxonomySchema | typeof productSchema,
>(base: string, schema: Schema) {
  return defineCollection({
    loader: yamlCollectionLoader(base),
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

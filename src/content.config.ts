import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { taxonomySchema } from './content/schemas/taxonomy';

function defineTaxonomyCollection(base: string) {
  return defineCollection({
    loader: glob({
      pattern: '**/[^_]*.{yml,yaml}',
      base,
      generateId: ({ data, entry }) =>
        typeof data.id === 'string' ? data.id : entry,
    }),
    schema: taxonomySchema,
  });
}

const categories = defineTaxonomyCollection('./src/content/categories');
const occasions = defineTaxonomyCollection('./src/content/occasions');
const recipients = defineTaxonomyCollection('./src/content/recipients');

export const collections = { categories, occasions, recipients };

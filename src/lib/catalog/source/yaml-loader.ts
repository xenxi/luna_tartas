import { readFile } from 'node:fs/promises';
import { glob, type Loader } from 'astro/loaders';
import { parseDocument } from 'yaml';

/** Use the same YAML 1.2 date semantics as Studio and the contract fixtures. */
export function parseCatalogYaml(source: string, filePath: string) {
  const document = parseDocument(source, { version: '1.2', schema: 'core' });
  if (document.errors.length > 0) {
    throw new Error(`${filePath}: ${document.errors[0]?.message}`);
  }
  return document.toJS() as Record<string, unknown>;
}

export function yamlCollectionLoader(base: string): Loader {
  const loader = glob({
    pattern: '**/[^_]*.{yml,yaml}',
    base,
    generateId: ({ data, entry }) =>
      typeof data.id === 'string' ? data.id : entry,
  });

  return {
    name: 'catalog-yaml-loader',
    load: (context) =>
      loader.load({
        ...context,
        // Keep glob's file watching, IDs and deletion handling. Reparse the
        // original text before validation: converting Date objects back to
        // strings would silently repair invalid dates such as February 31.
        parseData: async ({ filePath, ...entry }) => {
          if (!filePath) throw new Error('Catalog YAML requires a source file');
          const data = parseCatalogYaml(
            await readFile(filePath, 'utf8'),
            filePath,
          );
          return context.parseData({
            ...entry,
            filePath,
            data: data as typeof entry.data,
          });
        },
      }),
  };
}

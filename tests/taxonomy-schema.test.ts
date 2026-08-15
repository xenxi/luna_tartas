import { describe, expect, it } from 'vitest';
import {
  taxonomySchema,
  type TaxonomyData,
} from '../src/content/schemas/taxonomy';
import { readYamlFixture } from './helpers/yaml-fixtures';

function diagnostics(relativePath: string): string[] {
  const result = taxonomySchema.safeParse(
    readYamlFixture(`taxonomies/${relativePath}`),
  );

  if (result.success) {
    return [];
  }

  return result.error.issues.map((issue) => {
    const field = issue.path.length > 0 ? issue.path.join('.') : '$';
    return `${relativePath}:${field}: ${issue.message}`;
  });
}

describe('taxonomy YAML schema', () => {
  it.each(['valid/category.yml', 'valid/occasion.yaml', 'valid/recipient.yml'])(
    'accepts the non-publishable fixture %s',
    (relativePath) => {
      const parsed: TaxonomyData = taxonomySchema.parse(
        readYamlFixture(`taxonomies/${relativePath}`),
      );

      expect(parsed.status).toBe('draft');
      expect(parsed.context).toBe('FIXTURE');
    },
  );

  it.each([
    ['invalid/bad-id.yml', ':id:'],
    ['invalid/bad-slug.yml', ':slug:'],
    ['invalid/bad-status.yml', ':status:'],
    ['invalid/empty-seo.yml', ':seo:'],
    ['invalid/missing-summary.yml', ':summary:'],
    ['invalid/negative-order.yml', ':order:'],
    ['invalid/published-fixture.yml', ':status:'],
    ['invalid/unknown-field.yml', ':$:'],
  ])('rejects %s with an actionable field path', (relativePath, field) => {
    const messages = diagnostics(relativePath);

    expect(messages).not.toHaveLength(0);
    expect(messages.some((message) => message.includes(field))).toBe(true);
  });

  it('trims editorial text at the source boundary', () => {
    const fixture = readYamlFixture('taxonomies/valid/occasion.yaml');
    const parsed = taxonomySchema.parse({
      ...(fixture as Record<string, unknown>),
      name: '  Nombre sintético  ',
    });

    expect(parsed.name).toBe('Nombre sintético');
  });
});

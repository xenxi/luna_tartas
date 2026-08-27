import { parseDocument } from 'yaml';

const fixtures = import.meta.glob('../fixtures/**/*.{yml,yaml}', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const sharedContractFixtures = import.meta.glob(
  '../../schemas/fixtures/**/*.{yml,yaml}',
  {
    eager: true,
    import: 'default',
    query: '?raw',
  },
) as Record<string, string>;

export function readYamlFixture(relativePath: string): unknown {
  const fixturePath = `../fixtures/${relativePath}`;
  const source = fixtures[fixturePath];

  if (source === undefined) {
    throw new Error(`${fixturePath}: Fixture not found`);
  }

  const document = parseDocument(source);

  if (document.errors.length > 0) {
    throw new Error(
      `${fixturePath}: ${document.errors[0]?.message ?? 'Invalid YAML'}`,
    );
  }

  return document.toJS();
}

export function readSharedContractFixture(relativePath: string): unknown {
  const fixturePath = `../../schemas/fixtures/${relativePath}`;
  const source = sharedContractFixtures[fixturePath];

  if (source === undefined) {
    throw new Error(`${fixturePath}: Fixture not found`);
  }

  const document = parseDocument(source);
  if (document.errors.length > 0) {
    throw new Error(
      `${fixturePath}: ${document.errors[0]?.message ?? 'Invalid YAML'}`,
    );
  }
  return document.toJS();
}

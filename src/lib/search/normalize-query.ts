export function normalizeQuery(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function tokenizeQuery(value: string): readonly string[] {
  const normalized = normalizeQuery(value);
  return normalized === '' ? [] : normalized.split(' ');
}

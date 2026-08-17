import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export const REDIRECT_MAP = resolve('docs/seo/redirect-map.csv');

function parseCsvLine(line) {
  const fields = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      fields.push(field);
      field = '';
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error(`Unclosed CSV quote: ${line}`);
  fields.push(field);
  return fields;
}

export async function loadRedirectMap(file = REDIRECT_MAP) {
  const lines = (await readFile(file, 'utf8'))
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter(Boolean);
  const headers = parseCsvLine(lines.shift());

  return lines.map((line, index) => {
    const values = parseCsvLine(line);
    if (values.length !== headers.length) {
      throw new Error(
        `Redirect map row ${index + 2} has ${values.length} fields`,
      );
    }
    return Object.fromEntries(
      headers.map((header, offset) => [header, values[offset]]),
    );
  });
}

export function validateRedirectMap(rows) {
  const errors = [];
  const sources = new Map();
  const redirects = new Map();

  for (const row of rows) {
    if (!row.source_path.startsWith('/')) {
      errors.push(`${row.source_path}: source must be root-relative`);
    }
    if (sources.has(row.source_path)) {
      errors.push(`${row.source_path}: duplicate source`);
    }
    sources.set(row.source_path, row);

    if (!['exact', 'pattern'].includes(row.match_type)) {
      errors.push(
        `${row.source_path}: unsupported match type ${row.match_type}`,
      );
    }
    if (!['preserve', 'redirect', 'gone'].includes(row.decision)) {
      errors.push(`${row.source_path}: unsupported decision ${row.decision}`);
    }
    if (!['preserve', 'discard'].includes(row.query_policy)) {
      errors.push(`${row.source_path}: query policy must be explicit`);
    }

    if (row.decision === 'redirect') {
      if (row.status_code !== '301' || !row.target.startsWith('/')) {
        errors.push(
          `${row.source_path}: redirects require a root-relative 301 target`,
        );
      }
      redirects.set(row.source_path, row.target.split('#', 1)[0]);
    } else if (row.decision === 'gone') {
      if (row.status_code !== '410' || row.target) {
        errors.push(
          `${row.source_path}: gone entries require an empty 410 target`,
        );
      }
    } else if (row.status_code !== '200' || row.target !== row.source_path) {
      errors.push(
        `${row.source_path}: preserved entries must retain their 200 path`,
      );
    }
  }

  for (const [source, target] of redirects) {
    const targetRow = sources.get(target);
    if (target === source) errors.push(`${source}: redirect loop`);
    if (targetRow?.decision === 'redirect') {
      errors.push(`${source}: redirect chain through ${target}`);
    }
  }

  return errors;
}

import { loadRedirectMap, validateRedirectMap } from './redirect-map.mjs';

const rows = await loadRedirectMap();
const errors = validateRedirectMap(rows);
const originArgument = process.argv.find((argument) =>
  argument.startsWith('--origin='),
);

if (originArgument) {
  const origin = new URL(originArgument.slice('--origin='.length));
  for (const row of rows.filter(({ match_type }) => match_type === 'exact')) {
    const url = new URL(row.source_path, origin);
    url.search = row.query_policy === 'preserve' ? '?m92_probe=1' : '';
    const response = await fetch(url, { redirect: 'manual' });
    const expected = Number(row.status_code);
    if (response.status !== expected) {
      errors.push(`${url}: expected ${expected}, received ${response.status}`);
      continue;
    }

    if (row.decision === 'redirect') {
      const location = response.headers.get('location');
      const expectedTarget = new URL(row.target, origin);
      if (row.query_policy === 'preserve')
        expectedTarget.search = '?m92_probe=1';
      if (!location || new URL(location, origin).href !== expectedTarget.href) {
        errors.push(
          `${url}: expected Location ${expectedTarget.href}, received ${location}`,
        );
      }
    }
  }
}

if (errors.length) {
  throw new Error(`Redirect verification failed:\n- ${errors.join('\n- ')}`);
}

const counts = Object.fromEntries(
  ['preserve', 'redirect', 'gone'].map((decision) => [
    decision,
    rows.filter((row) => row.decision === decision).length,
  ]),
);
console.log(
  `Redirect map verified: ${rows.length} entries (${counts.preserve} preserve, ${counts.redirect} redirect, ${counts.gone} gone).`,
);

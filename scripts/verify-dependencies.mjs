import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const lock = JSON.parse(await readFile('package-lock.json', 'utf8'));
const root = lock.packages[''];
const failures = [];

for (const [group, dependencies] of Object.entries({
  dependencies: root.dependencies,
  devDependencies: root.devDependencies,
})) {
  for (const [name, version] of Object.entries(dependencies ?? {})) {
    if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
      failures.push(`${group}.${name} is not pinned exactly (${version})`);
    }
  }
}

const allowedLicenses = new Set([
  '0BSD',
  'Apache-2.0',
  'Apache-2.0 AND LGPL-3.0-or-later',
  'Apache-2.0 AND LGPL-3.0-or-later AND MIT',
  'BlueOak-1.0.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'CC0-1.0',
  'ISC',
  'LGPL-3.0-or-later',
  'MIT',
  'Python-2.0',
]);

let dependencyCount = 0;
for (const [pathname, entry] of Object.entries(lock.packages)) {
  if (!pathname.startsWith('node_modules/')) continue;
  dependencyCount += 1;
  if (typeof entry.license !== 'string') {
    failures.push(`${pathname} has no declared license`);
  } else if (!allowedLicenses.has(entry.license)) {
    failures.push(`${pathname} has unevaluated license ${entry.license}`);
  }
}

const acceptedAdvisories = new Set([
  1120680, // esbuild dev server on Windows; local trusted development only.
  1124066, // sharp/libvips; build-time processing of reviewed repository images only.
  1139373, // Astro dynamic spread attribute names; no untrusted templates/runtime rendering.
  1139375, // Astro hydrated view transitions; project has no islands or view transitions.
  1139376, // Astro view-transition properties; project has no view transitions.
]);

let audit;
const npmCli = process.env.npm_execpath;
if (typeof npmCli !== 'string' || npmCli === '') {
  throw new Error('Run this gate through npm run verify:dependencies');
}
try {
  execFileSync(process.execPath, [npmCli, 'audit', '--json'], {
    encoding: 'utf8',
    stdio: 'pipe',
  });
  audit = { vulnerabilities: {}, metadata: { vulnerabilities: { total: 0 } } };
} catch (error) {
  if (typeof error.stdout !== 'string' || error.stdout.trim() === '')
    throw error;
  audit = JSON.parse(error.stdout);
}

const seenAdvisories = new Set();
for (const vulnerability of Object.values(audit.vulnerabilities ?? {})) {
  for (const advisory of vulnerability.via ?? []) {
    if (typeof advisory !== 'object') continue;
    seenAdvisories.add(advisory.source);
    if (!acceptedAdvisories.has(advisory.source)) {
      failures.push(
        `npm advisory ${advisory.source} (${advisory.severity}) is not evaluated`,
      );
    }
  }
}
for (const advisory of acceptedAdvisories) {
  if (!seenAdvisories.has(advisory)) {
    failures.push(
      `accepted npm advisory ${advisory} is stale and must be reviewed`,
    );
  }
}

if (failures.length > 0) {
  console.error(`Dependency review FAIL (${failures.length})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Dependency review PASS (${dependencyCount} locked packages, exact direct versions, evaluated licenses, ${seenAdvisories.size} accepted non-runtime advisories, 0 unevaluated advisories).`,
);

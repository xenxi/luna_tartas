import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';

const artifactDirectory = resolve(process.env.DIST_DIR ?? 'dist');
const outputFile = resolve(
  process.argv[2] ??
    'docs/quality/evidence/m8-6-release-candidate/artifact-manifest.json',
);
const files = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  entries.sort((left, right) => left.name.localeCompare(right.name, 'en'));

  for (const entry of entries) {
    const pathname = join(directory, entry.name);
    if (entry.isDirectory()) await walk(pathname);
    else if (entry.isFile()) files.push(pathname);
  }
}

await walk(artifactDirectory);
if (files.length === 0) throw new Error('Release artifact is empty.');

const records = [];
for (const file of files) {
  const contents = await readFile(file);
  const metadata = await stat(file);
  records.push({
    path: relative(artifactDirectory, file).replaceAll('\\', '/'),
    bytes: metadata.size,
    sha256: createHash('sha256').update(contents).digest('hex'),
  });
}

records.sort((left, right) => left.path.localeCompare(right.path, 'en'));
const rootInput = records
  .map(({ path, bytes, sha256 }) => `${sha256} ${bytes} ${path}\n`)
  .join('');
const manifest = {
  schemaVersion: 1,
  candidateId: 'm8.6-rc.1',
  algorithm: 'sha256(file) + bytes + POSIX path, sorted by path',
  artifact: {
    fileCount: records.length,
    totalBytes: records.reduce((total, record) => total + record.bytes, 0),
    rootSha256: createHash('sha256').update(rootInput).digest('hex'),
  },
};

await mkdir(dirname(outputFile), { recursive: true });
await writeFile(outputFile, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(
  `Release manifest PASS: ${manifest.candidateId}, ${manifest.artifact.fileCount} files, ${manifest.artifact.totalBytes} bytes, sha256:${manifest.artifact.rootSha256}`,
);

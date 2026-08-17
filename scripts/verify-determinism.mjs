import { cp, mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const project = resolve('.');
const dist = resolve('dist');
const snapshot = await mkdtemp(join(process.env.TEMP ?? process.env.TMP ?? '.', 'luna-dist-'));
function build() {
  const command =
    process.platform === 'win32'
      ? process.env.ComSpec ?? 'cmd.exe'
      : 'npm';
  const args =
    process.platform === 'win32' ? ['/d', '/s', '/c', 'npm run build'] : ['run', 'build'];
  return exec(command, args, {
    cwd: project,
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
  });
}

async function files(directory, prefix = '') {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = join(prefix, entry.name);
    if (entry.isDirectory()) result.push(...(await files(join(directory, entry.name), relative)));
    else result.push(relative);
  }
  return result.sort();
}

async function digest(pathname) {
  return createHash('sha256').update(await readFile(pathname)).digest('hex');
}

try {
  await build();
  await cp(dist, snapshot, { recursive: true });
  await build();

  const [first, second] = await Promise.all([files(snapshot), files(dist)]);
  if (JSON.stringify(first) !== JSON.stringify(second)) {
    throw new Error('build file sets differ between consecutive runs');
  }
  for (const file of second) {
    const [before, after] = await Promise.all([
      digest(join(snapshot, file)),
      digest(join(dist, file)),
    ]);
    if (before !== after) throw new Error(`build output differs for ${file}`);
  }
  console.log(`Deterministic build PASS: ${second.length} files match across two builds.`);
} finally {
  await rm(snapshot, { recursive: true, force: true });
}

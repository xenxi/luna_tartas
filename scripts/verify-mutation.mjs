import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const temporaryDist = await mkdtemp(
  join(process.env.TEMP ?? process.env.TMP ?? '.', 'luna-mutated-dist-'),
);
const artifactScript = resolve('scripts/verify-artifact.mjs');

try {
  await cp(resolve('dist'), temporaryDist, { recursive: true });
  const homepage = join(temporaryDist, 'index.html');
  const original = await readFile(homepage, 'utf8');
  await writeFile(homepage, original.replace('href="/productos/"', 'href=""'));

  try {
    await exec(process.execPath, [artifactScript], {
      cwd: resolve('.'),
      env: { ...process.env, DIST_DIR: temporaryDist },
    });
  } catch {
    console.log(
      'Mutation gate PASS: empty critical discovery link was rejected by verify:artifact.',
    );
    process.exit(0);
  }

  throw new Error('verify:artifact accepted a mutated critical discovery link');
} finally {
  await rm(temporaryDist, { recursive: true, force: true });
}

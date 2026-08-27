import { execFileSync } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';

const root = resolve('.');
const dist = resolve(process.env.DIST_DIR ?? 'dist');
const failures = [];

const secretPatterns = [
  ['private key', new RegExp(`BEGIN (?:RSA |EC |OPENSSH )?PRIVATE ${'KEY'}`)],
  ['GitHub token', new RegExp(`(?:github_pat_|gh[pousr]_)[A-Za-z0-9_]{20,}`)],
  ['AWS access key', new RegExp(`AKIA[0-9A-Z]{16}`)],
  ['Google API key', new RegExp(`AIza[0-9A-Za-z_-]{30,}`)],
  ['npm token', new RegExp(`npm_[A-Za-z0-9]{30,}`)],
  ['Slack token', new RegExp(`xox[baprs]-[A-Za-z0-9-]{20,}`)],
  ['Stripe secret', new RegExp(`sk_(?:live|test)_[A-Za-z0-9]{16,}`)],
  [
    'assigned credential',
    new RegExp(
      `(?:password|passwd|client_secret|api_key|access_token)\\s*[:=]\\s*["'][^"'\\s]{8,}["']`,
      'i',
    ),
  ],
];

function git(...args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' });
}

function inspectSecrets(contents, location) {
  if (contents.includes('\0')) return;
  for (const [label, pattern] of secretPatterns) {
    if (pattern.test(contents))
      failures.push(`${location}: potential ${label}`);
  }
}

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const pathname = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(pathname)));
    else files.push(pathname);
  }
  return files;
}

const tracked = git('ls-files', '-z').split('\0').filter(Boolean);
for (const pathname of tracked) {
  inspectSecrets(
    await readFile(join(root, pathname), 'utf8'),
    `worktree:${pathname}`,
  );
}

const revisions = git('rev-list', '--all').trim().split(/\s+/).filter(Boolean);
const historyPattern = [
  'BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY',
  '(github_pat_|gh[pousr]_)[A-Za-z0-9_]{20,}',
  'AKIA[0-9A-Z]{16}',
  'AIza[0-9A-Za-z_-]{30,}',
  'npm_[A-Za-z0-9]{30,}',
  'xox[baprs]-[A-Za-z0-9-]{20,}',
  'sk_(live|test)_[A-Za-z0-9]{16,}',
  '(password|passwd|client_secret|api_key|access_token)[[:space:]]*[:=][[:space:]]*["\'][^"\'[:space:]]{8,}["\']',
].join('|');
for (const revision of revisions) {
  try {
    const matches = git(
      'grep',
      '-I',
      '-l',
      '-E',
      historyPattern,
      revision,
      '--',
      '.',
    )
      .trim()
      .split(/\r?\n/)
      .filter(Boolean);
    for (const pathname of matches) {
      failures.push(
        `history:${revision.slice(0, 12)}:${pathname}: potential credential`,
      );
    }
  } catch (error) {
    if (error.status !== 1) throw error;
  }
}

const gitignore = await readFile(join(root, '.gitignore'), 'utf8');
for (const rule of [
  'node_modules/',
  'dist/',
  '.astro/',
  '.env',
  '.env.*',
  '*.log',
]) {
  if (!gitignore.split(/\r?\n/).includes(rule)) {
    failures.push(`.gitignore: missing ${rule}`);
  }
}

const workflowFiles = (await walk(join(root, '.github', 'workflows'))).filter(
  (file) => ['.yml', '.yaml'].includes(extname(file)),
);
for (const file of workflowFiles) {
  const pathname = relative(root, file).replaceAll('\\', '/');
  const workflow = await readFile(file, 'utf8');
  for (const match of workflow.matchAll(/uses:\s*([^\s#]+)/g)) {
    if (!/@[0-9a-f]{40}$/i.test(match[1])) {
      failures.push(`${pathname}: action is not pinned to a commit SHA`);
    }
  }
  if (!/^permissions:\s*\r?\n\s{2}contents: read\s*$/m.test(workflow)) {
    failures.push(
      `${pathname}: workflow default permissions are not contents: read`,
    );
  }
}

const deployWorkflow = await readFile(
  join(root, '.github', 'workflows', 'deploy.yml'),
  'utf8',
);
if (!/persist-credentials: false/.test(deployWorkflow)) {
  failures.push('deploy workflow: checkout credentials remain persisted');
}
if (
  !/\n\s{4}permissions:\s*\r?\n\s{6}pages: write\s*\r?\n\s{6}id-token: write/.test(
    deployWorkflow,
  )
) {
  failures.push(
    'deploy workflow: elevated permissions are not isolated to deploy',
  );
}

const artifactFiles = await walk(dist);
const approvedHosts = new Set([
  'lunatartas.es',
  'wa.me',
  'www.instagram.com',
  'antoniomdm.dev',
  'www.aepd.es',
  'www.boe.es',
  'business.safety.google',
]);
const prohibitedPublicFields =
  /(?:licenseOrPermission|rightsEvidence|approvedBy|approvedAt|sourceDate|src\/assets|tests\/fixtures)/i;

for (const file of artifactFiles) {
  const pathname = relative(dist, file).replaceAll('\\', '/');
  if (extname(file) === '.map')
    failures.push(`dist:${pathname}: source map exposed`);
  if (
    !['.css', '.html', '.js', '.json', '.map', '.svg', '.txt', '.xml'].includes(
      extname(file),
    )
  )
    continue;
  const contents = await readFile(file, 'utf8');
  inspectSecrets(contents, `dist:${pathname}`);
  if (prohibitedPublicFields.test(contents)) {
    failures.push(`dist:${pathname}: internal editorial field or path exposed`);
  }
  if (extname(file) !== '.html') continue;
  for (const match of contents.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (/^(?:\/|#)/.test(value)) continue;
    if (value.startsWith('mailto:')) {
      if (value !== 'mailto:encargosmgr@gmail.com') {
        failures.push(`dist:${pathname}: unapproved email link`);
      }
      continue;
    }
    let url;
    try {
      url = new URL(value);
    } catch {
      failures.push(`dist:${pathname}: invalid external URL`);
      continue;
    }
    if (url.protocol !== 'https:' || !approvedHosts.has(url.hostname)) {
      failures.push(
        `dist:${pathname}: unapproved external origin ${url.origin}`,
      );
    }
  }
  for (const match of contents.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)) {
    if (!/rel="[^"]*noopener[^"]*"/i.test(match[0])) {
      failures.push(`dist:${pathname}: target=_blank without noopener`);
    }
  }
  for (const match of contents.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  )) {
    try {
      JSON.parse(match[1]);
    } catch {
      failures.push(`dist:${pathname}: invalid JSON-LD`);
    }
  }
}

const catalog = JSON.parse(await readFile(join(dist, 'catalog.json'), 'utf8'));
if (prohibitedPublicFields.test(JSON.stringify(catalog))) {
  failures.push('dist:catalog.json: internal catalog fields exposed');
}

if (failures.length > 0) {
  console.error(`Security review FAIL (${failures.length})`);
  for (const failure of [...new Set(failures)]) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Security review PASS (${tracked.length} tracked files, ${revisions.length} revisions, ${workflowFiles.length} workflows, ${artifactFiles.length} artifact files; no secrets, source maps, unsafe links, invalid JSON-LD, or internal catalog fields).`,
);

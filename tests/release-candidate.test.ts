import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(process.cwd());

describe('release candidate contract', () => {
  it('keeps a reproducible artifact identity command', () => {
    const packageJson = readFileSync(resolve(root, 'package.json'), 'utf8');
    const script = readFileSync(
      resolve(root, 'scripts/create-release-manifest.mjs'),
      'utf8',
    );

    expect(packageJson).toContain(
      '"release:manifest": "node scripts/create-release-manifest.mjs"',
    );
    expect(script).toContain("createHash('sha256')");
    expect(script).toContain("candidateId: 'm8.6-rc.1'");
    expect(script).not.toContain('new Date');
  });
});

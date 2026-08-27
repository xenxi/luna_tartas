import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const securityGate = readFileSync('scripts/verify-security.mjs', 'utf8');
const dependencyGate = readFileSync('scripts/verify-dependencies.mjs', 'utf8');
const ci = readFileSync('.github/workflows/ci.yml', 'utf8');
const deploy = readFileSync('.github/workflows/deploy.yml', 'utf8');
const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');

describe('M8.5 security gates', () => {
  it('scans tracked files, full Git history and the public artifact', () => {
    expect(securityGate).toContain("git('ls-files', '-z')");
    expect(securityGate).toContain("git('rev-list', '--all')");
    expect(securityGate).toContain("extname(file) === '.map'");
    expect(securityGate).toContain('prohibitedPublicFields');
    expect(securityGate).toContain('approvedHosts');
    expect(securityGate).toContain("'www.aepd.es'");
    expect(securityGate).toContain("'www.boe.es'");
    expect(securityGate).toContain("'business.safety.google'");
    expect(securityGate).toContain('JSON.parse(match[1])');
  });

  it('keeps dependency versions, licenses and advisories reviewed', () => {
    expect(dependencyGate).toContain("[npmCli, 'audit', '--json']");
    expect(dependencyGate).toContain('audit.auditReportVersion !== 2');
    expect(dependencyGate).toContain('audit.error !== undefined');
    expect(dependencyGate).toContain('allowedLicenses');
    expect(dependencyGate).toContain('acceptedAdvisories');
    expect(ci).toContain('npm run verify:dependencies');
  });

  it('uses complete history and minimum workflow permissions', () => {
    expect(ci).toContain('fetch-depth: 0');
    expect(deploy).toContain('fetch-depth: 0');
    expect(ci).toMatch(/permissions:\s*\n\s+contents: read/);
    expect(deploy).toMatch(/permissions:\s*\n\s+contents: read/);
    expect(deploy).toMatch(
      /permissions:\s*\n\s+pages: write\s*\n\s+id-token: write/,
    );
    expect(deploy).toContain('persist-credentials: false');
  });

  it('limits referrer data on external navigation', () => {
    expect(layout).toContain(
      '<meta name="referrer" content="strict-origin-when-cross-origin" />',
    );
  });
});

import { resolve, sep } from 'node:path';

function normalizeBase(base) {
  if (base === '') return '/';
  if (!base?.startsWith('/') || base.startsWith('//')) {
    throw new Error(`Deployment base must start with exactly one slash: ${base}`);
  }
  return base.replace(/\/+$/, '') || '/';
}

export function artifactPath(url, dist, deploymentBase = '/') {
  if (!url?.startsWith('/') || url.startsWith('//')) {
    throw new Error(`Expected a local artifact URL, got ${url}`);
  }

  const pathname = decodeURIComponent(url.split(/[?#]/, 1)[0]);
  const base = normalizeBase(deploymentBase);
  let assetPath = pathname;

  if (base !== '/') {
    if (pathname !== base && !pathname.startsWith(`${base}/`)) {
      throw new Error(`Asset URL is outside deployment base: ${url}`);
    }
    assetPath = pathname.slice(base.length) || '/';
  }

  const file = resolve(dist, assetPath.slice(1));
  const root = resolve(dist);
  if (file !== root && !file.startsWith(`${root}${sep}`)) {
    throw new Error(`Asset path escapes dist: ${url}`);
  }
  return file;
}

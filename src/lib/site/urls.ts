export function withBasePath(path: string, basePath: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;

  const base = basePath === '/' ? '' : basePath.replace(/\/+$/, '');
  return `${base}${path}` || '/';
}

export function withoutBasePath(path: string, basePath: string): string {
  const base = basePath === '/' ? '' : basePath.replace(/\/+$/, '');
  if (!base) return path;
  if (path === base) return '/';
  return path.startsWith(`${base}/`) ? path.slice(base.length) : path;
}

const exactGonePaths = new Set([
  '/servicios/curriculum',
  '/dashboard',
  '/apps',
  '/editor/tarjeta-nombre',
  '/editor/flyer',
  '/pedidos',
  '/perfil',
  '/suscripcion',
]);

export function isLegacyGonePath(pathname) {
  return exactGonePaths.has(pathname) || /^\/pedidos\/[^/]+$/.test(pathname);
}

export default {
  async fetch(request) {
    const { pathname } = new URL(request.url);
    if (!isLegacyGonePath(pathname)) return fetch(request);

    return new Response('Este recurso ya no esta disponible.\n', {
      status: 410,
      headers: {
        'Cache-Control': 'public, max-age=300',
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex',
      },
    });
  },
};

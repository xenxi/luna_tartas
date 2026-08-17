# M9.2 — Inventario y ejecución de redirects

**Estado:** preparado y bloqueado en activación externa  
**Auditoría:** 2026-08-17, Europe/Madrid  
**Dominio:** `lunatartas.es`

## Hallazgo que reabre el inventario

El reconocimiento de M0.1 había sido inconcluso por restricciones de red. La
repetición desde una salida sin ese bloqueo confirma una aplicación Flutter
anterior activa detrás de Cloudflare: HTTP y HTTPS responden `200`, el HTML
declara «Luna Estudio | Regalos personalizados» y el bundle público contiene
rutas de marketing, editores y área privada. El bundle observado mide
3.951.001 bytes y su SHA-256 es
`F584BA23A595E424A4EFD86DF32218D4DDAFFBD72D00F8A30D289D1DCA8CD3A5`.

`robots.txt` responde `200 text/plain`, pero concatena las directivas
gestionadas por Cloudflare con el shell HTML de Flutter. `sitemap.xml` responde
`200 text/html` con ese mismo shell en vez de un sitemap. `www` continúa en
`NXDOMAIN`. Las búsquedas públicas exactas por dominio no devolvieron URLs
indexadas; esto no sustituye Search Console, logs ni backlinks.

## Decisiones

La fuente de verdad es [`redirect-map.csv`](redirect-map.csv): una fila por
ruta conocida, sin duplicados. Se conservan seis equivalencias semánticas como
`301`; los parámetros de consulta se preservan para no perder atribución de
campañas. Nueve rutas de herramientas o área privada sin equivalente aprobado
responden `410`; sus consultas se descartan y no se redirigen a la portada.
La portada mantiene `/`. No se crean redirects por similitud léxica ni para
rutas no observadas.

Los destinos con fragmento son deliberados: `/#work-showcase` conserva la
intención de inspiración y `/#custom-idea` lleva al CTA de contacto. Los demás
destinos existen en el sitemap del candidato M9.1. Ningún destino vuelve a ser
origen de un redirect, por lo que el mapa no contiene cadenas ni loops.

## Implementación preparada

- [`cloudflare-bulk-redirects.csv`](cloudflare-bulk-redirects.csv) tiene el
  formato de importación de Bulk Redirects sin cabecera. Al omitir el esquema
  de origen, cada entrada aplica a HTTP y HTTPS. La lista debe asociarse a una
  Bulk Redirect Rule para quedar activa; importar la lista por sí solo no
  ejecuta redirects.
- [`../../infra/cloudflare/legacy-gone-worker.mjs`](../../infra/cloudflare/legacy-gone-worker.mjs)
  materializa las respuestas `410` y deja pasar el resto hacia el origen. Debe
  publicarse en una ruta edge que cubra `lunatartas.es/*`, después de revisar
  que no interfiera con reglas existentes.
- `npm run verify:redirects` valida decisiones, query policy, duplicados,
  cadenas y loops. Tras activar el edge,
  `npm run verify:redirects -- --origin=https://lunatartas.es` comprueba los
  estados y cabeceras `Location` reales sin seguir redirects.

Cloudflare documenta que Bulk Redirects admite `301` y conservación de query,
que una fuente sin esquema cubre HTTP y HTTPS y que una lista sólo se ejecuta
cuando una regla la referencia. Las respuestas `410` no pertenecen a Bulk
Redirects y por eso se resuelven mediante código edge.

## Orden de activación y rollback

1. Exportar zona, Bulk/Single Redirects, Page Rules, Workers/routes y TTL sin
   credenciales; guardar la referencia privada y el owner.
2. Importar el CSV en una lista nueva desactivada y verificar las seis filas.
3. Publicar el Worker con una ruta de prueba no productiva o usar la preview de
   Cloudflare; comprobar `410`, `X-Robots-Tag: noindex` y passthrough.
4. Activar primero el Worker y después la Bulk Redirect Rule en la ventana de
   M9.3. Comprobar una sola respuesta por ruta, sin salto intermedio.
5. Ejecutar el checker con `--origin`, muestrear manualmente HTTP/HTTPS y query,
   y registrar IDs/versiones sin tokens.
6. Ante una regresión, desactivar la regla y la ruta Worker, restaurar el export
   previo y repetir el smoke del origen anterior.

## Bloqueo verificable

No se proporcionó acceso, export ni conexión de Cloudflare y no hay credenciales
versionables. El edge productivo sigue devolviendo `200` para las quince rutas
de aplicación muestreadas; por tanto no existen todavía `301`/`410` reales y
M9.2 no puede marcarse `DONE`. Tampoco se aportaron exports de Search Console,
logs o backlinks para demostrar cobertura privada. No se avanza a M9.3 hasta
que el propietario active o autorice las reglas y el checker externo pase.

## Evidencia reproducible

- `npm run verify:redirects`: mapa local, duplicados, query, chains y loops.
- `npm test -- tests/redirect-map.test.ts`: contrato de mapa y respuestas 410.
- `curl --max-time 20 --write-out ... https://lunatartas.es/<ruta>`: las 16
  muestras exactas respondieron `200 text/html` el 2026-08-17 antes del cambio.
- `Resolve-DnsName`: apex detrás de Cloudflare; `www` en `NXDOMAIN`.
- URL técnica Pages `https://xenxi.github.io/luna_tartas/`: `200`.

Referencias autoritativas: [formato CSV de Bulk Redirects](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/reference/csv-file-format/),
[parámetros y matching](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/reference/parameters/)
y [respuesta condicional en Workers](https://developers.cloudflare.com/workers/examples/conditional-response/).

# Launch Log

## Ventana de estabilización: 2026-08-21

Release observado: `https://lunatartas.es/`, con el artefacto productivo
desplegado por GitHub Pages y el dominio canónico configurado en M9.3.

### Baseline y checks

| Área | Resultado | Evidencia reproducible | Owner |
| --- | --- | --- | --- |
| Uptime y HTTPS | PASS | `GET /`, `/productos/`, ficha representativa, `sitemap.xml` y `robots.txt`: HTTP 200; tiempos observados 58–709 ms. `www` responde HTTP 301 directo al apex HTTPS. | Operación / Luna |
| 4xx y redirects | PASS | `npm run verify:redirects -- --origin=https://lunatartas.es`: 16 entradas, 6 redirects, 9 gone, 1 preserve; sin chains/loops. | SEO / Luna |
| Crawl e indexability | PASS | `npm run verify:crawl`: 24 URLs indexables; `npm run verify:seo`: 24 HTML; sitemap y robots disponibles. | SEO / Luna |
| Links y conversión | PASS | `npm run verify:links`: 25 HTML, 0 rotos, 0 huérfanos; `npm run verify:artifact`: 8 productos y CTAs críticos presentes. | Producto / Luna |
| CWV/lab estático | PASS | `npm run verify:performance`: 25 HTML, 99 imágenes responsivas, transferencia inicial máxima a 375 px de 107.798 bytes. | Performance / Luna |
| Eventos | PASS | `npm test -- tests/analytics-adapter.test.ts tests/analytics-instrumentation.test.ts tests/product-whatsapp.test.ts`: 18/18; cubre `page_view`, `view_item`, `contact_whatsapp`, consentimiento, payload sin PII y navegación nativa. La recepción real y Realtime quedaron verificadas en M9.4. | Analytics / Luna |
| Seguridad del artefacto | PASS | `npm run verify:security`: sin secretos, source maps, enlaces inseguros ni campos internos. | Operación / Luna |

### Incidentes y alertas

- Incidentes críticos abiertos: 0.
- Alertas activas: ninguna nueva; los checks anteriores son la monitorización
  reproducible vigente para la ventana de V1.
- Cadencia: revisión manual diaria durante los primeros 7 días; repetir smoke
  HTTP, redirects, crawl, eventos y performance después de cada deploy.
- Escalado: cualquier HTTP 5xx sostenido, pérdida de canonical/sitemap,
  redirect incorrecto, CTA WhatsApp roto o evento con PII bloquea el release y
  se escala al owner indicado antes de publicar cambios.

### Decisión de rollback

No se requiere rollback. Si aparece un incidente crítico, detener nuevos
deploys, revertir hacia delante al último commit productivo verde mediante el
workflow de Pages y repetir los checks de esta tabla antes de reabrir tráfico.
La reversión no se ejecuta durante esta ventana porque no existe una anomalía.

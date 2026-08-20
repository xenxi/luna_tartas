# Runbook de analytics (M7.5 / M9.4)

**Revision:** 2026-08-20
**Owner:** titular de Luna Tartas
**Proveedor previsto:** Google Analytics 4, Google tag directo
**Estado:** configuracion externa confirmada y `analytics.enabled: true` con Measurement ID productivo; pendiente deploy y validacion humana post-despliegue

Este runbook no sustituye la validacion humana de produccion. La carga de Google sigue bloqueada hasta el opt-in explicito del usuario.

## Decisiones consolidadas

La fuente duradera de las decisiones de plataforma, privacidad, eventos y
entornos es [`analytics-decision.md`](analytics-decision.md). Esta seccion
resume el estado operativo confirmado para que no vuelva a tratarse como TBD:

- Proveedor: GA4 directo, sin Google Tag Manager ni Google Consent Mode.
- Propiedad/stream: `Luna Tartas` / `Luna Tartas - Produccion`.
- URL: `https://lunatartas.es`.
- Measurement ID: `G-DV6KHV0YMW`.
- Enhanced Measurement activada; page views, scrolls y outbound clicks activos;
  medicion de formularios desactivada. El adaptador usa `send_page_view: false`
  y emite el `page_view` propio una sola vez para evitar duplicacion.
- Google Signals, User-ID, datos proporcionados por usuarios y vinculaciones
  publicitarias desactivados o no utilizados.
- Email automatico oculto; query parameters sensibles propios no identificados,
  por lo que no se configura ocultacion de parametros.
- Retencion: eventos 2 meses, usuarios 14 meses; borrado/reset con nueva
  actividad activado.
- No se excluye trafico interno por IP; `Internal Traffic` fue eliminado por
  IP administrativa dinamica. Visitas administrativas consentidas en
  produccion pueden contabilizarse.

## Contrato

| Evento | Ruta/disparador | Payload | Duplicacion esperada |
| --- | --- | --- | --- |
| `page_view` | cualquier pagina instrumentada al cargar | `page_path` sin query/hash | 1 por carga |
| `view_item` | `/productos/{slug}/` al cargar una ficha | `item_id`, `item_name`, `item_category` | 1 por carga |
| `contact_whatsapp` | CTA en `/`, `/productos/`, `/productos/{slug}/`, `/categorias/{slug}/`, `/ocasiones/{slug}/`, `/regalos/{slug}/` o footer | `source` y, en producto, campos `item_*` | 1 por activacion |

No se instrumenta `/404/`. No se envia seleccion de tarjetas ni contenido del mensaje. Campos prohibidos: nombre del visitante, email, telefono, direccion, mensaje/URL de WhatsApp, texto personalizado, formulario, query, fragmento, User ID e identificadores personales o de dispositivo.

## Matriz de QA

| Caso | Preparacion | Accion | Resultado esperado |
| --- | --- | --- | --- |
| Configuracion apagada | `analytics.enabled: false` | Navegar y activar CTAs | 0 Google tag, requests o eventos |
| Sin consentimiento | Config habilitada controlada, storage vacio | Navegar y activar CTA | Banner visible y 0 requests/eventos |
| Rechazo | Pulsar `Rechazar` | Recargar y activar CTAs | `luna-analytics-consent=denied`; 0 requests |
| Aceptacion | Measurement ID sintetico solo en test | Pulsar `Aceptar` | Un script Google tag y eventos sanitizados |
| Retirada | Estado `granted` | Pulsar `Retirar consentimiento` | Estado `denied`; recarga que elimina Google tag y ningun evento posterior |
| Fallo del tracker | Simular error de script/adaptador | Activar WhatsApp | El enlace navega sin excepcion ni espera |
| Almacenamiento bloqueado | Storage lanza | Usar controles | Fallback denegado y navegacion intacta |
| Trafico interno | Navegador owner con consentimiento rechazado; sin filtro por IP | Visitar produccion | Desarrollo/preview no envia; visitas administrativas consentidas pueden contabilizarse |
| Localhost/tests | Runtime fuera de `https://lunatartas.es` | Intentar cargar/evento | No-op, sin script ni comando |
| Duplicacion | Una carga y una activacion | Inspeccionar DebugView | Un evento de cada tipo esperado |
| PII y URL | Inspeccionar DOM/dataLayer/Network | Buscar campos prohibidos | 0 coincidencias |

## Evidencia reproducible local

Vitest usa un documento, `dataLayer` y frontera de red simulados; no contacta Google. Verifica configuracion off, falta de consentimiento, origen no productivo, carga unica, `send_page_view: false`, payload permitido y rechazo de campos extra/PII.

```text
REQUEST [mocked] GET https://www.googletagmanager.com/gtag/js?id=[SYNTHETIC_TEST_ID]
EVENT   [not sent] view_item item_id=[PUBLIC_ID] item_name=[PUBLIC_NAME]
ASSERT  no phone | no email | no WhatsApp message | no query | no hash
```

## Evidencia manual de Search Console

Comprobacion manual confirmada el 2026-08-20:

- Propiedad de dominio `lunatartas.es`: accesible y verificada.
- Sitemap enviado: `https://lunatartas.es/sitemap.xml`.
- Sitemap procesado correctamente; Search Console detecto 24 paginas en la
  comprobacion.
- Home `https://lunatartas.es/`: disponible para Google, indexable e indexada
  segun la comprobacion realizada.
- Listado `https://lunatartas.es/productos/`: prueba en tiempo real correcta,
  disponible para Google, indexable e indexacion solicitada manualmente.
- Producto `https://lunatartas.es/productos/tarta-de-panales-personalizada/`:
  descubierto mediante sitemap; inicialmente figuraba como "Descubierta:
  actualmente sin indexar" y sin ultimo rastreo. La prueba en tiempo real
  posterior confirmo disponibilidad, indexabilidad, un Product snippet valido
  y breadcrumbs validos; la indexacion fue solicitada manualmente.

Solicitar indexacion no significa indexacion inmediata. El estado de esta
ficha no se convierte en un criterio de exito que exija indexacion inmediata.

## Activacion productiva

1. Propiedad Search Console verificada; sitemap procesado con 24 paginas.
2. URL Inspection registrada para home, `/productos/` y una ficha publicada; no se promete indexacion inmediata.
3. Propiedad y Web Data Stream GA4 creados para `https://lunatartas.es`; Measurement ID `G-DV6KHV0YMW` aprobado.
4. Revisar en GA4 retencion, Google Signals, User-ID, datos proporcionados por usuarios, Ads y medicion mejorada; conservar solo la configuracion aprobada.
5. Mantener sin filtro por IP el trafico interno por su naturaleza dinamica; el runtime excluye localhost, preview, tests y otros hosts.
6. Politica/cookies, textos de consentimiento y activacion productiva aprobados.
7. Configurar el Measurement ID real y `enabled: true` en un cambio revisado.
8. Desplegar y comprobar sin aceptar: 0 requests a Google; rechazar y recargar: 0 requests.
9. Aceptar en un navegador de prueba sin PII; verificar una carga de Google tag.
10. Recorrer home, ficha y CTA; comprobar `page_view`, `view_item` y `contact_whatsapp` una vez cada uno en Realtime/DebugView y payload sin PII.
11. Retirar consentimiento y confirmar que no se emiten eventos posteriores. Ante PII, duplicados o regresion, volver a `enabled: false` mediante revert hacia delante.

Registrar solo fecha, commit, rutas, nombres/conteos agregados y PASS/FAIL. No versionar capturas con IDs de cliente, IPs, cuerpos de requests ni datos de visitantes.

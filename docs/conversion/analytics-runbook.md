# Runbook de analytics (M7.5)

**Fecha de revisión:** 2026-08-17  
**Owner operativo:** titular de Luna Tartas  
**Proveedor previsto:** Matomo On-Premise en instancia dedicada dentro del EEE  
**Estado actual:** medición desactivada; no existe endpoint productivo en el repositorio

Este documento es una guía de verificación, no una autorización para activar medición. La identidad legal, la política publicada, el acuerdo aplicable y la instancia aprobada son requisitos de M9.4 y deben existir antes de cambiar `src/config/site.ts` a `enabled: true`.

## Contrato de eventos

`source_page` siempre es un pathname canónico en minúsculas, con barra final y sin query ni fragmento. `price` y `currency` aparecen juntos u omitidos; el precio está en unidades mayores y nunca se sustituye por cero.

| Evento | Rutas y disparador | Payload permitido | Duplicación esperada |
| --- | --- | --- | --- |
| `view_item` | `/productos/{slug}/`, al cargar una ficha publicada | `product_id`, `product_name`, `category`, `price?`, `currency?`, `source_page` | 1 por carga de ficha |
| `select_item` | `/`, `/productos/`, `/categorias/`, `/categorias/{slug}/`, `/ocasiones/`, `/ocasiones/{slug}/`, `/regalos/`, `/regalos/{slug}/`, y relacionados en ficha; activación de una tarjeta | payload de producto + `list_id`, `position` | 1 por activación |
| `whatsapp_click` | `/productos/{slug}/`; CTA de producto por puntero o teclado | payload de producto + `cta_location` | 1 por activación |
| `custom_whatsapp_click` | `/`, índices/landings y cualquier página con CTA de idea personalizada; CTA de propuesta por puntero o teclado | `cta_location`, `source_page` | 1 por activación |

No se instrumentan `/404/`, showcases ni navegación de enlaces que no declaren una marca de analytics. El footer puede producir `custom_whatsapp_click` en las páginas que lo renderizan.

Campos prohibidos en payloads, atributos, cola, logs y capturas: teléfono, email, nombre del visitante, mensaje o URL de WhatsApp, dirección, IP completa, cookies, User ID, identificadores de dispositivo, query, fragmento, formulario y cualquier dato sensible.

## Matriz de QA

| Caso | Preparación | Acción | Resultado esperado |
| --- | --- | --- | --- |
| Configuración apagada | `analytics.enabled: false` | Abrir home, ficha y listado | 0 scripts Matomo, 0 requests al proveedor, 0 eventos en cola; la navegación y WhatsApp funcionan |
| Sin consentimiento | Configuración habilitada en entorno controlado; `localStorage` sin clave | Abrir una ficha y activar un CTA | Banner visible, 0 scripts/requests de Matomo y ningún evento enviado |
| Rechazo | Estado inicial sin clave; pulsar `Rechazar` | Recargar y activar CTAs | `luna-analytics-consent=denied`, 0 requests y enlaces nativos intactos |
| Aceptación | Endpoint de prueba HTTPS sin credenciales y `siteId` ficticio | Pulsar `Aceptar`, abrir ficha y activar tarjeta/CTA | Una carga `defer` de `matomo.js`; comandos de privacidad (`disableCookies`, DNT), eventos sanitizados y navegación sin espera añadida |
| Retirada | Estado `granted` y tracker cargado | Pulsar `Retirar consentimiento` y activar un CTA | Estado `denied`; no se encola ni envía ningún evento posterior |
| Fallo del tracker | Adaptador o script responde error | Activar CTA WhatsApp | No hay excepción ni `preventDefault`; el `href` navega |
| Almacenamiento bloqueado | `localStorage` lanza al leer/escribir | Abrir banner y probar rechazo/aceptación | Estado seguro `denied` en la siguiente lectura; la navegación sigue operativa |
| Tráfico interno | Exclusión configurada sólo en la instancia Matomo | Visitar una ruta desde navegador del owner | La instancia excluye el tráfico; la evidencia no contiene rango ni IP |
| Duplicación | Cargar ficha, volver atrás/adelante y pulsar una tarjeta una vez | Comparar cola por carga/activación | Una `view_item` por carga y una selección por activación; no se duplica por componente |
| PII y URL | Inspección de cola, DOM y Network | Buscar teléfono, email, query, hash y URL de WhatsApp | 0 coincidencias; sólo pathname canónico y campos del contrato |

## Sesión de debug reproducible

**Fecha:** 2026-08-17  
**Entorno:** build local de producción, configuración pública vigente (`analytics.enabled: false`) y harness Vitest con endpoint ficticio `https://metrics.example.com`.  
**Método:** se inspeccionaron los modos apagado, sin consentimiento y consentimiento concedido mediante runtime de documento/cola simulado; no se contactó ningún proveedor ni se usó una URL real de Matomo.

Resultado del harness:

- Apagado y sin consentimiento: `track()` devuelve `false`, `load()` devuelve `false`, cola vacía, scripts vacíos.
- Consentimiento concedido: se añade exactamente un script `defer`/`async` con URL ficticia `https://metrics.example.com/matomo.js`; la cola contiene privacidad, endpoint ficticio, `siteId` ficticio y un `view_item` sanitizado.
- Payload con `phone` o query en `source_page`: rechazado (`undefined`).
- Fallo del adaptador: `trackSafely()` no propaga excepción.
- El enlace nativo no es cancelado por la instrumentación; no se llama `preventDefault`.

Captura de red redactada, correspondiente a ese harness y no a tráfico real:

```text
REQUEST  [blocked by test harness] GET https://metrics.example.com/matomo.js
          mode=defer async=true
          endpoint=[REDACTED] site_id=[PUBLIC_TEST_ID]

TRACK    [not sent] event=view_item
          product_id=[PUBLIC_CATALOG_ID]
          product_name=[PUBLIC_CATALOG_NAME]
          category=[PUBLIC_CATEGORY_ID]
          source_page=/productos/[SLUG]/
          price=[OPTIONAL_MINOR-FREE_VALUE] currency=EUR

ASSERT   no phone | no email | no WhatsApp message | no full URL
         no query | no hash | no IP | no cookie | no user/device ID
```

La recepción productiva no puede declararse hasta que exista la instancia aprobada y se complete una sesión autorizada. En esa sesión, Network debe mostrar sólo la carga diferida y las peticiones al origen aprobado; nunca se debe guardar el cuerpo de una petición ni una IP en el repositorio. La recepción controlada queda demostrada por la cola sanitizada del harness y los tests, no por un endpoint externo inventado.

## Procedimiento postrelease

1. Confirmar que `analytics.enabled` sigue en `false` durante preview, staging y cualquier entorno no productivo.
2. Antes de habilitar producción, registrar fuera de Git la aprobación de la titular, identidad/política publicada, acuerdo de encargo, origen EEE, `siteId`, exclusión interna y retención de 13 meses.
3. Habilitar sólo el endpoint HTTPS aprobado y ejecutar el caso de aceptación en una ventana de debug; aceptar consentimiento en un navegador de prueba sin datos personales.
4. Verificar en Network la carga única diferida, el origen aprobado, cookies deshabilitadas, DNT y recepción de los cuatro nombres de evento.
5. Recorrer home, listado, taxonomía, ficha, relacionado y ambos CTAs; comparar la matriz anterior y comprobar que las URLs conservan query/hash fuera del payload.
6. Rechazar y retirar consentimiento; confirmar ausencia de eventos posteriores y navegación normal.
7. Probar la exclusión de tráfico interno con el procedimiento de la instancia, sin anotar IPs/rangos en tickets, capturas o commits.
8. Configurar alertas básicas en Matomo/monitor de la instancia: ausencia de recepción durante 24 horas tras una ventana de tráfico consentido, caída del endpoint y desviación brusca de eventos. Las alertas no deben incluir payloads ni datos personales.
9. Guardar únicamente una fecha, ruta, nombres de evento, conteos agregados, versión del commit y resultado PASS/FAIL. Borrar capturas de Network tras la revisión.
10. Ante una petición inesperada, PII, duplicación o fallo de navegación, volver a `enabled: false` mediante revert hacia delante y abrir incidencia con la titular.

## Evidencia y límites

La evidencia pública de esta submilestone es el test contractual y esta captura redactada. No contiene endpoint, credenciales, `siteId` productivo, IP, rango interno, tráfico real ni conversación de WhatsApp. La recepción real, la revisión legal y la operación de alertas quedan condicionadas a M9.4 y al alta aprobada de la instancia.

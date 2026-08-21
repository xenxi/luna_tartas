# Estrategia de conversión y analytics

## Conversión

El recorrido prioritario es `ver -> entender -> desear -> contactar`. El CTA principal de producto es “Pedir por WhatsApp”; el CTA secundario transversal es “Cuéntanos tu idea”. Ninguno sustituye información esencial del producto.

## Contrato WhatsApp

- Teléfono y plantilla base viven en configuración global validada.
- Un builder puro genera URL HTTPS oficial y mensaje codificado.
- El mensaje de producto incluye el saludo aprobado, nombre, intención de consulta y URL canónica.
- El mensaje personalizado incluye contexto/origen cuando sea útil, sin inventar producto.
- La función admite datos Unicode, espacios y URLs sin doble codificación.
- Si falta configuración requerida, el build falla; no se publica un enlace vacío/roto.
- El enlace es un `<a>` funcional sin JavaScript. La medición es enhancement y no impide navegar.

El copy de producto aprobado el 2026-08-17 es:

```text
Hola, me interesa {productName} 😊

He visto este producto en vuestra web:
{productUrl}

¿Podríais darme más información sobre disponibilidad, precio y opciones de personalización?

¡Gracias!
```

- `{productName}` procede del nombre público exacto de un producto publicado y `{productUrl}` es su URL canónica absoluta.
- El CTA de producto abre WhatsApp en un contexto nuevo con `target="_blank"` y `rel="noopener noreferrer"`.
- La aprobación editorial pertenece a Luna, con fecha 2026-08-17 y fuente “aprobación directa del propietario del contenido para M5.1”.

## Taxonomía mínima de eventos

| Evento | Momento | Parámetros permitidos |
| --- | --- | --- |
| `page_view` | carga de pagina | `page_path` canonico |
| `view_item` | ficha visible/cargada | `item_id`, `item_name`, `item_category` |
| `contact_whatsapp` | activacion de CTA WhatsApp | `source` y campos `item_*` opcionales |

No se envían contenido del mensaje, teléfono, nombre del visitante ni otros datos personales. Los parámetros ausentes se omiten; no se falsifican ceros/precios.

## Desacoplamiento

Los componentes declaran nombre/payload mediante una API pequeña o atributos de datos. Un adaptador cliente único traduce al proveedor elegido. Sin consentimiento/proveedor, los enlaces siguen funcionando y el código no arroja errores.

La revision de M9.4 adopta GA4 directo, sin GTM, con `enabled: true` en la configuracion productiva aprobada y consentimiento analitico explicito antes de cargar Google tag. El contrato permanente esta en [`analytics-decision.md`](analytics-decision.md) y la evidencia manual cerrada el 2026-08-21 esta en [`analytics-runbook.md`](analytics-runbook.md).

## Medición y QA

- Vistas no se duplican por navegación/hidratación.
- El evento de click se intenta antes de navegar sin introducir una demora perceptible.
- Debug de proveedor y una captura/matriz de eventos sirven como evidencia.
- Se documentan retencion y propiedad de cuentas; no se usa exclusion por IP porque la conexion administrativa es dinamica y se acepta que visitas administrativas consentidas en produccion puedan contabilizarse.
- Tras release se verifica recepción real sin registrar datos personales.

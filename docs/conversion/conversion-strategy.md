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
| `view_item` | ficha visible/cargada | `product_id`, `product_name`, `category`, `price`, `currency`, `source_page` |
| `select_item` | selección desde listado | campos de producto + `list_id`, `position`, `source_page` |
| `whatsapp_click` | activación CTA de producto | campos de producto + `cta_location`, `source_page` |
| `custom_whatsapp_click` | activación CTA personalizado | `cta_location`, `source_page` |

No se envían contenido del mensaje, teléfono, nombre del visitante ni otros datos personales. Los parámetros ausentes se omiten; no se falsifican ceros/precios.

## Desacoplamiento

Los componentes declaran nombre/payload mediante una API pequeña o atributos de datos. Un adaptador cliente único traduce al proveedor elegido. Sin consentimiento/proveedor, los enlaces siguen funcionando y el código no arroja errores.

La decisión de M7.1 selecciona Matomo On-Premise dentro del EEE, con estado inicial desactivado y consentimiento analítico explícito antes de cargarlo. El contrato de configuración, retención, exclusiones y diccionario definitivo están en [`analytics-decision.md`](analytics-decision.md). La identidad legal y la política pública se completan en M9.4; hasta entonces producción no habilita medición.

## Medición y QA

- Vistas no se duplican por navegación/hidratación.
- El evento de click se intenta antes de navegar sin introducir una demora perceptible.
- Debug de proveedor y una captura/matriz de eventos sirven como evidencia.
- Se documentan exclusión de tráfico interno, retención y propiedad de cuentas cuando aplique.
- Tras release se verifica recepción real sin registrar datos personales.

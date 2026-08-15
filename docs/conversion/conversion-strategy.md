# Estrategia de conversión y analytics

## Conversión

El recorrido prioritario es `ver -> entender -> desear -> contactar`. El CTA principal de producto es “Pedir por WhatsApp”; el CTA secundario transversal es “Cuéntanos tu idea”. Ninguno sustituye información esencial del producto.

## Contrato WhatsApp

- Teléfono y plantilla base viven en configuración global validada.
- Un builder puro genera URL HTTPS oficial y mensaje codificado.
- El mensaje de producto incluye saludo, nombre, intención de pedido y URL canónica.
- El mensaje personalizado incluye contexto/origen cuando sea útil, sin inventar producto.
- La función admite datos Unicode, espacios y URLs sin doble codificación.
- Si falta configuración requerida, el build falla; no se publica un enlace vacío/roto.
- El enlace es un `<a>` funcional sin JavaScript. La medición es enhancement y no impide navegar.

El copy final, teléfono, saludo y política de nueva pestaña son `TBD` de negocio/UX.

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

Proveedor, measurement ID, modo de consentimiento y banner legal son `TBD`. M7.1 decide con requisitos de privacidad y rendimiento; no se presupone GA4.

## Medición y QA

- Vistas no se duplican por navegación/hidratación.
- El evento de click se intenta antes de navegar sin introducir una demora perceptible.
- Debug de proveedor y una captura/matriz de eventos sirven como evidencia.
- Se documentan exclusión de tráfico interno, retención y propiedad de cuentas cuando aplique.
- Tras release se verifica recepción real sin registrar datos personales.


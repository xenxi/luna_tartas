# Contrato conceptual del catálogo

Este documento fija semántica y límites. Los nombres exactos de campos y schemas ejecutables se cierran en M2 sin romper estas reglas.

La procedencia y aprobación editorial de cada entidad se controla con el contrato de readiness en [`../product/content-readiness.md`](../product/content-readiness.md). Un fixture puede servir para probar schemas o variantes, pero no es contenido publicable.

## Entidades

### Product

- `id`: identidad estable, no derivada del nombre visible.
- `slug`: segmento URL único y estable.
- `name`, `summary` y contenido descriptivo.
- `status`: al menos `draft` o `published`.
- relaciones por ID con una o más categorías y cero o más ocasiones/destinatarios.
- `price`: unión discriminada `fixed | from | on_request`; importe en unidades menores enteras cuando exista y moneda ISO válida.
- `media`: portada y galería ordenada con referencia, alt y metadatos verificables.
- `customization`: capacidades y texto aprobado, no un motor de configuración.
- orden/destacado explícitos y opcionales.
- overrides SEO opcionales; nunca reemplazan los mínimos obligatorios.

M2.2 concreta el source Product como unión discriminada por `status`:

- Todo producto exige `id`, `slug` y `status`. Un `draft` puede omitir bloques editoriales completos; si incluye uno, ese bloque debe ser válido y completo. `context: FIXTURE` sólo existe en drafts de test.
- Un `published` exige `name`, `summary`, `description`, al menos una categoría, `price`, `media.cover`, `customization` y `approval`. Ocasiones, destinatarios, `featured`, `order`, galería y SEO son opcionales.
- `price` es exactamente uno de `fixed | from | on_request`. `fixed/from` exigen `amountMinor` entero positivo dentro del rango seguro y `currency` ISO 4217 en mayúsculas; `on_request` prohíbe importe y moneda.
- `media.cover` es único por estructura y `gallery` conserva orden editorial con máximo 20 elementos. Cada elemento exige path relativo minúsculo bajo `src/assets/catalog` y alt no vacío; un publicado exige además owner, permiso/licencia y evidencia de derechos. La existencia, tamaño y dimensiones reales se contrastan en M2.4.
- `customization` es `none` o `available`; el segundo caso exige al menos una opción y copy aprobado. No modela combinaciones, inventario ni precio dinámico.
- `approval` exige fuente, fechas ISO reales, responsable y ausencia de placeholders `TBD`. Los objetos y variantes son estrictos para rechazar campos ambiguos.

Los hard limits exportados para el resolver de assets son raster de 8 MiB/24 MP, SVG de 250 KiB y máximo 20 elementos de galería. El schema de M2.2 valida forma y extensión; M2.4 comparará esos límites con archivos reales.

### Category, Occasion y Recipient

Taxonomías con `id`, `slug`, nombre, resumen/contenido, estado/orden y metadata opcional. `Recipient` representa la intención pública `/regalos/{slug}/`; el nombre del modelo no determina el copy visible.

M2.1 concreta un único shape source para las tres colecciones:

| Campo | Regla source |
| --- | --- |
| `id` | obligatorio, 1–80 caracteres, minúsculas ASCII/números separados por guiones simples |
| `slug` | obligatorio, misma forma que `id`; es estable aunque cambie `name` |
| `name` | texto obligatorio, 1–100 caracteres después de trim |
| `summary` | copy obligatorio, 1–200 caracteres después de trim |
| `description` | copy ampliado opcional, 1–2000 caracteres después de trim |
| `status` | `draft \| published` |
| `order` | entero obligatorio mayor o igual que cero |
| `seo` | objeto opcional y no vacío; `title` 1–60 y/o `description` 1–160 |
| `context` | sólo admite `FIXTURE`; cuando existe obliga a `status: draft` |

Los objetos son estrictos: un campo desconocido falla para hacer visibles los errores editoriales. Las colecciones reales pueden permanecer vacías hasta recibir contenido aprobado; los documentos sintéticos viven exclusivamente bajo `tests/fixtures`.

### Configuración global

Marca, URL canónica, locale, moneda permitida, WhatsApp y analytics no se repiten por producto. Las excepciones requieren un campo explícito y justificado.

## Invariantes de publicación

- IDs únicos globalmente dentro de cada tipo y slugs únicos dentro de su espacio de URL.
- Slugs en minúsculas, ASCII, con guiones; no se regeneran por cambiar el nombre.
- Toda relación apunta a una entidad existente y publicable según la política definida.
- Producto publicado: nombre, resumen, al menos una categoría, portada válida y texto alternativo significativo.
- `fixed/from` requieren importe positivo válido y moneda admitida; `on_request` no publica un Offer ficticio.
- No hay dos portadas ni referencias de medios fuera del directorio permitido.
- Una entidad draft no aparece en HTML público, sitemap, JSON-LD ni `/catalog.json`.
- Una entidad sólo puede pasar a `published` cuando sus campos obligatorios, medios, derechos, copy y aprobación editorial constan en la evidencia de readiness; `TBD` y fixtures permanecen fuera de toda proyección pública.
- URLs, texto SEO y campos estructurados respetan longitud/forma cuando el schema lo pueda validar; la semántica se audita además.

## Pipeline y errores

```text
parse/schema -> map DTO -> aggregate validation -> immutable public catalog -> query/projection
```

Los errores deben agruparse cuando sea posible y mostrar entidad/archivo, campo, valor problemático y corrección esperada. El build y CI fallan antes de generar producción.

## Medios

Las referencias editoriales apuntan a activos web mantenibles en `src/assets/catalog`. El pipeline conoce dimensiones, genera variantes modernas y preserva una alternativa compatible. Originales de archivo gigantes quedan fuera del Git ordinario. Los límites iniciales de fuente/repositorio están ratificados en [`architecture.md`](architecture.md#política-de-imágenes-y-salud-del-repositorio) y M8.2 los calibra con muestras reales sin relajar silenciosamente los hard limits.

## Proyección pública

`/catalog.json` incluye sólo datos publicados necesarios para descubrimiento: ID, nombre, URL canónica, resumen, taxonomías, precio público cuando exista, portada optimizada y capacidades de personalización. Excluye configuración interna, rutas de filesystem, drafts y datos no confirmados.

## Evolución del source

Un futuro gestor escribe el mismo contrato editorial mediante commits. Un CMS/API futuro implementará otro adaptador hacia el mismo modelo de dominio. Ningún componente deberá conocer la procedencia.

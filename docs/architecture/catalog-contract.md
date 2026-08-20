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

Marca, URL canónica, locale, moneda permitida, WhatsApp y analytics no se repiten por producto. Las excepciones requieren un campo explícito y justificado. La configuración de analytics es una única sección global validada con proveedor GA4, Measurement ID público opcional, estado `enabled` y consentimiento obligatorio; no contiene secretos ni datos de visitante. Su contrato operativo se fija en [`../conversion/analytics-decision.md`](../conversion/analytics-decision.md).

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

### Límite source → domain (M2.3)

Content Collections queda encapsulado en `src/lib/catalog/source/`. El DTO de entrada conserva únicamente la colección, el ID emitido por el loader, el `filePath` cuando Astro lo proporciona y los datos ya validados por el schema. `loadCatalog()` es el único punto de carga: lee las cuatro colecciones una vez en paralelo, memoiza la promesa para el proceso de build y entrega un `Catalog` de dominio.

El mapping es explícito para taxonomías, variantes `draft|published`, las tres variantes de precio, medios, personalización, SEO y aprobación. Copia objetos y arrays en lugar de exponer los datos de Astro; `context: FIXTURE` es metadata exclusiva del source y no cruza al dominio. Las colecciones se mantienen separadas y cada taxonomía recibe un discriminador de dominio estable: `categories → category`, `occasions → occasion` y `recipients → recipient`.

Los tipos de `src/lib/catalog/domain/` son TypeScript plano, readonly en su superficie y no importan Astro, schemas, layouts, páginas ni componentes. El adaptador depende del dominio, nunca al revés. No existe una interfaz de repositorio o multi-source anticipada: una fuente futura deberá mapear hacia el mismo `Catalog` cuando haya un caso real.

Un fallo propio del mapping lanza `CatalogSourceError` con `collection`, `entryId`, `filePath` opcional y `field`; su mensaje comienza por `archivo-o-colección:campo:` y conserva la causa cuando existe. La validación agregada de identidad, relaciones y assets permanece en M2.4.

### Validación agregada y assets (M2.4)

Tras el mapping, el dominio vuelve a comprobar IDs y slugs, unicidad por colección/espacio URL, bloques mínimos de publicación, alt significativo y variantes de precio. Las referencias de cualquier producto deben existir; una referencia desde un producto publicado exige además que la taxonomía destino esté publicada. Las referencias repetidas dentro del mismo campo se rechazan. La única moneda admitida en V1 es `EUR`, centralizada en `src/config/catalog.ts`; ampliar esa lista requiere un requisito de negocio confirmado.

El adaptador resuelve toda portada y galería declarada —también en drafts— contra `src/assets/catalog`, comprueba que el destino real permanezca dentro de esa raíz, sea un archivo legible y coincida con un formato permitido con dimensiones positivas. Raster aplica 8 MiB y 24 MP; SVG aplica 250 KiB y rechaza scripts, event handlers, declaraciones o referencias externas/ejecutables. PNG, JPEG, WebP y AVIF se identifican por sus cabeceras de dimensiones, no sólo por la extensión.

`CatalogValidationError` conserva todos los issues detectados con código, entidad, campo, valor problemático y corrección esperada. `loadCatalog()` combina en una sola pasada los issues de dominio y filesystem. La generación estática invoca esa carga antes de renderizar la entrada pública, por lo que un error deja el build con salida no cero y CI no puede avanzar al despliegue.

## Medios

Las referencias editoriales apuntan a activos web mantenibles en `src/assets/catalog`. El pipeline conoce dimensiones, genera variantes modernas y preserva una alternativa compatible. Originales de archivo gigantes quedan fuera del Git ordinario. Los límites iniciales de fuente/repositorio están ratificados en [`architecture.md`](architecture.md#política-de-imágenes-y-salud-del-repositorio) y M8.2 los calibra con muestras reales sin relajar silenciosamente los hard limits.

## Proyección pública

`/catalog.json` incluye sólo datos publicados necesarios para descubrimiento: ID, nombre, URL canónica, resumen, taxonomías, precio público cuando exista, portada optimizada y capacidades de personalización. Excluye configuración interna, rutas de filesystem, drafts y datos no confirmados.

## Evolución del source

Un futuro gestor escribe el mismo contrato editorial mediante commits. Un CMS/API futuro implementará otro adaptador hacia el mismo modelo de dominio. Ningún componente deberá conocer la procedencia.

# Contrato conceptual del catálogo

Este documento fija semántica y límites. Los nombres exactos de campos y schemas ejecutables se cierran en M2 sin romper estas reglas.

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

### Category, Occasion y Recipient

Taxonomías con `id`, `slug`, nombre, resumen/contenido, estado/orden y metadata opcional. `Recipient` representa la intención pública `/regalos/{slug}/`; el nombre del modelo no determina el copy visible.

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

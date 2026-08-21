# Guía editorial de catálogo e imágenes

## Fuentes editables

El catálogo se mantiene en YAML:

- `src/content/products/`: productos;
- `src/content/categories/`: categorías;
- `src/content/occasions/`: ocasiones;
- `src/content/recipients/`: destinatarios;
- `src/assets/catalog/`: imágenes referenciadas por productos.

El flujo es `YAML -> source adapter -> dominio -> presentación -> HTML`.
`dist/`, el HTML generado y `catalog.json` nunca se editan a mano. Home usa
además fuentes TypeScript bajo `src/content/home/`; cambiar su estructura no es
una operación editorial ordinaria y requiere revisión técnica.

## Reglas comunes

- Un archivo por entidad. `id`, `slug` y nombre de archivo usan minúsculas,
  números y guiones simples; una URL publicada termina en `/`.
- No cambiar `id` o `slug` de una entidad publicada sin mapa de redirect
  aprobado y comprobación HTTP posterior.
- `status: published` significa que copy, precio, relaciones, derechos,
  alternativas de imagen y bloque `approval` están aprobados. Lo incompleto
  permanece `draft` y nunca usa datos comerciales inventados.
- YAML rechaza campos desconocidos. Mantener espacios, no tabs, y entrecomillar
  fechas ISO (`'YYYY-MM-DD'`) para que sigan siendo texto.
- Toda relación usa el `id` de una taxonomía existente. Un producto publicado
  necesita al menos una categoría.
- `seo.title` admite hasta 60 caracteres y `seo.description` hasta 160. Si no
  hacen falta overrides, omitir el bloque completo.

Las taxonomías requieren `id`, `slug`, `name`, `summary`, `status` y `order`;
`description` y `seo` son opcionales. `order` es un entero no negativo y
controla la precedencia editorial.

## Producto publicado

Usar como referencia un producto actual validado, por ejemplo
`src/content/products/lamina-natalicia-a5.yml`. Campos obligatorios:

- identidad: `id`, `slug`, `status`, `name`, `summary`, `description`;
- relaciones: `categories` y, cuando proceda, `occasions`/`recipients`;
- `price`, `media.cover`, `customization` y `approval`;
- `featured` y `order` son opcionales.

Precios admitidos:

```yaml
price:
  kind: fixed # o from
  amountMinor: 200
  currency: EUR
```

`amountMinor` son céntimos enteros: `200` representa 2,00 €. Para consulta sin
importe:

```yaml
price:
  kind: on_request
```

La personalización es `kind: none` o `kind: available` con al menos una opción
y una descripción. No afirmar stock, plazo, disponibilidad o capacidades que
no hayan sido aprobadas.

Cada publicación conserva trazabilidad:

```yaml
approval:
  source: Descripción de la fuente aprobada
  sourceDate: '2026-08-21'
  approvedBy: Owner editorial
  approvedAt: '2026-08-21'
```

No usar `TBD` dentro de un producto publicado.

## Incorporar imágenes

1. Confirmar owner, permiso/licencia, evidencia de aprobación y texto
   alternativo antes de copiar el archivo.
2. Usar un nombre y ruta relativos en minúsculas dentro de
   `src/assets/catalog/`, sin `..`, espacios ni ruta absoluta. Formatos
   admitidos: AVIF, WebP, JPEG/JPG, PNG y SVG.
3. Mantener cada raster en un máximo de 8 MiB y 24 megapíxeles, cada SVG en
   250 KiB y una galería en 20 elementos como máximo. Conservar originales de
   archivo fuera de Git si exceden esos límites.
4. Referenciar la ruta relativa a `src/assets/catalog/`. Cada imagen publicada,
   incluida cada entrada de galería, necesita `alt` y `rights`:

```yaml
media:
  cover:
    src: laminas/ejemplo.jpeg
    alt: Descripción concreta de lo visible y relevante.
    rights:
      owner: Owner de la imagen
      licenseOrPermission: Permiso de publicación concedido.
      evidence: Referencia no sensible a la aprobación y su fecha.
```

`caption` es opcional. El `alt` no repite “imagen de” y no incluye keywords que
no describan el contenido. La portada es la imagen principal; la galería no
debe repetir el mismo archivo sin motivo editorial.

El build genera variantes responsive optimizadas. No se incorporan a Git esas
variantes ni se reemplaza manualmente su HTML.

## Validar, revisar y publicar

Desde la raíz del repositorio:

```bash
npm run build
npm run verify:catalog
npm run verify:assets
npm run verify:links
npm run verify:seo
npm run verify:artifact
npm run verify:security
```

Antes del PR, ejecutar también lint, formato, typecheck y tests como indica el
README. Revisar visualmente a 320, 768 y 1440 px cualquier producto o landing
afectada: recorte, orden, precio, alt/caption, CTA y ausencia de overflow.

Después de fusionar, esperar a que `Deploy to GitHub Pages` quede verde y
comprobar la URL productiva. Un cambio de slug no termina hasta que el redirect
301 se haya incorporado al mapa y pase el checker remoto.

Para retirar un producto sin romper URLs, no borrar ni cambiar su slug de forma
aislada: acordar primero si la URL debe redirigir o responder 410. Para revertir
un error editorial ya desplegado, seguir el revert hacia delante de
[`handover.md`](handover.md), aunque corregir el YAML sea sencillo; así el
estado de producción queda trazable.

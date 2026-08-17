# Contrato público de `/catalog.json`

## Propósito y estabilidad

`https://lunatartas.es/catalog.json` es una representación estática y machine-readable del catálogo publicado. Su versión actual es `1.0`. El HTML semántico y el JSON-LD siguen siendo las fuentes principales para personas y buscadores; este archivo permite a consumidores automatizados descubrir el mismo catálogo sin introducir una API runtime, búsqueda ni protocolo agentic.

El documento no incluye `generatedAt`. La política de versión `1.0` es que el contenido idéntico genere JSON idéntico: la hora del build no forma parte del contrato. Un cambio incompatible incrementará la versión de schema y se documentará antes de publicarse.

La respuesta declara `Content-Type: application/json; charset=utf-8` y, cuando la plataforma conserve los headers del endpoint estático, `Cache-Control: public, max-age=0, must-revalidate`. GitHub Pages puede aplicar su propia política de cache a archivos estáticos; el consumidor debe revalidar antes de asumir cambios.

## Forma del documento

```json
{
  "schemaVersion": "1.0",
  "taxonomies": {
    "category": [
      {
        "id": "...",
        "name": "...",
        "summary": "...",
        "url": "https://lunatartas.es/categorias/.../"
      }
    ],
    "occasion": [],
    "recipient": []
  },
  "products": [
    {
      "id": "...",
      "name": "...",
      "summary": "...",
      "url": "https://lunatartas.es/productos/.../",
      "taxonomies": {
        "category": [
          {
            "id": "...",
            "name": "...",
            "summary": "...",
            "url": "https://lunatartas.es/categorias/.../"
          }
        ],
        "occasion": [],
        "recipient": []
      },
      "price": { "kind": "fixed", "amount": "20.00", "currency": "EUR" },
      "cover": {
        "url": "https://lunatartas.es/_astro/...webp",
        "alt": "...",
        "width": 960,
        "height": 720
      },
      "customization": {
        "kind": "available",
        "options": ["..."],
        "description": "..."
      }
    }
  ]
}
```

`taxonomies` usa siempre las tres claves. Cada producto repite únicamente sus relaciones publicadas para que el archivo pueda consumirse sin hacer joins; una relación apunta a la entidad equivalente de la colección superior. Las URLs son canonical HTTPS absolutas y las portadas son assets WebP optimizados emitidos por Astro.

`price.kind` puede ser `fixed`, `from` u `on_request`. Los dos primeros incluyen `amount` como string decimal exacto con dos fracciones y `currency` ISO 4217; `from` es un mínimo, no un rango. `on_request` no incluye importe ni moneda. `customization.kind` es `none` o `available`; el segundo incluye las opciones y descripción visibles en ficha.

## Frontera pública

El generador parte exclusivamente de entidades publicadas y falla si una ficha publicada referencia una taxonomía no pública. No expone drafts, slugs ni rutas de filesystem, aprobaciones, derechos de imagen, evidencias, galerías, configuración global, contacto, analítica ni datos `TBD`. La ruta de la portada es una URL de asset pública, no la referencia editorial de origen.

`npm run verify:catalog` audita el archivo producido: valida versión y forma mínima, URLs/medios absolutos, ausencia de campos internos y que cada producto corresponda a su HTML canónico generado.

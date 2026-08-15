# Catálogo integral sintético

Este árbol representa un catálogo completo sólo para tests. Todo YAML declara
`status: draft` y `context: FIXTURE`; los nombres, importes, relaciones y SVG son
sintéticos y no describen la oferta comercial.

`content/` replica las cuatro colecciones editoriales y `assets/` actúa como raíz
de medios durante la suite integral. Nada de este árbol se copia a `src/content`,
`src/assets` o `dist`.

Al añadir un caso, debe seguir siendo obviamente sintético, mantener las
relaciones válidas y cubrir una variante contractual que no esté ya representada.
La suite se ejecuta con `npm test` y el aislamiento productivo se comprueba con
`npm run build` seguido de una búsqueda de `fixture` y `FIXTURE` dentro de `dist`.

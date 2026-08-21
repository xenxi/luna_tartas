# Dry run de handover M9.6

**Fecha:** 2026-08-21, Europe/Madrid  
**Alcance:** validar un cambio editorial reversible y la restauración local sin
commit, push, deploy ni cambio externo.

## Escenario

Se eligió `src/content/categories/laminas-personalizadas.yml`, limpio respecto
a `HEAD`. Su blob inicial fue
`dc6bfc3fa0a1a01db95805413929f097671bf04d`. Para no inventar copy, precio ni
derechos, el único cambio temporal fue `order: 30` → `order: 31`.

## Ejecución y resultado

1. Baseline: build, catálogo, assets, enlaces y SEO: PASS.
2. Cambio temporal visible como un diff de una línea: PASS.
3. Con `order: 31`: `npm run build` generó 25 páginas; catálogo validó 8
   productos/8 fichas; assets validó 41 archivos; links validó 25 HTML, 24
   indexables, 0 rotos y 0 huérfanos; SEO validó 24 HTML: PASS.
4. Rollback local mediante el cambio inverso `31` → `30`: PASS.
5. `git diff --exit-code -- src/content/categories/laminas-personalizadas.yml`
   devolvió 0 y el blob restaurado volvió a
   `dc6bfc3fa0a1a01db95805413929f097671bf04d`: PASS.
6. Tras restaurar se repitieron build y los cinco verificadores con los mismos
   conteos: PASS.

El dry run demuestra el ciclo editar-validar-restaurar y que la fuente queda
idéntica. No simula un deploy productivo ni altera el historial. Para un cambio
ya fusionado, el rollback contractual es un revert hacia delante mediante PR,
CI y un nuevo deploy de `main`, descrito en [`handover.md`](handover.md) y
[`../architecture/deployment.md`](../architecture/deployment.md).

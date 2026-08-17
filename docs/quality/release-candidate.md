# M8.6 — Release candidate

## Decisión

**GO técnico y visual para `m8.6-rc.1`.** Esta decisión congela la línea base
de M8.6; no autoriza producción ni sustituye M9.1–M9.4. El artefacto queda
identificado por el manifiesto SHA-256 reproducible y por el commit que cierra
la tarea.

## Gates ejecutados

| Gate                                    | Resultado              | Evidencia                                                                           |
| --------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------- |
| Instalación, lint y tipos               | PASS                   | `npm ci`, ESLint y Astro check con 0 errores, warnings o hints                      |
| Suite y build                           | PASS                   | Vitest completo y build estático de 25 páginas                                      |
| SEO, crawl, links y datos estructurados | PASS                   | 24 URLs indexables, 0 rotos/huérfanos y catálogo coherente                          |
| A11y, assets, performance y responsive  | PASS                   | Auditores del artefacto, budgets y revisión en navegador                            |
| Artifact, seguridad y supply chain      | PASS                   | Sin placeholders publicables, secretos, sourcemaps ni dependencias sin evaluar      |
| Determinismo y mutación                 | PASS                   | Dos builds idénticos y mutación controlada rechazada                                |
| Lighthouse móvil, tres corridas         | PASS con RC-1 aceptado | 100 performance, 100 a11y, 96 best practices, 100 SEO; LCP 1,13 s, CLS 0 y TBT 0 ms |

Los JSON completos de Lighthouse se comprobaron antes de resumirlos en
`evidence/m8-6-release-candidate/lighthouse-mobile-summary.json`; no se
versionan para evitar 2,5 MB de salida reproducible. En Windows, Lighthouse
escribió informes válidos y después devolvió `EPERM` al limpiar el perfil
temporal de Chrome. Las tres corridas son completas y sus resultados coinciden.

## Gate visual manual

La Home, navegación móvil, Footer y ficha de producto se revisaron contra
`docs/design/visual-direction.md` a 1440, 768 y 320 px. La jerarquía editorial,
ritmo, fotografía protagonista, tokens, ornamentación contenida, CTAs,
hover/foco, contraste, reduced motion y firma del Footer son coherentes. No se
observan saltos de layout, recortes de punto focal ni overflow del documento.
La firma “Hecho con mimo para Luna · Creado por Antonio MDM” permanece completa,
legible, accesible y secundaria.

La inspección descubrió un blocker real a 320 px: una miga larga forzaba scroll
horizontal y recortaba el nombre del producto. Se corrigió permitiendo wrap y
se añadió una regresión contractual. Las capturas finales están en
`evidence/m8-6-release-candidate/`.

## Identidad y rollback

`npm run release:manifest` recorre `dist/`, calcula SHA-256 por archivo y crea
un digest raíz sobre `sha256 bytes ruta`, ordenado por ruta POSIX. El manifiesto
`artifact-manifest.json` contiene el ID, total de archivos, bytes y digest. La
identidad desplegable es el par **commit de cierre + digest raíz**; CI debe
reconstruir y comparar el digest antes de promoverlo.

El rollback conserva el commit y artefacto Pages anterior. Ante regresión se
revierte el commit de promoción o se redespliega el artefacto anterior; nunca
se modifica un candidato ya identificado.

## Known issues aceptados

| ID   | Impacto y decisión                                                                                                                                                                              | Owner / salida                   |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| RC-1 | `/favicon.ico` devuelve 404 y limita Best Practices a 96. No afecta navegación ni indexación; no se inventa marca sin master aprobado. Aceptado para M8.6, bloquea producción si sigue abierto. | marca / Luna — M9.1              |
| RC-2 | Firefox, Safari/iOS y Android físico no están disponibles en este entorno. Los contratos Baseline, Chrome/Edge y viewports obligatorios pasan; queda prueba cruzada antes de producción.        | QA / Antonio — M9.3              |
| RC-3 | Headers reales, DNS y política edge no pueden validarse en el preview estático.                                                                                                                 | plataforma / Antonio — M9.3–M9.4 |
| RC-4 | M9.1 aún debe sustituir material provisional y completar marca, catálogo, copy, derechos y datos legales aprobados. El gate confirma que no se publica `TBD`, `FIXTURE` o `draft`.              | contenido y marca / Luna — M9.1  |

No hay blockers desconocidos ni fallos críticos aceptados silenciosamente.

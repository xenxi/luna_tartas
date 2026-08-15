# AGENTS.md

## Antes de modificar

1. Lee este archivo y `ROADMAP.md`.
2. Ejecuta sólo la submilestone solicitada y comprueba sus dependencias.
3. Consulta únicamente la documentación autoritativa enlazada desde esa tarea.
4. Conserva cambios ajenos y no amplíes el alcance silenciosamente.

## Arquitectura y fuentes de verdad

- Repositorio GitHub público: todo archivo, commit, rama, log y artefacto versionado se trata como información pública.
- Sitio estático Astro con TypeScript estricto, desplegado desde ese repositorio mediante GitHub Actions y GitHub Pages.
- Flujo: `YAML -> source adapter -> catalog/domain -> presentation -> HTML`.
- `src/content/` será la fuente de verdad editorial; los componentes nunca contienen catálogo hardcodeado.
- El dominio es TypeScript independiente del formato YAML y de los componentes Astro.
- Configuración global (dominio, WhatsApp, marca, analytics) centralizada y validada.
- `ROADMAP.md` es la única fuente de verdad de prioridad, estado y siguiente tarea.
- Los contratos autoritativos viven en `docs/`; no los dupliques aquí.

## Reglas no negociables

- No carrito, checkout, pagos, cuentas, stock, backend ni CMS en V1.
- Nunca guardes en Git tokens, API keys, contraseñas, credenciales, claves privadas ni `.env` con secretos; tampoco datos sensibles en fixtures, logs, HTML, JavaScript o assets generados.
- Usa GitHub Actions Secrets sólo cuando una integración lo necesite y evita imprimirlos o incorporarlos al artefacto público.
- Número comercial de WhatsApp, URLs, contacto, catálogo, precios, SEO e IDs públicos de analytics sí pueden versionarse en configuración central.
- Mantén `.gitignore` desde M1.1. Un `.env.example` sólo puede contener nombres/valores ficticios no sensibles.
- El futuro Catalog Manager nunca incluirá credenciales privilegiadas de GitHub en una aplicación cliente pública.
- No React/Vue/Svelte ni JavaScript cliente sin una necesidad demostrable.
- Toda entidad publicada debe pasar validación de esquema, relaciones, medios y requisitos SEO.
- URLs públicas en minúsculas, con slug estable y barra final; cualquier cambio exige estrategia de redirect.
- HTML semántico, accesibilidad por teclado, foco visible, imágenes dimensionadas y progressive enhancement.
- Antes de añadir dependencias, comprueba Astro/plataforma y documenta el coste si es relevante.

## Comandos de calidad

Hasta completar `M1.1`, el proyecto no tiene toolchain ejecutable. Después, el contrato será:

```text
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

Usa los comandos específicos indicados por la submilestone. No marques `DONE` con checks fallidos.

## Ejecución y definición de DONE

- Cambia la tarea solicitada a `IN_PROGRESS` al comenzar.
- Implementa sólo su alcance; los refactors deben ser directamente necesarios.
- Registra en `ROADMAP.md` evidencia breve y reproducible.
- `DONE` requiere todos los criterios de aceptación y verificaciones en `PASS`.
- Si existe un bloqueo real, usa `BLOCKED`, explica causa y pendiente, y no avances.
- La siguiente tarea se lee de `ROADMAP.md`; nunca se improvisa.
- El cierre al usuario debe seguir literalmente el protocolo de `ROADMAP.md`.

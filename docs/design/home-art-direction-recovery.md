# Recuperación de dirección artística de la Home

> Nota de supersesión (2026-08-17): este documento conserva la auditoría
> histórica de M4.11 contra la referencia anterior (SHA-256 `747E4453…B283`).
> El propietario sustituyó el archivo contractual por la nueva referencia
> desktop (SHA-256 `989DE73B…C1BE`). Las decisiones nuevas se registran en
> `luna-brand-system.md` y M8.9; no se reutiliza la captura obsoleta como objetivo.

## Estado y propósito

Auditoría ejecutada el 2026-08-16 como `M4.11.1`, después del primer cierre de
M4.11. El resultado anterior conserva su valor histórico y técnico, pero no
supera el nuevo contrato visual aprobado. El gate G4 queda reabierto hasta
completar `M4.11.2`–`M4.11.8`.

La referencia visual aprobada está registrada en
[`reference/luna-home-art-direction-reference.png`](reference/luna-home-art-direction-reference.png).
Es una referencia contractual de dirección artística, composición, jerarquía,
densidad, ritmo, escala, proporciones, tratamiento fotográfico, lenguaje de
cards, tipografía, ornamentación, superficies, paleta, CTA, Footer y calidad
percibida.

No es un contrato pixel-perfect ni una fuente factual. No sustituye contenido,
productos, fotografías, categorías, enlaces o datos reales; no autoriza a
inventarlos. Los contratos funcionales, editoriales, SEO, accesibilidad y
performance existentes siguen siendo fuente de verdad.

- Archivo: `docs/design/reference/luna-home-art-direction-reference.png`
- SHA-256: `747E4453AF9C043CE1D24CF792B56F8D12B8C299B606861FAADEE41F7D45B283`
- Tamaño: 2.180.828 bytes
- Origen: imagen aportada por el usuario el 2026-08-16

## Estado auditado

Se revisaron `docs/archive/v1-roadmap.md`, M3, M4, tokens, foundations, estilos globales,
layout, Header, Hero, primitives, patterns, cards, descubrimiento, destacados,
proceso, trabajos, CTA, Footer, contenido, assets, responsive y motion. Se
generó el build de producción y se inspeccionó la Home renderizada a 1440,
768 y 320 px.

Evidencia previa a la recuperación:

- [`home-1440.png`](evidence/m4-11-art-direction-recovery/before/home-1440.png)
- [`home-768.png`](evidence/m4-11-art-direction-recovery/before/home-768.png)
- [`home-320.png`](evidence/m4-11-art-direction-recovery/before/home-320.png)

Medidas observadas:

| Viewport    |    Documento |           H1 | Fotografía Hero | Overflow horizontal |
| ----------- | -----------: | -----------: | --------------: | ------------------: |
| 1440 × 1000 | 5049 px alto | 516 × 519 px |    663 × 378 px |                0 px |
| 768 × 1024  | 4735 px alto | 299 × 301 px |    372 × 212 px |                0 px |
| 320 × 740   | 6110 px alto | 267 × 269 px |    275 × 155 px |                0 px |

## Gap respecto a la referencia

### Composición

- En desktop el Hero invierte la jerarquía objetivo: el H1 ocupa más alto que
  el producto y se fragmenta en cinco líneas. La fotografía queda pequeña,
  baja y con demasiado espacio vacío alrededor.
- El container de 72 rem es válido para lectura, pero insuficiente como único
  límite de composición visual. Texto y fotografía necesitan medidas distintas.
- Descubrimiento se presenta como tres capítulos largos y separados, no como
  una experiencia visual compacta. La repetición incrementa el scroll sin
  aportar densidad ni decisiones reales.
- El proceso tiene una base semántica correcta, pero está aislado por grandes
  vacíos y no narra una secuencia conectada.
- El collage de trabajos es el módulo más cercano al objetivo: usa fotografía
  real, proporciones variadas y asimetría. Necesita una superficie editorial,
  mayor continuidad con el copy y un cierre menos abrupto.
- El CTA oscuro es correcto en contraste, pero pertenece a otro lenguaje
  cromático y no concluye naturalmente el recorrido.
- El Footer conserva semántica y firma, pero carece de presencia de marca,
  jerarquía de contacto y cierre gráfico.

### Design system

- La paleta semántica ya contiene crema, rosa, salvia, arena y tinta, pero los
  consumidores forman bloques aislados en vez de una continuidad cromática.
- La pareja serif/sans es una base válida y eficiente. El problema principal
  es de escala, medida y ritmo, no la ausencia inmediata de una tercera fuente.
- `--container-max` mezcla medida de lectura y composición. Se necesita
  diferenciar `content`, `visual` y `copy` sin crear un sistema paralelo.
- `--space-section` se aplica de forma demasiado homogénea y produce espacio
  vacío accidental. La recuperación debe definir ritmos de impacto, descanso,
  descubrimiento, evidencia y conversión.
- Radios, bordes y sombras son mantenibles, pero aún se perciben como un kit de
  componentes. Falta un vocabulario reducido de hilo/línea, subrayado orgánico
  y puntos o marcas de papel.

### Componentes

- Header: limpio y funcional, pero la región de marca es un fallback “Inicio”
  y la navegación no alcanza la presencia editorial de la referencia.
- Hero: contenido y CTA están aprobados, pero la escala y el reparto visual no
  cumplen el objetivo aproximado 45/55.
- TaxonomyDiscovery y FeaturedProducts: la arquitectura de dominio es correcta,
  pero el estado productivo vacío publica placeholders “Pronto podrás…”. Esos
  módulos no deben ocupar espacio público mientras falte contenido útil.
- TrustAndWork: copy y assets son reales; la secuencia requiere storytelling y
  la galería puede evolucionar sin convertirse en grid ecommerce.
- CustomIdeaCta y SiteFooter: conservan acciones/enlaces reales, pero necesitan
  una conclusión cromática y editorial compartida.

### Contenido y assets

Reutilizables y aprobados:

- `src/assets/home/tarta-hero.png` para el Hero.
- Cuatro fotografías en `src/assets/home/work-showcase/` para trabajos.
- H1, hero copy, ambos CTA, proceso, CTA final, número y mensaje personalizado
  de WhatsApp ya trazados.
- Contactos aportados para el Footer: WhatsApp Business `+34 697 63 71 80`,
  `encargosmgr@gmail.com`, Instagram `@lunatartas` y crédito a Antonio MDM.

Contenido bloqueante:

- El catálogo productivo y las taxonomías siguen vacíos. No existen productos,
  categorías, ocasiones o destinatarios aprobados que permitan cerrar la
  experiencia visual de descubrimiento o “Ideas para regalar”.
- Nombre comercial definitivo, logo, favicon, iconos y tipografías de marca
  siguen sin masters/licencia/aprobación formal.

Assets deseables, no autorizados a inventar:

- fotografía horizontal de manos preparando packaging;
- fotografías horizontales o 4:3 asociables a categorías/ocasiones/personas
  reales, una vez aprobado el contenido correspondiente;
- logo web y variantes con reglas de uso;
- tipografías de marca en WOFF2 con licencia web, sólo si mejoran la identidad
  sin regresión de LCP/CLS.

## Responsive y motion

- 1440: no hay overflow, pero el H1 domina y la foto queda subordinada; el
  lienzo no se aprovecha como composición visual de 1100–1240 px.
- 768: la composición de dos columnas entra demasiado pronto para la medida
  real del copy; la fotografía pierde escala y el CTA se fragmenta.
- 320: no hay overflow y los targets son cómodos, pero el producto queda bajo
  el primer viewport y la página alcanza 6110 px por placeholders y ritmo
  repetitivo.
- Motion actual: hover/focus y zoom sutil de galería, con reduced motion. No hay
  reveal, parallax ni draw ornamental; esto no es un defecto por sí mismo. Sólo
  se añadirán si mejoran lectura o continuidad y pasan coste/reduced-motion.

## Decisiones de recuperación

1. Evolucionar tokens y consumidores existentes; no crear otro design system.
2. Mantener contenido, URLs, WhatsApp, SEO y semántica aprobados.
3. Rediseñar el Hero antes que el resto: fotografía protagonista, H1 editorial
   controlado y transición orgánica hacia descubrimiento.
4. Eliminar de la salida pública todos los “Pronto podrás…”. Si no hay datos,
   ocultar el módulo sin dejar un hueco falso y mantener el bloqueo trazado.
5. Reutilizar exclusivamente las cinco fotografías aprobadas. La referencia no
   se importa en `src/` ni se usa como asset público.
6. Limitar el vocabulario gráfico a línea/hilo, subrayado orgánico y puntos o
   marcas de papel. Corazón o luna sólo si existe un motivo claro y no simula
   identidad no aprobada.
7. No cerrar G4 hasta capturas y comparación manual a 320/768/1440, teclado,
   reduced motion, contraste, budgets, tests, lint, typecheck y build.

## Gate de salida

La recuperación termina sólo cuando `M4.11.8` registra el conjunto en PASS. El
primer cierre de M4.11 no se borra ni se reinterpreta: queda como ejecución
técnicamente correcta pero visualmente insuficiente frente a la referencia
aprobada posteriormente. M5 no avanza mientras G4 permanezca reabierto.

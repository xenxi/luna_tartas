# Readiness de entradas V1

## Propósito y alcance

Este documento es el contrato operativo de entradas para V1. Define qué debe aportar el propietario del negocio, qué puede permanecer provisional y qué evidencia permite publicar. No produce copy, fotos, catálogo ni aprobaciones.

La fuente de verdad del estado de cada entrada es esta matriz. Los detalles semánticos del catálogo siguen en [`../architecture/catalog-contract.md`](../architecture/catalog-contract.md); la ejecución final de contenido corresponde a M9.1.

## Estados

Cada fila debe tener exactamente un estado, un propietario, una fecha o `TBD`, y una evidencia o acción siguiente.

| Estado     | Significado                                                                         | ¿Publicable?               |
| ---------- | ----------------------------------------------------------------------------------- | -------------------------- |
| `TBD`      | No entregado, no verificable o falta una decisión; incluye owner y siguiente acción | No                         |
| `RECEIVED` | Material recibido, pendiente de revisión de completitud, derechos o aprobación      | No                         |
| `READY`    | Completo para implementación; fuente, derechos y aprobación están identificados     | Sí, cuando pase schemas/QA |
| `BLOCKED`  | Tiene un impedimento concreto que requiere decisión o entrega del owner             | No                         |
| `FIXTURE`  | Material sintético o de prueba, aislado y marcado como no publicable                | No                         |

`READY` no sustituye la validación técnica de M2 ni el QA de M9.1. Un cambio de contenido aprobado reinicia la revisión de la fila y de sus dependencias.

## Matriz de entradas

| Área                    | Entrada y mínimo requerido                                                          | Estado    | Owner                    | Deadline/gate                                     | Evidencia o siguiente acción                                                                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------- | --------- | ------------------------ | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Marca                   | Nombre comercial y uso aprobado                                                     | `BLOCKED` | Propietario del negocio  | bloquea identidad definitiva; no M3.2 provisional | Entregar nombre aprobado, fuente, responsable y fecha; no inventar variante                                                                                                   |
| Marca                   | Logo, variantes, favicon e iconos en formatos web                                   | `BLOCKED` | Propietario del negocio  | bloquea identidad definitiva; no M3.2 provisional | Entregar masters, autor/licencia, reglas de uso y aprobación                                                                                                                  |
| Marca                   | Tipografías, archivos y licencias o autorización de alternativa                     | `BLOCKED` | Propietario del negocio  | bloquea identidad definitiva; no M3.2 provisional | Entregar guía, archivos/proveedor, licencia web y aprobación; mientras tanto se usan stacks del sistema                                                                       |
| Catálogo                | Productos, IDs estables, slugs, nombres, resúmenes y descripción                    | `TBD`     | Propietario del negocio  | antes de M9.1                                     | Entregar fuente vigente y fecha de aprobación                                                                                                                                 |
| Catálogo                | Categorías, ocasiones y destinatarios con copy público                              | `TBD`     | Propietario del negocio  | antes de M9.1                                     | Entregar taxonomías y relaciones revisadas                                                                                                                                    |
| Catálogo                | Personalización, contenido incluido y orden/destacado                               | `TBD`     | Propietario del negocio  | antes de M9.1                                     | Confirmar capacidades por producto, sin promesas no verificadas                                                                                                               |
| Fotos                   | Muestra Home M4.5: cuatro trabajos reales, orden editorial, dimensiones y contexto  | `READY`   | Propietario del negocio  | M4.5                                              | Cuatro originales PNG de 1536 × 2048 px entregados y aprobados el 2026-08-16; copias de trabajo versionadas bajo `src/assets/home/work-showcase/`                             |
| Fotos                   | Portadas y galerías del catálogo de productos                                       | `TBD`     | Propietario del negocio  | antes de M9.1                                     | Entregar selección por producto y originales; la muestra Home no se asigna al catálogo sin aprobación editorial adicional                                                     |
| Derechos                | Fotografías y textos de proceso publicados en M4.5                                  | `READY`   | Propietario del negocio  | M4.5                                              | Material propio; publicación en `lunatartas.es` autorizada expresamente por el propietario el 2026-08-16; no requiere atribución pública                                      |
| Derechos                | Resto de fotografías, logo, fuentes y textos pendientes                             | `TBD`     | Propietario del negocio  | antes de publicar cada asset                      | Aportar confirmación trazable por activo; la autorización M4.5 no se extiende a material distinto                                                                             |
| Accesibilidad           | Alt significativo para las cuatro imágenes de M4.5                                  | `READY`   | Propietario del negocio  | M4.5                                              | Cuatro textos alternativos entregados y aprobados el 2026-08-16; validación técnica y relación imagen/alt cubiertas por tests                                                 |
| Accesibilidad           | Alt y caption/atribución del resto de imágenes                                      | `TBD`     | Propietario del negocio  | junto con cada asset futuro                       | Entregar texto aprobado por imagen; el técnico valida presencia y relación                                                                                                    |
| Home hero               | H1, copy, ambos CTA, fotografía, alt, derechos y aprobación                         | `READY`   | Responsable del proyecto | M4.2                                              | Handoff aprobado 2026-08-16; original `tarta_hero.png`, autora/propietaria Luna; enlace directo WhatsApp y mensaje aprobados                                                  |
| Precios                 | Caso `fixed`, `from` u `on_request`, importe entero menor cuando aplique y moneda   | `TBD`     | Propietario del negocio  | antes de M9.1                                     | Confirmar precio y moneda; no crear Offers ficticios                                                                                                                          |
| WhatsApp                | Número público, saludo, plantilla, horario/reglas de atención y copy                | `READY`   | Propietario del negocio  | M5.1                                              | Plantilla y saludo de consulta de producto aprobados por Luna el 2026-08-17; variables: nombre público publicado y URL canónica absoluta; CTA en contexto nuevo con `target="_blank"` y `rel="noopener noreferrer"`; nunca credenciales |
| Contacto público        | WhatsApp Business, email e Instagram para Footer                                    | `READY`   | Propietario del negocio  | M4.11.5                                           | Aprobados en el encargo de recuperación visual del 2026-08-16: `+34 697 63 71 80`, `encargosmgr@gmail.com` y `@lunatartas`; no autoriza otras redes ni datos                  |
| Identidad legal         | Nombre legal/comercial, contacto, zona, plazos y políticas que se quieran afirmar   | `TBD`     | Propietario del negocio  | antes de M9.1                                     | Entregar fuentes verificables y aprobación de publicación                                                                                                                     |
| Prueba social/confianza | Reseñas, atribución, permisos y cualquier cifra o claim                             | `READY`   | Propietario del negocio  | M4.5; revisar antes de M9.1                       | Decisión aprobada 2026-08-16: M4.5 publica sólo el proceso facilitado y trabajos reales; no publica reseñas, estrellas, contadores, antigüedad, plazos ni cifras no aportadas |
| Analytics               | Proveedor, owner, IDs públicos si existen y requisitos de consentimiento/privacidad | `TBD`     | Propietario del negocio  | antes de M7.1                                     | Identificar responsable y requisitos; M7.1 decide la solución                                                                                                                 |
| DNS/Cloudflare          | Acceso operativo, export de zona, reglas, TTL y rollback owner                      | `TBD`     | Propietario del negocio  | antes de M9.2/M9.3                                | Aportar export sanitizado y confirmar acceso; no cambiar DNS en M0.3                                                                                                          |
| Search Console          | Owner, propiedad, sitemaps, páginas, enlaces y rendimiento exportable               | `TBD`     | Propietario del negocio  | antes de M9.2/M9.4                                | Aportar exports sin credenciales o confirmar ausencia explícita                                                                                                               |

Los estados `TBD` reflejan la evidencia de M0.1 y no son un bloqueo desconocido: todos tienen owner y gate. No se asignan deadlines de calendario mientras el propietario no los confirme; por eso la columna usa el milestone que los necesita.

## Plantilla editorial

Cada entrega editorial debe incluir un archivo o registro equivalente a esta ficha:

```yaml
id: 'estable-y-publico'
slug: 'minusculas-con-guiones'
status: 'draft' # draft durante trabajo; published sólo tras aprobación
source: 'nombre-del-export-o-documento'
source_date: 'YYYY-MM-DD'
approved_by: 'TBD'
approved_at: 'TBD'
rights:
  owner: 'TBD'
  license_or_permission: 'TBD'
  evidence: 'TBD'
```

Para un `Product`, la ficha debe añadir nombre, summary, descripción, al menos una categoría, ocasiones/destinatarios aplicables, precio, portada, galería/alt, personalización y SEO aprobado. Las taxonomías deben añadir nombre, resumen/contenido, orden y copy público. Los campos exactos y schemas ejecutables se cierran en M2.

## Fixture frente a contenido publicable

- Un fixture debe vivir en una ubicación de test o desarrollo y declarar `status: draft` y `FIXTURE` en su contexto; nunca puede usar un estado publicable por conveniencia.
- Todo texto, nombre, precio, teléfono, claim o imagen inventado para pruebas debe ser obviamente sintético y no presentarse como dato comercial.
- El pipeline de M2/M6/M9 debe excluir fixtures, `draft` y `TBD` de HTML público, sitemap, JSON-LD y `/catalog.json`.
- El material recibido (`RECEIVED`) tampoco se publica hasta que derechos, mínimos del schema, relaciones, alt y aprobación estén comprobados.

## Reglas de aprobación

1. El propietario del negocio aprueba copy, precio, contacto, claims, identidad y derechos de publicación.
2. El equipo técnico comprueba schema, relaciones, slugs, medios, alt, URLs y ausencia de secretos; no puede aprobar datos de negocio por inferencia.
3. Una entidad se marca `published` sólo con evidencia de aprobación y después de pasar validación agregada y revisión visual/editorial.
4. Si falta una fuente o permiso, se mantiene `TBD`, `RECEIVED` o `BLOCKED`; no se rellena con placeholder visible.
5. La aprobación se registra con fecha, responsable y referencia al archivo/fuente. Las credenciales, exports sensibles y datos personales no se versionan.

## Evaluación G0 y readiness de M1

**G0: PASS.** Hay entradas externas pendientes, pero el inventario de M0.1 documenta las ausencias y esta matriz asigna owner y gate a cada una; no queda un blocker desconocido. La decisión greenfield con migración SEO/contenido posible permanece vigente.

**M1: sin blocker desconocido.** M1.1 puede crear el scaffold sin contenido final; M1.3 usará placeholders técnicos no publicables. Los accesos de Actions/Pages están asignados a M1.4/M1.5 y DNS, Search Console, analytics y contenido están asignados a sus gates posteriores. Ningún fixture o `TBD` puede entrar en un release.

## Evidencia y revisión

- Estado inicial y fuentes: [`../discovery/current-state.md`](../discovery/current-state.md).
- Decisiones técnicas y límites: [`../architecture/architecture.md`](../architecture/architecture.md), [`../architecture/deployment.md`](../architecture/deployment.md).
- Contrato de catálogo: [`../architecture/catalog-contract.md`](../architecture/catalog-contract.md).
- Conversión y analytics: [`../conversion/conversion-strategy.md`](../conversion/conversion-strategy.md).
- Carga y aprobación final: M9.1 en `ROADMAP.md`.

La revisión de esta checklist se repite al iniciar M3.1, M4.5, M7.1, M9.1 y M9.2/M9.4; cualquier fila que cambie debe conservar su evidencia anterior y registrar la nueva.

## Historial de revisiones

- 2026-08-16 — Inicio de M3.1: las tres entradas de marca vencieron su gate sin material ni evidencia nueva. Cambian de `TBD` a `BLOCKED`, conservan como owner al propietario del negocio y dejan acciones concretas. La dirección provisional documentada en [`../design/visual-direction.md`](../design/visual-direction.md) permite continuar M3.2 sin publicar una identidad inventada; los demás estados no cambian.
- 2026-08-16 — Handoff M4.2: H1, copy, CTA principal, fotografía hero, alt, autoría/derechos y aprobación pasan a `READY`. El CTA “Cuéntanos tu idea” queda aprobado como texto, pero su destino WhatsApp no es publicable hasta recibir número y plantilla; la fila global de WhatsApp permanece `TBD`.
- 2026-08-16 — Reanudación M4.2: número WhatsApp Business normalizado y mensaje precargado recibidos y aprobados para publicación. El enlace directo del hero pasa a `READY`; email e Instagram aportados se reservan para milestones posteriores. La fila global de WhatsApp permanece `TBD` para el alcance adicional de M4.6/M5.1 que aún requiere sus propias reglas.
- 2026-08-16 — Inicio de M5.1: la entrada global de WhatsApp vence su gate sin saludo ni plantilla de producto aprobados. Pasa de `TBD` a `BLOCKED`; conserva como owner al propietario del negocio. El número y mensaje personalizado existentes siguen aprobados y publicados, pero no autorizan a derivar ni inventar el mensaje de producto.
- 2026-08-16 — M4.11.1 registra los contactos públicos facilitados expresamente para el Footer: WhatsApp Business `+34 697 63 71 80`, email `encargosmgr@gmail.com` e Instagram `@lunatartas`. Pasan a `READY` sólo para ese uso; la plantilla de producto de M5.1 continúa `BLOCKED`.
- 2026-08-16 — Cierre M4.11.7: auditado y validado el subconjunto de catálogo en `src/content/`. Se confirman 4 productos reales `READY`/`published` (`tarta-de-panales-personalizada`, `lamina-personalizada-a5`, `lamina-natalicia-a5`, `invitacion-marcapaginas-personalizada`) con portadas reales válidas, alt descriptivo, derechos propios (Luna / MGR Creaciones) y aprobación formal. Proyectan 9 intenciones taxonómicas y 3 destacados. El catálogo completo de M9.1 permanece en `TBD`, mientras que el subconjunto M4.11.7 queda formalmente cerrado y satisfecho.
- 2026-08-17 — Aprobación M5.1: Luna aprueba saludo, plantilla, variables, consulta sin inventar disponibilidad/precio/personalización y apertura del CTA en contexto nuevo con `target="_blank"` + `rel="noopener noreferrer"`. Fuente: aprobación directa del propietario del contenido para M5.1.

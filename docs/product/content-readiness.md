# Readiness de entradas V1

## Propósito y alcance

Este documento es el contrato operativo de entradas para V1. Define qué debe aportar el propietario del negocio, qué puede permanecer provisional y qué evidencia permite publicar. No produce copy, fotos, catálogo ni aprobaciones.

La fuente de verdad del estado de cada entrada es esta matriz. Los detalles semánticos del catálogo siguen en [`../architecture/catalog-contract.md`](../architecture/catalog-contract.md); la ejecución final de contenido corresponde a M9.1.

## Estados

Cada fila debe tener exactamente un estado, un propietario, una fecha o `TBD`, y una evidencia o acción siguiente.

| Estado | Significado | ¿Publicable? |
| --- | --- | --- |
| `TBD` | No entregado, no verificable o falta una decisión; incluye owner y siguiente acción | No |
| `RECEIVED` | Material recibido, pendiente de revisión de completitud, derechos o aprobación | No |
| `READY` | Completo para implementación; fuente, derechos y aprobación están identificados | Sí, cuando pase schemas/QA |
| `BLOCKED` | Tiene un impedimento concreto que requiere decisión o entrega del owner | No |
| `FIXTURE` | Material sintético o de prueba, aislado y marcado como no publicable | No |

`READY` no sustituye la validación técnica de M2 ni el QA de M9.1. Un cambio de contenido aprobado reinicia la revisión de la fila y de sus dependencias.

## Matriz de entradas

| Área | Entrada y mínimo requerido | Estado | Owner | Deadline/gate | Evidencia o siguiente acción |
| --- | --- | --- | --- | --- | --- |
| Marca | Nombre comercial y uso aprobado | `TBD` | Propietario del negocio | antes de M3.1 | Entregar nombre aprobado y fuente; no inventar variante |
| Marca | Logo, variantes, favicon e iconos en formatos web | `TBD` | Propietario del negocio | antes de M3.1 | Entregar masters, autor/licencia y aprobación |
| Marca | Tipografías, archivos y licencias o autorización de alternativa | `TBD` | Propietario del negocio | antes de M3.1 | Entregar guía/licencias; resolver proveedor en M3.1 |
| Catálogo | Productos, IDs estables, slugs, nombres, resúmenes y descripción | `TBD` | Propietario del negocio | antes de M9.1 | Entregar fuente vigente y fecha de aprobación |
| Catálogo | Categorías, ocasiones y destinatarios con copy público | `TBD` | Propietario del negocio | antes de M9.1 | Entregar taxonomías y relaciones revisadas |
| Catálogo | Personalización, contenido incluido y orden/destacado | `TBD` | Propietario del negocio | antes de M9.1 | Confirmar capacidades por producto, sin promesas no verificadas |
| Fotos | Portada y galería con dimensiones y contexto | `TBD` | Propietario del negocio | antes de M9.1 | Entregar selección y originales; optimización técnica posterior |
| Derechos | Autor, licencia/permiso, alcance y fecha por foto, logo, fuente y texto | `TBD` | Propietario del negocio | antes de publicar cualquier asset | Aportar confirmación trazable; sin evidencia el asset no se publica |
| Accesibilidad | Alt text significativo por imagen y caption/atribución si aplica | `TBD` | Propietario del negocio | junto con cada asset | Entregar alt aprobado; técnico valida presencia y relación |
| Precios | Caso `fixed`, `from` u `on_request`, importe entero menor cuando aplique y moneda | `TBD` | Propietario del negocio | antes de M9.1 | Confirmar precio y moneda; no crear Offers ficticios |
| WhatsApp | Número público, saludo, plantilla, horario/reglas de atención y copy | `TBD` | Propietario del negocio | antes de M4.6/M5.1 | Entregar datos aprobados; el número puede versionarse, nunca credenciales |
| Identidad legal | Nombre legal/comercial, contacto, zona, plazos y políticas que se quieran afirmar | `TBD` | Propietario del negocio | antes de M9.1 | Entregar fuentes verificables y aprobación de publicación |
| Prueba social | Reseñas, atribución, permisos y cualquier cifra o claim | `TBD` | Propietario del negocio | antes de M4.5/M9.1 | Entregar fuente y permiso; ausencias se muestran honestamente |
| Analytics | Proveedor, owner, IDs públicos si existen y requisitos de consentimiento/privacidad | `TBD` | Propietario del negocio | antes de M7.1 | Identificar responsable y requisitos; M7.1 decide la solución |
| DNS/Cloudflare | Acceso operativo, export de zona, reglas, TTL y rollback owner | `TBD` | Propietario del negocio | antes de M9.2/M9.3 | Aportar export sanitizado y confirmar acceso; no cambiar DNS en M0.3 |
| Search Console | Owner, propiedad, sitemaps, páginas, enlaces y rendimiento exportable | `TBD` | Propietario del negocio | antes de M9.2/M9.4 | Aportar exports sin credenciales o confirmar ausencia explícita |

Los estados `TBD` reflejan la evidencia de M0.1 y no son un bloqueo desconocido: todos tienen owner y gate. No se asignan deadlines de calendario mientras el propietario no los confirme; por eso la columna usa el milestone que los necesita.

## Plantilla editorial

Cada entrega editorial debe incluir un archivo o registro equivalente a esta ficha:

```yaml
id: "estable-y-publico"
slug: "minusculas-con-guiones"
status: "draft" # draft durante trabajo; published sólo tras aprobación
source: "nombre-del-export-o-documento"
source_date: "YYYY-MM-DD"
approved_by: "TBD"
approved_at: "TBD"
rights:
  owner: "TBD"
  license_or_permission: "TBD"
  evidence: "TBD"
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

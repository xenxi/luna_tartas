# Decisión de analytics y privacidad (M7.1)

**Fecha de decisión:** 2026-08-17
**Ámbito:** medición de audiencia y de los cuatro eventos de conversión V1 en `lunatartas.es`. No cubre el contenido de las conversaciones de WhatsApp ni sustituye la revisión legal de la política de privacidad antes de producción.

## Contexto

Luna Tartas es un sitio estático público servido en GitHub Pages. La conversión termina en un enlace a WhatsApp y no necesita JavaScript para funcionar. No hay una cuenta de analytics heredada ni una identidad legal publicada; por tanto, el tracker no puede convertirse en una dependencia de render ni activarse por defecto.

Una dirección IP y un identificador de cookie pueden ser datos personales. La persona responsable debe informar, entre otros extremos, de quién trata los datos, finalidad, base jurídica, conservación, destinatarios y transferencias; los encargados requieren un contrato u otro instrumento vinculante. Estas obligaciones se recogen en la [Comisión Europea: aplicación del RGPD](https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/application-gdpr_en) y en su [guía sobre información a las personas](https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/principles-gdpr/what-information-must-be-given-individuals-whose-data-collected_en). La AEPD indica que las cookies analíticas requieren consentimiento válido y que aceptar y rechazar deben presentarse con la misma visibilidad; su guía específica de medición explica las condiciones, más restrictivas, de una posible exención. [AEPD: FAQ de cookies](https://www.aepd.es/preguntas-frecuentes/17-internet-y-redes-sociales/FAQ-1707-importancia-de-las-cookies-en-la-proteccion-de-datos) · [AEPD: guía de medición de audiencia](https://www.aepd.es/guias/guia-cookies-analiticas-externas.pdf).

## Decisión

Se elige **Matomo On-Premise, en una instancia dedicada operada para Luna Tartas dentro del EEE**, con la medición **desactivada por configuración hasta que la titular la habilite en producción**. La instancia recibirá datos sólo después de un consentimiento analítico explícito. No se invoca la exención de consentimiento de la AEPD: evita una interpretación frágil y permite usar eventos de conversión mínimos bajo un control claro.

- **Responsable:** la persona física o jurídica titular que explota Luna Tartas; debe figurar con identidad y contacto reales en la política antes del primer envío. La titular aprueba el alta, la configuración productiva y cualquier cambio de finalidad.
- **Encargado/operación:** quien administre la instancia Matomo sólo actúa bajo instrucciones documentadas de la titular y con el acuerdo aplicable. No se versionan URL privadas, credenciales, IPs internas, site IDs ni exports de visitas.
- **Base y consentimiento:** consentimiento granular, libre, informado, revocable y opt-in. El estado inicial es `denied`; rechazar y retirar consentimiento no degrada navegación ni los CTAs de WhatsApp. No habrá carga de script, petición de tracking ni escritura de identificador analítico antes de aceptarlo.
- **Datos y minimización:** se anonimizan IPs en la instancia; no se habilitan cookies persistentes, User ID, perfiles entre dispositivos, publicidad, remarketing, Google Signals, heatmaps, session recording, formularios ni captura de URL query/hash. El adaptador sólo envía el diccionario de este documento y omite campos ausentes.
- **Retención:** datos de visita y eventos, como máximo 13 meses; informes agregados sin posibilidad razonable de reidentificación, 25 meses. Revisión trimestral por la titular; borrado/rotación automatizado en Matomo. La conservación debe ser la mínima necesaria, conforme al principio resumido por la [Comisión Europea](https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/principles-gdpr/how-long-can-data-be-kept-and-it-necessary-update-it_en).
- **Transferencias:** servidor, copias y subencargados dentro del EEE. Cualquier transferencia internacional, nuevo subencargado o cambio a Matomo Cloud exige evaluación, actualización de la política y aprobación de la titular antes de habilitarlo.
- **Tráfico interno:** analytics queda desactivado en desarrollo, pruebas, preview y staging. Producción mantiene una lista de exclusión de rangos/IPs gestionada exclusivamente en la instancia, sin versionarla; además, el personal de Luna debe mantener rechazo analítico en sus navegadores. Se prueba esta exclusión en M7.5 sin registrar direcciones en evidencias públicas.

La identidad legal, el canal para derechos y el texto público de la política siguen siendo entregables de M9.4; no autorizan a habilitar medición mientras estén pendientes. Esta decisión no es asesoramiento jurídico definitivo.

## Alternativas evaluadas

| Alternativa | Resultado | Motivo |
| --- | --- | --- |
| No medir en V1 | Descartada | Evita tratamiento, pero deja sin forma proporcional de validar los CTAs y el gate G7. Sigue siendo el fallback si no hay instancia, contrato o consentimiento válido. |
| GA4/Google Tag Manager | Descartada | Añade más superficie de proveedor, configuración y transferencias; no es proporcionada para cuatro eventos y una web estática pequeña. |
| Servicio SaaS cookieless de tercero | Descartada | Puede reducir cookies, pero no elimina la necesidad de revisar roles, datos personales, retención, subencargados y transferencias. No se asumirá una exención sólo por una afirmación comercial. |
| Matomo On-Premise EEE con opt-in | Elegida | Mantiene control de alojamiento, esquema y retención, sin hacer crítica la medición para la conversión. |

## Contrato de configuración para M7.2

La configuración global validada tendrá una única sección `analytics`, independiente del catálogo y de los componentes:

```ts
type AnalyticsConfig = {
  enabled: boolean; // false hasta alta aprobada
  provider: 'matomo';
  endpoint?: string; // HTTPS, origen EEE aprobado; ausente si enabled es false
  siteId?: string; // identificador público del sitio; ausente si enabled es false
  consentRequired: true;
  retentionMonths: 13;
};
```

Reglas contractuales:

1. La configuración productiva parte de `enabled: false`; `enabled: true` exige `endpoint` HTTPS sin credenciales, `siteId`, registro de aprobación de titular y evidencia de configuración de la instancia.
2. Ningún valor de configuración puede ser secreto. Las credenciales de administración de Matomo viven fuera de Git y nunca se interpolan en HTML, JavaScript, artefactos ni logs.
3. El único adaptador cliente puede cargar el tracker diferido después de consentimiento. Sin proveedor, configuración válida o consentimiento, es un no-op seguro.
4. El adaptador valida tipos, omite parámetros no permitidos y no deriva datos desde el DOM, la URL completa, el mensaje de WhatsApp ni campos de formulario.
5. No se añade un CMP de terceros para esta decisión. M7.2 implementará una superficie local mínima de aceptar/rechazar/retirar; la política y el enlace permanente se cierran en M9.4.

## Diccionario final de eventos V1

Todos los valores son datos de catálogo o contexto público de navegación. `source_page` es sólo pathname canónico en minúsculas con barra final, sin query ni fragment. `price` se omite cuando el catálogo no ofrece precio; nunca se sustituye por `0`.

| Evento | Disparador | Payload permitido |
| --- | --- | --- |
| `view_item` | carga de una ficha de producto publicada; como máximo una vez por carga | `product_id`, `product_name`, `category`, `price?`, `currency?`, `source_page` |
| `select_item` | activación de una tarjeta/enlace de producto desde un listado | campos de `view_item`, `list_id`, `position` (entero positivo) |
| `whatsapp_click` | activación por puntero o teclado del CTA de producto | campos de `view_item`, `cta_location` |
| `custom_whatsapp_click` | activación por puntero o teclado del CTA de propuesta personalizada | `cta_location`, `source_page` |

Quedan prohibidos, incluso como atributos auxiliares o logs: nombre, email, teléfono, contenido de WhatsApp, URL de WhatsApp, dirección, IP completa, identificadores de usuario/dispositivo, cookies, query strings, hash, datos de formulario, inferencias sensibles y cualquier ID ajeno al catálogo público.

## Consecuencias y verificación

- La conversión y la navegación permanecen plenamente funcionales sin JavaScript, sin consentimiento y si el tracker falla.
- Antes del consentimiento el HTML no contiene tracker ni ID; M7.2 verificará que no se realiza ninguna petición. Tras consentimiento, se permite una única carga `defer` desde el endpoint aprobado, sin terceros adicionales ni bloqueo de render.
- M7.2 medirá la diferencia de transferencia de JavaScript y documentará el tamaño comprimido del tracker; cualquier regresión debe respetar el presupuesto de M8.2 y requerirá aprobación explícita de la titular.
- M7.5 comprobará matriz evento/ruta/payload, rechazo, retirada de consentimiento, exclusión interna, ausencia de PII y captura de red redactada. La recepción real sólo ocurre tras alta aprobada.
- La aprobación operativa queda registrada con esta ejecución de M7.1 (2026-08-17); la habilitación productiva requiere la segunda aprobación explícita de la titular una vez existan la instancia, el acuerdo de encargo y la política publicada.

## Evidencia de revisión

Revisión de M7.1 realizada el 2026-08-17 contra `docs/conversion/conversion-strategy.md`, `docs/architecture/deployment.md`, `docs/product/content-readiness.md` y los requisitos de rendimiento de `docs/quality/testing-strategy.md`: **PASS**. La decisión fija proveedor, consentimiento, roles, retención, exclusión interna, presupuesto de carga y diccionario; no añade scripts ni datos personales al repositorio.

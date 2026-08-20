# Decision de analytics y privacidad (M7.1, revisada en M9.4)

**Decision original:** 2026-08-17
**Revision arquitectonica:** 2026-08-20
**Consolidacion operativa M9.4:** 2026-08-20
**Ambito:** audiencia y conversion hacia WhatsApp en `lunatartas.es`.

## Contexto

Luna Tartas es un sitio estatico en GitHub Pages. No se justifica operar servidor, runtime, base de datos, HTTPS, actualizaciones, backups, hardening, monitorizacion y disponibilidad permanente solo para analytics. La medicion tampoco puede convertirse en dependencia de render o conversion.

Las cookies e identificadores analiticos pueden implicar tratamiento de datos personales. La titular debe aprobar identidad, finalidad, base, conservacion, destinatarios y transferencias en la politica aplicable antes de activar medicion. Esta decision tecnica no afirma cumplimiento legal absoluto. Referencias: [Comision Europea, aplicacion del RGPD](https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/application-gdpr_en), [informacion a las personas](https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/principles-gdpr/what-information-must-be-given-individuals-whose-data-collected_en) y [AEPD, FAQ de cookies](https://www.aepd.es/preguntas-frecuentes/17-internet-y-redes-sociales/FAQ-1707-importancia-de-las-cookies-en-la-proteccion-de-datos).

## Decision

Se adopta **Google Analytics 4 mediante Google tag directo**, sin Google Tag Manager. Google Search Console complementa GA4 para indexacion y observabilidad SEO. Analytics permanecio `enabled: false` hasta disponer del Measurement ID productivo, politica aprobada y autorizacion explicita de la titular; la configuracion real queda habilitada tras esas aprobaciones y sigue bloqueada por consentimiento en cada navegador.

- **Consentimiento:** opt-in local, denegado por defecto, persistente y revocable. No se carga Google tag ni se envia ningun evento antes de aceptar.
- **Minimizacion:** no se habilitan Google Signals, personalizacion publicitaria, User ID ni captura de formularios. El adaptador envia exclusivamente el diccionario permitido.
- **Entornos:** el runtime exige HTTPS y hostname exacto `lunatartas.es`; localhost, tests, preview y otros hosts son no-op.
- **Traspasos y retencion:** la titular debe revisar y aprobar configuracion de cuenta, region, tratamiento, retencion y politica publica antes del alta. No se codifican afirmaciones juridicas no aprobadas.
- **Trafico interno:** el personal mantiene consentimiento rechazado en sus navegadores. No se configura filtro por IP porque la conexion administrativa usa IP publica dinamica; localhost, previews, tests y otros hosts quedan excluidos arquitectonicamente.
- **Seguridad:** el Measurement ID es un identificador publico, no un secreto. Credenciales, exports con visitantes y configuracion privilegiada nunca entran en Git ni en el artefacto.

No se usa Google Consent Mode: al no cargar ninguna libreria de Google antes del opt-in se evita tambien el envio de pings sin cookies. Si en el futuro se necesitara modelado de consentimiento, requerira una nueva decision y revision de privacidad.

## Alternativas

| Alternativa | Resultado | Motivo |
| --- | --- | --- |
| No medir | Fallback | Es el comportamiento seguro mientras falte configuracion o aprobacion. |
| Google Analytics 4 directo | Elegida | Mantiene el sitio estatico, evita infraestructura propia y cubre navegacion y contacto. |
| Google Tag Manager | No elegido | No existe un caso de uso que justifique otra capa de configuracion y gobierno. |
| SaaS alternativo | No elegido | No aporta ahora una ventaja suficiente frente al coste de otra evaluacion. |

## Historial

Matomo On-Premise fue considerado y elegido inicialmente, pero fue sustituido por GA4 el 2026-08-20 debido a su coste operacional desproporcionado para esta web estatica. No queda como requisito productivo ni dependencia futura.

## Configuracion

```ts
type AnalyticsConfig = {
  enabled: boolean;
  provider: 'ga4';
  measurementId?: string; // publico, formato G-XXXXXXXXXX
  consentRequired: true;
};
```

`enabled: true` exige un Measurement ID valido. Si esta deshabilitado, el ID debe estar ausente. Una configuracion ausente o invalida no puede producir un tracker parcial: la configuracion versionada de produccion permanece desactivada hasta aprobar todos los requisitos.

## Configuracion productiva aprobada

La plataforma de produccion es **Google Analytics 4**. Matomo On-Premise queda
descartado para esta fase: operar y mantener un servicio self-hosted permanente
no esta justificado para las necesidades actuales de trafico, navegacion e
interaccion, y GA4 se integra directamente con el ecosistema de Google Search
Console sin añadir infraestructura propia.

- Propiedad: `Luna Tartas`.
- Web Data Stream: `Luna Tartas - Produccion`.
- URL: `https://lunatartas.es`.
- Measurement ID: `G-DV6KHV0YMW`.
- Google Tag Manager: no utilizado y no requerido actualmente.
- Vinculaciones publicitarias: ninguna.

El Measurement ID es un identificador publico, no una credencial. No se
versionan credenciales, exports de visitantes ni configuracion privilegiada.

## Medicion mejorada y minimizacion

La medicion mejorada de GA4 permanece activada para las mediciones automaticas
compatibles con los contratos de privacidad. Vistas de pagina, desplazamientos
y clics de salida permanecen activados. La medicion automatica de formularios
esta desactivada porque no es necesaria actualmente y reduce superficie de
recogida innecesaria. Esta decision no implica desactivar toda la medicion
mejorada.

La configuracion del stream puede mostrar page views activadas, pero el
adaptador productivo establece `send_page_view: false` y emite el `page_view`
contractual desde la instrumentacion propia. Asi se conserva la medicion de
vistas sin duplicar el evento.

- Google Signals: desactivado.
- User-ID: no utilizado; no hay cuentas ni autenticacion.
- Datos proporcionados por usuarios: desactivados.
- Ocultacion automatica de correo: activada.
- Ocultacion de parametros de consulta: no configurada; no existen actualmente
  parametros sensibles propios que requieran redaccion.
- Conservacion de eventos: 2 meses.
- Conservacion de usuarios: 14 meses.
- Borrado/reset con nueva actividad: activado.

Si la web incorpora en el futuro URLs propias con parametros como `email`,
`phone`, `name`, `address` o `token`, debe revisarse la decision de ocultacion.
No se añaden nombres de parametros ficticios por el telefono o la URL externa
del CTA de WhatsApp.

## Trafico interno

No se utiliza actualmente exclusion de trafico interno mediante IP. La regla y
el filtro de prueba `Internal Traffic` fueron eliminados porque la conexion
administrativa usa una IP publica dinamica y su mantenimiento no esta
justificado por el volumen actual.

La exclusion principal de entornos no productivos es arquitectonica: el
adaptador solo puede emitir desde `https://lunatartas.es`; localhost,
desarrollo, tests, previews y otros hosts son no-op. Se acepta que una visita
administrativa consentida realizada directamente en produccion pueda
contabilizarse. Si el volumen interno distorsiona significativamente los
informes, se reconsiderara una estrategia con IP fija, VPN u otra segmentacion.

## Eventos

| Evento | Disparador | Payload permitido |
| --- | --- | --- |
| `page_view` | carga de una pagina instrumentada | `page_path` canonico sin query ni fragmento |
| `view_item` | carga de una ficha publicada, una vez | `item_id`, `item_name`, `item_category` del catalogo publico |
| `contact_whatsapp` | activacion de un CTA WhatsApp, una vez | `source`; opcionalmente los tres campos `item_*` publicos |

Se prohiben nombre del visitante, email, telefono, direccion, mensaje o URL de WhatsApp, texto personalizado, formularios, query, fragmento, identificadores personales o de dispositivo y cualquier valor ajeno al catalogo/contexto controlado.

## Consecuencias

- La UI conserva atributos declarativos y un unico adaptador; no hay llamadas dispersas a `gtag()`.
- Navegacion y WhatsApp funcionan sin JavaScript, consentimiento o proveedor.
- Google tag solo se inserta tras opt-in y se configura con `send_page_view: false` para evitar duplicados.
- La configuracion externa de Search Console y GA4 esta registrada en el runbook de M9.4.
- M9.4 sigue bloqueada hasta completar deploy y validacion humana productiva en Network y Realtime/DebugView.

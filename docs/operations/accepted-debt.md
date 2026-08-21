# Deuda aceptada al cierre de V1

Esta lista contiene límites conocidos que no bloquean producción. `P1` debe
revisarse antes que `P2`; ninguna fila autoriza trabajo post-V1 por sí sola.

| ID | Prioridad | Deuda o riesgo aceptado | Motivo de aceptación V1 | Owner | Condición de salida / revisión |
| --- | --- | --- | --- | --- | --- |
| DEBT-01 | P1 | Advisories mitigados de la cadena Astro 6/sharp y herramientas de desarrollo | El sitio es SSG, procesa sólo imágenes versionadas/revisadas y no expone SSR ni subida de usuario; el gate bloquea advisories nuevos | Mantenedor técnico | revisar en cada actualización y antes de aceptar media no confiable o SSR; planificar migración mayor y retirar excepciones sólo con suite completa verde |
| DEBT-02 | P1 | Cobertura manual sin Firefox, Safari/iOS ni dispositivo Android real en M8.3 | Baseline, HTML estático, no-JS, checks responsive y Chrome/Edge pasaron; no hay evidencia inventada para plataformas ausentes | Mantenedor técnico | ejecutar matriz real antes de una evolución visual amplia o ante un incidente de compatibilidad |
| DEBT-03 | P1 | El inventario histórico no incluye todos los posibles exports privados de logs/backlinks | Las 16 decisiones conocidas pasan en producción y Search Console está verificada; lo desconocido no justificó redirects especulativos | SEO / propietario del negocio | revisar Pages/404/links de Search Console y consultas de soporte; añadir sólo URLs con evidencia |
| DEBT-04 | P2 | Tipografía de marca no incorporada | No se recibieron archivos/licencia web; los stacks de sistema cumplen accesibilidad y performance | Luna / marca | aportar masters, licencia y aprobación, y validar CLS, contraste y dirección visual antes de publicar |
| DEBT-05 | P2 | Algunas landings taxonómicas mantienen poco copy y dos titles históricos largos | Son únicas, útiles, enlazadas e indexables; no se rellena con texto generado ni se recorta copy aprobado sin decisión | Luna / contenido y SEO | revisar rendimiento/consultas en Search Console y mejorar sólo con copy aprobado |
| DEBT-06 | P2 | GA4 no excluye tráfico interno por IP dinámica | Desarrollo, preview y tests están excluidos; el owner acepta que visitas administrativas consentidas puedan contarse | Titular de Luna Tartas / Analytics | reevaluar si existe una fuente estable de tráfico interno o si afecta decisiones de negocio |
| DEBT-07 | P2 | GitHub Pages no aporta por repositorio una CSP HTTP estricta configurable | V1 no usa formularios, iframes, SSR ni scripts de terceros antes del opt-in; HTTPS y superficie pública están verificadas | Mantenedor técnico + owner Cloudflare | configurar en edge o cambiar hosting si se amplían integraciones/riesgo y validar que no rompe GA4 consentido ni assets |
| DEBT-08 | P2 | La alineación móvil definitiva de la referencia visual queda fuera de la fase desktop | Mobile conserva navegación, lectura, CTA, accesibilidad y ausencia de overflow verificadas; no se declara paridad visual inexistente | Luna / diseño | sólo con prioridad explícita post-V1 y nueva aceptación visual 320/375/768 |

Resuelto y no arrastrado como deuda: favicon/logo aprobado (M9.1), dominio y
HTTPS (M9.3), redirects conocidos (M9.2), Search Console y GA4 productivos
(M9.4), y cero incidente crítico durante estabilización (M9.5).

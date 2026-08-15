# Estado actual de producción, SEO y activos

Inventario ejecutado el **2026-08-15** para `M0.1`. Sólo registra evidencia pública, archivos presentes en los dos workspaces del proyecto y confirmaciones ya documentadas. No contiene credenciales ni presume acceso a cuentas privadas.

## Clasificación ratificada

**Implementación de código greenfield con migración de contenido/SEO posible y todavía no descartada.** El repositorio canónico y su remoto público están vacíos, por lo que no existe una aplicación anterior recuperable desde Git. Sin embargo, el dominio tiene DNS activo y no hay acceso aportado a Search Console, Analytics, Cloudflare, hosting anterior ni exports. La falta de resultados públicos no demuestra que nunca existieran URLs o señales.

Consecuencia: el desarrollo puede partir de cero, pero `M9.2` debe conservar el gate de redirects. Sólo podrá producir un acta de “sin redirects” tras recibir exports/listados o una confirmación explícita del propietario del negocio de que no hubo sitio ni URLs anteriores.

## Fuentes y límites de la auditoría

| ID | Fuente comprobada | Fecha | Resultado reproducible | Límite |
| --- | --- | --- | --- | --- |
| S1 | Git local en `C:\lab\repos\luna_tartas` | 2026-08-15 | `git remote -v`, `git rev-list --all --count` y `git ls-remote --symref origin`: remoto `https://github.com/xenxi/luna_tartas.git`, 0 commits y ninguna ref anunciada | No acredita acceso administrativo |
| S2 | API pública de GitHub, `GET /repos/xenxi/luna_tartas` | 2026-08-15 | repositorio público, `size: 0`, rama por defecto `main`, `has_pages: false` | No inspecciona settings privados ni permisos del propietario |
| S3 | DNS local y Google Public DNS (A, AAAA, NS, MX, TXT y `www`) | 2026-08-15 | apex con A `188.114.96.5`, `188.114.97.5`; AAAA `2a06:98c1:3120::5`, `2a06:98c1:3121::5`; NS `clay.ns.cloudflare.com`, `hadlee.ns.cloudflare.com`; sin MX; TXT SPF de DonDominio; `www` devuelve NXDOMAIN | Los registros proxied no revelan el origin ni demuestran acceso a Cloudflare |
| S4 | Probes HTTP(S) desde el entorno de ejecución | 2026-08-15 | HTTPS al apex agotó tiempo; HTTP devolvió una página de bloqueo de Vodafone; `www` no resolvió; `robots.txt` y `sitemap.xml` por HTTP devolvieron la misma página de bloqueo | La respuesta de Vodafone es intermediaria y no identifica contenido u hosting de origen |
| S5 | Búsqueda pública exacta por dominio, `site:` y marca | 2026-08-15 | no aparecieron resultados atribuibles a `lunatartas.es` | No sustituye Search Console ni una herramienta de backlinks aportada por el propietario |
| S6 | Internet Archive Availability API y CDX | 2026-08-15 | la consulta del apex no devolvió snapshot; la consulta wildcard CDX agotó tiempo | No prueba ausencia histórica del resto de URLs |
| S7 | Inventario de archivos de los workspaces canónico y alternativo | 2026-08-15 | sólo documentación de planificación en el canónico; ningún logo, favicon, foto, catálogo, copy comercial o export; workspace alternativo sin archivos fuera de `.git` | No cubre dispositivos, nubes o cuentas no aportados |
| S8 | Confirmaciones recogidas en `architecture.md` y `ROADMAP.md` | 2026-08-15 | el propietario confirmó que el repositorio GitHub es nuevo, vacío y público | No confirma propiedad/acceso de dominio, Cloudflare ni plataformas históricas |

Los estados `TBD` siguientes son pendientes trazables, no afirmaciones de inexistencia.

## Producción, dominio y hosting

| Elemento | Evidencia/estado | Disponibilidad | Propietario | Siguiente acción |
| --- | --- | --- | --- | --- |
| Dominio apex `lunatartas.es` | DNS público activo detrás de Cloudflare (S3); respuesta web de origen no verificable (S4) | Parcial pública; acceso `TBD` | Propietario del negocio | Confirmar titularidad y acceso; exportar zona DNS completa sin secretos antes de M9.3 |
| Variante `www.lunatartas.es` | NXDOMAIN para A y CNAME (S3) | `TBD` (registro ausente) | Propietario del negocio | Confirmar que `www -> apex` es la política deseada y crearla sólo en M9.3 |
| Cuenta/zona Cloudflare | NS autoritativos de Cloudflare; cuenta, proxy, reglas y usuarios no aportados | `TBD` | Propietario del negocio | Identificar owner con acceso, exportar registros/TTL/reglas y definir recuperación; no versionar credenciales |
| Registros DNS | A/AAAA/NS/TXT observables; no se observó MX (S3) | Parcial pública; export completo `TBD` | Propietario del negocio | Revisar la zona desde Cloudflare y documentar registros que no sean públicamente enumerables |
| HTTPS/certificado | Conexión agotó tiempo desde esta red (S4) | `TBD` | Propietario del negocio | Probar desde otra red y revisar modo SSL/TLS/origin en Cloudflare |
| Hosting/origin anterior | No identificable detrás del proxy; no se aportó panel, factura ni configuración | `TBD` | Propietario del negocio | Aportar proveedor, acceso, export y fecha de posible baja; conservar rollback hasta M9.3 |
| CMS o plataforma anterior | No aportado y no recuperable desde el remoto vacío | `TBD` | Propietario del negocio | Confirmar si existió; entregar export de contenido/configuración o declaración explícita de ausencia |
| GitHub Pages | API pública indica `has_pages: false` (S2) | No habilitado; acceso administrativo `TBD` | Propietario GitHub (`xenxi`) | Confirmar permisos y habilitar/configurar únicamente en M1.5 |

## SEO, URLs y medición

El estado individual de todas las URLs conocidas durante esta auditoría está en [`../seo/url-inventory.csv`](../seo/url-inventory.csv). No se descubrieron rutas históricas adicionales mediante las fuentes públicas consultadas.

| Elemento | Evidencia/estado | Disponibilidad | Propietario | Siguiente acción |
| --- | --- | --- | --- | --- |
| `robots.txt` | No verificable en origin; HTTP fue interceptado y HTTPS agotó tiempo (S4) | `TBD` | Propietario del negocio | Recuperar desde hosting/export o comprobar desde otra red/origin autorizado |
| Sitemap(s) | `sitemap.xml` no verificable; no se aportó otra URL o archivo (S4) | `TBD` | Propietario del negocio | Aportar sitemap/export del hosting y consultar sitemaps enviados en Search Console |
| URLs históricas | Ninguna lista aportada; búsqueda pública sin resultados; Wayback sólo concluyente para ausencia de snapshot del apex en esa consulta (S5, S6) | `TBD` | Propietario del negocio | Exportar Pages/Indexing/Performance de Search Console, logs/CMS y confirmar expresamente cualquier ausencia |
| Google Search Console | Propiedad, usuarios y exports no aportados | `TBD` | Propietario del negocio | Identificar owner; exportar páginas, sitemaps, enlaces y rendimiento sin incluir credenciales |
| Analytics/tag manager | Cuenta, proveedor, IDs, periodos y exports no aportados | `TBD` | Propietario del negocio | Identificar owner/proveedor y exportar landing pages y métricas históricas agregadas; decisión futura en M7.1 |
| Backlinks | No se aportó listado; búsqueda exacta no descubrió referencias atribuibles (S5) | `TBD` | Propietario del negocio | Aportar export de Search Console o herramienta SEO y clasificar cada URL destino |
| Redirects/reglas edge | No se aportaron reglas y Cloudflare no es accesible | `TBD` | Propietario del negocio | Exportar Bulk Redirects/Page Rules/Redirect Rules antes de decidir la capa en M9.2 |

## Marca, contenido y activos

| Elemento | Evidencia/estado | Disponibilidad | Propietario | Siguiente acción |
| --- | --- | --- | --- | --- |
| Logo y variantes | Ningún archivo aportado (S7) | `TBD` | Propietario del negocio | Entregar masters y formatos web, indicando autor, licencia y aprobación |
| Favicon e iconos | Ningún archivo aportado (S7) | `TBD` | Propietario del negocio | Entregar fuente aprobada o autorizar derivación futura desde marca aprobada |
| Tipografías/guía de marca | Ningún archivo/licencia aportado (S7) | `TBD` | Propietario del negocio | Entregar guía, archivos y licencias o confirmar uso de alternativas permitidas |
| Fotos y originales | Ningún archivo aportado (S7) | `TBD` | Propietario del negocio | Entregar selección, originales, autor/derechos, aprobación y contexto para alt text |
| Catálogo, precios y taxonomías | No hay export ni contenido comercial; sólo contrato conceptual | `TBD` | Propietario del negocio | Entregar fuente vigente y fecha de aprobación; estructuración corresponde a M0.3/M9.1 |
| Textos comerciales/SEO | No hay copy publicable; la documentación existente no es contenido comercial | `TBD` | Propietario del negocio | Entregar textos y aprobación, separando material histórico de propuesta nueva |
| Prueba social, datos legales y contacto | No aportados | `TBD` | Propietario del negocio | Entregar fuentes verificables y permisos de publicación; no inventar claims |
| Derechos y licencias | No hay documentos o confirmaciones de uso | `TBD` | Propietario del negocio | Asociar cada activo/texto a autor, licencia, alcance y aprobación antes de publicar |

## Repositorios y exports

| Elemento | Evidencia/estado | Disponibilidad | Propietario | Siguiente acción |
| --- | --- | --- | --- | --- |
| Repositorio canónico local | `C:\lab\repos\luna_tartas`, rama `main`, sin commits iniciales (S1) | Disponible | Equipo técnico | Continuar aquí; no copiar secretos ni material sin derechos |
| Remoto canónico | `https://github.com/xenxi/luna_tartas.git`, público, vacío, sin Pages (S1, S2) | Disponible públicamente; administración `TBD` | Propietario GitHub (`xenxi`) | Confirmar permisos antes de CI/Pages; mantener frontera pública |
| Repositorio local alternativo | `C:\Users\Usuario\Documents\ChatGPT\Luna tartas`, Git vacío, sin remoto ni archivos (S7, S8) | Disponible pero no canónico | Equipo técnico | No desarrollar aquí; conservar salvo decisión explícita del propietario |
| Repositorio anterior | No aportado ni enlazado | `TBD` | Propietario del negocio | Facilitar URL/export/bundle Git o confirmar por escrito que no existe |
| Exports CMS/hosting/SEO/analytics | Ningún export aportado | `TBD` | Propietario del negocio | Entregar archivos sanitizados o enlaces privados mediante canal autorizado; registrar fecha y cobertura |

## Cierre del inventario

- Todas las URLs conocidas tienen estado en el CSV; no se asigna destino de migración todavía.
- Las ausencias quedan como `TBD` con propietario y acción concreta.
- No se copiaron contenidos ni activos y no se realizaron cambios de DNS, hosting o cuentas.
- Los riesgos de migración, DNS, activos y redirects permanecen abiertos hasta recibir evidencia privada o una confirmación explícita de ausencia.


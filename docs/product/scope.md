# Alcance de producto

## V1 incluido

- Home editorial y orientada a descubrimiento.
- Índice de productos y páginas por categoría, ocasión y destinatario.
- Ficha de producto con galería, precio cuando proceda, personalización, confianza, relacionados y CTA WhatsApp.
- CTA global para propuestas personalizadas.
- Catálogo YAML validado, extensible y desacoplado de presentación.
- SEO técnico, metadata, sitemap, robots, canonical, breadcrumbs, enlaces internos y JSON-LD correcto.
- `/catalog.json` estático con únicamente datos públicos publicados.
- Analytics desacoplado para visitas y eventos de conversión definidos.
- Optimización de imágenes, accesibilidad, rendimiento, tests y CI/CD.
- GitHub Pages con `lunatartas.es`, HTTPS y estrategia explícita de URLs/redirects.
- Repositorio GitHub público como frontera explícita: configuración pública versionada, secretos excluidos y protegidos mediante GitHub Actions Secrets cuando sean imprescindibles.

## Fuera de alcance V1

- Carrito, checkout, pagos, cuentas, pedidos y stock en tiempo real.
- Backend, base de datos, API de catálogo en runtime o CMS.
- Aplicación Luna Catalog Manager.
- Credenciales del futuro Catalog Manager dentro de una aplicación cliente o del repositorio público.
- Personalizador visual complejo o configurador de precios.
- Chatbot, MCP, UCP, agentes propios o agentic commerce.
- Automatización de WhatsApp Business y CRM.
- Blog salvo que el inventario SEO demuestre que es necesario conservar contenido existente.
- Internacionalización y múltiples monedas salvo requisito de negocio confirmado.
- Reseñas inventadas, precios, disponibilidad, plazos o políticas no confirmados.

## Información necesaria y todavía TBD

- Nombre legal/comercial definitivo, logo, favicon, tipografías/licencias y guía de marca.
- Número público y reglas de atención de WhatsApp.
- Catálogo, taxonomías, precios, moneda, textos, fotos y alt text aprobados.
- Prueba social verificable, zona de servicio, plazos y políticas relevantes.
- Acceso a DNS/Cloudflare, GitHub Pages, Analytics y Search Console.
- URLs históricas, enlaces externos, métricas y configuración de producción anterior.
- Proveedor de analytics y requisitos de consentimiento/privacidad.

El estado, propietario, deadline y evidencia de cada entrada se mantienen en [`content-readiness.md`](content-readiness.md). La ausencia de estos datos no bloquea el diseño de arquitectura ni M1.1. Sí bloqueará los milestones de contenido final, instrumentación o release que los indiquen como dependencia.

La información marcada como `TBD` no es publicable. Los fixtures de desarrollo tampoco son contenido V1: deben estar marcados como no publicables y aislados de la proyección de catálogo, HTML, sitemap, JSON-LD y `/catalog.json`.

## Regla de alcance

No se inventan datos de negocio. Los ejemplos y fixtures deben estar identificados como no publicables. Una nueva necesidad se añade al roadmap sólo con motivo, impacto y aceptación explícitos.

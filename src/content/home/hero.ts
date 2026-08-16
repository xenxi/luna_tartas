import { routes } from '../../lib/catalog/domain/routes';
import { whatsappConfig } from '../../config/contact';

export const heroContent = Object.freeze({
  heading: 'Hecho para alguien. No para cualquiera.',
  copy: Object.freeze([
    'Creamos regalos personalizados y pequeños detalles con mucho mimo,',
    'porque las personas especiales merecen algo pensado especialmente para ellas.',
  ]),
  primaryAction: Object.freeze({
    label: 'Descubrir regalos',
    href: routes.products(),
  }),
  secondaryAction: Object.freeze({
    label: 'Cuéntanos tu idea',
    href: whatsappConfig.href,
  }),
  image: Object.freeze({
    alt: 'Tarta de pañales artesanal decorada en tonos pastel con motivos infantiles.',
    author: 'Luna',
    rights: 'Publication rights confirmed by the original author and owner.',
  }),
  approval: Object.freeze({
    approvedBy: 'Responsable del proyecto',
    approvedAt: '2026-08-16',
  }),
});

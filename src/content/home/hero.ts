import { routes } from '../../lib/catalog/domain/routes';
import { whatsappConfig } from '../../config/contact';

export const heroContent = Object.freeze({
  eyebrow: 'REGALOS QUE CUENTAN HISTORIAS',
  heading: Object.freeze(['Pequeños detalles', 'para momentos']),
  claim: 'grandes ♡',
  signature: 'La magia está en los detalles',
  copy: Object.freeze([
    'Regalos personalizados, hechos a mano y con mucho cariño',
    'para celebrar todo lo que importa.',
  ]),
  primaryAction: Object.freeze({
    label: 'Descubrir regalos',
    href: routes.products(),
  }),
  secondaryAction: Object.freeze({
    label: 'Cuéntanos tu idea',
    href: whatsappConfig.href,
  }),
  shortcuts: Object.freeze([
    { label: 'Para bebés', href: routes.taxonomy('recipient', 'bebe') },
    { label: 'Para ocasiones', href: routes.taxonomyIndex('occasion') },
    {
      label: 'Para quien más quieras',
      href: routes.taxonomyIndex('recipient'),
    },
  ]),
  benefits: Object.freeze([
    Object.freeze({
      icon: 'heart',
      label: 'Hechos a mano',
    }),
    Object.freeze({
      icon: 'hands',
      label: 'Materiales de calidad',
    }),
    Object.freeze({
      icon: 'delivery',
      label: 'Envío y entrega con cuidado',
    }),
    Object.freeze({
      icon: 'quality',
      label: 'Regalos únicos y personalizados',
    }),
  ]),
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

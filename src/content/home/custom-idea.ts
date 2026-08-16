import { whatsappConfig } from '../../config/contact';

export const customIdeaContent = Object.freeze({
  title: 'Cuéntanos tu idea',
  copy: 'Si tienes algo especial en mente, escríbenos y te ayudamos a darle forma.',
  action: Object.freeze({
    label: 'Cuéntanos tu idea',
    href: whatsappConfig.href,
  }),
  approval: Object.freeze({
    approvedBy: 'Responsable del proyecto',
    approvedAt: '2026-08-16',
  }),
});

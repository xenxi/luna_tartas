import { whatsappConfig } from '../../config/contact';

export const customIdeaContent = Object.freeze({
  title: '¿Tienes algo en mente?',
  copy: 'Cuéntanos tu idea y te ayudamos a crear un regalo único e inolvidable.',
  action: Object.freeze({
    label: 'Cuéntanos tu idea',
    href: whatsappConfig.href,
  }),
  media: Object.freeze({
    image: Object.freeze({
      alt: 'Manos preparando un regalo envuelto con un lazo rosa junto a unas flores delicadas.',
      sourceWidth: 1536,
      sourceHeight: 1024,
    }),
    rights: Object.freeze({
      owner: 'Propietario del proyecto',
      scope: 'Publicación en lunatartas.es',
      evidence:
        'Assets aportados y autorizados directamente por el propietario para M8.9.8, 2026-08-18; fotografía central actualizada con PNG transparente.',
    }),
  }),
  approval: Object.freeze({
    approvedBy: 'Responsable del proyecto',
    approvedAt: '2026-08-18',
  }),
});

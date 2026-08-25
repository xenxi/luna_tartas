import { publicContactConfig } from '../config/contact';
import { routes } from '../lib/catalog/domain/routes';
import { shippingContent } from './shipping';

function getConfirmedLocation(): string {
  const localDelivery = shippingContent.options.items.find(
    (item) => 'location' in item,
  );

  if (!localDelivery) {
    throw new Error('Contact page requires a confirmed delivery location');
  }

  return localDelivery.location;
}

export const contactContent = Object.freeze({
  metadata: Object.freeze({
    title: 'Contacto | LUNA',
    description:
      'Contacta con LUNA en Linares para consultar regalos personalizados o contarnos tu idea. Escríbenos directamente por WhatsApp.',
  }),
  hero: Object.freeze({
    eyebrow: 'Contacto',
    title: 'Hablemos',
    intro:
      '¿Tienes una idea, una duda o quieres preparar algo diferente? Cuéntanoslo y vemos contigo cómo darle forma.',
  }),
  whatsapp: Object.freeze({
    eyebrow: 'La forma más directa',
    title: 'Escríbenos por WhatsApp',
    copy: 'Pregúntanos por un producto, cuéntanos qué tienes en mente o consúltanos cualquier detalle de tu pedido. Estamos aquí para ayudarte a encontrar la mejor opción.',
    note: 'Puedes escribirnos sin tenerlo todo decidido.',
    action: Object.freeze({
      label: 'Hablar por WhatsApp',
      href: publicContactConfig.whatsapp.href,
    }),
  }),
  topics: Object.freeze({
    eyebrow: 'Ideas, dudas y encargos',
    title: 'Cuéntanos qué necesitas',
    intro: 'Estas son algunas de las cosas sobre las que podemos hablar.',
    items: Object.freeze([
      Object.freeze({
        icon: 'cake',
        title: 'Tartas de pañales',
        copy: 'Pregunta por diseños, personalización o disponibilidad para tu regalo.',
        href: routes.taxonomy('category', 'tartas-de-panales'),
      }),
      Object.freeze({
        icon: 'stationery',
        title: 'Papelería personalizada',
        copy: 'Cuéntanos si buscas invitaciones, tarjetas, libretas o etiquetas.',
        href: routes.taxonomy('category', 'papeleria-personalizada'),
      }),
      Object.freeze({
        icon: 'print',
        title: 'Láminas personalizadas',
        copy: 'Háblanos del nombre, nacimiento o historia que quieres conservar.',
        href: routes.taxonomy('category', 'laminas-personalizadas'),
      }),
      Object.freeze({
        icon: 'gift',
        title: 'Packs personalizados',
        copy: 'Combina varios detalles en un regalo pensado para una sola persona.',
        href: routes.taxonomy('category', 'packs-personalizados'),
      }),
    ]),
  }),
  channels: Object.freeze({
    eyebrow: 'También estamos aquí',
    title: 'Otras formas de encontrarnos',
    items: Object.freeze([
      Object.freeze({
        icon: 'instagram',
        name: 'Instagram',
        label: publicContactConfig.instagram.label,
        copy: 'Descubre nuevos trabajos, ideas y detalles que vamos preparando.',
        actionLabel: 'Ver Instagram',
        href: publicContactConfig.instagram.href,
      }),
      Object.freeze({
        icon: 'email',
        name: 'Email',
        label: publicContactConfig.email.label,
        copy: 'Si prefieres contarnos tu consulta con más calma, escríbenos por correo.',
        actionLabel: 'Enviar email',
        href: publicContactConfig.email.href,
      }),
    ]),
  }),
  location: Object.freeze({
    eyebrow: 'Desde aquí',
    title: 'Estamos en Linares',
    location: getConfirmedLocation(),
    copy: 'LUNA nace y trabaja desde Linares, Jaén. Podemos organizar entregas en mano y también enviar por mensajería.',
    actionLabel: 'Ver opciones de entrega',
    href: routes.shipping(),
  }),
  faq: Object.freeze({
    eyebrow: 'Antes de escribirnos',
    title: 'Preguntas rápidas',
    items: Object.freeze([
      Object.freeze({
        question: '¿Puedo pedir algo personalizado?',
        answer:
          'Sí. Cuéntanos tu idea y veremos contigo qué podemos preparar y cómo adaptarlo.',
      }),
      Object.freeze({
        question: '¿Cómo hago un pedido?',
        answer:
          'Escríbenos por WhatsApp, dinos qué te interesa y te explicaremos los siguientes pasos.',
      }),
      Object.freeze({
        question: '¿Hacéis envíos?',
        answer:
          'Sí. En Linares podemos organizar la entrega en mano y, para otros destinos, utilizamos mensajería.',
        href: routes.shipping(),
        actionLabel: 'Consulta todos los detalles de entrega',
      }),
    ]),
  }),
  closing: Object.freeze({
    eyebrow: 'Cuando quieras',
    title: '¿Tienes algo en mente?',
    copy: 'Muchas ideas empiezan con un mensaje. Cuéntanos la tuya y vemos juntos por dónde empezar.',
    action: Object.freeze({
      label: 'Escribir por WhatsApp',
      href: publicContactConfig.whatsapp.href,
    }),
  }),
});

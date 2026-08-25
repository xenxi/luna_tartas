import { whatsappConfig } from '../config/contact';

export const shippingContent = Object.freeze({
  metadata: Object.freeze({
    title: 'Envíos y entregas | LUNA',
    description:
      'Consulta cómo recibir tus regalos personalizados: entrega en mano en Linares o envío mediante mensajería, con el coste informado antes de confirmar.',
  }),
  hero: Object.freeze({
    eyebrow: 'Cerca de ti',
    title: 'Envíos y entregas',
    intro:
      'Preparamos cada pedido con cuidado y buscamos la forma más sencilla de hacértelo llegar.',
  }),
  options: Object.freeze({
    title: '¿Cómo recibirás tu pedido?',
    intro: 'Depende de dónde quieras recibirlo.',
    items: Object.freeze([
      Object.freeze({
        number: '01',
        eyebrow: 'En Linares',
        title: 'Entrega en mano en Linares',
        location: 'Linares, Jaén',
        copy: 'Si estás en Linares, podemos organizar la entrega de tu pedido en mano. Cuando esté preparado, acordaremos contigo el lugar, la fecha y la hora para que puedas recibirlo cómodamente.',
      }),
      Object.freeze({
        number: '02',
        eyebrow: 'Fuera de Linares',
        title: 'Envío por mensajería',
        copy: 'Si quieres recibir tu pedido fuera de Linares, podemos enviártelo mediante mensajería.',
        highlight: 'Los gastos de envío no están incluidos.',
        detail:
          'El coste dependerá del destino y de las características del pedido. Te informaremos antes de confirmar el encargo.',
      }),
    ]),
  }),
  process: Object.freeze({
    title: 'Así funciona',
    intro: 'Te acompañamos en cada paso para que todo resulte fácil.',
    steps: Object.freeze([
      Object.freeze({
        number: '01',
        title: 'Cuéntanos qué necesitas',
        copy: 'Explícanos qué producto o personalización tienes en mente.',
        icon: 'chat',
      }),
      Object.freeze({
        number: '02',
        title: 'Preparamos tu pedido',
        copy: 'Creamos cada detalle de forma artesanal.',
        icon: 'hands',
      }),
      Object.freeze({
        number: '03',
        title: 'Acordamos la entrega',
        copy: 'Confirmamos contigo si será en mano o por mensajería.',
        icon: 'pin',
      }),
      Object.freeze({
        number: '04',
        title: 'Te lo hacemos llegar',
        copy: 'Recibes tu pedido de la forma que hayamos acordado.',
        icon: 'parcel',
      }),
    ]),
  }),
  notice: Object.freeze({
    title: '¿El envío está incluido en el precio?',
    answer: 'No.',
    copy: 'Los precios mostrados en la web no incluyen los gastos de envío mediante mensajería.',
    detail:
      'El importe correspondiente se comunicará antes de confirmar el pedido.',
  }),
  cta: Object.freeze({
    title: '¿Tienes dudas sobre la entrega?',
    copy: 'Escríbenos y te contamos cuál es la mejor opción para tu pedido.',
    note: 'Te informaremos de todo antes de confirmar tu pedido.',
    action: Object.freeze({
      label: 'Hablar por WhatsApp',
      href: whatsappConfig.href,
    }),
  }),
});

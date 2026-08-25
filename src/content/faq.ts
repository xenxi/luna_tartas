import { publicContactConfig } from '../config/contact';
import { routes } from '../lib/catalog/domain/routes';
import { shippingContent } from './shipping';

export interface FaqLink {
  readonly label: string;
  readonly href: string;
  readonly kind?: 'whatsapp';
}

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
  readonly links?: readonly FaqLink[];
}

export interface FaqSection {
  readonly id: 'pedidos' | 'productos' | 'envios' | 'contacto';
  readonly shortTitle: string;
  readonly title: string;
  readonly intro: string;
  readonly items: readonly FaqItem[];
}

const localDelivery = shippingContent.options.items[0];
const courierDelivery = shippingContent.options.items[1];

if (!('detail' in courierDelivery)) {
  throw new Error('FAQ requires the confirmed courier delivery details');
}

export const faqContent = Object.freeze({
  metadata: Object.freeze({
    title: 'Preguntas frecuentes | LUNA',
    description:
      'Resolvemos las dudas más habituales sobre pedidos personalizados, entregas en Linares, envíos y productos de LUNA.',
  }),
  hero: Object.freeze({
    eyebrow: 'Preguntas frecuentes',
    title: '¿Tienes alguna duda?',
    intro:
      'Aquí encontrarás respuestas claras a las preguntas que suelen surgir antes de preparar un pedido.',
    actionLabel: '¿No encuentras lo que buscas? Escríbenos',
    actionHref: routes.contact(),
  }),
  sections: Object.freeze([
    Object.freeze({
      id: 'pedidos',
      shortTitle: 'Pedidos',
      title: 'Pedidos y personalización',
      intro: 'Cómo empezar y dar forma a un encargo pensado para ti.',
      items: Object.freeze([
        Object.freeze({
          question: '¿Cómo hago un pedido?',
          answer:
            'Puedes escribirnos por WhatsApp y contarnos qué producto te interesa o qué tienes en mente. A partir de ahí concretaremos contigo los detalles del pedido.',
          links: Object.freeze([
            Object.freeze({
              label: 'Escribir por WhatsApp',
              href: publicContactConfig.whatsapp.href,
              kind: 'whatsapp',
            }),
          ]),
        }),
        Object.freeze({
          question: '¿Puedo personalizar un producto o pedir algo diferente?',
          answer:
            'Sí. Muchos productos pueden adaptarse con nombres, colores, textos u otros detalles. Si tienes una idea que no aparece exactamente en la web, cuéntanosla y valoraremos contigo si podemos prepararla.',
        }),
        Object.freeze({
          question: '¿Cuándo empieza a prepararse mi pedido?',
          answer:
            'Cuando tengamos claros contigo los detalles del encargo te indicaremos los siguientes pasos y cuándo podemos comenzar a prepararlo.',
        }),
      ]),
    }),
    Object.freeze({
      id: 'productos',
      shortTitle: 'Productos',
      title: 'Productos y precios',
      intro: 'Lo esencial sobre el trabajo artesanal y los importes mostrados.',
      items: Object.freeze([
        Object.freeze({
          question: '¿Los productos están hechos a mano?',
          answer:
            'Sí. Los productos de LUNA se preparan de forma artesanal, cuidando especialmente los detalles y la personalización de cada pedido.',
        }),
        Object.freeze({
          question: '¿El precio puede cambiar según la personalización?',
          answer:
            'En la web encontrarás productos con precio fijo y otros mostrados «desde» un determinado importe. Si la personalización modifica el precio, te informaremos antes de confirmar el pedido.',
          links: Object.freeze([
            Object.freeze({
              label: 'Ver productos',
              href: routes.products(),
            }),
          ]),
        }),
        Object.freeze({
          question: '¿Las imágenes muestran exactamente lo que recibiré?',
          answer:
            'Las fotografías muestran ejemplos reales o representativos. Al tratarse de productos artesanales y personalizados, pueden existir pequeñas variaciones en colores, composición o detalles según el encargo.',
        }),
      ]),
    }),
    Object.freeze({
      id: 'envios',
      shortTitle: 'Envíos',
      title: 'Envíos y entregas',
      intro: 'Opciones para recibir tu pedido dentro y fuera de Linares.',
      items: Object.freeze([
        Object.freeze({
          question: '¿Hacéis entregas en Linares?',
          answer: localDelivery.copy,
        }),
        Object.freeze({
          question: '¿Hacéis envíos fuera de Linares?',
          answer: courierDelivery.copy,
          links: Object.freeze([
            Object.freeze({
              label: 'Ver envíos y entregas',
              href: routes.shipping(),
            }),
          ]),
        }),
        Object.freeze({
          question: '¿Los gastos de envío están incluidos?',
          answer: `${shippingContent.notice.copy} ${courierDelivery.detail}`,
          links: Object.freeze([
            Object.freeze({
              label: 'Ver envíos y entregas',
              href: routes.shipping(),
            }),
          ]),
        }),
        Object.freeze({
          question: '¿Cuánto tarda en llegar un pedido?',
          answer:
            'El tiempo depende tanto de la preparación del producto como del tipo de entrega. Al confirmar los detalles del pedido podremos darte una estimación más concreta.',
        }),
      ]),
    }),
    Object.freeze({
      id: 'contacto',
      shortTitle: 'Contacto',
      title: 'Contacto',
      intro: 'La forma más sencilla de resolver cualquier detalle contigo.',
      items: Object.freeze([
        Object.freeze({
          question: '¿Cómo puedo contactar con LUNA?',
          answer:
            'La forma más directa es escribirnos por WhatsApp. También puedes encontrarnos en Instagram o escribirnos por email.',
          links: Object.freeze([
            Object.freeze({
              label: 'WhatsApp',
              href: publicContactConfig.whatsapp.href,
              kind: 'whatsapp',
            }),
            Object.freeze({
              label: 'Instagram',
              href: publicContactConfig.instagram.href,
            }),
            Object.freeze({
              label: 'Email',
              href: publicContactConfig.email.href,
            }),
            Object.freeze({
              label: 'Ver contacto',
              href: routes.contact(),
            }),
          ]),
        }),
        Object.freeze({
          question: '¿Puedo consultar una idea antes de hacer un pedido?',
          answer:
            'Sí. Si todavía no tienes claro qué necesitas, puedes contarnos la idea y veremos contigo qué opciones pueden encajar mejor.',
        }),
      ]),
    }),
  ]) as readonly FaqSection[],
  closing: Object.freeze({
    eyebrow: 'Estamos al otro lado',
    title: '¿No encuentras lo que buscas?',
    copy: 'Escríbenos y cuéntanos tu duda. Te ayudaremos con tu pedido o con cualquier idea que tengas en mente.',
    primaryAction: Object.freeze({
      label: 'Hablar por WhatsApp',
      href: publicContactConfig.whatsapp.href,
    }),
    secondaryAction: Object.freeze({
      label: 'Ver contacto',
      href: routes.contact(),
    }),
  }),
});

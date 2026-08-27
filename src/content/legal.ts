import { publicContactConfig } from '../config/contact';
import { routes } from '../lib/catalog/domain/routes';

export interface LegalLink {
  readonly label: string;
  readonly href: string;
}

export interface LegalSection {
  readonly id: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly items?: readonly string[];
  readonly links?: readonly LegalLink[];
  readonly note?: string;
}

export interface LegalPageContent {
  readonly kind: 'privacy' | 'terms';
  readonly metadata: Readonly<{
    title: string;
    description: string;
  }>;
  readonly hero: Readonly<{
    eyebrow: string;
    title: string;
    intro: string;
    updated: string;
  }>;
  readonly overview: Readonly<{
    title: string;
    copy: string;
    items: readonly string[];
  }>;
  readonly sections: readonly LegalSection[];
  readonly closing: Readonly<{
    title: string;
    copy: string;
    action: LegalLink;
  }>;
}

const privacyContent: LegalPageContent = Object.freeze({
  kind: 'privacy',
  metadata: Object.freeze({
    title: 'Política de privacidad | LUNA',
    description:
      'Información sobre cómo Luna Tartas trata los datos de consultas, pedidos y medición opcional de la web.',
  }),
  hero: Object.freeze({
    eyebrow: 'Tu privacidad, con claridad',
    title: 'Política de privacidad',
    intro:
      'Te explicamos qué datos podemos tratar, para qué los usamos y cómo puedes decidir sobre ellos.',
    updated: 'Última actualización: 27 de agosto de 2026',
  }),
  overview: Object.freeze({
    title: 'Lo esencial, de un vistazo',
    copy: 'La web puede visitarse sin crear una cuenta y sin aceptar medición. Los datos personales aparecen cuando decides contactar, hacer un pedido o aceptar las cookies analíticas.',
    items: Object.freeze([
      'No vendemos tus datos personales.',
      'Google Analytics permanece desactivado hasta que lo aceptas.',
      'Puedes retirar el consentimiento y ejercer tus derechos en cualquier momento.',
    ]),
  }),
  sections: Object.freeze([
    Object.freeze({
      id: 'responsable',
      title: 'Responsable y contacto',
      paragraphs: Object.freeze([
        'Este sitio se publica bajo el nombre comercial Luna Tartas. La titular de la actividad es responsable de los datos tratados al atender consultas y pedidos realizados a través de sus canales de contacto.',
        'Para cualquier cuestión de privacidad o para ejercer tus derechos, puedes escribir al correo indicado a continuación. Para localizar tu solicitud podremos pedirte la información mínima necesaria para verificar tu identidad.',
      ]),
      links: Object.freeze([
        Object.freeze({
          label: publicContactConfig.email.label,
          href: publicContactConfig.email.href,
        }),
      ]),
    }),
    Object.freeze({
      id: 'datos',
      title: 'Qué datos tratamos',
      paragraphs: Object.freeze([
        'Esta web no tiene cuentas, formularios de pedido ni pasarela de pago. Si eliges contactar por WhatsApp, correo electrónico o Instagram, trataremos los datos que compartas voluntariamente, como tu nombre, datos de contacto, mensaje y detalles necesarios para preparar el encargo.',
        'Cuando aceptas la medición opcional, Google Analytics puede tratar información técnica sobre la visita. Nuestra instrumentación limita los eventos propios a la ruta visitada, interacciones con la web y datos públicos del producto; no envía nombres, correos, teléfonos, direcciones ni el texto de tus mensajes.',
        'Tu elección sobre la medición se guarda localmente en el navegador para recordar la preferencia.',
      ]),
    }),
    Object.freeze({
      id: 'finalidades',
      title: 'Para qué y con qué base',
      paragraphs: Object.freeze([
        'Tratamos los datos de contacto y del encargo para responder consultas, preparar presupuestos, concretar una personalización y gestionar el pedido. La base es aplicar medidas precontractuales solicitadas por ti y, cuando el pedido se confirma, ejecutar la relación contractual.',
        'Podemos conservar la información estrictamente necesaria para atender obligaciones legales, fiscales, contables o reclamaciones. La medición de uso se basa exclusivamente en tu consentimiento y no condiciona el acceso a la web ni la posibilidad de contactar.',
      ]),
    }),
    Object.freeze({
      id: 'destinatarios',
      title: 'Proveedores y transferencias',
      paragraphs: Object.freeze([
        'No cedemos datos con fines comerciales. Pueden acceder a la información los proveedores necesarios para prestar el servicio —por ejemplo, el canal de comunicación que elijas o la empresa de transporte cuando corresponda— y las autoridades cuando exista una obligación legal.',
        'Si aceptas la medición, Google Ireland Limited presta el servicio Google Analytics. Este proveedor puede realizar transferencias internacionales con las garantías que describe en su documentación de privacidad y tratamiento de datos.',
      ]),
      links: Object.freeze([
        Object.freeze({
          label: 'Privacidad y condiciones de Google',
          href: 'https://business.safety.google/privacy/',
        }),
      ]),
    }),
    Object.freeze({
      id: 'conservacion',
      title: 'Durante cuánto tiempo',
      paragraphs: Object.freeze([
        'Las consultas se conservan mientras sea necesario para responder y realizar un seguimiento razonable. La documentación de pedidos se mantiene durante los plazos exigidos por la normativa aplicable o mientras pueda existir una reclamación.',
        'La configuración actual de Google Analytics conserva los eventos durante 2 meses y los datos asociados a usuarios durante 14 meses, con reinicio del plazo cuando existe nueva actividad. La preferencia de consentimiento permanece en el navegador hasta que la cambias, borras los datos locales o utilizas otro navegador.',
      ]),
    }),
    Object.freeze({
      id: 'derechos',
      title: 'Tus derechos',
      paragraphs: Object.freeze([
        'Puedes solicitar acceso, rectificación, supresión, oposición, limitación o portabilidad cuando corresponda. También puedes retirar en cualquier momento el consentimiento para la medición desde el control de cookies del pie; retirarlo no afecta a la licitud del tratamiento anterior.',
        'Si consideras que tu solicitud no ha sido atendida correctamente, puedes presentar una reclamación ante la Agencia Española de Protección de Datos.',
      ]),
      links: Object.freeze([
        Object.freeze({
          label: 'Contactar con Luna Tartas',
          href: publicContactConfig.email.href,
        }),
        Object.freeze({
          label: 'Agencia Española de Protección de Datos',
          href: 'https://www.aepd.es/derechos-y-deberes/conoce-tus-derechos',
        }),
      ]),
    }),
    Object.freeze({
      id: 'seguridad',
      title: 'Seguridad, menores y cambios',
      paragraphs: Object.freeze([
        'Aplicamos medidas razonables para reducir accesos, pérdidas o usos no autorizados. Ningún sistema es completamente infalible, por lo que conviene no enviar datos especialmente sensibles que no sean necesarios para el encargo.',
        'Los servicios no se dirigen específicamente a menores. Si una persona menor necesita contactar, debe hacerlo con la intervención de su representante legal.',
        'Podemos actualizar esta política si cambia la web, el tratamiento o la normativa. La fecha visible al inicio permite identificar la versión vigente.',
      ]),
    }),
  ]),
  closing: Object.freeze({
    title: '¿Quieres preguntarnos algo sobre tus datos?',
    copy: 'Escríbenos y atenderemos tu consulta de privacidad de forma clara y directa.',
    action: Object.freeze({
      label: 'Escribir por email',
      href: publicContactConfig.email.href,
    }),
  }),
});

const termsContent: LegalPageContent = Object.freeze({
  kind: 'terms',
  metadata: Object.freeze({
    title: 'Condiciones del servicio | LUNA',
    description:
      'Condiciones aplicables al uso de la web y a los encargos artesanales personalizados de Luna Tartas.',
  }),
  hero: Object.freeze({
    eyebrow: 'Pedidos con las cosas claras',
    title: 'Condiciones del servicio',
    intro:
      'Estas condiciones explican cómo funciona la web y qué debes saber antes de confirmar un encargo personalizado.',
    updated: 'Última actualización: 27 de agosto de 2026',
  }),
  overview: Object.freeze({
    title: 'Antes de empezar',
    copy: 'La web es un catálogo informativo. Los pedidos se concretan de forma personal, con la información de producto, personalización, precio y entrega confirmada antes de comenzar.',
    items: Object.freeze([
      'Contar una idea o pedir información no confirma un pedido.',
      'Las condiciones concretas se comunican antes de aceptar el encargo.',
      'Tus derechos legales sobre conformidad y garantías se mantienen siempre.',
    ]),
  }),
  sections: Object.freeze([
    Object.freeze({
      id: 'alcance',
      title: 'Quiénes somos y alcance',
      paragraphs: Object.freeze([
        'Luna Tartas es el nombre comercial bajo el que se muestran y preparan los productos artesanales de este sitio. Estas condiciones regulan la navegación por lunatartas.es y los encargos iniciados desde sus canales de contacto.',
        'La web no incorpora una compra automática, cuentas de usuario ni una pasarela de pago. Las fotografías, descripciones y precios ayudan a explorar opciones, pero cada pedido se concreta mediante comunicación directa.',
      ]),
      links: Object.freeze([
        Object.freeze({
          label: 'Contacto',
          href: routes.contact(),
        }),
      ]),
    }),
    Object.freeze({
      id: 'catalogo',
      title: 'Productos y personalización',
      paragraphs: Object.freeze([
        'Los productos se elaboran de forma artesanal y muchos se adaptan con nombres, textos, colores u otros detalles acordados. Las imágenes son ejemplos reales o representativos; pueden existir pequeñas variaciones propias del trabajo manual, los materiales disponibles o la pantalla desde la que se consultan.',
        'Antes de confirmar, revisa con atención nombres, fechas, textos, medidas, colores y cualquier otro dato personalizado. Luna Tartas preparará el encargo conforme a la información que hayas validado.',
      ]),
    }),
    Object.freeze({
      id: 'pedido',
      title: 'Consulta, presupuesto y confirmación',
      paragraphs: Object.freeze([
        'El envío de una consulta, una idea o un mensaje no supone por sí solo la aceptación de un pedido. Antes de comenzar se comunicarán las características principales, la personalización, el precio total, la forma de pago y la opción de entrega disponible.',
        'El pedido queda confirmado cuando ambas partes aceptan esas condiciones y Luna Tartas comunica los pasos para iniciar la preparación. Si algún material, fecha o detalle no resulta viable, se propondrá una alternativa antes de la confirmación.',
      ]),
    }),
    Object.freeze({
      id: 'precios',
      title: 'Precios y pago',
      paragraphs: Object.freeze([
        'Algunos productos muestran un precio cerrado y otros un importe «desde». Cuando una personalización, tamaño o composición modifique el importe, recibirás el precio total antes de confirmar.',
        'La forma y el momento del pago se acordarán durante la confirmación del encargo. No introduzcas datos bancarios ni información de tarjetas en mensajes no solicitados; esta web no recoge ni procesa pagos directamente.',
      ]),
    }),
    Object.freeze({
      id: 'preparacion',
      title: 'Preparación, entrega y envíos',
      paragraphs: Object.freeze([
        'El plazo depende del tipo de producto, la personalización, la disponibilidad de materiales y la carga de trabajo. La fecha comunicada es una estimación hasta que el pedido y su modalidad de entrega quedan confirmados.',
        'Puede acordarse entrega en Linares o envío mediante transporte cuando esté disponible. Los gastos de envío no están incluidos en el precio del producto y se comunicarán antes de confirmar. Es responsabilidad de quien compra facilitar datos de entrega completos y correctos.',
      ]),
      links: Object.freeze([
        Object.freeze({
          label: 'Ver envíos y entregas',
          href: routes.shipping(),
        }),
      ]),
    }),
    Object.freeze({
      id: 'cambios',
      title: 'Cambios, desistimiento y conformidad',
      paragraphs: Object.freeze([
        'Si necesitas modificar o cancelar un encargo, comunícalo cuanto antes. La viabilidad y, en su caso, el coste dependerán de si la preparación ha comenzado, de los materiales adquiridos y del trabajo ya realizado.',
        'El derecho de desistimiento puede no resultar aplicable a productos confeccionados conforme a tus especificaciones o claramente personalizados, de acuerdo con la normativa de consumo. Esta excepción no limita los derechos legales cuando el producto sea defectuoso, no corresponda con lo acordado o exista cualquier otra falta de conformidad.',
        'Si detectas una incidencia, contacta lo antes posible y conserva el producto y su embalaje cuando sea relevante para poder revisarla y ofrecer una solución adecuada.',
      ]),
      note: 'Nada en estas condiciones reduce los derechos imperativos que la normativa reconoce a las personas consumidoras.',
    }),
    Object.freeze({
      id: 'uso',
      title: 'Uso de la web y propiedad intelectual',
      paragraphs: Object.freeze([
        'Puedes navegar y compartir enlaces a las páginas públicas. No está permitido utilizar la web para actividades ilícitas, interferir con su funcionamiento, intentar acceder a zonas no públicas o reutilizar de forma sustancial el catálogo sin autorización.',
        'La marca, textos, ilustraciones, fotografías, composición y demás contenidos están protegidos por la normativa aplicable y pertenecen a sus titulares. Consultarlos no concede una licencia para copiarlos, transformarlos o explotarlos comercialmente.',
      ]),
    }),
    Object.freeze({
      id: 'disponibilidad',
      title: 'Disponibilidad, enlaces y responsabilidad',
      paragraphs: Object.freeze([
        'Procuramos mantener la información actualizada y la web disponible, pero pueden existir interrupciones, errores o cambios. Corregiremos los errores detectados sin afectar a las condiciones concretas que ya hayan sido aceptadas para un pedido.',
        'Los enlaces a WhatsApp, Instagram, correo u otros servicios externos se rigen también por las condiciones y políticas de sus respectivos proveedores. Luna Tartas no controla su disponibilidad ni el tratamiento que realizan fuera de esta web.',
      ]),
    }),
    Object.freeze({
      id: 'ley',
      title: 'Normativa, consultas y reclamaciones',
      paragraphs: Object.freeze([
        'Estas condiciones se interpretan conforme a la normativa española, sin privarte de la protección imperativa que corresponda por tu lugar de residencia. Intentaremos resolver cualquier desacuerdo de forma directa y de buena fe.',
        'Para una consulta, incidencia o reclamación puedes utilizar los canales de contacto publicados en la web. Conserva la información intercambiada sobre el pedido para que podamos localizarlo y atenderte.',
      ]),
      links: Object.freeze([
        Object.freeze({
          label: 'Contactar con Luna Tartas',
          href: routes.contact(),
        }),
        Object.freeze({
          label: 'Normativa estatal de consumo',
          href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2007-20555',
        }),
      ]),
    }),
  ]),
  closing: Object.freeze({
    title: '¿Quieres confirmar un detalle antes de pedir?',
    copy: 'Cuéntanos qué tienes en mente y revisaremos contigo producto, personalización, precio y entrega.',
    action: Object.freeze({
      label: 'Ir a contacto',
      href: routes.contact(),
    }),
  }),
});

export const legalPages = Object.freeze({
  privacy: privacyContent,
  terms: termsContent,
});

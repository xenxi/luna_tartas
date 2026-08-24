import type { TaxonomyKind } from '../lib/catalog/domain/model';

export const catalogPageContent = Object.freeze({
  products: Object.freeze({
    eyebrow: 'CREACIONES HECHAS PARA EMOCIONAR',
    title: 'Regalos personalizados',
    claim: 'Detalles que cuentan historias',
    intro:
      'Ideas hechas con mimo para celebrar a las personas especiales y convertir cada regalo en un recuerdo único.',
    imageAlt:
      'Regalo personalizado entre flores rosas y pequeños detalles artesanales.',
  }),
  taxonomy: Object.freeze({
    category: Object.freeze({
      eyebrow: 'EXPLORA ESTA CATEGORÍA',
      claim: 'Hecho a mano, pensado para ti',
    }),
    occasion: Object.freeze({
      eyebrow: 'PARA CADA MOMENTO ESPECIAL',
      claim: 'Celebra lo que de verdad importa',
    }),
    recipient: Object.freeze({
      eyebrow: 'PARA ALGUIEN MUY ESPECIAL',
      claim: 'Un detalle con nombre propio',
    }),
  } satisfies Readonly<
    Record<TaxonomyKind, { readonly eyebrow: string; readonly claim: string }>
  >),
});

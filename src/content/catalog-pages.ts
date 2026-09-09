import type { TaxonomyKind } from '../lib/catalog/domain/model';

export const catalogPageContent = Object.freeze({
  products: Object.freeze({
    eyebrow: 'DETALLES QUE CUENTAN HISTORIAS',
    title: 'Regalos personalizados',
    claim: 'Diseños que emocionan',
    intro:
      'Productos únicos, creados a mano y personalizados para hacer de cada ocasión un momento especial. Cuéntanos tu idea y lo hacemos realidad.',
    imageAlt:
      'Colección de regalos personalizados, tartas de pañales y papelería decorada en tonos rosas.',
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

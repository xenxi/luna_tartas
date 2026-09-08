/** Editorial copy for the three catalog entry points on the home page. */
export const discoveryContent = {
  title: 'Encuentra el regalo perfecto',
  intro: 'Explora por tipo, ocasión o destinatario y déjate inspirar.',
  cards: [
    {
      kind: 'category',
      number: '01',
      title: 'Por tipo',
      actionLabel: 'Ver tipos',
      description:
        'Tartas de pañales, láminas personalizadas, papelería, packs y mucho más.',
    },
    {
      kind: 'occasion',
      number: '02',
      title: 'Por ocasión',
      actionLabel: 'Ver ocasiones',
      description:
        'Cumpleaños, bautizo, comunión, nacimiento y fechas especiales.',
    },
    {
      kind: 'recipient',
      number: '03',
      title: 'Para quién',
      actionLabel: 'Ver destinatarios',
      description:
        'Para bebés, niños y niñas, para alguien especial o simplemente porque sí.',
    },
  ],
} as const;

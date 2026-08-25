import type { FaqSection } from '../../../content/faq';

export interface FaqPageJsonLd {
  readonly '@context': 'https://schema.org';
  readonly '@type': 'FAQPage';
  readonly mainEntity: readonly {
    readonly '@type': 'Question';
    readonly name: string;
    readonly acceptedAnswer: {
      readonly '@type': 'Answer';
      readonly text: string;
    };
  }[];
}

/** Builds FAQPage from the same section projection rendered in the page. */
export function createFaqPageJsonLd(
  sections: readonly FaqSection[],
): FaqPageJsonLd {
  const items = sections.flatMap((section) => section.items);

  if (items.length === 0) {
    throw new Error('FAQPage JSON-LD requires at least one visible question');
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

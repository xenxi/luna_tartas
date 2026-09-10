import { z } from 'astro/zod';
import { identifierSchema, seoSchema } from './shared';

const heroPositionSchema = z
  .string()
  .trim()
  .max(32, 'Hero position must contain at most 32 characters')
  .refine((value) => {
    const keywordParts = value.split(' ');
    const allowedKeywords = new Set([
      'left',
      'center',
      'right',
      'top',
      'bottom',
    ]);
    if (
      keywordParts.length <= 2 &&
      keywordParts.every((part) => allowedKeywords.has(part))
    ) {
      const horizontalCount = keywordParts.filter((part) =>
        ['left', 'right'].includes(part),
      ).length;
      const verticalCount = keywordParts.filter((part) =>
        ['top', 'bottom'].includes(part),
      ).length;
      return horizontalCount <= 1 && verticalCount <= 1;
    }

    const percentages = value.match(/^(\d+(?:\.\d+)?)% (\d+(?:\.\d+)?)%$/);
    return (
      percentages !== null &&
      Number(percentages[1]) <= 100 &&
      Number(percentages[2]) <= 100
    );
  }, 'Hero position must use CSS position keywords or two percentages from 0% to 100%');

export const taxonomySchema = z
  .object({
    id: identifierSchema,
    slug: identifierSchema,
    name: z
      .string()
      .trim()
      .min(1, 'Name must not be empty')
      .max(100, 'Name must contain at most 100 characters'),
    summary: z
      .string()
      .trim()
      .min(1, 'Summary must not be empty')
      .max(200, 'Summary must contain at most 200 characters'),
    description: z
      .string()
      .trim()
      .min(1, 'Description must not be empty')
      .max(2_000, 'Description must contain at most 2000 characters')
      .optional(),
    status: z.enum(['draft', 'published']),
    order: z
      .number()
      .int('Order must be an integer')
      .min(0, 'Order must be zero or greater'),
    seo: seoSchema.optional(),
    heroPosition: heroPositionSchema.optional(),
    context: z.literal('FIXTURE').optional(),
  })
  .strict()
  .superRefine((taxonomy, context) => {
    if (taxonomy.context === 'FIXTURE' && taxonomy.status !== 'draft') {
      context.addIssue({
        code: 'custom',
        path: ['status'],
        message: 'FIXTURE entries must remain draft and are not publishable',
      });
    }
  });

export type TaxonomyInput = z.input<typeof taxonomySchema>;
export type TaxonomyData = z.output<typeof taxonomySchema>;

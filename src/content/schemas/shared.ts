import { z } from 'astro/zod';

export const identifierSchema = z
  .string()
  .min(1, 'Must not be empty')
  .max(80, 'Must contain at most 80 characters')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Must use lowercase ASCII letters, numbers, and single hyphens',
  );

export const seoSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'SEO title must not be empty')
      .max(60, 'SEO title must contain at most 60 characters')
      .optional(),
    description: z
      .string()
      .trim()
      .min(1, 'SEO description must not be empty')
      .max(160, 'SEO description must contain at most 160 characters')
      .optional(),
  })
  .strict()
  .refine((seo) => seo.title !== undefined || seo.description !== undefined, {
    message: 'SEO metadata must define a title or description',
  });

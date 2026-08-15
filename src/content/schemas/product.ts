import { z } from 'astro/zod';
import { identifierSchema, seoSchema } from './shared';

export const ASSET_LIMITS = Object.freeze({
  rasterBytes: 8 * 1024 * 1024,
  rasterPixels: 24_000_000,
  svgBytes: 250 * 1024,
  galleryItems: 20,
});

const requiredText = (field: string, maximum: number) =>
  z
    .string()
    .trim()
    .min(1, `${field} must not be empty`)
    .max(maximum, `${field} must contain at most ${maximum} characters`);

const approvedText = (field: string, maximum: number) =>
  requiredText(field, maximum).refine((value) => !/\bTBD\b/i.test(value), {
    message: `${field} must not contain a TBD placeholder`,
  });

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must use an ISO date in YYYY-MM-DD form')
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00Z`);
    return (
      !Number.isNaN(parsed.valueOf()) && parsed.toISOString().startsWith(value)
    );
  }, 'Must be a real calendar date');

const currencySchema = z
  .string()
  .regex(
    /^[A-Z]{3}$/,
    'Currency must be a three-letter uppercase ISO 4217 code',
  );

const amountMinorSchema = z
  .number()
  .int('Amount must be an integer in minor currency units')
  .positive('Amount must be greater than zero')
  .max(Number.MAX_SAFE_INTEGER, 'Amount exceeds the safe integer range');

const pricedSchema = (kind: 'fixed' | 'from') =>
  z
    .object({
      kind: z.literal(kind),
      amountMinor: amountMinorSchema,
      currency: currencySchema,
    })
    .strict();

export const priceSchema = z.discriminatedUnion('kind', [
  pricedSchema('fixed'),
  pricedSchema('from'),
  z.object({ kind: z.literal('on_request') }).strict(),
]);

const rightsSchema = z
  .object({
    owner: approvedText('Rights owner', 120),
    licenseOrPermission: approvedText('License or permission', 200),
    evidence: approvedText('Rights evidence', 300),
  })
  .strict();

const mediaSourceSchema = z
  .string()
  .regex(
    /^[a-z0-9][a-z0-9_-]*(?:\/[a-z0-9][a-z0-9_-]*)*\.(?:avif|webp|jpe?g|png|svg)$/,
    'Media source must be a lowercase relative path inside src/assets/catalog with an allowed extension',
  );

const draftMediaItemSchema = z
  .object({
    src: mediaSourceSchema,
    alt: requiredText('Alt text', 180),
    caption: requiredText('Caption', 200).optional(),
    rights: rightsSchema.optional(),
  })
  .strict();

const publishedMediaItemSchema = draftMediaItemSchema.extend({
  rights: rightsSchema,
});

const mediaSchema = (item: typeof draftMediaItemSchema) =>
  z
    .object({
      cover: item,
      gallery: z.array(item).max(ASSET_LIMITS.galleryItems).optional(),
    })
    .strict();

const publishedMediaSchema = z
  .object({
    cover: publishedMediaItemSchema,
    gallery: z
      .array(publishedMediaItemSchema)
      .max(ASSET_LIMITS.galleryItems)
      .optional(),
  })
  .strict();

const customizationSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('none') }).strict(),
  z
    .object({
      kind: z.literal('available'),
      options: z
        .array(requiredText('Customization option', 80))
        .min(1, 'Available customization must define at least one option')
        .max(20, 'Customization must define at most 20 options'),
      description: requiredText('Customization description', 300),
    })
    .strict(),
]);

const approvalSchema = z
  .object({
    source: approvedText('Approval source', 200),
    sourceDate: isoDateSchema,
    approvedBy: approvedText('Approved by', 120),
    approvedAt: isoDateSchema,
  })
  .strict();

const relationshipFields = {
  categories: z
    .array(identifierSchema)
    .min(1, 'A product must reference at least one category'),
  occasions: z.array(identifierSchema).optional(),
  recipients: z.array(identifierSchema).optional(),
};

const optionalEditorialFields = {
  name: requiredText('Name', 120).optional(),
  summary: requiredText('Summary', 240).optional(),
  description: requiredText('Description', 5_000).optional(),
  categories: relationshipFields.categories.optional(),
  occasions: relationshipFields.occasions,
  recipients: relationshipFields.recipients,
  price: priceSchema.optional(),
  media: mediaSchema(draftMediaItemSchema).optional(),
  customization: customizationSchema.optional(),
  featured: z.boolean().optional(),
  order: z
    .number()
    .int('Order must be an integer')
    .min(0, 'Order must be zero or greater')
    .optional(),
  seo: seoSchema.optional(),
  approval: approvalSchema.optional(),
};

const draftProductSchema = z
  .object({
    id: identifierSchema,
    slug: identifierSchema,
    status: z.literal('draft'),
    context: z.literal('FIXTURE').optional(),
    ...optionalEditorialFields,
  })
  .strict();

const publishedProductSchema = z
  .object({
    id: identifierSchema,
    slug: identifierSchema,
    status: z.literal('published'),
    name: requiredText('Name', 120),
    summary: requiredText('Summary', 240),
    description: requiredText('Description', 5_000),
    ...relationshipFields,
    price: priceSchema,
    media: publishedMediaSchema,
    customization: customizationSchema,
    featured: z.boolean().optional(),
    order: z
      .number()
      .int('Order must be an integer')
      .min(0, 'Order must be zero or greater')
      .optional(),
    seo: seoSchema.optional(),
    approval: approvalSchema,
  })
  .strict();

export const productSchema = z.discriminatedUnion('status', [
  draftProductSchema,
  publishedProductSchema,
]);

export type PriceData = z.output<typeof priceSchema>;
export type ProductInput = z.input<typeof productSchema>;
export type ProductData = z.output<typeof productSchema>;

import type {
  Catalog,
  Customization,
  DraftMedia,
  DraftMediaItem,
  EditorialApproval,
  MediaRights,
  Price,
  Product,
  PublishedMedia,
  PublishedMediaItem,
  SeoMetadata,
  Taxonomy,
  TaxonomyKind,
} from '../domain/model';
import type { ProductData } from '../../../content/schemas/product';
import type { TaxonomyData } from '../../../content/schemas/taxonomy';
import type {
  CatalogSourceDto,
  ProductSourceDocument,
  TaxonomySourceDocument,
} from './dto';
import { CatalogSourceError } from './errors';

function fail(
  document: TaxonomySourceDocument | ProductSourceDocument,
  field: string,
  message: string,
  cause?: unknown,
): never {
  throw new CatalogSourceError(
    {
      collection: document.collection,
      entryId: document.id,
      filePath: document.filePath,
      field,
    },
    message,
    cause === undefined ? undefined : { cause },
  );
}

function assertMatchingId(
  document: TaxonomySourceDocument | ProductSourceDocument,
): void {
  if (document.id !== document.data.id) {
    fail(
      document,
      'id',
      `loader ID ${JSON.stringify(document.id)} does not match editorial ID ${JSON.stringify(document.data.id)}`,
    );
  }
}

function copySeo(seo: TaxonomyData['seo']): SeoMetadata | undefined {
  return seo === undefined
    ? undefined
    : { title: seo.title, description: seo.description };
}

function taxonomyKind(
  collection: TaxonomySourceDocument['collection'],
): TaxonomyKind {
  switch (collection) {
    case 'categories':
      return 'category';
    case 'occasions':
      return 'occasion';
    case 'recipients':
      return 'recipient';
  }
}

export function mapTaxonomy(document: TaxonomySourceDocument): Taxonomy {
  try {
    assertMatchingId(document);
    const { data } = document;

    return {
      kind: taxonomyKind(document.collection),
      id: data.id,
      slug: data.slug,
      name: data.name,
      summary: data.summary,
      description: data.description,
      status: data.status,
      order: data.order,
      seo: copySeo(data.seo),
    };
  } catch (error) {
    if (error instanceof CatalogSourceError) {
      throw error;
    }
    fail(document, '$', 'could not map taxonomy entry', error);
  }
}

function copyPrice(
  document: ProductSourceDocument,
  price: NonNullable<ProductData['price']>,
): Price {
  switch (price.kind) {
    case 'fixed':
      return {
        kind: 'fixed',
        amountMinor: price.amountMinor,
        currency: price.currency,
      };
    case 'from':
      return {
        kind: 'from',
        amountMinor: price.amountMinor,
        currency: price.currency,
      };
    case 'on_request':
      return { kind: 'on_request' };
    default:
      return fail(document, 'price.kind', 'unsupported price kind');
  }
}

function copyRights(rights: MediaRights): MediaRights {
  return {
    owner: rights.owner,
    licenseOrPermission: rights.licenseOrPermission,
    evidence: rights.evidence,
  };
}

function copyDraftMediaItem(item: DraftMediaItem): DraftMediaItem {
  return {
    src: item.src,
    alt: item.alt,
    caption: item.caption,
    rights: item.rights === undefined ? undefined : copyRights(item.rights),
  };
}

function copyPublishedMediaItem(item: PublishedMediaItem): PublishedMediaItem {
  return {
    src: item.src,
    alt: item.alt,
    caption: item.caption,
    rights: copyRights(item.rights),
  };
}

function copyDraftMedia(media: DraftMedia): DraftMedia {
  return {
    cover: copyDraftMediaItem(media.cover),
    gallery: media.gallery?.map(copyDraftMediaItem),
  };
}

function copyPublishedMedia(media: PublishedMedia): PublishedMedia {
  return {
    cover: copyPublishedMediaItem(media.cover),
    gallery: media.gallery?.map(copyPublishedMediaItem),
  };
}

function copyCustomization(customization: Customization): Customization {
  return customization.kind === 'none'
    ? { kind: 'none' }
    : {
        kind: 'available',
        options: [...customization.options],
        description: customization.description,
      };
}

function copyApproval(approval: EditorialApproval): EditorialApproval {
  return {
    source: approval.source,
    sourceDate: approval.sourceDate,
    approvedBy: approval.approvedBy,
    approvedAt: approval.approvedAt,
  };
}

export function mapProduct(document: ProductSourceDocument): Product {
  try {
    assertMatchingId(document);
    const { data } = document;

    if (data.status === 'published') {
      return {
        id: data.id,
        slug: data.slug,
        status: 'published',
        name: data.name,
        summary: data.summary,
        description: data.description,
        categories: [...data.categories],
        occasions:
          data.occasions === undefined ? undefined : [...data.occasions],
        recipients:
          data.recipients === undefined ? undefined : [...data.recipients],
        price: copyPrice(document, data.price),
        media: copyPublishedMedia(data.media),
        customization: copyCustomization(data.customization),
        featured: data.featured,
        order: data.order,
        seo: copySeo(data.seo),
        approval: copyApproval(data.approval),
      };
    }

    return {
      id: data.id,
      slug: data.slug,
      status: 'draft',
      name: data.name,
      summary: data.summary,
      description: data.description,
      categories:
        data.categories === undefined ? undefined : [...data.categories],
      occasions: data.occasions === undefined ? undefined : [...data.occasions],
      recipients:
        data.recipients === undefined ? undefined : [...data.recipients],
      price:
        data.price === undefined ? undefined : copyPrice(document, data.price),
      media: data.media === undefined ? undefined : copyDraftMedia(data.media),
      customization:
        data.customization === undefined
          ? undefined
          : copyCustomization(data.customization),
      featured: data.featured,
      order: data.order,
      seo: copySeo(data.seo),
      approval:
        data.approval === undefined ? undefined : copyApproval(data.approval),
    };
  } catch (error) {
    if (error instanceof CatalogSourceError) {
      throw error;
    }
    fail(document, '$', 'could not map product entry', error);
  }
}

export function mapCatalogSource(source: CatalogSourceDto): Catalog {
  return {
    categories: source.categories.map(mapTaxonomy),
    occasions: source.occasions.map(mapTaxonomy),
    recipients: source.recipients.map(mapTaxonomy),
    products: source.products.map(mapProduct),
  };
}

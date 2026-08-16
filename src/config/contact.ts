import { buildCustomWhatsAppUrl } from '../lib/whatsapp/custom';

export interface WhatsAppConfig {
  readonly number: string;
  readonly message: string;
  readonly href: string;
}

export interface PublicContactConfig {
  readonly whatsapp: Readonly<{ label: string; href: string }>;
  readonly email: Readonly<{ label: string; href: string }>;
  readonly instagram: Readonly<{ label: string; href: string }>;
}

const configuredWhatsApp: unknown = {
  number: '34697637180',
  message:
    '¡Hola! 🌙 He visto vuestra web y tengo una idea para un regalo. ¿Me ayudáis a darle forma?',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateWhatsAppConfig(value: unknown): WhatsAppConfig {
  if (!isRecord(value)) {
    throw new Error('WhatsApp configuration is required');
  }

  if (typeof value.number !== 'string' || !/^\d{8,15}$/.test(value.number)) {
    throw new Error(
      'WhatsApp number must contain 8–15 international digits without separators',
    );
  }

  if (typeof value.message !== 'string' || value.message.trim() === '') {
    throw new Error('WhatsApp message must be a non-empty string');
  }

  const message = value.message.trim();
  return Object.freeze({
    number: value.number,
    message,
    href: buildCustomWhatsAppUrl({ number: value.number, message }),
  });
}

export const whatsappConfig = validateWhatsAppConfig(configuredWhatsApp);

const configuredPublicContacts: unknown = {
  whatsappLabel: '+34 697 63 71 80',
  email: 'encargosmgr@gmail.com',
  instagramHandle: '@lunatartas',
};

export function validatePublicContactConfig(
  value: unknown,
  whatsapp: WhatsAppConfig,
): PublicContactConfig {
  if (!isRecord(value)) {
    throw new Error('Public contact configuration is required');
  }

  if (
    typeof value.whatsappLabel !== 'string' ||
    value.whatsappLabel.replace(/\D/g, '') !== whatsapp.number
  ) {
    throw new Error('Public WhatsApp label must match the approved number');
  }

  if (
    typeof value.email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)
  ) {
    throw new Error('Public email must be a valid address');
  }

  if (
    typeof value.instagramHandle !== 'string' ||
    !/^@[a-z0-9._]{1,30}$/.test(value.instagramHandle)
  ) {
    throw new Error('Public Instagram handle must use its approved @handle');
  }

  const email = value.email;
  const instagramHandle = value.instagramHandle;

  return Object.freeze({
    whatsapp: Object.freeze({
      label: value.whatsappLabel,
      href: whatsapp.href,
    }),
    email: Object.freeze({
      label: email,
      href: `mailto:${email}`,
    }),
    instagram: Object.freeze({
      label: instagramHandle,
      href: `https://www.instagram.com/${instagramHandle.slice(1)}/`,
    }),
  });
}

export const publicContactConfig = validatePublicContactConfig(
  configuredPublicContacts,
  whatsappConfig,
);

export interface WhatsAppConfig {
  readonly number: string;
  readonly message: string;
  readonly href: string;
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
  const url = new URL(`https://wa.me/${value.number}`);
  url.searchParams.set('text', message);

  return Object.freeze({
    number: value.number,
    message,
    href: url.href,
  });
}

export const whatsappConfig = validateWhatsAppConfig(configuredWhatsApp);

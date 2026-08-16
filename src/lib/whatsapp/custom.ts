export interface CustomWhatsAppInput {
  readonly number: string;
  readonly message: string;
}

export function buildCustomWhatsAppUrl({
  number,
  message,
}: CustomWhatsAppInput): string {
  if (!/^\d{8,15}$/.test(number)) {
    throw new Error(
      'WhatsApp number must contain 8–15 international digits without separators',
    );
  }

  const trimmedMessage = message.trim();

  if (trimmedMessage === '') {
    throw new Error('WhatsApp message must be a non-empty string');
  }

  const url = new URL(`https://wa.me/${number}`);
  url.searchParams.set('text', trimmedMessage);
  return url.href;
}

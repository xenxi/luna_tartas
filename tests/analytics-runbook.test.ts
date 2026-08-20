import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { siteConfig } from '../src/config/site';
import { sanitizeAnalyticsEvent } from '../src/lib/analytics/events';

const runbook = readFileSync('docs/conversion/analytics-runbook.md', 'utf8');

describe('analytics QA runbook', () => {
  it('keeps the three approved events and representative routes documented', () => {
    for (const event of ['page_view', 'view_item', 'contact_whatsapp']) {
      expect(runbook).toContain(`\`${event}\``);
    }

    for (const route of [
      '`/`',
      '`/productos/`',
      '`/productos/{slug}/`',
      '`/categorias/{slug}/`',
      '`/ocasiones/{slug}/`',
      '`/regalos/{slug}/`',
      '`/404/`',
    ]) {
      expect(runbook).toContain(route);
    }
  });

  it('documents every consent and degradation mode', () => {
    for (const caseName of [
      'Configuracion apagada',
      'Sin consentimiento',
      'Rechazo',
      'Aceptacion',
      'Retirada',
      'Fallo del tracker',
      'Almacenamiento bloqueado',
      'Trafico interno',
    ]) {
      expect(runbook).toContain(`| ${caseName} |`);
    }

    expect(siteConfig.analytics).toEqual({
      enabled: true,
      provider: 'ga4',
      measurementId: 'G-DV6KHV0YMW',
      consentRequired: true,
    });
  });

  it('keeps prohibited fields rejected and the redacted capture PII-free', () => {
    const event = {
      name: 'view_item',
      item_id: 'producto-publico',
      item_name: 'Producto público',
      item_category: 'categoria-publica',
    };

    expect(
      sanitizeAnalyticsEvent({ ...event, phone: 'redacted' }),
    ).toBeUndefined();
    expect(
      sanitizeAnalyticsEvent({
        ...event,
        item_name: 'redacted@example.com',
      }),
    ).toBeUndefined();
    expect(runbook).toContain('no phone | no email | no WhatsApp message');
    expect(runbook).not.toMatch(/\+34\d{9}|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/);
  });
});

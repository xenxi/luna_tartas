import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { siteConfig } from '../src/config/site';
import { sanitizeAnalyticsEvent } from '../src/lib/analytics/events';

const runbook = readFileSync('docs/conversion/analytics-runbook.md', 'utf8');

describe('analytics QA runbook', () => {
  it('keeps the four approved events and representative routes documented', () => {
    for (const event of [
      'view_item',
      'select_item',
      'whatsapp_click',
      'custom_whatsapp_click',
    ]) {
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
      'Configuración apagada',
      'Sin consentimiento',
      'Rechazo',
      'Aceptación',
      'Retirada',
      'Fallo del tracker',
      'Almacenamiento bloqueado',
      'Tráfico interno',
    ]) {
      expect(runbook).toContain(`| ${caseName} |`);
    }

    expect(siteConfig.analytics.enabled).toBe(false);
  });

  it('keeps prohibited fields rejected and the redacted capture PII-free', () => {
    const event = {
      name: 'view_item',
      product_id: 'producto-publico',
      product_name: 'Producto público',
      category: 'categoria-publica',
      source_page: '/productos/producto-publico/',
    };

    expect(
      sanitizeAnalyticsEvent({ ...event, phone: 'redacted' }),
    ).toBeUndefined();
    expect(
      sanitizeAnalyticsEvent({
        ...event,
        source_page: '/productos/producto-publico/?email=redacted@example.com',
      }),
    ).toBeUndefined();
    expect(runbook).toContain('no phone | no email | no WhatsApp message');
    expect(runbook).not.toMatch(/\+34\d{9}|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/);
  });
});

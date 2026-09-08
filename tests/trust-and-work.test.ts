import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { trustAndWorkContent } from '../src/content/home/trust-and-work';

const component = readFileSync(
  'src/components/home/TrustAndWork.astro',
  'utf8',
);
const styles = readFileSync('src/components/home/trust-and-work.css', 'utf8');
const page = readFileSync('src/pages/index.astro', 'utf8');
describe('approved trust process', () => {
  it('keeps the approved process copy and source approval centralized', () => {
    expect(trustAndWorkContent.trust.title).toBe('Así trabajamos en Luna');
    expect(trustAndWorkContent.trust.intro).toBe(
      'De una idea bonita a un regalo inolvidable.',
    );
    expect(trustAndWorkContent.trust.steps).toEqual([
      {
        title: 'Nos cuentas tu idea',
        copy: 'Hablamos de la ocasión, tus gustos y todos los detalles importantes.',
      },
      {
        title: 'La hacemos realidad',
        copy: 'Preparamos cada pieza a mano, con materiales de calidad.',
      },
      {
        title: 'La preparamos con mimo',
        copy: 'Cuidamos cada detalle del embalaje.',
      },
      {
        title: 'Lista para emocionar',
        copy: 'Tu regalo, listo para llegar a su destino.',
      },
    ]);
    expect(trustAndWorkContent.rights).toEqual({
      owner: 'Propietario del negocio',
      scope: 'Publicación en lunatartas.es',
      approvedAt: '2026-08-16',
    });
    expect(trustAndWorkContent.approval.approvedAt).toBe('2026-08-16');
  });

  it('uses the supplied process assets in a semantic, static sequence', () => {
    expect(component).toContain('<div class="trust-story">');
    expect(component).toContain('<div class="trust-process"');
    expect(component).toContain('<ol class="trust-list">');
    expect(component).toContain('const trustStepImages');
    expect(component).toContain("'../../assets/home/trust-steps/01-chat.png'");
    expect(component).toContain("'../../assets/home/trust-steps/02-manos.png'");
    expect(component).toContain(
      "'../../assets/home/trust-steps/03-corazon.png'",
    );
    expect(component).toContain('class="trust-card__art"');
    expect(component).toContain('class="trust-card__number"');
    expect(component).toContain("String(index + 1).padStart(2, '0')");
    expect(component).toContain('aria-hidden="true"');
    expect(component).not.toContain('work-showcase');
    expect(component).not.toContain('work-gallery');
    expect(component).not.toContain('client:');
    expect(styles).toContain('.trust-process__header');
    expect(styles).not.toContain('.work-gallery__item:hover');
    expect(styles).not.toContain('transition: transform');
    expect(page).toContain('<TrustAndWork />');
  });

  it('keeps the process before the final custom idea CTA', () => {
    expect(component).toContain('trustAndWorkContent.trust.steps.map');
    expect(component).not.toMatch(/carousel|slider|client:/i);
    expect(
      page.indexOf('<TaxonomyDiscovery catalog={catalog} />'),
    ).toBeLessThan(page.indexOf('<TrustAndWork />'));
    expect(page.indexOf('<TrustAndWork />')).toBeLessThan(
      page.indexOf('<FeaturedProducts catalog={catalog} />'),
    );
    expect(page.indexOf('<FeaturedProducts catalog={catalog} />')).toBeLessThan(
      page.indexOf('<CustomIdeaCta />'),
    );
    expect(page).not.toContain('work-showcase');
  });
});

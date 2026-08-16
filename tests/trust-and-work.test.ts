import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { trustAndWorkContent } from '../src/content/home/trust-and-work';

const component = readFileSync(
  'src/components/home/TrustAndWork.astro',
  'utf8',
);
const styles = readFileSync('src/components/home/trust-and-work.css', 'utf8');
const page = readFileSync('src/pages/index.astro', 'utf8');
const imagePaths = [
  'src/assets/home/work-showcase/tarta-rosa-completa.png',
  'src/assets/home/work-showcase/tarta-stitch-completa.png',
  'src/assets/home/work-showcase/tarta-azul-completa.png',
  'src/assets/home/work-showcase/tarta-rosa-detalle.png',
];

describe('approved trust and work showcase', () => {
  it('keeps the approved process copy and source approval centralized', () => {
    expect(trustAndWorkContent.trust.steps).toEqual([
      {
        title: 'Hecho a mano para ti',
        copy: 'Cada encargo se prepara artesanalmente y de forma individual.',
      },
      {
        title: 'Tú nos cuentas la idea',
        copy: 'Temática, colores, nombre y detalles se acuerdan directamente contigo antes de preparar el regalo.',
      },
      {
        title: 'Te lo hacemos llegar',
        copy: 'Entrega en mano cuando la distancia lo permite y, para el resto, envío mediante mensajería.',
      },
    ]);
    expect(trustAndWorkContent.rights).toEqual({
      owner: 'Propietario del negocio',
      scope: 'Publicación en lunatartas.es',
      approvedAt: '2026-08-16',
    });
    expect(trustAndWorkContent.approval.approvedAt).toBe('2026-08-16');
  });

  it('publishes the four approved alternative texts in editorial order', () => {
    expect(
      trustAndWorkContent.showcase.images.map((image) => image.alt),
    ).toEqual([
      'Tarta de pañales de dos pisos decorada en tonos rosa con temática de dulces.',
      'Tarta de pañales de dos pisos decorada con personajes y motivos tropicales en rosa y azul.',
      'Tarta de pañales de dos pisos decorada en tonos azules con motivos infantiles.',
      'Detalle de una tarta de pañales decorada en tonos rosa con lazo, bloques y motivos infantiles.',
    ]);
    expect(trustAndWorkContent.showcase.images[0]?.primary).toBe(true);
    expect(
      trustAndWorkContent.showcase.images
        .slice(1)
        .every((image) => !image.primary),
    ).toBe(true);
  });

  it('preserves dimensioned original PNG files and delegates optimized variants to Astro', () => {
    for (const imagePath of imagePaths) {
      const image = readFileSync(imagePath);
      expect(image.subarray(16, 24).readUInt32BE(0)).toBe(1536);
      expect(image.subarray(16, 24).readUInt32BE(4)).toBe(2048);
    }

    expect(component).toContain("formats={['avif', 'webp']}");
    expect(component).toContain('fallbackFormat="jpg"');
    expect(component).toContain('quality={50}');
    expect(component).toContain('[320, 480, 768, 1024, 1536]');
    expect(component).toContain('[320, 480, 640]');
    expect(component).toContain('loading="lazy"');
  });

  it('uses semantic static lists and a responsive primary image without hydration', () => {
    expect(component).toContain('<div class="trust-story">');
    expect(component).toMatch(/<Ornament\s+variant="thread"\s+motion="draw"/);
    expect(component).toContain('<ol class="trust-list">');
    expect(component).toContain('<div class="work-showcase__canvas">');
    expect(component).toContain('<Ornament variant="dots"');
    expect(component).toContain('<ul class="work-gallery"');
    expect(component).toContain('<figure class="work-gallery__figure">');
    expect(component).not.toContain('client:');
    expect(styles).toContain('@media (min-width: 40rem)');
    expect(styles).toContain('@media (min-width: 64rem)');
    expect(styles).toContain('counter-increment: trust-step');
    expect(styles).toContain('.trust-list::before');
    expect(styles).toContain('grid-column: 1 / span 7');
    expect(styles).toContain('inline-size: 82%');
    expect(styles).not.toContain('overflow-x: auto');
    expect(styles).not.toContain('.work-gallery__item:hover');
    expect(styles).not.toContain('transition: transform');
    expect(page).toContain('<TrustAndWork />');
  });

  it('keeps process and work order in the approved DOM sequence', () => {
    expect(component).toContain('trustAndWorkContent.trust.steps.map');
    expect(component).toContain('trustAndWorkContent.showcase.images.map');
    expect(component.indexOf('trust-story')).toBeLessThan(
      component.indexOf('work-showcase__canvas'),
    );
    expect(component).not.toMatch(/carousel|slider|client:/i);
  });
});

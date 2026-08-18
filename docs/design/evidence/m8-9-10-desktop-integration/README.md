# M8.9.10 — Integración visual desktop

Evidencia generada el 2026-08-18 con Chrome headless estable sobre
`astro preview` en `http://127.0.0.1:4321/`, escala de dispositivo 1 y sin
scrollbars en la captura.

## Capturas

| Viewport | Archivo         | Documento medido                          | SHA-256                                                            |
| -------- | --------------- | ----------------------------------------- | ------------------------------------------------------------------ |
| 1280 px  | `home-1280.png` | 1265 px de `clientWidth`, 2508 px de alto | `A44112D657593FDE620B964B0DEFB1BDF7376343D9221EBA47EA42226A1871E8` |
| 1440 px  | `home-1440.png` | 1425 px de `clientWidth`, 2680 px de alto | `EE36871450B359FF89E67765BDA577E017836B79C39060E9D3FB4FB8510DD181` |
| 1920 px  | `home-1920.png` | 1905 px de `clientWidth`, 2765 px de alto | `0136067FB1083B2FB0F6BE3FF7A8E50E406377883E2F41996D1DD4995EF576B6` |

Los 15 px de diferencia entre viewport y `clientWidth` corresponden a la barra
vertical de Chrome. En los tres viewports `scrollWidth === clientWidth`, por lo
que no existe overflow horizontal. Los CTA principales miden 48 px de alto; los
enlaces editoriales secundarios medidos quedan en 44–46 px.

## Resultado objetivo

- Artefacto completo: 25 páginas.
- Home continua dentro de una única envolvente `.home-composition`.
- Altura de la composición: 2214 px a 1280, 2383 px a 1440 y 2468 px a 1920.
- Navegación, contenido y CTA responden sin JavaScript decorativo.
- Suite, budgets, accesibilidad, responsive, artefacto, seguridad y
  determinismo: `PASS`.

## Revisión humana

Comparación perceptual de ritmo, fondos, densidad, escala, repetición y
continuidad contra
`docs/design/reference/luna-home-art-direction-reference.png`: `PASS`
(2026-08-18). La revisión confirma una composición continua, sin percepción de
bloques independientes apilados, en los tres viewports contractuales.

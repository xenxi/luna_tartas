import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve('dist');
const failures = [];
const htmlFiles = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(entryPath);
    else if (entry.name.endsWith('.html')) htmlFiles.push(entryPath);
  }
}

function requireMatch(content, pattern, message) {
  if (!pattern.test(content)) failures.push(message);
}

function isAllowedAnalyticsModule(attributes) {
  const src = attributes.match(/\bsrc="([^"]+)"/i)?.[1];
  return (
    /\btype="module"/i.test(attributes) &&
    src !== undefined &&
    /^\/_astro\/Analytics(?:Consent|Instrumentation)\.astro_astro_type_script_[^/]+\.js$/i.test(
      src,
    )
  );
}

try {
  await walk(root);
} catch {
  failures.push(
    'dist no existe; ejecuta npm run build antes de la auditoria responsive',
  );
}

if (htmlFiles.length === 0) {
  failures.push('el artefacto no contiene HTML');
} else {
  for (const file of htmlFiles) {
    const relative = path.relative(root, file);
    const html = await readFile(file, 'utf8');
    requireMatch(
      html,
      /<meta\s+name="viewport"\s+content="width=device-width, initial-scale=1"\s*\/?\s*>/i,
      `${relative}: falta viewport responsive`,
    );
    requireMatch(html, /<main\b[^>]*>/i, `${relative}: falta main`);
    for (const script of html.matchAll(/<script\b([^>]*)>/gi)) {
      if (
        !/type="application\/ld\+json"/i.test(script[1]) &&
        !isAllowedAnalyticsModule(script[1])
      )
        failures.push(
          `${relative}: el artefacto carga JavaScript cliente no permitido`,
        );
    }
    if (/<a\b[^>]*href=""/i.test(html))
      failures.push(`${relative}: contiene href vacio`);

    for (const image of html.matchAll(/<img\b[^>]*>/gi)) {
      const tag = image[0];
      if (!/\bwidth="\d+"/i.test(tag) || !/\bheight="\d+"/i.test(tag)) {
        failures.push(`${relative}: imagen sin dimensiones intrinsecas`);
      }
      if (!/\balt="[^"]*"/i.test(tag))
        failures.push(`${relative}: imagen sin alt`);
    }
  }

  const cssFiles = [];
  const inlineCss = [];
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    for (const style of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
      inlineCss.push(style[1]);
    }
    for (const href of html.matchAll(/<link[^>]+href="([^"]+\.css)"/gi)) {
      const cssPath = href[1].startsWith('/')
        ? path.join(root, href[1].slice(1))
        : path.resolve(path.dirname(file), href[1]);
      if (!cssFiles.includes(cssPath)) cssFiles.push(cssPath);
    }
  }
  const css = inlineCss
    .concat(
      await Promise.all(
        cssFiles.map((file) => readFile(file, 'utf8').catch(() => '')),
      ),
    )
    .join('\n');
  requireMatch(
    css,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)/i,
    'CSS: falta reduced-motion',
  );
  requireMatch(
    css,
    /min-width\s*:\s*0/i,
    'CSS: falta min-width: 0 para tracks flex/grid',
  );
  requireMatch(
    css,
    /max-width\s*:\s*100%/i,
    'CSS: falta limite de medios al contenedor',
  );
  requireMatch(
    css,
    /min-block-size:\s*2\.75rem/i,
    'CSS: falta target tactil minimo de 44px',
  );
}

if (failures.length > 0) {
  console.error(`Responsive audit FAIL (${failures.length})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Responsive audit PASS (${htmlFiles.length} HTML, no-JS, viewport, media, targets y reduced-motion)`,
  );
}

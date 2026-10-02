import { defineConfig } from 'astro/config';
import { siteConfig } from './src/config/site';

export default defineConfig({
  site: siteConfig.siteUrl,
  output: 'static',
  // Preserve Astro 6 spacing between inline elements when building with Astro 7.
  compressHTML: true,
  build: {
    format: 'directory',
  },
  trailingSlash: 'always',
});

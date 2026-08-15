import { defineConfig } from 'astro/config';
import { siteConfig } from './src/config/site';

export default defineConfig({
  site: siteConfig.siteUrl,
  output: 'static',
  build: {
    format: 'directory',
  },
  trailingSlash: 'always',
});

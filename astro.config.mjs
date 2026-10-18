import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Keep the live workers.dev origin canonical until the ToolMingle subdomain is connected.
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://cup-to-gram.hosi4242.workers.dev',
  output: 'static',
  integrations: [sitemap()],
  build: { format: 'directory' },
});

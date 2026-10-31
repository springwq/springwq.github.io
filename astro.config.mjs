import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { redirects } from './redirects.mjs';

export default defineConfig({
  site: 'https://stevenwu.ai',
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404') && !/\/20\d{2}\/\d{2}\/\d{2}\//.test(page),
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    },
  },
  redirects: Object.fromEntries(redirects),
});

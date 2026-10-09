import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeFigure from './src/plugins/rehype-figure.mjs';
import rehypeScripts from './src/plugins/rehype-scripts.mjs';

// SITE_URL and BASE_PATH are set by the GitHub Pages workflow, so the same
// code works at https://remipaccou.github.io/website/ (preview) and at
// https://remipaccou.blog/ (custom domain).
const base = process.env.BASE_PATH || '/';
const prefix = base.replace(/\/$/, '');

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://remipaccou.blog',
  base,
  trailingSlash: 'always',
  integrations: [sitemap()],
  // Addresses that existed on the former WordPress site.
  redirects: {
    '/category/energy': `${prefix}/writing/`,
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex, rehypeFigure, rehypeScripts],
    }),
  },
});

// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { unified } from '@astrojs/markdown-remark';
import blogadmin from './src/integrations/blogadmin.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://xomnibot.in',
  output: 'static',
  prefetch: {
    prefetchAll: true,
  },
  markdown: {
    // Astro 7's default "Sätteri" processor doesn't support remark/rehype
    // plugins, so we opt back into the unified (remark/rehype) pipeline for
    // GFM + heading anchors. @astrojs/mdx inherits this via
    // `extendMarkdownConfig: true` (its default), so .md and .mdx get the
    // same plugins, GFM, and smart punctuation.
    processor: unified({
      gfm: true,
      smartypants: true,
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'append',
            properties: {
              class: 'heading-anchor',
              ariaHidden: 'true',
              tabIndex: -1,
            },
            // '#' glyph is drawn via CSS ::after so it doesn't leak into headings[].text (TOC/search)
            content: [],
          },
        ],
      ],
    }),
  },
  integrations: [
    expressiveCode({
      themes: ['github-light', 'github-dark'],
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) => (theme.name === 'github-dark' ? '.dark' : false),
      styleOverrides: {
        borderRadius: 'var(--radius-lg, 0.5rem)',
        codeFontFamily:
          '"Geist Mono Variable", ui-monospace, SFMono-Regular, Menlo, monospace',
        uiFontFamily:
          '"Geist Variable", ui-sans-serif, system-ui, sans-serif',
      },
      defaultProps: {
        wrap: true,
      },
    }),
    mdx(),
    react(),
    blogadmin(), // dev-only: injects nothing in `astro build`
    sitemap({
      filter: (page) => !page.includes('/admin'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

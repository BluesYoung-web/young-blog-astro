/*
 * @Author: zhangyang
 * @Date: 2022-09-04 09:46:18
 * @LastEditTime: 2023-01-30 15:25:31
 * @Description:
 */
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import unocss from 'unocss/astro';

import { remarkLayout, remarkReadTime } from './md-plugins';

// https://astro.build/config
export default defineConfig({
  site: 'https://young-blog-astro.netlify.app/',
  integrations: [
    mdx(),
    sitemap({
      customPages: [
        'https://young-blog-astro.netlify.app',
        'https://young-blog-astro.netlify.app/about',
        'https://young-blog-astro.netlify.app/blogs',
      ],
    }),
    vue({
      jsx: true,
    }),
    unocss(),
  ],
  markdown: {
    syntaxHighlight: 'prism',
    remarkPlugins: [remarkLayout, remarkReadTime],
  },
  vite: {
    ssr: {
      format: 'cjs',
    },
  },
});

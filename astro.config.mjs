/*
 * @Author: zhangyang
 * @Date: 2022-09-04 09:46:18
 * @LastEditTime: 2022-09-11 16:53:43
 * @Description: 
 */
import { defineConfig } from 'astro/config';
import adapter from '@astrojs/netlify/functions';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import unocss from 'unocss/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://young-blog-astro.vercel.app',
  output: 'server',
  adapter: adapter(),
  integrations: [
		mdx(),
		sitemap({
			customPages: ['https://young-blog-astro.vercel.app', 'https://young-blog-astro.vercel.app/about', 'https://young-blog-astro.vercel.app/blog']
		}),
		vue(),
		unocss()
	],
	markdown: {
		shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: 'github-dark',
      // Add custom languages
      // Note: Shiki has countless langs built-in, including .astro!
      // https://github.com/shikijs/shiki/blob/main/docs/languages.md
      langs: [],
      // Enable word wrap to prevent horizontal scrolling
      wrap: true,
    },
	}
});
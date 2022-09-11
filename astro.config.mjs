/*
 * @Author: zhangyang
 * @Date: 2022-09-04 09:46:18
 * @LastEditTime: 2022-09-11 17:13:42
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
		syntaxHighlight: 'prism',
	}
});
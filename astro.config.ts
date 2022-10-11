/*
 * @Author: zhangyang
 * @Date: 2022-09-04 09:46:18
 * @LastEditTime: 2022-10-11 09:14:52
 * @Description: 
 */
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import unocss from 'unocss/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://young-blog-astro.netlify.app',
  integrations: [
		mdx(),
		sitemap({
			customPages: [
				'https://young-blog-astro.netlify.app',
				'https://young-blog-astro.netlify.app/about',
				'https://young-blog-astro.netlify.app/blogs'
			]
		}),
		vue({
			jsx: true
		}),
		unocss()
	],
	markdown: {
		syntaxHighlight: 'prism',
	},
	vite: {
		ssr: {
			format: 'cjs'
		}
	}
});
/*
 * @Author: zhangyang
 * @Date: 2022-09-04 09:46:18
 * @LastEditTime: 2022-09-04 10:22:07
 * @Description: 
 */
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import vercelAdapter from '@astrojs/vercel/serverless';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://young-blog-astro.vercel.app',
	output: 'server',
	adapter: vercelAdapter(),
	integrations: [
		mdx(),
		sitemap({
			customPages: [
				'https://young-blog-astro.vercel.app',
				'https://young-blog-astro.vercel.app/about',
				'https://young-blog-astro.vercel.app/blog',
			]
		})
	],
});

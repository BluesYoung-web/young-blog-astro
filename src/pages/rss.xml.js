/*
 * @Author: zhangyang
 * @Date: 2022-09-04 09:46:18
 * @LastEditTime: 2022-10-05 11:23:09
 * @Description: 
 */
import rss from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION } from '../config';

export const get = () =>
	rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: import.meta.env.SITE,
		items: import.meta.glob('./blog/**/*.{md,mdx}'),
	});

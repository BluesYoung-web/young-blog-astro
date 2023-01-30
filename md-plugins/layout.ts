/*
 * @Author: zhangyang
 * @Date: 2022-10-17 14:45:38
 * @LastEditTime: 2022-10-17 14:57:06
 * @Description:
 */
import type { RemarkPlugin } from '@astrojs/markdown-remark';

export const remarkLayout: RemarkPlugin = () => {
  return function (tree, { data }) {
    // @ts-ignore
    data.astro.frontmatter.layout = '@/layouts/BlogPost.astro';
  };
};

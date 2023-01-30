/*
 * @Author: zhangyang
 * @Date: 2022-10-17 14:48:22
 * @LastEditTime: 2022-10-17 15:07:04
 * @Description:
 */
import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import type { RemarkPlugin } from '@astrojs/markdown-remark';

export const remarkReadTime: RemarkPlugin = () => {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    // readingTime.text will give us minutes read as a friendly string,
    // i.e. "3 min read"
    // @ts-ignore
    data.astro.frontmatter.minutesRead = readingTime.text;
  };
};

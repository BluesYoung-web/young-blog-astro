/*
 * @Author: zhangyang
 * @Date: 2022-09-04 11:41:37
 * @LastEditTime: 2022-10-07 19:10:45
 * @Description: 
 */
export type DocItem = {
  frontmatter: Record<string, string>;
  default: Function;
  url: string;
  file: string;
  rawContent: string;
  compiledContent: string;
  Content: string;
};
// todo translate it to the tree struct
export const generate = (args: DocItem[]) => {
  return {
    total: args.length,
    tree: args
  };
};
/*
 * @Author: zhangyang
 * @Date: 2022-09-04 11:41:37
 * @LastEditTime: 2022-09-04 11:47:48
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

export const generate = (args: DocItem[]) => {
  console.log("🚀 ~ file: generateDocTree.ts ~ line 19 ~ generate ~ args", args)
  return {
    total: args.length,
    tree: args
  };
};
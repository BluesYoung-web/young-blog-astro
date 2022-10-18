/*
 * @Author: zhangyang
 * @Date: 2022-09-04 11:41:37
 * @LastEditTime: 2022-10-18 10:03:20
 * @Description: 
 */
export type DocItem = {
  frontmatter: {
    title: string;
    description: string;
    date: string;
    image?: string;
  } & Record<string, string>;
  default: Function;
  url: string;
  file: string;
  rawContent: string;
  compiledContent: string;
  Content: string;
  label: string;
  value: string;
};

export type DocTree = {
  label: string;
  key: string;
  children?: DocTree[];
  path?: string;
};

export type ReturnDocTree = {
  total: number;
  tree: DocTree[];
  list: DocItem[];
};

const getTree = (list: DocItem[]) => {
  const docDir: Record<string, DocTree> = {};
  const docTreeMap: DocTree[] = [];

  const mkdir = (path: string[], parent?: DocTree): DocTree | undefined => {
    if (path.length <= 1) {
      return parent;
    }
    const p = path[0];

    if (docDir[p]) {
      const parent = docDir[p];
      path.shift();
      return mkdir(path, parent)
    } else {
      const dir: DocTree = {
        label: p,
        key: p,
      };

      docDir[p] = dir;

      if (parent) {
        if (parent.children) {
          parent.children.push(dir);
        } else {
          parent.children = [dir];
        }
      } else {
        docTreeMap.push(dir);
      }

      path.shift();
      return mkdir(path, dir);
    }
  };

  // 按目录嵌套层级排序
  list.sort((a, b) => a.url.split('/').length - b.url.split('/').length);

  const returnList: DocItem[] = [];

  for (const doc of list) {
    returnList.push({
      ...doc,
      label: doc.frontmatter.title,
      value: doc.url
    });

    const tp: DocTree = {
      key: doc.url,
      label: doc.frontmatter.title,
      path: doc.url
    };
    const pathArr = doc.url.split('/').slice(2);

    const parent = mkdir(pathArr);
    if (parent?.children) {
      parent.children.push(tp);
    } else if (parent) {
      parent!.children = [tp];
    }
  }
  return {
    tree: docTreeMap,
    list: returnList
  };
};

export const generate = (args: DocItem[]): ReturnDocTree => {
  if (Array.isArray(args) && args.length > 0) {
    // 按时间倒序
    const list = args
      
      .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
    return {
      total: list.length,
      ...getTree(list.slice()),
    };  
  } else {
    return {
      total: 0,
      tree: [],
      list: []
    };
  }
};
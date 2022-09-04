/*
 * @Author: zhangyang
 * @Date: 2022-09-04 10:52:44
 * @LastEditTime: 2022-09-04 11:20:03
 * @Description: 
 */
import fs from 'node:fs/promises';

let total: number

export interface DocTree {
  label: string
  key: string
  children?: DocTree[]
  path?: string
}

const getTree = async (blogPrefix = '../pages/blog') => {
  const t: DocTree[] = [];

  const url = new URL(blogPrefix, import.meta.url);
  const ls = await fs.readdir(url, 'utf-8');
  for (const l of ls) {
    const path = `${blogPrefix}/${l}`;
    const fs_status = await fs.stat(new URL(path, import.meta.url));
    if (fs_status.isDirectory()) {
      t.push({
        label: l,
        key: path,
        children: await getTree(path)
      });
    } else if (fs_status.isFile()) {
      const str = await fs.readFile(new URL(path, import.meta.url), 'utf-8');
      let title = str.match(/(?<=title: )(.*)(?=\n)/img)?.[0] ?? l.slice(0, -3)
      if (title.length > 12)
        title = `${title.slice(0, 12)}...`

      t.push({
        label: title,
        key: path.slice(7, -3),
        path: path.slice(7, -3).toLocaleLowerCase(),
      })
      total++
    }
  }
  return t;
}

export default async () => {
  total = 0;
  const tree: DocTree[] = await getTree();
  return {
    tree,
    total,
  }
}

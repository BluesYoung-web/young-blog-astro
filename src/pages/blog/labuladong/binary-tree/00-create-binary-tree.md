---
layout: "@/layouts/BlogPost.astro"
title: 生成树的辅助函数
description: 生成树的辅助函数
date: 2022-07-10 12:00:00
image: /img/algorithm.webp
---

[[toc]]

## 生成树(输入数组，输出树形结构的数据)

```bash
[1, 2, 3, 4, 5] ===>
          1
         / \
        2   3
       / \     
      4   5    

[3, 9, 20, null, null, 15, 7] ===>
    3
   / \
  9  20
    /  \
   15   7 
```

```ts
class TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
  constructor(
    val?: number,
    left?: TreeNode | null,
    right?: TreeNode | null
  ) {
    this.val = val ?? 0
    this.left = left ?? null
    this.right = right ?? null
  }
}

const helper = (arr: Array<number | null>, t: TreeNode) => {
  const l = arr.shift()
  if (typeof l === 'number')
    t.left = new TreeNode(l)

  else
    t.left = null

  const r = arr.shift()
  if (typeof r === 'number')
    t.right = new TreeNode(r)

  else
    t.right = null

  if (arr.length > 0) {
    if (t.left !== null)
      helper(arr, t.left)

    if (t.right !== null)
      helper(arr, t.right)

  }
}

const createTree = (arr: Array<number | null>) => {
  if (arr.length === 0)
    return null

  const tree = new TreeNode()
  const v = arr.shift()
  if (typeof v === 'number') {
    tree.val = v
    helper(arr, tree)
  }
  else {
    return null
  }

  return tree
}
```
---
title: 二叉树算法——思路篇
description: 二叉树算法——思路篇
date: 2022-07-18 15:15:00
image: /img/algorithm.webp
---

[[toc]]

## 翻转二叉树

### 题目描述

[<cib-leetcode /> 力扣原题-226. 翻转二叉树](https://leetcode.cn/problems/invert-binary-tree/)

给你一棵二叉树的根节点 `root`，翻转这棵二叉树，并返回其根节点

**提示：**

- 树中节点数目范围在 `[0, 100]` 内
- `100 <= Node.val <= 100`

### TDD

<n-collapse>
  <n-collapse-item name="1">
    <template #header>
      <vscode-icons-file-type-testts />
      <span class="ml-1">测试代码</span>
    </template>

```ts
describe('binary tree thought', () => {
  it('invertTree', () => {
    const before = invertTree(createTree([1, 2, 3, 4, 5]))
    const after = createTree([1, 3, 2, null, null, 5, 4])
    expect(before).toEqual(after)
  })
})
```
  </n-collapse-item>
</n-collapse>

### 具体实现

```ts
// 简单递归即可
function invertTree(root: TreeNode | null): TreeNode | null {
  if (!root)
    return null

  const left = invertTree(root.left)
  const right = invertTree(root.right)
  root.left = right
  root.right = left

  return root
}
```

## 填充每个节点的下一个右侧节点指针

### 题目描述

[<cib-leetcode /> 力扣原题-116. 填充每个节点的下一个右侧节点指针](https://leetcode-cn.com/problems/populating-next-right-pointers-in-each-node/)

**提示：**
- **满二叉树**
- 树中节点的数量在 `[0, 212 - 1]` 范围内
- `-1000 <= node.val <= 1000`

### 具体实现

```ts
function traverse(left: TreeNode | null, right: TreeNode | null) {
  if (!left || !right)
    return
  left.next = right
  // 左子树的左节点指向右节点
  traverse(left.left, left.right)
  // 右子树的左节点指向右节点
  traverse(right.left, right.right)
  // 左子树的右节点指向右子树的左节点
  traverse(left.right, right.left)
}

function connect(root: TreeNode | null): TreeNode | null {
  if (!root)
    return null
  traverse(root.left, root.right)
  return root
}
```
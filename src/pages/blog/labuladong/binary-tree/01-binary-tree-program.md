---
layout: "@/layouts/BlogPost.astro"
title: 二叉树算法——纲领篇
description: 二叉树算法——纲领篇
date: 2022-07-10 13:40:00
image: /img/algorithm.webp
---

[[toc]]

## 二叉树的最大深度

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-104. 二叉树的最大深度](https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/)

[<div class="i-cib-leetcode"></div> 剑指offer-55. 二叉树的最大深度](https://leetcode.cn/problems/er-cha-shu-de-shen-du-lcof/)

给定一个二叉树，找出其最大深度(二叉树的深度为根节点到最远叶子节点的最长路径上的节点数)

### 具体实现

```ts
class TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = (val === undefined ? 0 : val)
    this.left = (left === undefined ? null : left)
    this.right = (right === undefined ? null : right)
  }
}

// 回溯
let max = 0
let dep = 0

function maxDepth(root: TreeNode | null): number {
  traverse(root)
  return max
}

function traverse(root: TreeNode | null) {
  if (root === null)
    return

  dep++
  max = Math.max(max, dep)
  traverse(root.left)
  traverse(root.right)
  dep--
}

// 动态规划
function maxDepth2(root: TreeNode | null): number {
  if (root == null)
    return 0

  const leftMax = maxDepth(root.left)
  const rightMax = maxDepth(root.right)
  // 根据左右子树的最大深度推出原二叉树的最大深度
  return 1 + Math.max(leftMax, rightMax)
}
```

## 二叉树的前序遍历

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-144. 二叉树的前序遍历](https://leetcode-cn.com/problems/binary-tree-preorder-traversal/)

给定一个二叉树，返回其节点值的 **前序遍历**

### 具体实现

```ts
class TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = (val === undefined ? 0 : val)
    this.left = (left === undefined ? null : left)
    this.right = (right === undefined ? null : right)
  }
}

function preorderTraversal(root: TreeNode | null): number[] {
  const arr: number[] = []
  if (root === null)
    return []
  // 节点值
  arr.push(root.val)
  // 左子树
  arr.push(...preorderTraversal(root.left))
  // 右子树
  arr.push(...preorderTraversal(root.right))
  return arr
}
```

## 二叉树的直径

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-543. 二叉树的直径](https://leetcode-cn.com/problems/diameter-of-binary-tree/)

给定一个二叉树，返回其直径长度(任意两节点之间路径长度的最大值)

### 具体实现

```ts
class TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = (val === undefined ? 0 : val)
    this.left = (left === undefined ? null : left)
    this.right = (right === undefined ? null : right)
  }
}

let max
function diameterOfBinaryTree(root: TreeNode | null): number {
  max = 0
  maxDepth(root)
  return max
}

function maxDepth(root: TreeNode | null) {
  if (root == null)
    return 0

  // 计算左子树的最大直径
  const leftMax = maxDepth(root.left)
  // 计算右子树的最大直径
  const rightMax = maxDepth(root.right)
  // 后序遍历位置顺便计算最大直径
  max = Math.max(max, leftMax + rightMax)
  return 1 + Math.max(leftMax, rightMax)
}
```
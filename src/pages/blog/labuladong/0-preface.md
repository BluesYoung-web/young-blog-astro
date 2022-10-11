---
layout: "@/layouts/BlogPost.astro"
title: 拉布拉多算法小抄——序章
description: 拉布拉多算法小抄——序章
date: 2022-04-09 15:30:50
image: /img/algorithm.webp
---

[[toc]]

## 数据结构的存储方式

### 数组

**顺序存储**

**优点：**
- 可以随机访问，通过索引快速找到对应的元素
- 相对节约存储空间

**缺点：**
- 扩容、插入、删除，时间复杂度 O(N)

### 链表

**链式存储**

**优点：**
- 无需考虑扩容的问题
- 如果知道某个元素的前一个元素和后一个元素，插入、删除，时间复杂度 O(1)

**缺点：**
- 无法随机访问
- 每个元素需要额外保存前后元素位置的指针，会消耗更多的存储空间

### 其他数据结构

**队列、栈：**
- 既可以使用链表实现，又可以使用数组实现
- **使用数组实现，需要处理扩容和缩容的问题**
- **使用链表实现，需要消耗更多的内存空间来存储节点指针**

**图：**
- 邻接表——链表，节省空间，但是效率较低
- 邻接矩阵——二维数组，判断连通性比较迅速，还可以进行矩阵运算，但是如果图比较稀疏就很浪费空间

**散列表(哈希表)：**
- **通过 hash 函数把键映射到一个大数组里面**
- 解决 hash 冲突：
  - 开链法：需要链表的特性，操作简单，但是需要额外的空间存储指针
  - 线性探测法：需要数组的特性，便于连续寻址，不须要额外的空间存储指针，但是操作相对复杂

**树：**
- 使用数组实现的树是**完全二叉树——堆**，不需要节点指针，操作相对简单
- 使用链表实现的树，不一定是完全二叉树：
  - 二叉搜索树
  - AVL 树
  - 红黑树
  - 区间树
  - B 树
  - ...

## 数据结构的基本操作

**增删改查**

**for/while 迭代——线性**

**递归——非线性**

**数组遍历**

```ts
function traverse<T>(arr: T[]) {
  for (let i = 0; i < arr.length; i++) {
    // 迭代访问 arr[i]
  }
}
```

**链表遍历**

```ts
/* 基本的单链表节点 */
class ListNode<T> {
  public val: T;
  public next: ListNode<T> | null;
}

function traverse<T>(head: ListNode<T>) {
  for (let p = head; p.next != null; p = p.next) {
    // 迭代访问 p.val
  }
}

function traverse<T>(head: ListNode<T>) {
  if (head) {
    // 访问 head.val
    traverse(head.next);
  }
}
```

**二叉树遍历**

```ts
/* 基本的二叉树节点 */
class TreeNode<T> {
  public val: T;
  public left: T | null;
  public right: T | null;
}

function traverse<T>(root: TreeNode<T>) {
  if (root) {
    // root.val
    traverse(root.left);
    traverse(root.right);
  }
}
```

**n 叉树遍历**

```ts
/* 基本的 N 叉树节点 */
class TreeNode<T> {
  public val: T;
  public children: TreeNode<T>[];
}


function traverse<T>(root: TreeNode<T>, dp: Set<T>) {
  // root.val
  if (root.children) {
    for (const child of root.children) {
      if (dp.has(child)) {
        continue;
      } else {
        traverse(child, dp);
      }
      dp.add(child);
    }
  }
}

function traverseHelper<T>(root: TreeNode<T>) {
  const dp = new Set<T>();
  traverse(root, dp);
}
```

## 算法的本质

**算法的本质——穷举**

**无遗漏、无冗余**

穷举所有的可行解，然后得到最值

## 刷题指南

**数组、链表的常用算法：**
- 单链表翻转
- 前缀和数组
- 二分搜索
- ...

**二叉树**

**动态规划**

**回溯**
---
layout: "@/layouts/BlogPost.astro"
title: 查找两个 DOM 节点的最近公共父节点
description: 查找两个 DOM 节点的最近公共父节点
date: 2022-03-18 15:29:58
---

[[toc]]

## 场景

Node1 和 Node2 **在同一文档中，且不会为相同的节点**

需要**寻找这两个节点最近的一个共同父节点，可以包括节点本身**

## 解题思路

1. Node1 为 Node2 的父节点或 Node2 为 Node1 的父节点，直接返回
2. 两个节点无直接联系，但是沿着其中一个节点一直向上查找可以找到同时包含两个节点的父节点

## 递归实现

```js
function findCommonParent(oNode1, oNode2) {
  if (oNode1.contains(oNode2)) {
    return oNode1;
  } else if (oNode2.contains(oNode1)) {
    return oNode2;
  } else {
    return findCommonParent(oNode1.parentNode, oNode2);
  }
}
```

## 循环实现

```js
function findCommonParent(oNode1, oNode2) {
  // 节点包含自身！！！
  // oNode1.contains(oNode1) === true;
  while (!oNode1.contains(oNode2)) {
    oNode1 = oNode1.parentNode;
  }
  return oNode1;
}
```
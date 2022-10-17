---
title: 递归反转链表
description: 递归反转链表
date: 2022-04-13 09:00:00
image: /img/algorithm.webp
---

[[toc]]

## 反转链表

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-206.反转链表](https://leetcode-cn.com/problems/reverse-linked-list/)

给定一个单链表的头结点 `head`，请你反转链表，并返回反转后的链表

**提示：**
- 链表中节点的数目 ∈ [0, 5000]
- 节点值 ∈ [-5000, 5000]

### TDD

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
import { describe, it, expect } from 'vitest';

class ListNode {
  constructor(
    public val: number = 0,
    public next: ListNode | null = null
  ) {}
}

function createHelper(arr: number[]) {
  let p = new ListNode();
  const res = p;
  for (const i of arr) {
    p.next = new ListNode(i);
    p = p.next;
  }
  return res.next;
}

describe('反转链表', () => {
  it('1', () => {
    const list = createHelper([1, 2, 3, 4, 5]);
    const res = createHelper([5, 4, 3, 2, 1]);
    expect(reverseList(list)).toEqual(res);
  });
  it('2', () => {
    const list = createHelper([1, 2]);
    const res = createHelper([2, 1]);
    expect(reverseList(list)).toEqual(res);
  });
  it('3', () => {
    const list = createHelper([]);
    const res = createHelper([]);
    expect(reverseList(list)).toEqual(res);
  });
});
```
  
</details>

### 具体实现

```ts
// 递归 时间复杂度 O(N)，空间复杂度 O(N)
function reverseList(
  head: ListNode | null
): ListNode | null {
  if (head === null || head.next === null) {
    // 链表为空或者链表只有一个元素，直接返回
    return head;
  }

  // 递归(全程依赖引用关系!!!)
  const res = reverseList(head.next);
  // head.next 为反转之前的第一个节点，也就是反转之后的最后一个节点
  // 将倒数第二个节点拼接上最初的头结点
  head.next.next = head;
  // 将最初的头结点的下一个节点置为 null，断开双向链接关系
  head.next = null;
  
  return res;
}
// 迭代 时间复杂度 O(N)，空间复杂度 O(1)
function reverseList(
  head: ListNode | null
): ListNode | null {
  // 慢指针
  let pre = null;
  // 快指针
  let curr = head;
  while(curr) {
    // 临时存储当前节点的下一个节点
    const n = curr.next;
    // 反转链表元素
    curr.next = pre;
    // 慢指针前进
    pre = curr;
    // 快指针前进
    curr = n;
  }
  return pre;
}
```

## 反转链表 II

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-92.反转链表 II](https://leetcode-cn.com/problems/reverse-linked-list-ii/)

给定一个单链表的头结点 `head`，和两个正整数 `left <= right`，请你反转位置从 `left` 到 `right` 的链表节点，并返回反转后的链表

**提示：**
- 链表中节点的数目 ∈ [1, 500]
- 节点值 ∈ [-500, 500]
- left, right ∈ [1, n]

### TDD

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
import { describe, it, expect } from 'vitest';

class ListNode {
  constructor(
    public val: number = 0,
    public next: ListNode | null = null
  ) {}
}

function createHelper(arr: number[]) {
  let p = new ListNode();
  const res = p;
  for (const i of arr) {
    p.next = new ListNode(i);
    p = p.next;
  }
  return res.next;
}

describe('反转链表 II', () => {
  it('1', () => {
    const list = reverseBetween([1, 2, 3, 4, 5], 2, 4);
    const res = createHelper([1, 4, 3, 2, 5]);
    expect(reverseList(list)).toEqual(res);
  });
  it('2', () => {
    const list = createHelper([5], 1, 1);
    const res = createHelper([5]);
    expect(reverseList(list)).toEqual(res);
  });
});
```
  
</details>

### 解题思路

先实现一个反转链表前 N 个节点的函数

然后对于 `left === 1` 的情况，直接调用反转前 N 个节点的函数

对于 `left > 1` 的情况，将头结点前进至第 `left` 个节点，然后调用反转前 `N` 个节点的函数

### 具体实现

```ts
// 反转前 N 个节点
function reverseN(
  head: ListNode | null,
  n: number
) {
  if (n === 1) {
    endNode = head.next;
    return head;
  }

  const res = reverseN(head.next, n - 1);
  head.next.next = head;
  head.next = endNode;
  return res;
}
// 反转给定区间的节点
function reverseBetween(
  head: ListNode | null,
  left: number,
  right: number
): ListNode | null {
  if (left === 1) {
    // 相当于反转前 N 个元素
    return reverseN(head, right);
  }
  // 指针前进至反转起点
  head.next = reverseBetween(head.next, left - 1, right - 1);
  return head;
}
```
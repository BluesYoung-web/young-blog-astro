---
title: K 个一组反转链表
description: K 个一组反转链表
date: 2022-04-23 09:00:00
image: /img/algorithm.webp
---

[[toc]]

## K 个一组反转链表

### 题目描述

[<cib-leetcode /> 力扣原题-25. K 个一组翻转链表](https://leetcode-cn.com/problems/reverse-nodes-in-k-group/)

给定一个单链表的头结点 `head`，每 `k` 个节点一组进行翻转，请你返回修改后的链表

如果节点的总数不是 k 的整数倍，请将剩余节点保持原有的顺序

**你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换**

**提示：**
- 链表中节点的数目 n
- 1 <= k <= n <= 5000
- 节点值 ∈ [0, 1000]

### TDD

<n-collapse>
  <n-collapse-item name="1">
    <template #header>
      <vscode-icons-file-type-testts />
      <span class="ml-1">测试代码</span>
    </template>

```ts
import { describe, expect, it } from 'vitest'

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

describe('测试用例：', () => {
  it('1', () => {
    const p = createHelper([1, 2, 3, 4, 5]);
    const res = createHelper([2, 1, 4, 3, 5]);
    expect(reverseKGroup(p, 2)).toEqual(res);
  });

  it('2', () => {
    const p = createHelper([1, 2, 3, 4, 5]);
    const res = createHelper([3, 2, 1, 4, 5]);
    expect(reverseKGroup(p, 3)).toEqual(res);
  });

  it('3', () => {
    const p = createHelper([1, 2, 3, 4, 5, 6]);
    const res = createHelper([2, 1, 4, 3, 6, 5]);
    expect(reverseKGroup(p, 2)).toEqual(res);
  });

  it('4', () => {
    const p = createHelper([1, 2, 3, 4, 5, 6]);
    expect(reverseKGroup(p, 1)).toEqual(p);
  });
});
```
  </n-collapse-item>
</n-collapse>

### 具体实现

![示意图](https://labuladong.gitee.io/algo/images/kgroup/8.gif)

```ts
// 翻转链表的前 k 个元素
function reverse(
  start: ListNode | null,
  end: ListNode | null
): ListNode | null {
  let pre = null;
  let curr = start;
  let next = start;
  while (curr !== end) {
    next = curr.next;
    curr.next = pre;
    pre = curr;
    curr = next;
  }
  // 返回翻转之后的头结点
  return pre;
}

function reverseKGroup(
  head: ListNode | null,
  k: number
  ): ListNode | null {
  if (k === 1 || head === null) {
    return head;
  }
  let start = head;
  let end = head;

  for (let i = 0; i < k; i++) {
    // 剩余数量不足 k 个，直接返回
    if (end === null) {
      return head
    }
    end = end.next;
  }
  // 翻转前 k 个元素
  let newHead = reverse(start, end);
  // 递归翻转后续元素
  start.next = reverseKGroup(end, k);
  return newHead;
}
```


---
title: 回文链表
description: 回文链表
date: 2022-04-23 13:20:00
image: /img/algorithm.webp
---

[[toc]]

## 回文链表

### 题目描述

[<cib-leetcode /> 力扣原题-234. 回文链表](https://leetcode-cn.com/problems/palindrome-linked-list/)

给定一个单链表的头结点 `head`，请判断其是否为回文链表，返回 `true | false`

**提示：**
- 链表中节点的数目 n ∈ [0, 1e5]
- 节点值 ∈ [0, 9]

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

describe('示例：', () => {
  it('1', () => {
    const p = createHelper([1, 2, 2, 1]);
    expect(isPalindrome(p)).toBe(true);
  });

  it('2', () => {
    const p = createHelper([1, 2]);
    expect(isPalindrome(p)).toBe(false);
  });

  it('3', () => {
    const p = createHelper([1]);
    expect(isPalindrome(p)).toBe(true);
  });
});
```
  </n-collapse-item>
</n-collapse>

### 具体实现

#### 暴力破解

将链表整个翻转，然后使用两个指针分别从翻转前后的链表头部开始遍历对比

#### 双指针

先使用快慢指针找到链表的中点

然后从中点开始翻转链表(**只需要翻转一半**)

最后使用双指针逐个对比

```ts
function reverse(head: ListNode | null): ListNode | null {
  let pre = null;
  let curr = head;
  while (curr != null) {
    let next = curr.next;
    curr.next = pre;
    pre = curr;
    curr = next;
  }
  return pre;
}

function isPalindrome(head: ListNode | null): boolean {
  if (head === null || head.next === null) {
    return true;
  }
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  // 链表拥有奇数个节点
  if (fast !== null) {
    slow = slow.next;
  }

  let left = head;
  let right = reverse(slow);

  while (right !== null) {
    if (left.val !== right.val) {
      // 恢复链表顺序
      slow.next = reverse(fast);
      return false;
    }
    left = left.next;
    right = right.next;
  }
  slow.next = reverse(fast);
  return true;
}
```


---
title: 双指针技巧秒杀链表
description: 双指针技巧秒杀链表
date: 2022-04-10 10:00:00
image: /img/algorithm.webp
---

[[toc]]

## 合并两个有序链表

### 题目描述

[<cib-leetcode /> 力扣原题-21. 合并两个有序链表](https://leetcode-cn.com/problems/merge-two-sorted-lists/)

将两个**升序链表**合并为一个**升序**链表并返回，新的链表是通过拼接给定的两个链表的所有节点组成的

**提示：**
- 两个链表的节点数目 ∈ [0, 50]
- 节点的值 ∈ [-100, 100]
- 两个链表均为**非递减排序**

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

describe('官方示例：', () => {
  it('1', () => {
    const l1 = createHelper([1, 2, 4]);
    const l2 = createHelper([1, 3, 4]);
    const res = createHelper([1, 1, 2, 3, 4, 4]);

    expect(mergeTwoLists(l1, l2)).toEqual(res);
  });

  it('2', () => {
    const l1 = createHelper([]);
    const l2 = createHelper([]);
    const res = createHelper([]);

    expect(mergeTwoLists(l1, l2)).toEqual(res);
  });

  it('3', () => {
    const l1 = createHelper([]);
    const l2 = createHelper([0]);
    const res = createHelper([0]);

    expect(mergeTwoLists(l1, l2)).toEqual(res);
  });
});
```
  </n-collapse-item>
</n-collapse>

### 具体实现

```ts
function mergeTwoLists(
  list1: ListNode | null,
  list2: ListNode | null
): ListNode | null {
  let p = new ListNode();
  // 保留对头指针的索引
  const head = p;
  while (list1 !== null && list2 !== null) {
    // 从小到大开始拼接到新的链表上
    if (list1.val > list2.val) {
      p.next = list2;
      list2 = list2.next;
    } else {
      p.next = list1;
      list1 = list1.next;
    }
    // 指针前进
    p = p.next;
  }

  if (list1 !== null) {
    p.next = list1;
  }

  if (list2 !== null) {
    p.next = list2;
  }

  return head.next;
}
```

## 合并 k 个有序链表

### 题目描述

[<cib-leetcode /> 力扣原题-23. 合并K个升序链表](https://leetcode-cn.com/problems/merge-k-sorted-lists/)

给定一个链表数组，其中每个链表都已经按升序排序，请将所有链表合并为一个升序链表，返回合并后的链表

**提示：**
- k === lists.length
- k ∈ [0, 1e4]
- lists[i].length ∈ [0, 500]，且总和小于等于 1e4
- lists[i][j] ∈ [-1e4, 1e4]
- lists[i] **升序排序**

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

describe('官方示例：', () => {
  it('1', () => {
    const lists = [
      [1, 4, 5],
      [1, 3, 4],
      [2, 6]
    ].map(createHelper)
    const res = createHelper([1, 1, 2, 3, 4, 4, 5, 6]);
    expect(mergeKLists(lists)).toEqual(res);
  });

  it('2', () => {
    const lists = [].map(createHelper)
    const res = createHelper([]);
    expect(mergeKLists(lists)).toEqual(res);
  });

  it('3', () => {
    const lists = [[]].map(createHelper)
    const res = createHelper([]);
    expect(mergeKLists(lists)).toEqual(res);
  });
});
```
  </n-collapse-item>
</n-collapse>

### 具体实现

**暴力解法：**

```ts
function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  let p = new ListNode();
  const head = p;
  const arr: Array<ListNode | null> = [];
  // 首先将所有的链表的头结点都放入一个数组
  for (const l of lists) {
    l !== null && arr.push(l);
  }
  while (arr.length) {
    // 数组升序排序
    arr.sort((a, b) => a.val - b.val);
    // 开始从小到大拼接指针
    p.next = arr[0];
    if (arr[0].next !== null) {
      arr[0] = arr[0].next;
    } else {
      arr.shift();
    }
    // 指针前进
    p = p.next;
  }
  
  return head.next;
}
```

**优先级队列(二叉堆)解法，待实现...**

## 寻找单链表中倒数第 n 个节点

### 题目描述

[<cib-leetcode /> 力扣原题-19. 删除链表的倒数第 N 个结点](https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/)

给定一个链表和一个正整数 n，删除链表倒数第 n 个节点，并返回链表的头节点

**提示：**
- 链表中节点的数目为 sz
- sz ∈ [1, 30]
- 节点的值 ∈ [0, 100]
- n ∈ [1, sz]

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

describe('官方示例：', () => {
  it('1', () => {
    const p = createHelper([1, 2, 3, 4, 5])
    const res = createHelper([1, 2, 3, 5]);
    expect(removeNthFromEnd(p, 2)).toEqual(res);
  });

  it('2', () => {
    const p = createHelper([1])
    const res = createHelper([]);
    expect(removeNthFromEnd(p, 1)).toEqual(res);
  });

  it('3', () => {
    const p = createHelper([1, 2])
    const res = createHelper([1]);
    expect(removeNthFromEnd(p, 1)).toEqual(res);
  });
});
```
  </n-collapse-item>
</n-collapse>

### 具体实现

**思路：**
- 倒数第 n 个节点 === 正数第 sz - n + 1 个节点
- 找到单链表的**倒数第 n + 1 个节点(sz - n)**，将其与目标节点的下一个节点拼接即可删除目标节点

```ts
function findFromLast(head: ListNode | null, n: number) {
  let fast = head;
  let slow = head;
  // 快指针先走 n 步
  for (let index = 0; index < n; index++) {
    fast = fast.next;
  }
  // 两个指针同时再走 sz - n 步
  while (fast !== null) {
    fast = fast.next;
    slow = slow.next;
  }
  // 找到倒数第 n 个节点(sz - n)
  return slow;
}

function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const vertual = new ListNode(0, head);
  let n1 = findFromLast(vertual, n + 1);
  // 删除目标节点
  n1.next = n1.next.next;
  return vertual.next;
}
```

## 寻找单链表的中间节点

### 题目描述

[<cib-leetcode /> 力扣原题-876. 链表的中间结点](https://leetcode-cn.com/problems/middle-of-the-linked-list/)

给定一个头结点为 `head` 的非空单链表，返回链表的中间结点。如果有两个中间节点，则返回第二个中间节点

**提示：**
- 链表中节点的数目为 sz
- sz ∈ [1, 100]

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

describe('官方示例：', () => {
  it('1', () => {
    const p = createHelper([1, 2, 3, 4, 5]);
    const res = createHelper([3, 4, 5]);
    expect(middleNode(p)).toEqual(res);
  });

  it('2', () => {
    const p = createHelper([1]);
    expect(middleNode(p)).toEqual(p);
  });

  it('3', () => {
    const p = createHelper([1, 2, 3, 4, 5, 6]);
    const res = createHelper([4, 5, 6]);
    expect(middleNode(p)).toEqual(res);
  });
});
```
  </n-collapse-item>
</n-collapse>

### 具体实现

```ts
function middleNode(head: ListNode | null): ListNode | null {
  let fast = head;
  let slow = head;

  while (fast !== null && fast.next !== null) {
    // 慢指针走一步，快指针走两步
    slow = slow.next;
    fast = fast.next.next;
  }
  // 慢指针指向中点，偶数个为第二个中间节点
  return slow;
}
```

## 判断单链表是否包含环并找出环起点

### 环形链表 I

[<cib-leetcode /> 力扣原题-141. 环形链表](https://leetcode-cn.com/problems/linked-list-cycle/)

给你一个链表的头节点 `head` ，判断链表中是否有环

> 如果链表中有某个节点，可以通过连续跟踪 `next` 指针再次到达，则链表中存在环

如果链表中存在环则返回 `true`，否则返回 `false`

```ts
// 与寻找中间节点类似的代码
function hasCycle(head: ListNode | null): boolean {
  let fast = head;
  let slow = head;

  while (fast !== null && fast.next !== null) {
    // 慢指针走一步，快指针走两步
    slow = slow.next;
    fast = fast.next.next;
    // 快指针追上了慢指针，存在环
    if (fast === slow) {
      return true;
    }
  }
  // 快指针到达终点，不存在环
  return false;
}
```

### 环形链表 II

[<cib-leetcode /> 力扣原题-142. 环形链表 II](https://leetcode-cn.com/problems/linked-list-cycle-ii/)

给定一个链表的头节点  `head` ，返回链表开始入环的第一个节点。 如果链表无环，则返回 `null`

```ts
function detectCycle(head: ListNode | null): ListNode | null {
  let fast = head;
  let slow = head;

  while (fast !== null && fast.next !== null) {
    // 慢指针走一步，快指针走两步
    slow = slow.next;
    fast = fast.next.next;
    // 两指针相遇，跳出循环
    if (fast === slow) {
      break;
    }
  }
  if (fast === null || fast.next === null) {
    // 链表无环
    return null;
  }
  // 慢指针重新回到起点
  slow = head;
  while (slow !== fast) {
    // 两指针同步前进，再次相遇即为环的起点
    slow = slow.next;
    fast = fast.next;
  }
  return slow;
}
```


## 判断两个单链表是否相交并找出交点

[<cib-leetcode /> 力扣原题-160. 相交链表](https://leetcode-cn.com/problems/intersection-of-two-linked-lists/)

给你两个单链表的头节点 `headA` 和 `headB` ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 `null` 

### 思路

两个链表的长度可能不相同，从而导致指针无法同时走到公共的节点

**逻辑上将两个链表拼接起来，从而使得两个指针所需要遍历的长度相同<br />(p1: L1 -> L2, p2: L2 -> L1)**

### 具体实现

```ts
function getIntersectionNode(
  headA: ListNode | null,
  headB: ListNode | null
): ListNode | null {
  let p1 = headA;
  let p2 = headB;
  // 两边相遇或同时走到终点
  while (p1 !== p2) {
    if (p1 === null) {
      p1 = headB;
    } else {
      p1 = p1.next;
    }

    if (p2 === null) {
      p2 = headA;
    } else {
      p2 = p2.next;
    }
  }
  return p1;
}
```

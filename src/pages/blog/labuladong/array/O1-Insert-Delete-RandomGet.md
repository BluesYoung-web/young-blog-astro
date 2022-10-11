---
layout: "@/layouts/BlogPost.astro"
title: 常数时间插入、删除、随机获取数组中的元素
description: 常数时间插入、删除、随机获取数组中的元素
date: 2022-05-08 10:00:00
image: /img/algorithm.webp
---

[[toc]]

## O(1) 时间插入、删除和获取随机元素

### 题目描述

[<cib-leetcode /> 力扣原题-380. O(1) 时间插入、删除和获取随机元素](https://leetcode-cn.com/problems/insert-delete-getrandom-o1/)

**实现RandomizedSet 类：**
- RandomizedSet() 初始化 RandomizedSet 对象
- bool insert(int val) 当元素 val 不存在时，向集合中插入该项，并返回 true ；否则，返回 false
- bool remove(int val) 当元素 val 存在时，从集合中移除该项，并返回 true ；否则，返回 false
- int getRandom() 随机返回现有集合中的一项（测试用例保证调用此方法时集合中至少存在一个元素）每个元素应该有 **相同的概率** 被返回。
- 你必须实现类的所有函数，并满足**每个函数的平均时间复杂度为O(1)**

**提示：**
- val ∈ [-2e31, 2e31 - 1]
- 函数最多调用 2e5 次
- **在调用getRandom方法时，数据结构中至少存在一个元素**

### TDD

<n-collapse>
  <n-collapse-item name="1">
    <template #header>
      <vscode-icons-file-type-testts />
      <span class="ml-1">测试代码</span>
    </template>

```ts
import { describe, expect, it } from 'vitest'

describe('O1', () => {
  const s = new RandomizedSet();
  it('1', () => {
    expect(s.insert(1)).toBe(true);
  });

  it('2', () => {
    expect(s.remove(2)).toBe(false);
    expect(s.insert(2)).toBe(true);
  });

  it('3', () => {
    expect([1, 2]).toContain(s.getRandom());
  });

  it('4', () => {
    expect(s.remove(1)).toBe(true);
  });

  it('5', () => {
    expect(s.insert(2)).toBe(false);
  });

  it('6', () => {
    expect(s.getRandom()).toBe(2);
  });
});
```
  </n-collapse-item>
</n-collapse>

### 具体实现

```ts
class RandomizedSet {
  private IndexMap = new Map<number, number>();
  private data: number[] = [];

  insert(val: number): boolean {
    if (!this.IndexMap.has(val)) {
      const index = this.data.length;
      this.data[index] = val;
      this.IndexMap.set(val, index);
      return true;
    } else {
      return false;
    }
  }

  remove(val: number): boolean {
    if (this.IndexMap.has(val)) {
      // 将需要删除的元素移动到尾部
      const index1 = this.IndexMap.get(val);
      const index2 = this.IndexMap.size - 1;
      if (index1 !== index2) {
        [this.data[index1], this.data[index2]] = [this.data[index2], this.data[index1]];
        // 更新索引
        this.IndexMap.set(this.data[index1], index1); 
      }
      // 弹出尾部元素
      this.data.pop(); 
      // 删除索引
      this.IndexMap.delete(val);
      return true;
    } else {
      return false;
    }
  }

  getRandom(): number {
    const size = this.IndexMap.size;
    // 测试用例保证获取元素时集合中存在元素
    // if (size < 1) {
    //   throw new Error('can\'t get element from a null set !');
    // } else {
      const index = Math.floor(Math.random() * size);
      return this.data[index];
    // }
  }
}
```

## 黑名单中的随机数

### 题目描述

[<cib-leetcode /> 力扣原题-710. 黑名单中的随机数](https://leetcode-cn.com/problems/random-pick-with-blacklist/)

给定一个整数 n 和一个**无重复黑名单整数数组的 blacklist**

设计一种算法，从 [0, n - 1] 的范围内的任意整数之中选取一个**不在黑名单数组中的整数**，任何不在黑名单中的整数都有**同等的机会**被返回

**尽可能少的调用语言内置的随机函数**

**提示：**
- n ∈ [1, 1e9]
- blacklist.length ∈ [0, Math.min(n - 1, 1e5)]
- blacklist[i] ∈ [0, n)
- **blacklist 中无重复的元素**
- pick 函数最多调用 2e4 次

### TDD

<n-collapse>
  <n-collapse-item name="1">
    <template #header>
      <vscode-icons-file-type-testts />
      <span class="ml-1">测试代码</span>
    </template>

```ts
// 结果为随机值，不便测试
```
  </n-collapse-item>
</n-collapse>

### 具体实现

```ts
class Solution {
  private realLength = 0;
  private blackMap = new Map<number, number>();
  constructor(n: number, blacklist: number[]) {
    // 有效数值的长度
    this.realLength = n - blacklist.length;
    // 初始化
    for (const b of blacklist) {
      this.blackMap.set(b, -1);
    }

    let last = n - 1;
    for (const b of blacklist) {
      // 有效范围之外的 黑名单中的数，不用管
      if (b >= this.realLength) {
        continue;
      }
      // 防止将黑名单中的数映射到黑名单中的数
      while (this.blackMap.has(last)) {
        last--;
      }
      // 将黑名单中的数映射为 有效范围之外的 合法的数
      this.blackMap.set(b, last);
      last--;
    }
  }

  pick(): number {
    const n = Math.floor(Math.random() * this.realLength);
    return this.blackMap.get(n) || n;
  }
}
```
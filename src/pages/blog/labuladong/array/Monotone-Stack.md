---
layout: "@/layouts/BlogPost.astro"
title: 单调栈
description: 单调栈
date: 2022-05-11 15:42:00
image: /img/algorithm.webp
---

[[toc]]

## 去除重复字母

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-316. 去除重复字母](https://leetcode-cn.com/problems/remove-duplicate-letters/)

[<div class="i-cib-leetcode"></div> 力扣原题-1081. 不同字符的最小子序列](https://leetcode-cn.com/problems/smallest-subsequence-of-distinct-characters/)

给定一个字符串 `s`，请去除字符串中重复的字母，使得每个字母只出现一次

在**不打乱字符顺序的情况下返回结果的字典序最小**

**提示：**
- s.length ∈ [1, 1e4]
- s 全部由小写字母组成


### TDD

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
import { it, expect, describe } from 'vitest';

describe('demo', () => {
  it.each([
    ['baabc', 'abc'],
    ['cbacdcbc', 'acdb']
  ])('去除重复字母(%s) -> %s', (s, res) => {
    expect(removeDuplicateLetters(s)).toBe(res);
  });
});
```
  
</details>

### 具体实现

核心思想——**单调栈**

```ts
function removeDuplicateLetters(str: string) {
  const len = str.length;
  // 单调栈
  const stack: string[] = [];

  for (let i = 0; i < len; i++) {
    // 栈中存在相同的元素，直接跳过
    if (stack.includes(str[i])) {
      continue;
    }
    while (
      // 要入栈的元素小于等于当前栈顶的元素
      str[i] < stack[stack.length - 1] &&
      // 字符串后面存在与栈顶元素相同的元素
      str.indexOf(stack[stack.length - 1], i) > -1
    ) {
      // 弹出当前的栈顶元素
      stack.pop();
    }
    stack.push(str[i]);
  }

  return stack.join('');
}
```

## 下一个更大的元素 I

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-496. 下一个更大元素 I](https://leetcode-cn.com/problems/next-greater-element-i/)

nums1 中数字 x 的 下一个更大元素 是指 x 在 nums2 中对应位置 **右侧** 的 **第一个** 比 x 大的元素

给你两个 **没有重复元素** 的数组 nums1 和 nums2，下标从 0 开始计数，**其中nums1 是 nums2 的子集**

对于每个 0 <= i < nums1.length ，找出满足 nums1[i] === nums2[j] 的下标 j，并且在 nums2 确定 nums2[j] 的 **下一个更大元素**。如果不存在下一个更大元素，那么本次查询的答案是 -1

返回一个长度为 nums1.length 的数组 ans 作为答案，满足 ans[i] 是如上所述的 下一个更大元素

**提示：**
- nums.length ∈ [1, 1000]
- nums[i] ∈ [0, 1e4]

### TDD

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
import { it, expect, describe } from 'vitest';

describe('demo', () => {
  it.each([
    [
      [4, 1, 2],
      [1, 3, 4, 2],
      [-1, 3, -1]
    ],
    [
      [2, 4],
      [1, 2, 3, 4],
      [3, -1]
    ]
  ])('下一个更大的元素(%s, %s) -> %s', (nums1, nums2, res) => {
    expect(nextGreaterElement(nums1, nums2)).toEqual(res);
  });
});
```
  
</details>

### 具体实现

```ts
function nextGreaterElement(
  nums1: number[],
  nums2: number[]
): number[] {
  const len = nums2.length;
  const recordMap = new Map<number, number>();
  const stack: number[] = [];
  for (let i = len - 1; i >= 0; i--) {
    while (stack.length > 0) {
      const n = stack.shift();
      // 取出栈顶元素与当前元素进行对比
      if (nums2[i] < n) {
        recordMap.set(nums2[i], n);
        // 栈顶元素大于当前元素，重新入栈
        stack.unshift(n);
        stack.unshift(nums2[i]);
        break;
      }
    }
    // 栈为空
    if (stack.length === 0) {
      recordMap.set(nums2[i], -1);
      stack.unshift(nums2[i]);   
    }
  }
  return nums1.map((v) => recordMap.get(v));
}
```

## 下一个更大的元素 II

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-503. 下一个更大元素 II](https://leetcode-cn.com/problems/next-greater-element-ii/)

给定一个**循环数组** nums （**nums[nums.length - 1] 的下一个元素是 nums[0]**），返回 nums 中每个元素的 **下一个更大元素**

数字 x 的 下一个更大的元素是按数组遍历顺序，这个数字之后的第一个比它更大的数，这意味着你应该循环地搜索它的下一个更大的数。如果不存在，则输出 -1

**提示：**
- nums.length ∈ [1, 1e4]
- nums[i] ∈ [-1e9, 1e9]

### TDD

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
import { it, expect, describe } from 'vitest';

describe('demo', () => {
  it.each([
    [
      [1, 2, 1],
      [2, -1, 2]
    ],
    [
      [1, 2, 3, 4, 3],
      [2, 3, 4, -1, 4]
    ]
  ])('下一个更大的元素(%s) -> %s', (nums, res) => {
    expect(nextGreaterElements(nums)).toEqual(res);
  });
});
```
  
</details>

### 具体实现

```ts
function nextGreaterElements(nums: number[]): number[] {
  const len = nums.length;
  const stack: number[] = [];
  const res: number[] = [];
  // 假装拥有双倍长度的数组
  for (let i = 2 * len - 1; i >= 0; i--) {
    while (
      // 堆栈不为空
      stack.length > 0 &&
      // 并且栈顶元素小于等于当前元素
      stack[0] <= nums[i % len] 
    ) {
      stack.shift();
    }
    res[i % len] = stack[0] ?? -1;
    stack.unshift(nums[i % len]);
  }
  return res;
}
```

## 每日温度

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-739. 每日温度](https://leetcode-cn.com/problems/daily-temperatures/)

给定一个整数数组 temperatures，表示每天的温度，返回一个数组 answer，其中 answer[i] 是指在第 i 天之后，才会有更高的温度

如果气温在这之后都不会升高，请在该位置用 0 来代替

**提示：**
- temperatures.length ∈ [1, 1e5]
- temperatures[i] ∈ [30, 100]

### TDD

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
import { it, expect, describe } from 'vitest';

describe('demo', () => {
  it.each([
    [
      [73, 74, 75, 71, 69, 72, 76, 73],
      [1, 1, 4, 2, 1, 1, 0, 0]
    ],
    [
      [30, 40, 50, 60],
      [1, 1, 1, 0]
    ],
    [
      [30, 60, 90],
      [1, 1, 0]
    ]
  ])('每日温度(%s) -> %s', (nums, res) => {
    expect(dailyTemperatures(nums)).toEqual(res);
  });
});
```
  
</details>

### 具体实现

```ts
function dailyTemperatures(nums: number[]): number[] {
  const len = nums.length;
  // 单调栈直接存放索引
  const stack: number[] = [];
  const res: number[] = [];
  for (let i = len - 1; i >= 0; i--) {
    while (
      // 堆栈不为空
      stack.length > 0 &&
      // 并且栈顶元素小于等于当前元素
      nums[stack[0]] <= nums[i]
    ) {
      stack.shift();
    }

    let n = stack[0] ?? -1;
    if (n === -1) {
      // 不存在
      res[i] = 0;
    } else {
      // 距离下一个温度更高的日子
      res[i] = n - i;
    }
    stack.unshift(i);
  }
  return res;
}
```
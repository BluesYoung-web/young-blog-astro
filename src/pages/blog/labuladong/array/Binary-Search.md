---
title: 二分搜索算法
description: 二分搜索算法
date: 2022-05-02 08:30:00
image: /img/algorithm.webp
---

[[toc]]

## 二分查找

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-704. 二分查找](https://leetcode-cn.com/problems/binary-search/)

给定一个 `n` 个元素有序的(升序)整形数组 `nums` 和一个目标值 `target`，写一个函数搜索 `nums` 中的 `target`，如果存在则返回数组索引，否则返回 `-1`

**提示：**
- 假设数组中所有的元素都是不重复的
- n ∈ [1, 10000]
- nums[i] ∈ [-9999, 9999]

### TDD

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
import { describe, expect, it } from 'vitest'

describe('二分查找', () => {
  it('1', () => {
    const nums = [-1, 0, 3, 5, 9, 12];
    const target = 9;
    expect(search(nums, target)).toBe(4);
  });

  it('2', () => {
    const nums = [-1, 0, 3, 5, 9, 12];
    const target = 2;
    expect(search(nums, target)).toBe(-1);
  });
});
```
  
</details>

### 具体实现

```ts
function search(nums: number[], target: number): number {
  const len = nums.length;
  let left = 0;
  let right = len - 1;
  while (left <= right) {
    // 防止整型数值溢出
    let mid = left + Math.floor((right - left) / 2);
    const temp = nums[mid];
    if (temp === target) {
      return mid;
    } else if (temp < target) {
      // 右移区间
      left = mid + 1;
    } else if (temp > target) {
      // 左移区间
      right = mid - 1;
    }
  }
  return -1;
}
```

## 在排序数组中查找元素的第一个位置和最后一个位置

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode-cn.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

给定一个按照**升序排列**的整数数组 `nums` 和一个目标值 `target`，找出给定目标值在数组中的开始位置和结束位置，如果不存在则返回 `[-1, -1]`

**提示：**
- nums.length ∈ [0, 1e5]
- nums[i] ∈ [-1e9, 1e9]
- target ∈ [-1e9, 1e9]

### TDD

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
import { describe, expect, it } from 'vitest'

describe('二分查找', () => {
  it('1', () => {
    const nums = [5, 7, 7, 8, 8, 10];
    const target = 8;
    expect(searchRange(nums, target)).toEqual([3, 4]);
  });

  it('2', () => {
    const nums = [5, 7, 7, 8, 8, 10];
    const target = 6;
    expect(searchRange(nums, target)).toEqual([-1, -1]);
  });

  it('3', () => {
    const nums = [];
    const target = 0;
    expect(searchRange(nums, target)).toEqual([-1, -1]);
  });
});
```
  
</details>

### 具体实现

**在上面代码的基础上稍作修改：**

```ts
function searchRange(nums: number[], target: number): number[] {
  const len = nums.length;
  let left = 0;
  let right = len - 1;

  let start = -1, end = -1;
  while (left <= right) {
    // 防止整型数值溢出
    let mid = left + Math.floor((right - left) / 2);
    const temp = nums[mid];
    if (temp === target) {
      start = mid - 1;
      end = mid + 1;
      // 寻找左边界
      while (start >= 0 && nums[start] === target) {
        start--;
      }
      // 寻找右边界
      while (end <= len - 1 && nums[end] === target) {
        end++;
      }
      return [start + 1, end - 1];
    } else if (temp < target) {
      // 右移区间
      left = mid + 1;
    } else if (temp > target) {
      // 左移区间
      right = mid - 1;
    }
  }
  return [start, end];
}
```

**分别查找左右边界：**

```ts
function searchRange(nums: number[], target: number): number[] {
  const start = findLeft(nums, target);
  const end = findRight(nums, target);
  return [start, end];
}

function findLeft (nums: number[], target: number): number {
  const len = nums.length;
  let left = 0;
  let right = len - 1;

  while (left <= right) {
    // 防止整型数值溢出
    let mid = left + Math.floor((right - left) / 2);
    const temp = nums[mid];
    if (temp === target) {
      // 锁定左边界的最大值
      right = mid - 1;
    } else if (temp < target) {
      // 右移区间
      left = mid + 1;
    } else if (temp > target) {
      // 左移区间
      right = mid - 1;
    }
  }
  // 保证数组没有越界
  if (left >= len || nums[left] !== target) {
    return -1;
  }
  return left;
}

function findRight (nums: number[], target: number): number {
  const len = nums.length;
  let left = 0;
  let right = len - 1;

  while (left <= right) {
    // 防止整型数值溢出
    let mid = left + Math.floor((right - left) / 2);
    const temp = nums[mid];
    if (temp === target) {
      // 锁定右边界的最小值
      left = mid + 1;
    } else if (temp < target) {
      // 右移区间
      left = mid + 1;
    } else if (temp > target) {
      // 左移区间
      right = mid - 1;
    }
  }
  // 保证数组没有越界
  if (right < 0 || nums[right] !== target) {
    return -1;
  }
  return right;
}
```
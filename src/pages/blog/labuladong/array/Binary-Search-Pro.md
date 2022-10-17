---
title: 二分搜索——进阶
description: 二分搜索——进阶
date: 2022-05-06 17:00:00
image: /img/algorithm.webp
---

[[toc]]

## 爱吃香蕉的 koko

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-875. 爱吃香蕉的珂珂](https://leetcode-cn.com/problems/koko-eating-bananas/)

珂珂喜欢吃香蕉。这里有 n 堆香蕉，第 i 堆中有 piles[i] 根香蕉。警卫已经离开了，将在 h 小时后回来。

珂珂可以决定她吃香蕉的速度 k(根/小时)。每个小时，她将会选择一堆香蕉，从中吃掉 k 根。如果这堆香蕉少于 k 根，她将吃掉这堆所有的香蕉，然后这一小时内不会再吃更多的香蕉。

珂珂喜欢慢慢吃，但仍想在警卫回来之前吃掉所有的香蕉。

求她可以在 h 小时内吃完所有香蕉的**最小速度 k(k为整数)**

**提示：**
- piles.length ∈ [1, 1e4]
- h ∈ [piles.length, 1e9]
- piles[i] ∈ [1, 1e9]

### TDD

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>
  
```ts
import { describe, it, expect } from 'vitest';

describe('爱吃香蕉的珂珂', () => {
  it('1', () => {
    const piles = [3, 6, 7, 11];
    const h = 8;
    expect(minEatingSpeed(piles, h)).toBe(4);
  });

  it('2', () => {
    const piles = [30, 11, 23, 4, 20];
    const h = 5;
    expect(minEatingSpeed(piles, h)).toBe(30);
  });

  it('3', () => {
    const piles = [30, 11, 23, 4, 20];
    const h = 6;
    expect(minEatingSpeed(piles, h)).toBe(23);
  });

});
```

</details>


### 具体实现

```ts
function canFinish (piles: number[], n: number) {
  let hours = 0;
  for (const banana of piles) {
    hours += Math.ceil(banana / n);
  }
  return hours;
}

function minEatingSpeed(piles: number[], h: number): number {
  let left = 1;
  // h 大于等于香蕉堆数，最坏情况取最大值
  let right = Math.max(...piles);

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (canFinish(piles, mid) <= h) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return right;
}
```

## 在 D 天内送达包裹的能力

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-1011. 在 D 天内送达包裹的能力](https://leetcode-cn.com/problems/capacity-to-ship-packages-within-d-days/)

传送带上的包裹必须在 days 天内从一个港口运送到另一个港口。

传送带上第 i 个包裹的重量为 weights[i]。每一天我们都会按给出重量的**顺序**往传送带上装载包裹。**装载的重量不会超过船只的最大运载重量**。

返回能在 days 天内将传送带上的所有包裹送达的船只的**最低运载能力**。

**提示：**
- weights.length ∈ [1, 5e4]
- days ∈ [1, weights.length]
- weights[i] ∈ [1, 500]

### TDD

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
import { describe, it, expect } from 'vitest';

describe('在 D 天内送达包裹的能力', () => {
  it('1', () => {
    const weights = [1,2,3,4,5,6,7,8,9,10];
    const days = 5;
    expect(shipWithinDays(weights, days)).toBe(15);
  });

  it('2', () => {
    const weights = [3, 2, 2, 4, 1, 4];
    const days = 3;
    expect(shipWithinDays(weights, days)).toBe(6);
  });

  it('3. 最小运载量不得小于单个货物的最大重量', () => {
    const weights = [1, 2, 3, 1, 1];
    const days = 4;
    expect(shipWithinDays(weights, days)).toBe(3);
  });

  it('4. 刚好装满', () => {
    const weights = [3, 3, 3, 3, 3, 3];
    const days = 2;
    expect(shipWithinDays(weights, days)).toBe(9);
  });
});
```
  
</details>

### 具体实现

```ts
function canFinish (weights: number[], n: number) {
  let d = 1;
  let tempShip = 0;
  const len = weights.length;
  for (let i = 0; i < len; i++) {
    if (tempShip + weights[i] < n) {
      tempShip += weights[i];
    } else {
      d++;
      tempShip = tempShip + weights[i] === n ? 0 : weights[i];
    }
  }
  // 刚好装满
  if (tempShip === 0) {
    d--;
  }
  return d;
}

function shipWithinDays(weights: number[], days: number): number {
  let left = 1;
  let right = weights.reduce((pre, curr) => pre + curr, 0);
  let maxValue = Math.max(...weights);

  // base case
  if (days === 1) {
    return right;
  }
  if (days === weights.length) {
    return maxValue;
  }

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (canFinish(weights, mid) <= days) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  // 最小装载量不能小于单个货物的重量
  return Math.max(right, maxValue);
}
```

## 分割数组的最大值

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-410. 分割数组的最大值](https://leetcode-cn.com/problems/split-array-largest-sum/)

给定一个非负整数数组 nums 和一个整数 m，需要将这个数组分成 m 个**非空的连续子数组**

设计一个算法使得这 m 个子数组各自和的最大值最小，返回这个**最大值**

**提示：**
- nums.length ∈ [1, 1000]
- nums[i] ∈ [0, 1e6]
- m ∈ [1, Math.min(50, nums.length)]

### TDD

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
import { describe, it, expect } from 'vitest';

describe('分割数组的最大值', () => {
  it('1', () => {
    const nums = [7, 2, 5, 10, 8];
    const m = 2;
    expect(splitArray(nums, m)).toBe(18);
  });

  it('2', () => {
    const nums = [1, 2, 3, 4, 5];
    const m = 2;
    expect(splitArray(nums, m)).toBe(9);
  });

  it('3', () => {
    const nums = [1, 4, 4];
    const m = 3;
    expect(splitArray(nums, m)).toBe(4);
  });

  it('4. 子数组的最大值不会小于单个元素的最大值', () => {
    const nums = [2, 3, 1, 2, 4, 3];
    const m = 5;
    expect(splitArray(nums, m)).toBe(4);
  });
});
```
  
</details>

### 具体实现

**其实思路跟上一题类似，稍微改一改代码就行**

```ts
function canFinish (weights: number[], n: number) {
  let d = 1;
  let tempShip = 0;
  const len = weights.length;
  for (let i = 0; i < len; i++) {
    if (tempShip + weights[i] < n) {
      tempShip += weights[i];
    } else {
      d++;
      tempShip = tempShip + weights[i] === n ? 0 : weights[i];
    }
  }
  // 刚好装满
  if (tempShip === 0) {
    d--;
  }
  return d;
}

function splitArray(nums: number[], m: number): number {
  let left = Math.min(...nums);
  let right = nums.reduce((pre, curr) => pre + curr, 0);
  let maxValue = Math.max(...nums);

  // base case
  if (m === 1) {
    return right;
  }
  if (m === nums.length) {
    return maxValue;
  }
  while (left < right) {
    const mid = (right + left) >> 1;
    if (canFinish(nums, mid) <= m) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  // 子数组的最大值不会小于单个元素的最大值
  return Math.max(right, maxValue);
};
```
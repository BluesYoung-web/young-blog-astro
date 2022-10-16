---
layout: "@/layouts/BlogPost.astro"
title: 前缀和数组
description: 前缀和数组
date: 2022-04-24 15:30:00
image: /img/algorithm.webp
---

[[toc]]

<n-alert type="info">**常用于频繁查询数组某个区间的累加和**</n-alert>

## 区域和检索-数组不可变

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-303. 区域和检索 - 数组不可变](https://leetcode-cn.com/problems/range-sum-query-immutable/)

给定一个整数数组 `nums`，处理以下类型的多个查询：
1. 计算索引 `left` 和 `right` 闭区间内所有元素的和，`left <= right`

**提示：**
- nums.length ∈ [1, 1e4]
- nums[i] ∈ [-1e5, 1e5]
- 0 <= left <= right <= nums.length>
- **最多调用 `1e4` 次 `sumRange` 方法**

### TDD

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
import { describe, expect, it } from 'vitest'

describe('区域和搜索', () => {
  const numArray = new NumArray([-2, 0, 3, -5, 2, -1]);

  it('1', () => {
    expect(numArray.sumRange(0, 2)).toEqual(1);
  });

  it('2', () => {
    expect(numArray.sumRange(2, 5)).toEqual(-1);
  });

  it('3', () => {
    expect(numArray.sumRange(0, 5)).toEqual(-3);
  });
});
```
  
</details>

### 具体实现

```ts
class NumArray {
  // 存储所有元素顺序累加和的数组
  public sumArr: number[] = [0];
  constructor(
    public nums: number[]
  ) {
    const len = this.nums.length + 1;
    // 遍历元素，计算累加和
    for (let i = 1; i < len; i++) {
      this.sumArr[i] = this.sumArr[i - 1] + nums[i - 1];
    }
  }
  // [1, 4] 内的所有元素之和 => sumArr[5] - sumArr[1]
  sumRange(left: number, right: number): number {
    return this.sumArr[right + 1] - this.sumArr[left];
  }
}
```

## 二维区域和检索 - 矩阵不可变

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-304. 二维区域和检索 - 矩阵不可变](https://leetcode-cn.com/problems/range-sum-query-2d-immutable/)

给定一个二维矩阵 `matrix`，计算其子矩阵范围内元素的总和<br/> `(x1, y1, x2, y2)`


**提示：**
- m === matrix.length && 1<= m <= 200
- n === matrix[i].length && 1<= m <= 200
- matrix[i][j] ∈ [-1e5, 1e5]
- 0 <= x1 <= x2 <= m
- 0 <= y1 <= y2 <= n
- 最多调用 1e4 次求和方法

### TDD

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
import { describe, expect, it } from 'vitest'

describe('二维区域和搜索', () => {
  const numMatrix = new NumMatrix([
    [3, 0, 1, 4, 2],
    [5, 6, 3, 2, 1],
    [1, 2, 0, 1, 5],
    [4, 1, 0, 1, 7],
    [1, 0, 3, 0, 5]
  ]);

  it('1', () => {
    expect(numMatrix.sumRegion(2, 1, 4, 3)).toEqual(8);
  });

  it('2', () => {
    expect(numMatrix.sumRegion(1, 1, 2, 2)).toEqual(11);
  });

  it('3', () => {
    expect(numMatrix.sumRegion(1, 2, 2, 4)).toEqual(12);
  });
});
```
  
</details>

### 具体实现

![思路](https://labuladong.gitee.io/algo/images/%e5%89%8d%e7%bc%80%e5%92%8c/5.jpeg)

**红色 = 绿色 - 蓝色 - 橙色 + 粉色**

**绿蓝橙粉均以 (0, 0) 为原点**

```ts
class NumMatrix {
  public sumArr: number[][] = [];
  constructor(
    public matrix: number[][]
  ) {
    const m = matrix.length;
    const n = matrix[0].length;
    // 初始化结果矩阵
    for (let index = 0; index <= m; index++) {
      this.sumArr[index] = new Array(n + 1).fill(0);
    }
    
    if (m === 0 || n === 0) {
      return;
    }
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        this.sumArr[i][j] = 
          this.sumArr[i - 1][j]
           + this.sumArr[i][j - 1]
           + matrix[i - 1][j - 1]
           - this.sumArr[i -1][j - 1];
        
      }
    }
  }

  sumRegion(x1: number, y1: number, x2: number, y2: number): number {
    return this.sumArr[x2 + 1][y2 + 1]
            - this.sumArr[x1][y2 + 1]
            - this.sumArr[x2 + 1][y1]
            + this.sumArr[x1][y1];
  }
}
```

## 和为 k 的子数组

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-560. 和为 K 的子数组](https://leetcode-cn.com/problems/subarray-sum-equals-k/)

给定一个整数数组 `nums` 和一个整数 `k`，**请统计并返回该数组中和为 k 的子数组的个数**

**提示：**
- nums.length ∈ [1, 2e4]
- nums[i] ∈ [-1000, 1000]
- k ∈ [-1e7, 1e7]

### TDD

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
import { describe, expect, it } from 'vitest'

describe('和为 k 的子数组', () => {
  it('1', () => {
    expect(subarraySum([1, 1, 1], 2)).toEqual(2);
  });

  it('2', () => {
    expect(subarraySum([1, 2, 3], 3)).toEqual(2);
  });

  it('3', () => {
    expect(subarraySum([2, 3, 3], 4)).toEqual(0);
  });
});
```
  
</details>

### 具体实现

```ts
function subarraySum(nums: number[], k: number): number {
  // 当前缀和足够时，无需额外的元素
  const sumMap = new Map<number, number>([[0, 1]]);
  let res = 0, sum0_i = 0;
  for (const n of nums) {
    sum0_i += n;
    const diff = sum0_i - k;
    if (sumMap.has(diff)) {
      // 统计所需值在之前的前缀和之中出现的次数
      res += sumMap.get(diff);
    }
    sumMap.set(sum0_i, (sumMap.get(sum0_i) ?? 0) + 1);
  }
  return res;
}
```
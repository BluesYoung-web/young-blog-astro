---
title: 差分数组
description: 差分数组
date: 2022-04-25 15:30:00
image: /img/algorithm.webp
---

[[toc]]

<n-alert type="info">**常用于频繁对数组某个区间的元素进行增减**</n-alert>

## 区间加法

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-370.区间加法(会员专享，需要氪金)](https://leetcode-cn.com/problems/range-addition/)

假设你有一个长度为 n 的数组，初始情况下所有的元素值都为 0，你将会被给出 k 个更新操作；其中每个操作会被表示为一个三元组：[startIndex, endIndex, incNum]，你需要将数组中 startIndex 至 endIndex 之间的所有元素增加 incNum，请返回 k 次操作之后的数组

### TDD

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
import { describe, expect, it } from 'vitest'

describe('差分数组', () => {
  const originArr = new Array(5).fill(0);
  const diffArray = new DiffArray(originArr);

  it('1', () => {
    diffArray.inc(1, 3, 2);
    expect(diffArray.res()).toEqual([0, 2, 2, 2, 0]);
  });

  it('2', () => {
    diffArray.inc(2, 4, 3);
    expect(diffArray.res()).toEqual([0, 2, 5, 5, 3]);
  });

  it('3', () => {
    diffArray.inc(0, 2, -2);
    expect(diffArray.res()).toEqual([-2, 0, 3, 5, 3]);
  });
});
```
  
</details>

### 具体实现

```ts
class DiffArray {
  public diffArr: number[] = [];
  constructor(arr: number[]) {
    // 构造差分数组
    this.diffArr[0] = arr[0];
    const len = arr.length;
    for (let i = 1; i < len; i++) {
      this.diffArr[i] = arr[i] - arr[i - 1];
    }
  }

  inc(i: number, j: number, k: number) {
    // 左边界加 k，相当于此元素之后的所有元素都加 k
    this.diffArr[i] += k;
    if (j + 1 < this.diffArr.length) {
      // 右边界到达数组尾元素之前，抵消副作用，保证仅区间内的元素变化
      this.diffArr[j + 1] -= k;
    }
  }

  res() {
    const resArr = [this.diffArr[0]];
    const len = this.diffArr.length;
    for (let i = 1; i < len; i++) {
      resArr[i] = resArr[i - 1] + this.diffArr[i];
    }
    return resArr;
  }
}
```

## 航班预定统计

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-1109. 航班预订统计](https://leetcode-cn.com/problems/corporate-flight-bookings/)

这里有 n 个航班，它们**分别从 1 到 n 进行编号**

有一份航班预订表 bookings ，表中第 i 条预订记录 bookings[i] = [firsti, lasti, seatsi] 意味着在从 firsti 到 lasti （包含 firsti 和 lasti ）的 每个航班 上预订了 seatsi 个座位

请你返回一个长度为 n 的数组 answer，里面的元素是每个航班预定的座位总数


### 具体实现

直接使用上面的差分数组类，**使用时将索引 -1 即可**

```ts
function corpFlightBookings(
  bookings: number[][],
  n: number
): number[] {
  const diffArr = new DiffArray(new Array(n).fill(0));
  for(const [start, end, num] of bookings) {
    // 航班索引从 1 开始
    diffArr.inc(start - 1, end - 1, num);
  }
  return diffArr.res();
}
```

## 拼车

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-1094. 拼车](https://leetcode-cn.com/problems/car-pooling/)

车上最初有 `capacity` 个空座位，**并且只能向一个方向行驶**

给定一个数组 `trips` 和一个整数 `capacity`, `trip[i] = [numPassengersi, fromi, toi]` 表示第 `i` 次旅行有 `numPassengersi` 乘客，接他们和放他们的位置分别是 fromi 和 toi 。这些位置是从汽车的初始位置向东的公里数

**当且仅当你可以在所有给定的行程中接送所有乘客时，返回 true，否则请返回 false**

**提示：**

- 1 <= trips.length <= 1000
- trips[i].length == 3
- 1 <= numPassengersi <= 100
- **0 <= fromi < toi <= 1000**
- 1 <= capacity <= 105

### TDD

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
import { describe, expect, it } from 'vitest'

describe('拼车', () => {
  it('1', () => {
    expect(carPooling([[2, 1, 5], [3, 3, 7]], 4)).toEqual(false);
  });

  it('2', () => {
    expect(carPooling([[2, 1, 5], [3, 3, 7]], 5)).toEqual(true);
  });
});
```
  
</details>

### 具体实现

```ts
function carPooling(
  trips: number[][],
  capacity: number
): boolean {
  // 最多 1001 个车站
  const diffArr = new DiffArray(new Array(1001).fill(0));

  for (const [n, start, end] of trips) {
    // 乘客在车上的区间
    diffArr.inc(start, end - 1, n);
  }
  // 每一站都没有超载
  return diffArr.res().every((n) => n <= capacity);
}
```


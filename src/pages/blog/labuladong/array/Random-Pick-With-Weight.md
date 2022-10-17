---
title: 加权随机选择
description: 加权随机选择
date: 2022-05-04 14:30:00
image: /img/algorithm.webp
---

[[toc]]

## 按权重随机选择

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-528. 按权重随机选择](https://leetcode-cn.com/problems/random-pick-with-weight/)

给定一个**下标从 0 开始的正整数数组 `w`**，其中 `w[i]` 代表第 `i` 个下标的权重

请实现一个函数 `pickIndex`，它可以**随机地**从范围 `[0, w.length - 1]` 内选出并返回一个下标。选取下标 `i` 的概率为 `w[i] / sum(w)`

**提示：**
- w.length ∈ [1, 1e4]
- w[i] ∈ [1, 1e5]
- pickIndex 被调用的次数不超过 1e4 次

### TDD

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码(随机结果，不便测试，仅展示示例情况)
  </summary>

**示例 1：**
```js
输入：
["Solution","pickIndex"]
[[[1]],[]]
输出：
[null,0]
解释：
Solution solution = new Solution([1]);
solution.pickIndex();
// 返回 0，因为数组中只有一个元素，所以唯一的选择是返回下标 0
```

**示例 2：**

```js
输入：
["Solution"
,"pickIndex","pickIndex","pickIndex","pickIndex","pickIndex"]
[[[1,3]],[],[],[],[],[]]
输出：
[null,1,1,1,1,0]
解释：
Solution solution = new Solution([1, 3]);
// 返回 1，返回下标 1，返回该下标概率为 3/4 
solution.pickIndex();
// 返回 1
solution.pickIndex();
// 返回 1
solution.pickIndex();
// 返回 1
solution.pickIndex();
// 返回 0，返回下标 0，返回该下标概率为 1/4 
solution.pickIndex();

// 由于这是一个随机问题，允许多个答案
// 因此下列输出都可以被认为是正确的:
[null,1,1,1,1,0]
[null,1,1,1,1,1]
[null,1,1,1,0,0]
[null,1,1,1,0,1]
[null,1,0,1,0,0]
......
```
  
</details>

### 具体实现

**思路：**
1. 使用权重数组构造对应的前缀和数组
2. 生成一个取值范围在前缀和数组之内的随机数，使用二分搜索寻找到大于等于这个随机数的最小元素的索引
3. 将上一步的索引**减一**(前缀和数组位置偏移)即可得到最终结果

```ts
class Solution {
  private sumArr: number[] = [0];
  private len: number = 0;
  private max: number = 0;
  constructor(w: number[]) {
    w.forEach((v, i) => {
      this.sumArr[i + 1] = this.sumArr[i] + v;
    });
    this.len = this.sumArr.length;
    this.max = this.sumArr[this.len - 1];
  }

  pickIndex(): number {
    let randNum = Math.floor(Math.random() * this.sumArr[this.len - 1]);
    randNum = randNum + 1 <=  this.max ? randNum + 1 : this.max;
    return this.findLeft(randNum) - 1;
  }

  findLeft(target: number): number {
    let left = 0;
    let right = this.len - 1;

    while (left <= right) {
      // 防止整型数值溢出
      let mid = left + Math.floor((right - left) / 2);
      const temp = this.sumArr[mid];
      if (temp >= target) {
        right = mid - 1;
      } else if (temp < target) {
        left = mid + 1;
      }
    }
    return left;
  }
}
```
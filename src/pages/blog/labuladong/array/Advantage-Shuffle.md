---
title: 算法中的田忌赛马
description: 算法中的田忌赛马
date: 2022-05-07 19:40:00
image: /img/algorithm.webp
---

[[toc]]

## 优势洗牌

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-870. 优势洗牌](https://leetcode-cn.com/problems/advantage-shuffle/)

给定两个长度相等的数组 nums1 和 nums2，nums1 相对于 nums2 的*优势*可以用**满足 nums1[i] > nums2[i] 的索引 i 的数目**来描述

返回 nums1 的**任意排列**，使得其**优势最大化**

**提示：**
- nums1.length === nums2.length ∈ [1, 1e5]
- nums1[i] ∈ [0, 1e9]
- nums2[i] ∈ [0, 1e9]

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
      const nums1 = [2, 7, 11, 15];
      const nums2 = [1, 10, 4, 11];
      const res = [2, 11, 7, 15];
      expect(advantageCount(nums1, nums2)).toEqual(res);
    });

    it('2', () => {
      const nums1 = [12, 24, 8, 32];
      const nums2 = [13, 25, 32, 11];
      const res = [24, 32, 8, 12];
      expect(advantageCount(nums1, nums2)).toEqual(res);
    });

    it('3. 元素重复', () => {
      const nums1 = [2, 0, 4, 1, 2];
      const nums2 = [1, 3, 0, 0, 2];
      // 此处可能存在多个答案，合理即可
      const res = [2, 4, 2, 1, 0];
      expect(advantageCount(nums1, nums2)).toEqual(res);
    })
  });
  ```
</details>

### 具体实现

**以下等对上等，以上等对中等，以中等对下等**

```ts
function advantageCount(nums1: number[], nums2: number[]): any {
  const resArr: number[] = [];
  nums1.sort((a, b) => b - a);
  // 以二维数组存储原始索引，防止重复元素对结果的影响
  const temp = nums2.map((v, i) => [i, v]).sort((a, b) => b[1] - a[1]);

  let left = 0, right = nums1.length - 1;

  temp.forEach(([origin_index, v]) => {
    // 打得过就打，打不过就以最小的换最大的
    if (nums1[left] > v) {
      resArr[origin_index] = nums1[left];
      left++;
    } else {
      resArr[origin_index] = nums1[right];
      right--;
    }
  });
  return resArr;
}
```
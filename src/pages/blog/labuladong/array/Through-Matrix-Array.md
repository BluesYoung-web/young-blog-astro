---
title: 花式遍历二维数组
description: 花式遍历二维数组
date: 2022-04-26 10:30:00
image: /img/algorithm.webp
---

[[toc]]

## 旋转图像

### 题目描述

[<cib-leetcode /> 力扣原题-48. 旋转图像](https://leetcode-cn.com/problems/rotate-image/)

给定一个 `n * n` 的二维矩阵 `matrix` 表示一个图像，请**将图像顺时针旋转 90°(原地旋转，不得使用额外的矩阵空间)**

**提示：**
- n ∈ [1, 20]
- matrix[i][j] ∈ [-1000, 1000]

### TDD

<n-collapse>
  <n-collapse-item name="1">
    <template #header>
      <vscode-icons-file-type-testts />
      <span class="ml-1">测试代码</span>
    </template>

```ts
import { describe, expect, it } from 'vitest'

describe('旋转图像', () => {
  it('1', () => {
    const before = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    const after = [
      [7, 4, 1],
      [8, 5, 2],
      [9, 6, 3]
    ];
    expect(rotate(before)).toEqual(after);
  });

  it('2', () => {
    const before = [
      [5, 1, 9, 11],
      [2, 4, 8, 10],
      [13, 3, 6, 7],
      [15, 14, 12, 16]
    ];
    const after = [
      [15, 13, 2, 5],
      [14, 3, 4, 1],
      [12, 6, 8, 9],
      [16, 7, 10, 11]
    ];
    expect(rotate(before)).toEqual(after);
  });
});
```
  </n-collapse-item>
</n-collapse>

### 具体实现

```ts
/**
思路：
  先将数组沿着 左上到右下 的对角线折叠
  然后反转每一行即可(逆时针旋转 沿 右上到左下)
  1, 2, 3
  4, 5, 6
  7, 8, 9
  ===>
  1, 4, 7 
  2, 5, 8
  3, 6, 9
  ===>
  7, 4, 1
  8, 5, 2
  9, 6, 3
*/
function rotate(arr: number[][]): void {
  const len = arr.length;
  // 沿对角线翻转
  for (let i = 0; i < len; i++) {
    for (let j = i; j < len; j++) {
      [arr[i][j], arr[j][i]] = [arr[j][i], arr[i][j]];
    }
  }
  // 翻转每一行
  for (const line of arr) {
    let i = 0, j = len -1;
    while (j > i) {
      [line[i], line[j]] = [line[j], line[i]];
      i++;
      j--;
    }
  }
}
```

## 螺旋矩阵

### 题目描述

[<cib-leetcode /> 力扣原题-54. 螺旋矩阵](https://leetcode-cn.com/problems/spiral-matrix/)

给定一个 `m * n` 的二维矩阵 `matrix`，请**按顺时针螺旋顺序(右→下→左→上→右...)，返回矩阵中所有的元素**

**提示：**
- m = matrix.length, n = matrix[i].length
- m ∈ [1, 10]
- n ∈ [1, 10]
- matrix[i][j] ∈ [-100, 100]

### TDD

<n-collapse>
  <n-collapse-item name="1">
    <template #header>
      <vscode-icons-file-type-testts />
      <span class="ml-1">测试代码</span>
    </template>

```ts
import { describe, expect, it } from 'vitest'

describe('螺旋矩阵', () => {
  it('1', () => {
    const before = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    const after = [1, 2, 3, 6, 9, 8, 7, 4, 5];
    expect(spiralOrder(before)).toEqual(after);
  });

  it('2', () => {
    const before = [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12]
    ];
    const after = [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7];
    expect(spiralOrder(before)).toEqual(after);
  });
});
```
  </n-collapse-item>
</n-collapse>

### 具体实现

```ts
function spiralOrder(matrix: number[][]): number[] {
  let m = matrix.length;
  let n = matrix[0].length;

  // 上下左右的边界
  let up = 0, down = m - 1;
  let left = 0, right = n - 1;

  const res: number[] = [];
  // 将矩阵中所有元素的个数作为判断结束的条件
  while (res.length < m * n) {
    if (up <= down) {
      // 左 → 右
      for (let i = left; i <= right; i++) {
        res.push(matrix[up][i]);
      }
      // 修改上边界
      up++;
    }
    if (left <= right) {
      // 上 → 下
      for (let i = up; i <= down; i++) {
        res.push(matrix[i][right]);
      }
      // 修改右边界
      right--;
    }
    if (up <= down) {
      // 右 → 左
      for (let i = right; i >= left; i--) {
        res.push(matrix[down][i]);
      }
      // 修改下边界
      down--;
    }
    if (left <= right) {
      // 下 → 上
      for (let i = down; i >= up; i--) {
        res.push(matrix[i][left]);
      }
      // 修改左边界
      left++;
    }
  }
  return res;
}
```

## 螺旋矩阵 II

### 题目描述

[<cib-leetcode /> 力扣原题-59. 螺旋矩阵 II](https://leetcode-cn.com/problems/spiral-matrix-ii/)

给定一个正整数 `n`，生成一个从 `1` 到 `n`<sup>2</sup> 所有的元素，且元素按顺时针螺旋排列的 `n * n` 正方形矩阵 `matrix`

**提示：**
- n ∈ [1, 20]

### TDD

<n-collapse>
  <n-collapse-item name="1">
    <template #header>
      <vscode-icons-file-type-testts />
      <span class="ml-1">测试代码</span>
    </template>

```ts
import { describe, expect, it } from 'vitest'

describe('螺旋矩阵 II', () => {
  it('1', () => {
    const res = [
      [1, 2, 3],
      [8, 9, 4],
      [7, 6, 5]
    ];
    expect(generateMatrix(3)).toEqual(res);
  });

  it('2', () => {
    const res = [
      [1, 2],
      [4, 3]
    ];
    expect(generateMatrix(2)).toEqual(res);
  });
  
  it('3', () => {
    const res = [
      [1]
    ];
    expect(generateMatrix(1)).toEqual(res);
  });
});
```
  </n-collapse-item>
</n-collapse>

### 具体实现

```ts
// 将上面的取值操作替换成赋值操作即可
function generateMatrix(n: number): number[][] {
  // 初始化结果数组
  const res = new Array(n);
  for (let i = 0; i < n; i++) {
    res[i] = new Array(n).fill(0);
  }

  let num = 1;

  // 上下左右的边界
  let up = 0, down = n - 1;
  let left = 0, right = n - 1;

  // 将最终值作为判断结束的条件
  while (num <= n * n) {
    if (up <= down) {
      // 左 → 右
      for (let i = left; i <= right; i++) {
        res[up][i] = num;
        num++;
      }
      // 修改上边界
      up++;
    }
    if (left <= right) {
      // 上 → 下
      for (let i = up; i <= down; i++) {
        res[i][right] = num;
        num++;
      }
      // 修改右边界
      right--;
    }
    if (up <= down) {
      // 右 → 左
      for (let i = right; i >= left; i--) {
        res[down][i] = num;
        num++;
      }
      // 修改下边界
      down--;
    }
    if (left <= right) {
      // 下 → 上
      for (let i = down; i >= up; i--) {
        res[i][left] = num;
        num++;
      }
      // 修改左边界
      left++;
    }
  }
  return res;
}
```
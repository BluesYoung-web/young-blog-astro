---
title: 左右指针算法
description: 左右指针算法
date: 2022-03-24 14:29:58
---

[[toc]]

## 核心思想

<n-alert type="info">**两个指针相向而行，一头一尾**</n-alert>

## 题目

### 二分查找

> 给定一个无重复元素且按升序排序的整数数组和一个整数，返回整数在数组中的索引，若不存在则返回 -1

<n-collapse>
  <n-collapse-item name="1">
    <template #header>
      <vscode-icons-file-type-testts />
      <span class="ml-1">测试代码</span>
    </template>

```ts
describe('左右指针——二分查找', () => {
  it('空数组', () => {
    expect(findIndex([], 1)).toBe(-1);
  });

  it('奇数长度的数组', () => {
    expect(findIndex([1, 2, 5, 8, 10], 10)).toBe(4);
  });

  it('偶数长度的数组', () => {
    expect(findIndex([1, 2, 5, 8, 10, 11, 19, 33, 99, 108], 33)).toBe(7);
  });
});
```
  </n-collapse-item>
</n-collapse>

**具体实现：**

```ts
const findIndex = (arr: number[], n: number) => {
  const len = arr.length;
  if (len === 0) {
    return -1;
  } else if (len === 1) {
    return arr[0] === n ? 0 : -1;
  } else {
    let left = 0;
    let right = len - 1;
    while (left <= right) {
      // 防止大数溢出
      let mid = left + Math.ceil((right - left) / 2);
      if (arr[mid] === n) {
        return mid;
      } else if (arr[mid] > n) {
        right = mid - 1;
      } else if (arr[mid] < n) {
        left = mid + 1;
      }
    }
    return -1;
  }
};
```

### 两数之和

- 给定一个**下标从 1 开始的数组 numbers**，该数组为**非降序排列**，请你从数组中找出满足相加之和等于目标数 target 的两个数

- 如果设这两个数分别是 `numbers[index1]` 和 `numbers[index2]`，则 `1 <= index1 < index2 <= numbers.length`

- 以长度为 2 的整数数组 `[index1, index2]` 的形式返回这两个整数的下标 `index1` 和 `index2`

- 你可以**假设每个输入只对应唯一的答案** ，而且你**不可以重复使用相同的元素**。你所设计的解决方案必须**只使用常量级的额外空间**。

[<cib-leetcode /> 力扣原题-167](https://leetcode-cn.com/problems/two-sum-ii-input-array-is-sorted/)

<n-collapse>
  <n-collapse-item name="1">
    <template #header>
      <vscode-icons-file-type-testts />
      <span class="ml-1">测试代码</span>
    </template>

```ts
describe('左右指针——两数之和', () => {
  it('特殊情况', () => {
    expect(twoSum([], 1)).toEqual([-1, -1]);
    expect(twoSum([1], 1)).toEqual([-1, -1]);
  });

  it('其他情况', () => {
    expect(twoSum([1, 2, 5, 8, 10], 10)).toEqual([2, 4]);
    expect(twoSum([1, 2, 5, 8, 10], 9)).toEqual([1, 4]);
    expect(twoSum([1, 2, 5, 8, 10], 8)).toEqual([-1, -1]);
    expect(twoSum([1, 2, 5, 8, 10], 7)).toEqual([2, 3]);
    expect(twoSum([1, 2, 5, 8, 10], 6)).toEqual([1, 3]);
    expect(twoSum([1, 2, 5, 8, 10], 5)).toEqual([-1, -1]);
    expect(twoSum([1, 2, 5, 8, 10], 4)).toEqual([-1, -1]);
    expect(twoSum([1, 2, 5, 8, 10], 3)).toEqual([1, 2]);
    expect(twoSum([1, 2, 5, 8, 10], 2)).toEqual([-1, -1]);
    expect(twoSum([1, 2, 5, 8, 10], 1)).toEqual([-1, -1]);
    expect(twoSum([1, 2, 5, 8, 10], 0)).toEqual([-1, -1]);
  });

  it('官方示例', () => {
    expect(twoSum([2, 7, 11, 15], 9)).toEqual([1, 2]);
    expect(twoSum([2, 3, 4], 6)).toEqual([1, 3]);
    expect(twoSum([-1, 0], -1)).toEqual([1, 2]);
  });
});
```
  </n-collapse-item>
</n-collapse>

**具体实现：**

```ts
const twoSum = (arr: number[], n: number) => {
  const len = arr.length;
  if (len <= 1) {
    return [-1, -1];
  } else {
    let left = 0;
    let right = len - 1;
    while (left < right) {
      let res = arr[left] + arr[right];
      if (res === n) {
        return [left + 1, right + 1];
      } else if (res > n) {
        right--;
      } else {
        left++;
      }
    }
    return [-1, -1];
  }
}
```

### 反转字符串(数组)

- 编写一个函数，其作用是将输入的字符串反转过来。**输入字符串以字符数组 s 的形式给出**

- **不要给另外的数组分配额外的空间，你必须原地修改输入数组、使用 O(1) 的额外空间解决这一问题**

[<cib-leetcode /> 力扣原题-344](https://leetcode-cn.com/problems/reverse-string/)

<n-collapse>
  <n-collapse-item name="1">
    <template #header>
      <vscode-icons-file-type-testts />
      <span class="ml-1">测试代码</span>
    </template>

```ts
describe('左右指针——两数之和', () => {
  it('特殊情况', () => {
    const arr1 = [];
    const arr2 = ['1'];
    
    reverseString(arr1);
    expect(arr1).toEqual([]);
    reverseString(arr2);
    expect(arr2).toEqual(['1']);

  });

  it('官方示例', () => {
    const arr1 = ['h','e','l','l','o'];
    const arr2 = ['H','a','n','n','a','h'];

    reverseString(arr1);
    expect(arr1).toEqual(['o','l','l','e','h']);

    reverseString(arr2);
    expect(arr2).toEqual(['h','a','n','n','a','H']);
  });
});
```
  </n-collapse-item>
</n-collapse>

**具体实现：**

```ts
const reverseString = (arr: string[]) => {
  const len = arr.length;
  if (len <= 1) {
    return;
  } else {
    let left = 0;
    let right = len - 1;
    while (left <= right) {
      [arr[left++], arr[right--]] = [arr[right], arr[left]];
    }
    return;
  }
}
```

### 最长回文子串

> 给你一个字符串 s，找到 s 中最长的回文子串

[<cib-leetcode /> 力扣原题-5](https://leetcode-cn.com/problems/longest-palindromic-substring/)

<n-collapse>
  <n-collapse-item name="1">
    <template #header>
      <vscode-icons-file-type-testts />
      <span class="ml-1">测试代码</span>
    </template>

```ts
describe('左右指针——最长回文子串', () => {

  it('官方示例', () => {
    const res = longestPalindrome('babad');
    expect(['bab', 'aba']).contains(res);

    expect(longestPalindrome('cbbd')).toBe('bb');
  });
});

```
  </n-collapse-item>
</n-collapse>

**具体实现：**

```ts
/**
 * 寻找对应元素为中心的回文字符串
 */
const findPalindrome = (s: string, left: number, right: number) => {
  while (
    left >= 0
    &&
    right < s.length
    &&
    s[left] === s[right]
  ) {
    left--;
    right++;
  }
  // 左闭右开切割，所以左边要 + 1
  return s.substring(left + 1, right);
};

const longestPalindrome = (s: string) => {
  let res = '';
  for (let i = 0; i < s.length; i++) {
    // 计算以 s[i] 为中心的最长回文字符串
    const s1 = findPalindrome(s, i, i);
    // 计算以 s[i] 和 s[i + 1] 为中心的最长回文字符串
    const s2 = findPalindrome(s, i, i + 1);

    res = res.length > s1.length
      ? res.length > s2.length
        ? res
        : s2
      : s1.length > s2.length
        ? s1
        : s2;
  }
  return res;
};
```
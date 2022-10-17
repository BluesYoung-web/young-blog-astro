---
title: 快慢指针算法
description: 快慢指针算法
date: 2022-03-23 16:29:58
---

[[toc]]

## 核心思想

<n-alert type="info">**两个指针同向而行，一快一慢**</n-alert>

## 题目

### 删除排序数组中的重复项

> 给定一个**排序数组**，你需要在 **原地删除(空间复杂度O(1))** 重复出现的元素，使得每个元素只出现一次，**返回移除重复元素后的数组的新长度**

[<div class="i-cib-leetcode"></div> 力扣原题-26](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array/submissions/)

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
import { describe, it, expect } from 'vitest';
import { removeDuplicates } from '../pointer1';
describe('快慢指针', () => {
  it('空数组', () => {
    expect(removeDuplicates([])).toBe(0);
  });

  it('数组1', () => {
    const arr = [1, 1, 2];
    const res = removeDuplicates(arr);

    expect(arr).toEqual([1, 2]);
    expect(res).toBe(2);
  });

  it('数组2', () => {
    const arr = [1, 1, 2, 3, 4, 4, 4, 5, 6, 7, 8, 9, 9, 9, 9, 9];
    const res = removeDuplicates(arr);
    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(res).toEqual(9);
  });
});
```
  
</details>

**具体实现：**

```ts
export const removeDuplicates = (arr: number[]) => {
  let fast = 0;
  let slow = 0;

  const len = arr.length;
  // 空数组直接返回
  if (len === 0) {
    return 0;
  }
  while (fast < len) {
    if (arr[fast] !== arr[slow]) {
      // 当快指针对应的值与慢支针不相等时，就相当于没有重复的元素
      slow++;
      // 保证 arr[0...slow] 之间没有重复的
      arr[slow] = arr[fast];
    }
    // 快指针遍历每一个元素
    fast++;
  }
  arr.length = slow + 1;
  return slow + 1;
};
```

### 删除排序单向链表中的重复项

> 给定一个**排序链表**，你需要在 **原地删除(空间复杂度O(1))** 重复出现的元素，使得每个元素只出现一次，**返回移除重复元素之后的链表**

[<div class="i-cib-leetcode"></div> 力扣原题-83](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-list/submissions/)

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
import { describe, it, expect } from 'vitest';
import { removeDupList } from '../pointer1';
import type { ListNode } from '../pointer1';
describe('快慢指针', () => {
  it('空链表', () => {
    const node: ListNode = {
      val: 1,
      next: null,
    };
    expect(removeDupList(null)).toEqual(null);
    expect(removeDupList(node)).toEqual({ val: 1, next: null });
  });

  it('链表1', () => {
    const node: ListNode = {
      val: 1,
      next: {
        val: 1,
        next: {
          val: 2,
          next: {
            val: 2,
            next: {
              val: 3,
              next: null,
            },
          },
        },
      },
    };
    expect(removeDupList(node)).toEqual({
      val: 1,
      next: {
        val: 2,
        next: {
          val: 3,
          next: null,
        },
      },
    });
  });
});
```
  
</details>

**具体实现：**

```ts
export type ListNode = {
  val: any;
  next: ListNode | null;
};
/**
 * 删除有序的单向链表
 */
export const removeDupList = (node: ListNode | null) => {
  if (node === null) {
    return null;
  }

  let slow = node;
  let fast = node;

  while (fast !== null) {
    if (fast.val !== slow.val) {
      // 当前元素的值与下一个元素的值不相等，修改链表关系
      slow.next = fast;
      // 慢支针前进
      slow = slow.next;
    }
    // 快指针前进
    fast = fast.next;
  }
  // 断开与后面重复元素的连接
  slow.next = null;
  return node;
};
```

### 原地删除数组中的某些重复项

[<div class="i-cib-leetcode"></div> 力扣原题-27](https://leetcode-cn.com/problems/remove-element/submissions/)

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
describe('原地删除数组的重复项', () => {
  it('1', () => {
    const arr = [3, 2, 2, 3];
    const v = 3;

    const res = removeElement(arr, v);
    expect(arr).toEqual([2, 2]);
    expect(res).toBe(2);
  });

  it('2', () => {
    const arr = [0, 1, 2, 2, 3, 0, 4, 2];
    const v = 2;

    const res = removeElement(arr, v);
    expect(arr).toEqual([0, 1, 3, 0, 4]);
    expect(res).toBe(5);
  });
});
```
  
</details>

**具体实现：**

```ts
export const removeElement = (nums: number[], val: number) => {
  let fast = 0;
  let slow = 0;
  const len = nums.length;
  if (len === 0) {
    return 0;
  }

  while (fast < len) {
    if (nums[fast] !== val) {
      nums[slow] = nums[fast];
      // slow 后加一，所以 slow 的值即为数组的长度
      slow++;
    }
      fast++;

  }
  nums.length = slow;
  return slow;
};
```

### 移动数组中的 0 至尾部

[<div class="i-cib-leetcode"></div> 力扣原题-283](https://leetcode-cn.com/problems/remove-element/submissions/)

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
describe('移动 0 至数组尾部', () => {
  it('0', () => {
    const arr = [0];
    moveZeroes(arr);
    expect(arr).toEqual([0])
  });

  it('1', () => {
    const arr = [0, 1, 2, 3, 0, 4, 0, 5];
    moveZeroes(arr);
    expect(arr).toEqual([1, 2, 3, 4, 5, 0, 0, 0])
  });

  it('2', () => {
    const arr = [0, 1, 0, 3, 12];
    moveZeroes(arr);
    expect(arr).toEqual([1, 3, 12, 0, 0]);
  });
});
```
  
</details>

**具体实现：**

```ts
export const moveZeroes = (nums: number[]) => {
  const len = nums.length;
  if (len <=1) {
    return;
  }

  // 相当于删除所有 0 之后，再在尾部填充 0 直至初始长度
  let slow = 0;
  let fast = 0;
  while (fast < len) {
    if (nums[fast] !== 0) {
      nums[slow] = nums[fast];
      slow++;
    }
    fast++;
  }
  // 剩余元素全部置零
  for (; slow < len; slow++) {
    nums[slow] = 0;
  }
};
```

### 最小覆盖子串

<n-alert type="info">**快慢指针 + 滑动窗口**</n-alert>

<n-tag type="error"> hard </n-tag>

[<div class="i-cib-leetcode"></div> 力扣原题-76](https://leetcode-cn.com/problems/minimum-window-substring/submissions/)

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
describe('最小子串', () => {
  it('0', () => {
    const s = 'a';
    const t = 'aa';
    const res = minWindow(s, t);
    expect(res).toBe('');
  });

  it('1', () => {
    const s = 'a';
    const t = 'a';
    const res = minWindow(s, t);
    expect(res).toBe('a');
  });

  it('2', () => {
    const s = 'ADOBECODEBANC';
    const t = 'ABC';
    const res = minWindow(s, t);
    expect(res).toBe('BANC');
  });

  it('3. 容易忽略的右边窗口收缩', () => {
    const s = 'cabefgecdaecf';
    const t = 'cae';
    const res = minWindow(s, t);
    expect(res).toBe('aec');
  });

  it('4. substring 切割为左闭右开，需要 + 1，否则切不到最后一位字符', () => {
    const s = 'bdab';
    const t = 'ab';
    const res = minWindow(s, t);
    expect(res).toBe('ab');
  });

  it('5. 赋值之前进行长度判断', () => {
    const s = 'cabwefgewcwaefgcf';
    const t = 'cae';
    const res = minWindow(s, t);
    expect(res).toBe('cwae');
  });
  // 测试数据 5k
  it('6. 超时，左边窗口收缩至不满足条件之后，继续扩张右边窗口，无需重复操作', async () => {
    const { src, target, sub } = await import('./data6.json');
    const res = minWindow(src, target);
    expect(res).toBe(sub);
  });
  // 测试数据 120k
  it('7. 超时，循环的同时更新窗口内字符出现的次数，指数级减少运行时间', async () => {
    const { src, target, sub } = await import('./data7.json');

    const res = minWindow(src, target);
    expect(res).toBe(sub);
  });
});
```
  
</details>


**具体实现：**

```ts
function minWindow(s: string, t: string): string {
  let start = 0;
  let end = 0;
  let res = '';

  // 子串长度大于母串，必定无法匹配，直接返回空字符串
  if (t.length > s.length) {
    return res;
  } else if (s === t) {
    // 两字符串相同，直接返回
    return s;
  } else {
    // 子串长度小于
    const matchArr = t.split('');
    const subLen = matchArr.length;
    
    // 记录目标子串中各个字符出现的次数
    const targetMap = new Map<string, number>();
    for (const sub of t) {
      const count = targetMap.get(sub);
      if (count) {
        targetMap.set(sub, count + 1);
      } else {
        targetMap.set(sub, 1);
      }
    }

    // 记录窗口中个字符出现的次数
    const windowMap = new Map<string, number>();
    // 更新窗口 map
    const updateWindowMap = (char: string) => {
      const count = windowMap.get(char);
      if (count) {
        windowMap.set(char, count + 1);
      } else {
        windowMap.set(char, 1);
      }
    };

    // 判断是否匹配，以 map 替代数组操作，时间可缩短为 1/40
    const match = () => {
      for (const key of targetMap.keys()) {
        // 不存在对应的键，或者对应键出现的次数不足
        if (
          !windowMap.has(key)
          ||
          windowMap.get(key) < targetMap.get(key)
        ) {
          return false;
        }
      }
      return true;
    };
    if (subLen === 0) {
      // 子串为空，直接返回母串首元素
      return s[0];
    }

    while (end < s.length) {
      // 循环的同时更新窗口内字符出现的次数，指数级减少运行时间！！！
      updateWindowMap(s[end]);
      while (match()) {
        // 子串合法，继续收缩左边的窗口，同时移除对应的字符
        const char = s[start];
        const count = windowMap.get(char);
        windowMap.set(char, count - 1);
        start++;
        // 更新返回值
        const tp = s.slice(start - 1, end + 1);
        // 首次直接赋值
        if (!res) {
          res = tp;
        }
        res = tp.length < res.length ? tp : res;
      }
      end++;
    }
    return res;
  }
}
```

### 无重复最长子串

<n-alert type="info">**快慢指针 + 滑动窗口**</n-alert>

[<div class="i-cib-leetcode"></div> 力扣原题-3](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
describe('无重复最长子串', () => {

  it('官方示例', () => {
    expect(lengthOfLongestSubstring('abcabcbb')).toBe(3);
    expect(lengthOfLongestSubstring('bbbbb')).toBe(1);
    expect(lengthOfLongestSubstring('pwwkew')).toBe(3);
  });

  it('整个字符串全部无重复', () => {
    expect(lengthOfLongestSubstring('au')).toBe(2);
  });

  it('结尾', () => {
    expect(lengthOfLongestSubstring('aab')).toBe(2);
  });

  it('开头', () => {
    expect(lengthOfLongestSubstring('jbpnbwwd')).toBe(4);
  })
});
```
  
</details>

**具体实现：**

```ts
function lengthOfLongestSubstring(s: string): number {
  if (s.length <= 1) {
    return s.length;
  }
  let slow = 0;
  let fast = 0;
  let max = 0;

  const windowMap = new Map<string, number>();

  while(fast < s.length) {
    if (windowMap.has(s[fast])) {
      // 从第一个重复的字符之后，重新开始
      while (slow <= windowMap.get(s[fast])) {
        windowMap.delete(s[slow]);
        slow++;
      }
    }
    windowMap.set(s[fast], fast);
    max = Math.max(fast - slow + 1, max);
    fast++;
  }
  return max;
};
```
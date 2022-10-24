---
title: 剑指 Offer 10- I. 斐波那契数列
description: 剑指 Offer 10- I. 斐波那契数列
date: 2022-04-08 19:17:41
---

[[toc]]

## 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-剑指 Offer 10- I. 斐波那契数列](https://leetcode-cn.com/problems/reverse-string/)

写一个函数，输入 n ，**求斐波那契（Fibonacci）数列的第 n 项**（即 F(N)）。斐波那契数列的定义如下：

```js
F(0) = 0,   F(1) = 1
F(N) = F(N - 1) + F(N - 2), 其中 N > 1.
```

斐波那契数列由 0 和 1 开始，之后的斐波那契数就是由之前的两数相加而得出。

<span class="font-bold text-red-600">答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。</span>

## TDD

<details>
  <summary class="cursor-pointer">
    <div class="inline-flex">
      <div class="i-vscode-icons-file-type-testts mr-1"></div>
      <div>测试代码</div>
    </div>
  </summary>

```ts
describe('斐波那契', () => {
  it('base', () => {
    expect(fib(0)).toBe(0)
    expect(fib(1)).toBe(1)
    expect(fib(2)).toBe(1)
  });

  it('more', () => {
    expect(fib(3)).toBe(2)
    expect(fib(4)).toBe(3)
    expect(fib(5)).toBe(5)
    expect(fib(6)).toBe(8)
    expect(fib(7)).toBe(13)
    expect(fib(8)).toBe(21)
    expect(fib(9)).toBe(34)
    expect(fib(10)).toBe(55)
    expect(fib(11)).toBe(89)
    expect(fib(12)).toBe(144)
  });

  it('溢出取模', () => {
    expect(fib(45)).toBe(134903163)
    expect(fib(81)).toBe(107920472)
  });
});
```

</details>


## 具体实现

```ts
function fib(n: number): number {
  // 基础情况直接返回
  if (n === 0) {
    return 0;
  }
  if (n === 1 || n === 2) {
    return 1;
  }
  // 其他情况，递推
  let f1 = 0, f2 = 1;
  for (let i = 2; i < n + 1; i++) {
    // 计算过程中就要进行取模，防止溢出！！！
    [f1, f2] = [f2, (f1 + f2) % (1e9 + 7)]
  }
  return f2;
}
```
---
layout: "@/layouts/BlogPost.astro"
title: 35-递归函数与尾调用优化
image: /img/hbs.png
description: JavaScript 递归函数与尾调用优化
date: 2021-01-15 14:00:15
---

[[toc]]

## 递归函数

函数在函数体内部调用自身

### 基础写法

直接使用函数名自身调用

**如果直接将函数赋值给其他变量，就会出现问题**

```js
function fact(num) {
  if(num <= 1) {
    return 1;
  } else {
    return num * fact(num - 1);
  }
}
```

### 进阶写法

**严格模式下会报错**

```js
function fact(num) {
  if(num <= 1) {
    return 1;
  } else { 
    return num * arguments.callee(num - 1);
  }
}
```

### 终极写法

不受外界影响

```js
const fact = (function f(num) {
  if(num <= 1) {
    return 1;
  } else {
    return num * f(num - 1);
  }
});
```

### 优化

尾调用优化，尽可能节省栈帧的使用

```js
const fact = (function fn(a, b, n) {
  if(n === 0) {
    return a;
  }
  return fn(b, a + b, n - 1);
});
function fib(n) {
  return fact(0, 1, n);
}
```

## 尾调用优化

```js
function outFn() { return insFn(); }
```

### `ES6`之前

1. 执行到 `outFn` 函数体，第一个栈帧被推到栈上
2. 执行 `outFn` 函数体，到达 `return` 语句，计算返回值必须先计算 `insFn`
3. 执行到 `insFn` 函数体，第二个栈帧被推到栈上
4. 执行 `insFn` 函数体，计算其返回值
5. 将返回值传回 `outFn`， 然后 `outFn` 再返回值
6. 将栈帧弹出栈外

### `ES6`之后

1. 执行到 `outFn` 函数体，第一个栈帧被推到栈上
2. 执行 `outFn` 函数体，到达 `return` 语句，计算返回值必须先计算 `insFn`
3. 引擎发现把第一个栈帧弹出栈外也没问题，因为 `insFn` 的返回值也是 `outFn` 的返回值
4. 弹出 `outFn` 的栈帧
5. 执行到 `insFn` 函数体，栈帧被推到栈上
6. 执行 `insFn` 函数体，计算其返回值
7. 将 `insFn` 的栈帧弹出栈外

### 前后对比

之前每多调用一次嵌套函数，就会多增加一个栈帧

之后**无论调用多少次，只会消耗一个栈帧**

### 实现的条件

代码在**严格模式**下执行

**外部函数的返回值是对尾调用函数的调用**

**尾调用函数返回后不需要执行额外的逻辑**

尾调用函数**不是引用外部函数作用域中自由变量的闭包**

### 不符合优化条件

```js
"use strict";
// 无优化：尾调用没有返回
function outerFunction() {
  innerFunction();
}
// 无优化：尾调用没有直接返回
function outerFunction() {
  let innerFunctionResult = innerFunction();
  return innerFunctionResult;
}
// 无优化：尾调用返回后必须转型为字符串
function outerFunction() {
  return innerFunction().toString();
}
// 无优化：尾调用是一个闭包
function outerFunction() {
  let foo = 'bar';
  function innerFunction() { return foo; }
  return innerFunction();
} 
```

### 符合优化条件

```js
"use strict";
// 有优化：栈帧销毁前执行参数计算
function outerFunction(a, b) {
  return innerFunction(a + b);
}
// 有优化：初始返回值不涉及栈帧
function outerFunction(a, b) {
  if (a < b) {
    return a;
  }
  return innerFunction(a + b);
}
// 有优化：两个内部函数都在尾部
function outerFunction(condition) {
  return condition ? innerFunctionA() : innerFunctionB();
}
```
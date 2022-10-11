---
layout: "@/layouts/BlogPost.astro"
title: 10-函数
image: /img/hbs.png
description: JavaScript 函数
date: 2020-12-28 17:21:20
---

[[toc]]

## 基础

函数对于任何语言来说都是核心组件

它可以封装语句，然后在任何地方、任何时间执行

使用 `return` 关键字返回值，`return` 之后的代码不会执行

**函数名就是指向函数对象的指针**，而且不一定与函数本身紧密绑定

函数要么返回值，要么不返回值。只在某个条件下返回值的函数会带来麻烦，尤其是调试时

**不存在重载，后定义的会覆盖先定义的**

```js
function fn (a) {
  consloe.log(a);
  return ++a;
}
```

## 函数定义方式

### 函数声明

**存在提升**

```js
function sum(num1, num2) {
  return num1 + num2;
}
```

### 函数表达式

**不存在提升**

```js
const sum = function(num1, num2) {
  return num1 + num2;
};
```

### 使用构造函数

接受任意多个字符串，**最后一个参数会被当成函数体**

**不存在提升**

**影响性能，不推荐使用**

```js
const sum = new Function('num1', 'num2', 'return num1 + num2');
```



## 严格模式下的限制

不能以 `eval` 或 `arguments` 作为函数名称或者参数名称

两个命名的参数不能拥有同一个名称
---
layout: "@/layouts/BlogPost.astro"
title: 17-单体内置对象
image: /img/hbs.png
description: JavaScript 单体内置对象
date: 2020-12-28 17:31:47
---

[[toc]]

## Global

背锅侠

不属于任何其他对象的属性和方法最终都属于它

### 方法

`isNaN`

`isFinite`

`parseInt`

`parseFloat`

`encodeURI` 不会编码属于 `URL` 组件的特殊字符

`encodeURIComponent` 会编码它发现的所有非标准字符，常用于编码查询字符串

`decodeURI`

`decodeURIComponent`

`eval` 将字符串作为语句执行，无变量及函数提升，**不推荐使用**

`escape | unescape`，废弃，**不推荐使用**

### 属性

`undefined`

`NaN`

`Infinity`

`Object`

`Array`

`Function`

`Boolean`

`String`

`Number`

`Date`

`RegExp`

`Error`

`EvalError`

`RangeError`

`ReferenceError`

`SyntaxError`

`TypeError`

`URIError`

### 浏览器内的实现

## window

```js
var global = (function(){return this;})()
```

## Math

**`Math` 对象上提供的计算要比直接在 `JavaScript` 实现的快得多**，因为 `Math` 对象上的计算使用了 `JavaScript` 引擎中更高效的实现和处理器指令

但使用 `Math` 计算的问题是**精度会因浏览器、操作系统、指令集和硬件而异**

### 属性

`E === 2.71828...`

`LN10` ===> 10的自然对数

`LN2` ===> 2的自然对数

`LOG2E` ===> 以2为底`E`的对数

`LOG10E` ===> 以10为底`E`的对数

`PI` ===> `π`

`SQRT1_2` ===> 1/2开平方根

`SQRT2` ===> 2的平方跟

### 方法

`min(...args)`，取最小值

`max(...args)`，取最大值

`ceil(n)`，向上取整

`floor(n)`，向下取整

`round(n)`，四舍五入

`random()`，返回`(0,1)`之间的随机数

`abs(n)`，绝对值

`exp(n)`，E 的 n 次幂

`log()`，自然对数

`power(x, y)`，`x 的 y 次幂`

`sqrt(n)`，n 的平方根

`sin(n)`，正弦

`cos(n)`，余弦

`tan(n)`，正切

`asin()`，反正弦

`acos()`

`atan()`

`atan2(y, x)`，`y/x` 的反正切
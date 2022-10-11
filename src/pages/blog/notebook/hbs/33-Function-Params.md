---
layout: "@/layouts/BlogPost.astro"
title: 33-函数参数
image: /img/hbs.png
description: JavaScript 函数参数
date: 2021-01-14 15:02:38
---

[[toc]]

## 理解参数

`ECMAScript` 函数既不关心传入的参数个数，也不关心参数的数据类型

函数的参数在函数内部表现为一个数组

**除箭头函数之外，所有的函数内部都可以访问 `arguments` 对象**

### `arguments` 对象

类数组对象

只与**实际传入的参数**有关

`arguments[index]` 获取每一个参数(`index ∈ [0, n]`)

可以使用 `Array.from()`，扩展运算符等，将其转换为真正的数组

`arguments.length` 为参数的个数

`arguments.callee` 为函数体自身

`arguments.callee.caller` 调用该函数的函数，**全局环境返回 `null`**

`ECMAScript` 中的所有参数都按值传递的。不可能按引用传递参数。如果把对象作为参数传递，那么传递的值就是这个**对象的引用**

## 默认参数值

`(a = 1, b = 2, c = 3)`

传入 `undefined` 相当于不传，使用默认值

默认参数**不影响** `arguments` 对象

不仅限于原始值或者对象类型，也可以使用函数的返回值，**只有在函数调用时才会求值**

### 作用域与暂时性死区

参数拥有属于自己的**独立**作用域

参数按顺序**从左到右**初始化，**右边可以引用左边，左边不能引用右边**

## `...` 操作符

### 收集参数

函数定义时写在括号中，`...args`

函数体内部，`args instanceof Array`

**只能是最后一个参数**

### 扩展运算符

调用函数时，将数组或类数组对象自动分解为单个参数传入函数

可在任意位置使用，不影响 `arguments` 对象

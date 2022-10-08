---
title: 18-Object
image: /img/hbs.png
description: JavaScript 对象(Object)
date: 2020-12-29 09:15:00
---

## 概述

`ECMAScript`中最常用的类型之一

大多数引用值的实例都是 `Object`

很适合存储和在应用程序之间交换数据

## 创建方式

### 使用`new`操作符

```js
const person = new Object();
person.name = 'Blues';
person.age = 22;
```

### 使用对象字面量

属性名可以是数字或字符串，**数字属性名会自动转换为字符串**

在使用对象字面量创建对象时，**并不会实际调用 Object 构造函数**

```js
const person = {
  name: 'Blues',
  age: 22
};
```

## 使用

通过`.属性名`获取和操作对应的属性值，不能包含空格之类的特殊字符

`[属性名]`，作用同上，不过没有特殊字符的限制

---
title: 23-迭代器
image: /img/hbs.png
description: JavaScript 迭代器
date: 2021-01-05 09:49:07
---

[[toc]]

## 理解迭代

按照顺序反复多次执行一段程序，通常会**有明确的终止条件**

最简单的迭代——计数循环

因为数组有已知的长度，且数组每一项都可以通过索引获取，所以整个数组可以通过递增索引来遍历

劣势：
  - 迭代之前需要事先知道如何使用数据结构
  - 遍历顺序并不是数据结构固有的

`ES5` 新增了 `Array.prototype.forEach()` 方法，向通用迭代需求迈进了一步（但仍然不够理想）：
  - 解决了单独记录索引和通过数组对象取得值的问题，**但是没有办法标识迭代何时终止**
  - 因此这个方法**只适用于数组，而且回调结构也比较笨拙**

## 迭代器模式

可以把有些结构称为 “可迭代对象”（`iterable`），因为它们实现了正式的 `Iterable` 接口，而且可以通过迭代器 `Iterator` 消费

### 可迭代对象

一种抽象的说法，**包含有限数量的元素，且具有无歧义的遍历顺序**

### 可迭代协议(`Iterable` 接口)

支持迭代的自我识别能力和创建实现 `Iterator` 接口的对象的能力

必须暴露一个属性作为“默认迭代器”

键名必须为 `Symbol.iterator`

**这个属性必须引用一个迭代器工厂函数，调用这个工厂函数必须返回一个新的迭代器**

## 内置`Iterable`接口的数据类型

`String`

`Array`

`Map`

`Set`

`arguments`

`NodeList`...

## 接收可迭代对象的操作

for-of 循环

数组解构

扩展操作符

`Array.from()`

创建集合

创建映射

`Promise.all()` 接收由期约组成的可迭代对象

`Promise.race()` 接收由期约组成的可迭代对象

`yield*` 操作符，在生成器中使用

## 迭代器协议

迭代器是一种**一次性使用的对象**，用于迭代与其关联的可迭代对象

迭代器 `API ` **使用 `next()` 方法在可迭代对象中遍历数据**

每次成功调用 `next()`，都会返回一个 `IteratorResult` 对象，其中包含迭代器返回的下一个值

若不调用 `next()`，则无法知道迭代器的当前位置

`IteratorResult `包含两个属性：
  - `done` 是一个布尔值，表示是否还可以再次调用 `next()` 取得下一个值
  - `value` 包含可迭代对象的下一个值（`done` 为 `false`），或者 `undefined`（`done `为 `true`）。`done: true` 状态称为“耗尽”

**只要迭代器到达 `done: true` 状态， 后续调用 `next()` 就一直返回同样的值了**

```js
// 可迭代对象
let arr = ['foo', 'bar'];
// 迭代器工厂函数
console.log(arr[Symbol.iterator]); // f values() { [native code] }
// 迭代器
let iter = arr[Symbol.iterator]();
console.log(iter); // ArrayIterator {}
// 执行迭代
console.log(iter.next()); // { done: false, value: 'foo' }
console.log(iter.next()); // { done: false, value: 'bar' }
console.log(iter.next()); // { done: true, value: undefined } 
```

每个迭代器都表示对可迭代对象的**一次性**有序遍历

不同迭代器的实例**相互之间没有联系**，只会**独立**地遍历可迭代对象

```js
let arr = ['foo', 'bar'];
let iter1 = arr[Symbol.iterator]();
let iter2 = arr[Symbol.iterator]();
console.log(iter1.next()); // { done: false, value: 'foo' }
console.log(iter2.next()); // { done: false, value: 'foo' }
console.log(iter2.next()); // { done: false, value: 'bar' }
console.log(iter1.next()); // { done: false, value: 'bar' } 
```

迭代器并**不与可迭代对象某个时刻的快照绑定**，如果可迭代对象在迭代期间被修改了，那么迭代器也会反映相应的变化(**引用关系**)

```js
let arr = ['foo', 'baz'];
let iter = arr[Symbol.iterator]();
console.log(iter.next()); // { done: false, value: 'foo' }
// 在数组中间插入值
arr.splice(1, 0, 'bar');
console.log(iter.next()); // { done: false, value: 'bar' }
console.log(iter.next()); // { done: false, value: 'baz' }
console.log(iter.next()); // { done: true, value: undefined } 
```

## 自定义迭代器

```js
class Counter {
  constructor(limit) {
    this.limit = limit;
  }
  [Symbol.iterator]() {
    let count = 1, limit = this.limit;
    return {
      next() {
        if (count <= limit) {
          return { done: false, value: count++ };
        } else {
          return { done: true, value: undefined };
        }
      }
    };
  }
} 
```

## 提前终止迭代器

`break \ continue \ return \ throw \ 部分解构`

可选的 `return()` 方法用于指定在迭代器提前关闭时执行的逻辑

`return()` 方法必须返回一个有效的 `IteratorResult` 对象

简单情况下，可以只返回 `{ done: true }`

**数组**的**迭代器**不可关闭，无论是否添加 `return` 方法

```js
class Counter {
  constructor(limit) {
    this.limit = limit;
  }
  [Symbol.iterator]() {
    let count = 1, limit = this.limit;
    return {
      next() {
        if (count <= limit) {
          return { done: false, value: count++ };
        } else {
          return { done: true };
        }
      },
      return() {
        console.log('Exiting early');
        return { done: true };
      }
    };
  }
}
let counter1 = new Counter(5);
for (let i of counter1) {
  if (i > 2) {
    break;
  }
  console.log(i);
} 
// 1
// 2
// Exiting early 
//////////////------------//////////////////////////
let a = [1, 2, 3, 4, 5];
let iter = a[Symbol.iterator]();
for (let i of iter) {
  console.log(i);
  if (i > 2) {
    break;
  }
}
// 1
// 2
// 3
for (let i of iter) {
  console.log(i);
}
// 4
// 5 
```


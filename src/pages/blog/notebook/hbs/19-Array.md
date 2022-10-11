---
layout: "@/layouts/BlogPost.astro"
title: 19-Array
image: /img/hbs.png
description: JavaScript 数组
date: 2020-12-29 09:36:46
---

[[toc]]

## 概述

除 `Object` 之外最常用的数据类型

每一个槽位都可以存储任意类型的数据

数组的长度会随着数据添加而自动增长

## 创建

### 使用 `new` 操作符

`new` 操作符可省略，但不推荐

```js
// 创建一个长度为 20 的数组，初始值都为 undefined
const arr = new Array(20);
// 创建一个包含特定值的数组
const brr = new Array('blues', 'young');
```

### 使用字面量

```js
// 创建一个包含 3 个元素的数组
const color = ['red', 'blue', 'green'];
// 创建一个空数组
const names = [];
// 创建一个包含 2 个元素的数组
const values = [1, 2,];
```

## 静态方法

### `from(arrayLikeObj[, fn[, this]])`

`ES6` 新增

可以将类数组对象转化为数组
  - 将字符串拆分为单字符数组
  - 将`Set` `Map` (可迭代对象)转换为一个新数组
  - 对现有数组执行**浅拷贝**

```js
const arr =  {
  0: 1,
  1: 2,
  2: 3,
  3: 4,
  length: 4
};
const brr = Array.from(arr);
const crr = Array.from(arr, (item) => item ** 2);
// 箭头函数无 this
const drr = Array.from(arr, function (item) { return item ** this.p }, { p: 3 });

brr = [1, 2, 3, 4];
crr = [1, 4, 9, 16];
drr = [1, 8, 27, 64];
```

### `of(...args)`

`ES6` 新增，用于替代`Array.prototype.slice.call(...args)`

```js
Array.of(1, 2, 3, 4) => [1, 2, 3, 4]
```

## 数组空位

使用字面量创建数组时，可以使用一串逗号来创建空位

`ECMAScript`会将逗号之间相应索引位置的值当成空位

`ES6` 规范重新定义了该如何处理这些空位

**`ES6` 新增方法普遍将这些空位当成存在的元素，只不过值为 `undefined`**
  - `for-of`
  - `Array.from`
  - `Array.of`
  - `...`

**`ES6` 之前的方法则会忽略这个空位，但具体的行为也会因方法而异**
  - `map` 跳过空位置
  - `join` 将其当成空字符串

由于行为不一致和存在性能隐患，因此要避免使用数组空位。如果确实需要使用，建议显示填写 `undefined`

```js
console.log(options.map(() => 6)); // [6, undefined, undefined, undefined, 6]
console.log(options.join('-')); // "1----5"
```


## 数组索引

要获取或设置数组的值，需要使用中括号并提供相应值的数字索引

如果索引小于数组包含的元素数，则返回存储在相应位置的元素

如果索引超过数组长度，则返回 `undefined`，同时数组长度加一

数组中元素的数量保存于 `length` 属性之中，这个属性始终返回 0 或大于 0 的值

`length` 属性可读可写，修改其值可以从数组末尾删除或添加元素

**数组最多可以包含 **4 294 967 295** 个元素**

## 检测数组

正常情况下可以使用 `arr instanceof Array` 判断

但是如果拥有两个不同版本的 `Array`，上面的方法就不能准确判断了

**为了解决这个问题，`ECMAScript` 提供了 `Array.isArray()` 方法**

## 实例方法

### 迭代器方法

**在`ES6`中，`Array` 原型上暴露了 3 个用于检索数组的方法**
  - `keys` 返回数组索引的迭代器
  - `values` 返回数组元素的迭代器
  - `entries` 返回 **索引，值** 对的迭代器

```js
const a = ["foo", "bar", "baz", "qux"];
// 因为这些方法都返回迭代器，所以可以将它们的内容
// 通过 Array.from()直接转换为数组实例
const aKeys = Array.from(a.keys());
const aValues = Array.from(a.values());
const aEntries = Array.from(a.entries());
console.log(aKeys); // [0, 1, 2, 3]
console.log(aValues); // ["foo", "bar", "baz", "qux"]
console.log(aEntries); // [[0, "foo"], [1, "bar"], [2, "baz"], [3, "qux"]] 
```

### 填充方法与复制方法

**`arr.fill(val, start = 0, end = arr.length)`**
  - 使用 `val` 填充整个数组
  - 可选填充起止索引，`[start, end)`
  - 以下情况会被忽略：
    - 超出数组边界
    - 零长度
    - `start > end`

```js
const zeroes = [0, 0, 0, 0, 0];
// 用 5 填充整个数组
zeroes.fill(5);
console.log(zeroes); // [5, 5, 5, 5, 5]
zeroes.fill(0); // 重置
// 用 6 填充索引大于等于 3 的元素
zeroes.fill(6, 3);
console.log(zeroes); // [0, 0, 0, 6, 6]
zeroes.fill(0); // 重置
// 用 7 填充索引大于等于 1 且小于 3 的元素
zeroes.fill(7, 1, 3);
console.log(zeroes); // [0, 7, 7, 0, 0];
zeroes.fill(0); // 重置
// 用 8 填充索引大于等于 1 且小于 4 的元素
// (-4 + zeroes.length = 1)
// (-1 + zeroes.length = 4)
zeroes.fill(8, -4, -1);
console.log(zeroes); // [0, 8, 8, 8, 0]; 

// 索引过低，忽略
zeroes.fill(1, -10, -6);
console.log(zeroes); // [0, 0, 0, 0, 0]
// 索引过高，忽略
zeroes.fill(1, 10, 15);
console.log(zeroes); // [0, 0, 0, 0, 0]
// 索引反向，忽略
zeroes.fill(2, 4, 2);
console.log(zeroes); // [0, 0, 0, 0, 0]
// 索引部分可用，填充可用部分
zeroes.fill(4, 3, 10)
console.log(zeroes); // [0, 0, 0, 4, 4] 
```

**`arr.copyWith(target, start = 0, end = arr.length)`**
  - 将`target` 索引位置开始的元素替换为 `[start, end)`之间的元素
  - 后两个参数的规则同上

```js
let ints;
const reset = () => ints = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
reset();
// 从 ints 中复制索引 0 开始的内容，插入到索引 5 开始的位置
// 在源索引或目标索引到达数组边界时停止
ints.copyWithin(5);
console.log(ints); // [0, 1, 2, 3, 4, 0, 1, 2, 3, 4]
reset();
// 从 ints 中复制索引 5 开始的内容，插入到索引 0 开始的位置
ints.copyWithin(0, 5);
console.log(ints); // [5, 6, 7, 8, 9, 5, 6, 7, 8, 9] 
reset();
// 从 ints 中复制索引 0 开始到索引 3 结束的内容
// 插入到索引 4 开始的位置
ints.copyWithin(4, 0, 3);
console.log(ints); // [0, 1, 2, 3, 0, 1, 2, 7, 8, 9]
reset();
// JavaScript 引擎在插值前会完整复制范围内的值
// 因此复制期间不存在重写的风险
ints.copyWithin(2, 0, 6);
console.log(ints); // [0, 1, 0, 1, 2, 3, 4, 5, 8, 9]
reset();
// 支持负索引值，与 fill()相对于数组末尾计算正向索引的过程是一样的
ints.copyWithin(-4, -7, -3);
console.log(ints); // [0, 1, 2, 3, 4, 5, 3, 4, 5, 6] 
reset();

// 索引过低，忽略
ints.copyWithin(1, -15, -12);
console.log(ints); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
reset()
// 索引过高，忽略
ints.copyWithin(1, 12, 15);
console.log(ints); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
reset();
// 索引反向，忽略
ints.copyWithin(2, 4, 2);
console.log(ints); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
reset();
// 索引部分可用，复制、填充可用部分
ints.copyWithin(4, 7, 10)
console.log(ints); // [0, 1, 2, 3, 7, 8, 9, 7, 8, 9]; 
```

### 转换方法

**`arr.valueOf()`**，返回数组本身

**`arr.toString()`**，返回由数组每个元素调用 `toString()` 方法返回的值以**逗号**拼接的字符串

**`arr.toLocaleString()`**，基本同上，但针对每个元素调用的是 `toLocaleString()`

**`arr.join(sep = ',')`**，返回将数组元素使用特定分隔符拼接的字符串

**如果数组中某一项是 null 或 undefined，则在 join()、toLocaleString()、toString() 和 valueOf() 返回的结果中会以空字符串表示**

### 栈方法

**`arr.push(...arg)`，接受任意数量的参数，并将它们添加到数组末尾，增加 `length` 的值，<span class="text-red-500">返回最新的数组长度</span>**

**`arr.pop()`，删除数组的最后一项，并减少 `length` 值，<span class="text-red-500">返回被删除的元素</span>**

### 队列方法

**`array.unshift(...arg)`，接受任意数量的参数，并将它们添加到数组头部，增加 `length` 值，<span class="text-red-500">返回最新的数组长度</span>**

**`arr.shift()`，删除数组的第一项，并减少 `length` 值，<span class="text-red-500">返回被删除的元素</span>**

### 排序方法

**`arr.reverse()`**，数组逆序，返回数组的引用，影响原数组

**`arr.sort(fn = (a, b) => a - b)`**
  - 排序高阶函数，默认**按字符升序**
  - 返回数组的引用，影响原数组
  - `1 => '>'` `0 => '='` `-1 => '<'`

### 操作方法

**`arr.concat(...args)`**
  - 执行流程：
    - 创建当前数组的副本
    - 将其参数添加到副本尾部(参数为数组的默认将其**拉平**, 调用其 `flat` 方法)
    - 返回新构建的数组
  - **深拷贝** `arr.concat()`
  - 要阻止 `flat` 操作，需要将对应的数组参数的 `Symbol.isConcatSpreadable` 属性显示设置为 `false`

**`arr.slice(start = 0, end = arr.length)`，返回 `[start, end)` 位置对应的所有元素组成的新数组**
  - **深拷贝** `arr.slice()`
  - 如果 slice()的参数有负值，那么就以数值长度加上这个负值的结果确定位置。比 如，在包含 5 个元素的数组上调用 slice(-2,-1)，就相当于调用 slice(3,4)。如果结 束位置小于开始位置，则返回空数组

**`arr.splice(start = 0, num = 0, ...insert = '')`**
  - `arr.splice(0, 2)` **删除**数组前两个元素，返回删除元素组成的数组，**影响原数组**
  - `arr.splice(0, 0, 1, 2) ===> arr = [1, 2].concat(arr)`，**插入元素**
  - `arr.splice(2, 1, 'blues')` 将数组索引为 2 的元素**替换**为 `'blues'`

### 搜索和位置方法

**`arr.indexOf(target, start = 0)`**
  - **严格相等搜索**
  - 从前往后搜索
  - 返回要查找元素在数组中的索引
  - 没找到返回 `-1`

**`arr.lastIndexOf(target, start = arr.length -1)`**
  - **严格相等搜索**
  - 从后往前搜索
  - 返回要查找元素在数组中的索引
  - 没找到返回 `-1`

**`arr.indexOf(target, start = 0)`**
  - **严格相等搜索**
  - **ES7新增**
  - 从前往后搜索
  - 返回布尔值

**`arr.find((el, index, arr) => cond, this)`**
  - **高阶函数搜索**
  - 返回第一个匹配的元素

**`arr.findIndex((el, index, arr) => cond, this)`**
  - **严格相等搜索**
  - 返回第一个匹配的元素的索引

*箭头函数无 this*

### 迭代方法

**`arr.every((el, index, arr) => cond, this)`**，对数组每一项都运行传入的函数，如果对每一项函数都返回 `true`，则这个方法返回 `true`

**`arr.filter((el, index, arr) => cond, this)`**，对数组每一项都运行传入的函数，函数返回 `true` 的项会组成数组之后返回

**`arr.forEach((el, index, arr) => cond, this)`**，对数组每一项都运行传入的函数，没有返回值

**`arr.map((el, index, arr) => cond, this)`**，对数组每一项都运行传入的函数，返回由每次函数调用的结果构成的数组

**`arr.some((el, index, arr) => cond, this)`**，对数组每一项都运行传入的函数，如果有一项函数返回 `true`，则这个方法返回 `true`

### 归并方法

**`arr.reduce((pre, cur, index, arr) => do sth, startValue)`**

```js
// 第一次执行归并函数时，prev 是 1，cur 是 2
// 第二次执行时，prev 是 3（1 + 2），cur 是 3（数组第三项）
// 如此递进，直到把所有项都遍历一次
let values = [1, 2, 3, 4, 5];
let sum1 = values.reduce((prev, cur, index, array) => prev + cur);
let sum2 = values.reduce((prev, cur, index, array) => prev + cur, 5);
alert(sum1); // 15 
alert(sum2); // 20
```

**`Array.prototype.reduceRight((pre, cur, index, arr) => do sth, startValue)`**，基本同上，只是从右到左
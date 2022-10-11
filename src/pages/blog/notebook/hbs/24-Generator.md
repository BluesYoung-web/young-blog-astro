---
layout: "@/layouts/BlogPost.astro"
title: 24-生成器
image: /img/hbs.png
description: JavaScript 生成器
date: 2021-01-05 13:53:15
---

[[toc]]

## 概述

`ES6` 新增的一个极为灵活的结构

**拥有在一个函数块内暂停和恢复代码执行的能力**

使用生成器可以自定义**迭代器**和**实现协程**

## 声明

```js
// 生成器函数声明
function* generatorFn() {}
// 生成器函数表达式
let generatorFn = function* () {}
// 作为对象字面量方法的生成器函数
let foo = {
 * generatorFn() {}
}
// 作为类实例方法的生成器函数
class Foo {
 * generatorFn() {}
}
// 作为类静态方法的生成器函数
class Bar {
 static * generatorFn() {}
} 

// 等价的生成器函数：
function* generatorFnA() {}
function *generatorFnB() {}
function * generatorFnC() {}
// 等价的生成器方法：
class Foo {
 *generatorFnD() {}
 * generatorFnE() {}
} 
```

<n-alert title="箭头函数不能用来定义生成器函数" type="warning" />

## 执行

初次调用生成器函数会产生一个**生成器对象**

生成器对象一开始处于暂停执行的状态（`suspended`）

与迭代器相似，生成器对象也实现了 `Iterator` 接口，调用 `next()` 方法会让生成器开始或恢复执行

**函数体为空**的生成器函数中间不会停留，调用一次 `next()` 就会让生成器到达 `done: true` 状态

`value` 属性是生成器函数的返回值，默认值为 `undefined`，可以通过生成器函数的返回值指定

```js
function* generatorFn() {}
let generatorObject = generatorFn();
console.log(generatorObject); // generatorFn {<suspended>}
console.log(generatorObject.next()); // { done: true, value: undefined } 

function* generatorFn() {
 return 'foo';
}
let generatorObject = generatorFn();
console.log(generatorObject); // generatorFn {<suspended>}
console.log(generatorObject.next()); // { done: true, value: 'foo' } 
```

<n-alert title="生成器函数只会在初次调用 next() 方法后开始执行" type="info" />

```js
function* generatorFn() {
 console.log('foobar');
}
// 初次调用生成器函数并不会打印日志
let generatorObject = generatorFn();
generatorObject.next(); // foobar 
```

生成器对象实现了 `Iterable` 接口，它们默认的迭代器是**自引用**的

```js
const g = generatorFn();
console.log(g === g[Symbol.iterator]());
// true 
```

## `yield` 关键字

**只能存在于生成器函数内部**，其他地方会报错

生成器函数在遇到 `yeild` 关键字之前会正常执行，遇到之后执行会停止，**函数作用域的状态会被保留**

通过 `yeild` 返回的值会出现在 `next()` 方法返回的对象里面

`yeild -> done: false; return -> done: true`

```js
function* generatorFn() {
  yield 'foo';
  yield 'bar';
  return 'baz';
}
let generatorObject = generatorFn();
console.log(generatorObject.next()); // { done: false, value: 'foo' }
console.log(generatorObject.next()); // { done: false, value: 'bar' }
console.log(generatorObject.next()); // { done: true, value: 'baz' } 
console.log(generatorObject.next()); // { done: true, value: undefined } 
```

### 输入输出


<n-alert title="第一次调用 next() 传入的值不会被使用" type="info" />

```js
function* generatorFn(initial) {
  console.log(initial);
  console.log(yield);
  console.log(yield);
}
let generatorObject = generatorFn('foo');
generatorObject.next('bar'); // foo
generatorObject.next('baz'); // baz
generatorObject.next('qux'); // qux 
// -------------------------- //
function* generatorFn() {
  return yield 'foo';
}
let generatorObject = generatorFn();
console.log(generatorObject.next()); // { done: false, value: 'foo' }
console.log(generatorObject.next('bar')); // { done: true, value: 'bar' } 
```

### 用途

**无穷计数生成器**

```js
function* generatorFn() {
  for (let i = 0; ;++i) {
    yield i;
  }
}
let generatorObject = generatorFn();
console.log(generatorObject.next().value); // 0
console.log(generatorObject.next().value); // 1
console.log(generatorObject.next().value); // 2
console.log(generatorObject.next().value); // 3
console.log(generatorObject.next().value); // 4
console.log(generatorObject.next().value); // 5 
// ...
```

**范围生成器**

```js
function* range(start, end) {
  while(end > start) {
    yield start++;
  }
}
for (const x of range(4, 7)) {
  console.log(x);
}
// 4
// 5
// 6 
```

**填充数组**

```js
function* zeroes(n) {
  while(n--) {
    yield n;
  }
}
console.log(Array.from(zeroes(8))); // [7, 6, 5, 4, 3, 2, 1, 0]
```

### `yeild*`

能够**迭代一个可迭代对象**，从而一次产出一个值

```js
function* generatorFn() {
  for (const x of [1, 2, 3]) {
    yield x;
  }
  return 666;
}
// ========================== //
function* generatorFn() {
  yield* [1, 2, 3];
  
  return 666;
}

for (const x of generatorFn()) {
  console.log(x);
}
// 只有 yeild 语句返回的值才会在 for-of 里面输出
// for-of 循环等内置语言结构会忽略状态为 done: true 的 IteratorObject 内部返回的值
// 1\n2\n3\n
```

**作为默认迭代器**

```js
class Foo {
  constructor() {
    this.values = [1, 2, 3, 4, 5];
  }
  * [Symbol.iterator]() {
    yield* this.values;
  }
}
const f = new Foo();
for(const i of f) {
  console.log(i);
}
// 1\n2\n3\n4\n5\n
```

## 提前终止生成器

### `return()`

强制生成器进入关闭状态

传入的值就是终止迭代器对象的值

### `throw()`

会在暂停的时候将一个提供的错误注入到生成器对象中

如果错误**未被处理**，生成器就会关闭

假如生成器函数**内部处理**了这个错误，那么生成器就不会关闭，而且还可以恢复执行


<n-alert title="错误处理会跳过对应的 yield" type="info" />

<n-alert class="mt-5" title="如果生成器对象还没有开始执行，那么调用 throw() 抛出的错误不会在函数内部被捕获，因为这相当于在函数块外部抛出了错误" type="warning" />

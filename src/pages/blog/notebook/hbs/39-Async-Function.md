---
title: 39-异步函数
image: /img/hbs.png
description: JavaScript 异步函数
date: 2021-01-19 11:18:08
---

[[toc]]

## 异步函数

`async/await`

`ES8` 新增，`generator` 函数的语法糖

以同步的方式书写异步的操作

### `async`

声明一个函数为异步函数

如果内部没有 `await/yeild` 等关键字时，基本表现与普通函数相同

可用于函数声明、函数表达式、箭头函数、对象/类的方法等等

**返回值会被 Promise.resolve() 包装为期约对象**

```js
async function foo() {
  console.log(1);
  return 3;
}
// 给返回的期约添加一个解决处理程序
foo().then(console.log);
console.log(2); 
// 返回一个实现了 thenable 接口的非期约对象
async function baz() {
  const thenable = {
    then(callback) { callback('baz'); }
  };
  return thenable;
}
baz().then(console.log); // baz
// 在异步函数中抛出错误会返回拒绝的期约：
async function foo() {
  console.log(1);
  throw 3;
}
// 给返回的期约添加一个拒绝处理程序
foo().catch(console.log);
console.log(2); // 1 2 3
// 拒绝期约的错误不会被异步函数捕获：
async function foo() {
  console.log(1);
  Promise.reject(3);
}
foo().catch(console.log);
console.log(2); // 1 2 Uncaught (in promise): 3 
```

### `await`

可以**暂停**异步函数代码的执行，等待期约解决

会自动对后面的对象进行**解包**，如果不是期约对象，则会被当做已解决的期约

类似于一元操作符，可单独使用，也可在表达式中使用

即使 `await` 后面跟着一个立即可用的值，函数的其余部分也会被**异步求值**

```js
// 异步打印"bar"
async function bar() {
 	return await Promise.resolve('bar');
}
bar().then(console.log); // bar
// 1000 毫秒后异步打印"baz"
async function baz() {
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  console.log('baz');
}
baz(); // baz（1000 毫秒后）
// -----------------------
// 等待一个原始值
async function foo() {
 	console.log(await 'foo');
}
foo();  // foo
// 等待一个实现了 thenable 接口的非期约对象
async function baz() {
 const thenable = {
  then(callback) { callback('baz'); }
 };
 console.log(await thenable);
}
baz();  // baz 
// 等待会抛出错误的同步操作，会返回拒绝的期约：
async function foo() {
  console.log(1);
  await (() => { throw 3; })();
}
// 给返回的期约添加一个拒绝处理程序
foo().catch(console.log);
console.log(2); // 1 2 3
// 单独的 Promise.reject()不会被异步函数捕获，而会抛出未捕获错误
async function foo() {
  console.log(1);
  await Promise.reject(3);
  console.log(4); // 这行代码不会执行
}
// 给返回的期约添加一个拒绝处理程序
foo().catch(console.log);
console.log(2); // 1 2 3
```

## 函数策略

### 实现 `sleep()`

```js
async function sleep(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
async function foo() {
  const start = Date.now();
  await sleep(1500);
  console.log(Date.now() - start);
}
foo(); // 因为是单线程的，所以时间会长于 1500
```

### 并行加速

先全部初始化(`new Promise()`)

然后 `await promiseObj`

虽然没有按照顺序完成，但是接收到的顺序符合预期

```js
async function randomDelay(id) {
  const delay = Math.random() * 1000;
  return new Promise((resolve) => setTimeout(() => {
    console.log(`${id} finished`);
    resolve();
  }, delay))
}
async function foo_no() {
  const start = Date.now();
  for(let i = 0; i < 5; i++) {
    await randomDelay(i);
  }
  console.log(`${Date.now() - start} all done`);
}
async function foo_yes() {
  const start = Date.now();
  const promises = Array(5).fill(null).map((_, index) => randomDelay(index));
  for await(const p of promises) {
    console.log(p);
  }
  console.log(`${Date.now() - start} all done`);
}
foo_no(); // 4221 all done
foo_yes(); // 1495 all done
```

### 串行执行

```js
async function addTwo(x) {return x + 2;}
async function addThree(x) {return x + 3;}
async function addFive(x) {return x + 5;}
async function addTen(x) {
  for (const fn of [addTwo, addThree, addFive]) {
    x = await fn(x);
  }
  return x;
}
addTen(9).then(console.log); // 19 
```
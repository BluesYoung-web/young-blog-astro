---
title: 38-期约
image: /img/hbs.png
description: JavaScript Promise
date: 2021-01-19 10:31:57
---

[[toc]]

## `Promise` 基础

### 状态机

待定 `pending`

兑现 `fulfilled / resolved`

拒绝 `rejected`

**一旦兑现或拒绝，就不会再改变**

**状态私有，不能通过 JavaScript 检测到，不能被外部代码修改**

无论 `resolve()` 和 `reject()` 中的哪个被调用，状态转换都不可撤销了(**异步执行，不影响前后的同步操作**)

为避免期约卡在待定状态，可以添加一个定时退出功能

```js
let p1 = new Promise((resolve, reject) => resolve());
setTimeout(console.log, 0, p1); // Promise <resolved>
let p2 = new Promise((resolve, reject) => reject());
setTimeout(console.log, 0, p2); // Promise <rejected>
// Uncaught error (in promise) 
```

### `Promise.resolve(result)`

实例化一个解决的期约的静态方法

等同于 `new Promise((resolve, reject) => resolve(result))`

如果传入的参数本身是一个期约，那它的行为就类似于一个空包装(**幂等，保留传入期约的状态**)

`Promise.resolve(p) === Promise.resolve(Promise.resolve(p))`

### `Promise.reject(reason)`

实例化一个拒绝的期约，并抛出一个**异步的错误**(不能使用 `try-catch` 捕获)

如果给它传一个期约对象，则这个期约会成为它返回的**拒绝期约的理由**

### `Promise.prototype.then(onResolve = null, onReject = null)`

两个函数都可选

分别对应“兑现”以及“拒绝”状态的回调函数

```js
let p1 = Promise.reject('foo');
// 调用 then()时不传处理程序则原样向后传
let p2 = p1.then();
// Uncaught (in promise) foo 
setTimeout(console.log, 0, p2); // Promise <rejected>: foo

// 这些都一样
let p3 = p1.then(null, () => undefined);
let p4 = p1.then(null, () => {});
let p5 = p1.then(null, () => Promise.resolve());
setTimeout(console.log, 0, p3); // Promise <resolved>: undefined
setTimeout(console.log, 0, p4); // Promise <resolved>: undefined
setTimeout(console.log, 0, p5); // Promise <resolved>: undefined 

// 这些都一样
let p6 = p1.then(null, () => 'bar');
let p7 = p1.then(null, () => Promise.resolve('bar'));
setTimeout(console.log, 0, p6); // Promise <resolved>: bar
setTimeout(console.log, 0, p7); // Promise <resolved>: bar 

// Promise.resolve()保留返回的期约
let p8 = p1.then(null, () => new Promise(() => {}));
let p9 = p1.then(null, () => Promise.reject());
// Uncaught (in promise): undefined
setTimeout(console.log, 0, p8); // Promise <pending>
setTimeout(console.log, 0, p9); // Promise <rejected>: undefined
let p10 = p1.then(null, () => { throw 'baz'; });
// Uncaught (in promise) baz
setTimeout(console.log, 0, p10); // Promise <rejected>: baz
let p11 = p1.then(null, () => Error('qux'));
setTimeout(console.log, 0, p11); // Promise <resolved>: Error: qux 
```

### `Promise.prototype.catch(onRejected)`

等同于`Promise.prototype.then(null, onResolve)`

### `Promise.prototype.finally(onFinally)`

无论"兑现"或者"拒绝"，都会执行

无法获知此时期约的状态

```js
let p1 = Promise.resolve('foo');
// 这里都会原样后传
let p2 = p1.finally();
let p3 = p1.finally(() => undefined);
let p4 = p1.finally(() => {});
let p5 = p1.finally(() => Promise.resolve());
let p6 = p1.finally(() => 'bar');
let p7 = p1.finally(() => Promise.resolve('bar'));
let p8 = p1.finally(() => Error('qux'));
setTimeout(console.log, 0, p2); // Promise <resolved>: foo
setTimeout(console.log, 0, p3); // Promise <resolved>: foo
setTimeout(console.log, 0, p4); // Promise <resolved>: foo
setTimeout(console.log, 0, p5); // Promise <resolved>: foo
setTimeout(console.log, 0, p6); // Promise <resolved>: foo
setTimeout(console.log, 0, p7); // Promise <resolved>: foo
setTimeout(console.log, 0, p8); // Promise <resolved>: foo 

// Promise.resolve()保留返回的期约
let p9 = p1.finally(() => new Promise(() => {}));
let p10 = p1.finally(() => Promise.reject());
// Uncaught (in promise): undefined
setTimeout(console.log, 0, p9); // Promise <pending>
setTimeout(console.log, 0, p10); // Promise <rejected>: undefined
let p11 = p1.finally(() => { throw 'baz'; });
// Uncaught (in promise) baz
setTimeout(console.log, 0, p11); // Promise <rejected>: baz 
```

### 邻近处理程序的执行顺序

如果给期约函数添加了**多个**处理程序，当期约变化时，相关处理程序会**按照添加它们的顺序依次执行**

```js
let p1 = Promise.resolve();
let p2 = Promise.reject();
p1.then(() => setTimeout(console.log, 0, 1));
p1.then(() => setTimeout(console.log, 0, 2));
// 1 2
p2.catch(() => setTimeout(console.log, 0, 5));
p2.catch(() => setTimeout(console.log, 0, 6));
// 5 6
p1.finally(() => setTimeout(console.log, 0, 7));
p1.finally(() => setTimeout(console.log, 0, 8));
// 7 8
```

### 拒绝期约与拒绝错误处理

```js
let p1 = new Promise((resolve, reject) => reject(Error('foo1')));
let p2 = new Promise((resolve, reject) => { throw Error('foo2'); });
let p3 = Promise.resolve().then(() => { throw Error('foo4'); }); // 在最终抛出未捕获错误之前还会创建另一个期约
let p4 = Promise.reject(Error('foo3')); 
```

## 期约连锁与期约合成

### 期约连锁

`then/catch/finally` 都会返回一个**新的**期约对象，而这个新的期约对象又有自己的实例方法

链式调用(**串行化异步任务**)

```js
function delayedResolve(str) {
 return new Promise((resolve, reject) => {
   console.log(str);
   setTimeout(resolve, 1000);
 });
} 
delayedResolve('p1 executor')
 .then(() => delayedResolve('p2 executor'))
 .then(() => delayedResolve('p3 executor'))
 .then(() => delayedResolve('p4 executor'))
// p1 executor（0 秒后）
// p2 executor（1 秒后）
// p3 executor（2 秒后）
// p4 executor（3 秒后）
// ----------- 回调地狱 --------------
function delayedExecute(str, callback = null) {
 setTimeout(() => {
   console.log(str);
   callback && callback();
   }, 1000)
}
delayedExecute('p1 callback', () => {
   delayedExecute('p2 callback', () => {
     delayedExecute('p3 callback', () => {
     		delayedExecute('p4 callback');
     });
   });
}); 
// p1 callback（1 秒后）
// p2 callback（2 秒后）
// p3 callback（3 秒后）
// p4 callback（4 秒后）
```

### 期约图

二叉树的遍历顺序

```js
//      A
//     / \
//    /   \
//   B      C
//  / \    / \
// D   E  F   G
let A = new Promise((resolve, reject) => {
 console.log('A');
 resolve();
});
let B = A.then(() => console.log('B'));
let C = A.then(() => console.log('C'));
B.then(() => console.log('D'));
B.then(() => console.log('E'));
C.then(() => console.log('F'));
C.then(() => console.log('G'));
// A B C D E F G 
```

### 期约合成

**`Promise.all()`**

创建的期约会在传入的期约**全部解决**之后再解决

如果至少有一个包含的期约待定，则合成的期约也会待定

如果有一个包含的期约拒绝，则合成的期约也会拒绝

接受一个可迭代对象(数组)，返回一个新期约

如果所有期约都成功解决，则合成期约的解决值就是所有包含期约解决值的数组

如果有期约拒绝，则**第一个**拒绝的期约会将自己的理由作为合成期约的拒绝理由。之后再拒绝的期约不会影响最终期约的拒绝理由

```js
let p1 = Promise.all([
   Promise.resolve(),
   Promise.resolve()
]);
// 可迭代对象中的元素会通过 Promise.resolve()转换为期约
let p2 = Promise.all([3, 4]);
// 空的可迭代对象等价于 Promise.resolve()
let p3 = Promise.all([]);
// 无效的语法
let p4 = Promise.all();
// TypeError: cannot read Symbol.iterator of undefined 
// -------------------
// 永远待定
let p1 = Promise.all([new Promise(() => {})]);
setTimeout(console.log, 0, p1); // Promise <pending>
// 一次拒绝会导致最终期约拒绝
let p2 = Promise.all([
   Promise.resolve(),
   Promise.reject(),
   Promise.resolve()
]);
setTimeout(console.log, 0, p2); // Promise <rejected>
// Uncaught (in promise) undefined 
// ---------------------------
let p = Promise.all([
   Promise.resolve(3),
   Promise.resolve(),
   Promise.resolve(4)
]);
p.then((values) => setTimeout(console.log, 0, values)); // [3, undefined, 4] 
```

**`Promise.race()`**

接受一个可迭代对象(数组)，返回一个新期约

不会对解决或者拒绝的期约区别对待

只要是第一个完成的期约，就会包装其解决值或拒绝理由并返回新期约

```js
// 解决先发生，超时后的拒绝被忽略
let p1 = Promise.race([
   Promise.resolve(3),
   new Promise((resolve, reject) => setTimeout(reject, 1000))
]);
setTimeout(console.log, 0, p1); // Promise <resolved>: 3
// 拒绝先发生，超时后的解决被忽略
let p2 = Promise.race([
   Promise.reject(4),
   new Promise((resolve, reject) => setTimeout(resolve, 1000))
]);
setTimeout(console.log, 0, p2); // Promise <rejected>: 4
// 迭代顺序决定了落定顺序
let p3 = Promise.race([
   Promise.resolve(5),
   Promise.resolve(6),
   Promise.resolve(7)
]);
setTimeout(console.log, 0, p3); // Promise <resolved>: 5 
```

#### 串行期约合成

```js
// 1.0
function addTwo(x) {return x + 2;}
function addThree(x) {return x + 3;}
function addFive(x) {return x + 5;}
function addTen(x) {
 return addFive(addTwo(addThree(x)));
}
console.log(addTen(8)); // 18
// 2.0
function addTen(x) {
 return Promise.resolve(x)
 .then(addTwo)
 .then(addThree)
 .then(addFive);
} 
addTen(8).then(console.log); // 18
// 3.0
function addTen(x) {
 // Array.prototype.reduce((pre, cur, index, arr) => do sth, startValue)
 return [addTwo, addThree, addFive].reduce((promise, fn) => promise.then(fn), Promise.resolve(x));
 // 等同于 [Promise.resolve(x), addTwo, addThree, addFive].reduce((promise, fn) => promise.then(fn))
}
addTen(8).then(console.log); // 18 
// 3.1 通用函数
function compose(...fns) {
 	return (x) => fns.reduce((promise, fn) => promise.then(fn), Promise.resolve(x))
}
let addTen = compose(addTwo, addThree, addFive);
addTen(8).then(console.log); // 18 
```

## 期约扩展

期约取消

期约进度通知

`ES6` 不支持取消期约和进度通知，一个主要原因就是这样会导致期约连锁和期约合成过度复杂化。比如在一个期约连锁中，如果某个被其他期约依赖的期约被取消了或者发出了通知，那么接下来应该发生什么完全说不清楚
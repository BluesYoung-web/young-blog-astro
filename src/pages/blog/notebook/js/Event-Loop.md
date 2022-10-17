---
title: 事件循环
description: 事件循环
image: /img/event_loop.png
date: 2022-03-17 17:40:58
---

[[toc]]

## 什么是事件循环

JS 引擎是**单线程**的，一个时间点只能做一件事情

像读写文件、网络请求这种任务，需要消耗很长时间才能完成，如果一直空闲等待的话用户体验是极差的

所以就有了**异步任务回调通知模式**

**在等待异步任务准备的同时，JS 引擎去执行其他同步任务，等到异步任务准备好了，再去执行回调**

以这种**非阻塞式**的方式执行代码，完成相同的任务，可以极大地节省花费的时间

实现此**回调通知**的正是**事件循环**

## 宏任务与微任务

<n-alert class="my-4" type="info">**事件循环由宏任务和 *在执行宏任务期间产生的所有微任务* 组成。完成当下的宏任务后，会立刻执行所有在此期间入队的微任务**</n-alert>

**这种设计是为了给紧急任务一个插队的机会，否则新入队的任务永远被放在队尾**

> **本轮循环中的微任务**实际上就是**在插队**，这样微任务中所做的状态修改，在下一轮事件循环中也能得到同步

### 宏任务

`<script>`

`I/O`

`setTimeout`

`setInterval`

`setImmediate`

`requestAnimationFrame`

`UI Render`

### 微任务

`process.nextTick`

`MutationObserver`

`Promise.then.catch.finally`

![宏任务与微任务](/img/event_loop.png)

![事件轮询](/img/event_queue.png)

## 浏览器中的事件循环

由一个宏任务队列和多个微任务队列组成，**每个宏任务对应一个微任务队列**

**执行过程：**
1. 执行全局的 script，在此期间所产生的宏任务和微任务各自入队
2. 执行完成之后，清空当前的**微任务队列**
3. 取出宏任务队列之中的第一个任务，执行，**期间产生的宏任务和微任务再次入队**
4. 重复 2、3 两步

```js
console.log('开始执行');
Promise.resolve().then(()=> {
  console.log('第一个回调函数：微任务1');
  setTimeout(()=> {
    console.log('第三个回调函数：宏任务2');
    console.log('结束执行');
  }, 0);
});
setTimeout(()=> {
  console.log('第二个回调函数：宏任务1');
  Promise.resolve().then(()=> {
    console.log('第四个回调函数：微任务2');
  });
}, 0);
// 1. 微任务、宏任务入队
// 2. 开始清空微任务队列
//    微任务 1
//    宏任务 2 入队
// 3. 取出第一个宏任务开始执行
//    宏任务 1，微任务 2 入队
// 4. 开始清空微任务队列
//    微任务 2
// 5. 取出第二的宏任务开始执行
//    宏任务 2
```

## Node 中的事件循环

<n-alert class="my-4" type="info">**拥有 6 个宏任务队列和 6 个微任务队列，6 个等级的宏任务全部执行完才是一轮循环**</n-alert>

<n-image src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f62a46a5a83e4cdba686754f43e85195~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp" />

**日常需要关注的只有：Timers、Poll、Check 三个阶段：**

**Timers：**
- setTimeout
- setInterval

**Poll：**
- I/O(文件读写)

**Check：**
- setImmediate

<n-alert class="my-4" type="info">**优先级：process.nextTick > Promise.then**</n-alert>

```js
console.log('Script开始')
setTimeout(() => {
  console.log('宏任务1（setTimeout)');
  Promise.resolve().then(() => {
    console.log('微任务promise2');
  });
}, 0);
setImmediate(() => {
  console.log('宏任务2');
});
setTimeout(() => {
  console.log('宏任务3（setTimeout)');
}, 0);
console.log('Script结束');
Promise.resolve().then(() => {
  console.log('微任务promise1');
})
process.nextTick(() => {
  console.log('微任务nextTick');
});
```

### Node 11 之前

<n-alert class="my-4" type="warning">**一个宏任务队列执行完成之后再去清空一次微任务队列**</n-alert>

```js
// Script开始
//    宏任务 1 入队，宏任务 2 入队，宏任务 3 入队
// Script结束
//    微任务 1 入队，微任务 nextTick 入队
// 微任务 nextTick
// 微任务 promise1
// 宏任务1（setTimeout)
//    微任务 2 入队
// 宏任务3（setTimeout)
// 微任务 promise2
// 宏任务 2
```

### Node 11 之后

<n-alert class="my-4" type="warning">**同浏览器，每执行完一个宏任务，就去清空一次微任务队列**</n-alert>

```js
// Script开始
//    宏任务 1 入队，宏任务 2 入队，宏任务 3 入队
// Script结束
//    微任务 1 入队，微任务 nextTick 入队
// 微任务 nextTick
// 微任务 promise1
// 宏任务1（setTimeout)
//    微任务 2 入队
// 微任务 promise2
// 宏任务3（setTimeout)
// 宏任务 2
```
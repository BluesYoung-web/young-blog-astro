---
title: 37-异步编程
image: /img/hbs.png
description: JavaScript 异步编程
date: 2021-01-18 15:02:06
---

[[toc]]

## 同步与异步

**同步行为**对应内存中顺序执行的处理器指令，每条指令都会严格按照它们出现的顺序来执行，而每条指令执行后也能**立即获得**存储在系统本地（如寄存器或系统内存）的信息

**异步行为**类似于系统中断，即当前进程外部的实体可以触发代码执行

**同步 > 微任务 > 宏任务**

```js
new Promise((res) => res()).then(() => console.log('promise1'));
setTimeout(() => console.log('settimeout1'), 0);
console.log('tong bu 1');
new Promise((res) => res()).then(() => console.log('promise2'));
setTimeout(() => console.log('settimeout2'), 0);
console.log('tong bu 2');
new Promise((res) => res()).then(() => console.log('promise3'));
setTimeout(() => console.log('settimeout3'), 0);
console.log('tong bu 3');
// tong bu 1
// tong bu 2
// tong bu 3
// promise1
// promise2
// promise3
// settimeout1
// settimeout2
// settimeout3
```

## 宏任务

`I/O`

`setTimeout`

`setInterval`

`setImmediate`

`requestAnimationFrame`

## 微任务

`process.nextTick`

`MutationObserver`

`Promise.then.catch.finally`

![宏任务与微任务](/img/event_loop.png)

![事件轮询](/img/event_queue.png)

## 任务执行顺序

1. 同步任务进入主线程，异步任务进入`Event Table` 并注册函数

2. 当指定的事情完成时，`Event Table` 会将这个函数移入`Event Queue`

3. 主线程内的任务执行完毕为空，会去 `Event Queue` 读取对应的函数，进入主线程执行

4. 上述过程会不断重复，也就是常说的 `Event Loop` (事件循环)

5. `js` 引擎存在 `monitoring process` 进程，会持续不断的检查主线程执行栈是否为空，一旦为空，就会去`Event Queue` 那里检查是否有等待被调用的函数

<Step
  class="mt-10"
  title="异步发展进程"
  :data="[
    '异步返回值——回调函数',
    '失败处理——成功回调+失败回调',
    '嵌套异步——回调地狱',
    'Promise',
    'Gernerator',
    'Async/Await'
  ]"
/>

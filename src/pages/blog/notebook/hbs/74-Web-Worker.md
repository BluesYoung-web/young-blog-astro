---
title: 74-工作者线程
image: /img/hbs.png
description: JavaScript 工作者线程
date: 2021-02-22 14:56:26
---

[[toc]]

## 简介

允许把主线程的工作转嫁给独立的实体，而不会改变现有的单线程模型

`JavaScript` 环境实际上是运行在托管操作系统中的**虚拟环境**

**每个页面都有自己的内存、事件循环、`DOM`，等等**

对于浏览器来说，同时管理多个环境是非常简单的，因为所有这些环境都是**并行执行**的

使用工作者线程，浏览器可以在原始页面环境之外再分配一个**完全独立的二级子环境**

这个子环境**不能与依赖单线程交互的 `API`（如 `DOM`）互操作**，但可以与父环境并行执行代码

## 特点

以实际线程实现，并行执行

可以共享某些内存，但不共享全部内存

**不一定在同一个线程里面**

开销更大

## 类型

专用工作者线程
  - 简称工作者线程、`Web Worker` 或 `Worker`
  - 可以让脚本单独创建一个 `JavaScript` 线程，以执行委托的任务
  - **只能被创建它的页面使用**

共享工作者线程
  - 可以被多个不同的上下文使用，包括不同的页面
  - 任何与创建共享工作者线程的脚本**同源的脚本**，都可以向共享工作者线程发送消息或从中接收消息

服务工作者线程
  - 主要用于拦截、重定向和修改页面发出的请求
  - 充当网络请求的仲裁者的角色

## `WorkerGlobalScope`

在网页上，`window` 对象可以向运行在其中的脚本暴露各种全局变量

在工作者线程内部，没有 `window` 的概念

这里的全局对象是 `WorkerGlobalScope` 的实例，**通过 `self` 关键字暴露出来**

### 属性及方法

`.navigator` 返回与工作者线程关联的 `WorkerNavigator`

`.self` 返回 `WorkerGlobalScope` 对象

`.location` 返回与工作者线程关联的 `WorkerLocation` 对象

`.performance` 返回（只包含特定属性和方法的）`Performance` 对象

`.console` 返回与工作者线程关联的 `Console` 对象，对 `API` 没有限制

`.caches` 返回与工作者线程关联的 `CacheStorage` 对象，对 `API` 没有限制

`.indexedDB` 返回 `IDBFactory` 对象

`.isSecureContext` 返回布尔值，表示工作者线程上下文是否安全

`.origin` 返回 `WorkerGlobalScope` 的源

`.atob()`

`.btoa()`

`.clearInterval()`

`.clearTimeout()`

`.fetch()`

`.setInterval()`

`.setTimeout()`

`.name` 构造函数可选标识符

`.postMessage()` 发送消息

`.close()` **立即终止工作者线程——内部**

`.importScripts()` 用于向工作者线程中导入任意数量的脚本

### 子类

`DedicatedWorkerGlobalScope` 专用工作者线程

`SharedWorkerGlobalScope` 共享工作者线程

`ServiceWorkerGlobalScope` 服务工作者线程

## 专用工作者线程

最简单的工作者线程

可以与父页面交换信息、发送网络请求、执行文件输入/输出、进行密集计算、处理大量数据

文件在后台加载，工作者线程的初始化完全独立于主脚本

工作者线程本身存在于一个独立的 `JavaScript` 环境中，因此 **`main.js` 必须以 `Worker` 对象为代理实现与工作者线程通信**

虽然相应的工作者线程可能还不存在，但该 `Worker` 对象已在原始环境中可用了

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
<script>
const worker = new Worker('./test.js', { name: 'young' });
worker.postMessage('来了老弟');
worker.addEventListener('message', console.log);
</script>
</body>
</html>
```

```js
// test.js
self.addEventListener('message', console.log);
self.postMessage('好嗨哟');
```

### 安全限制

**创建**工作者线程的脚本文件只能从**同源**加载

在工作者线程中使用 `importScripts()` 可以加载其他源的脚本，**不受跨域限制**

如果工作者线程加载的脚本带有全局唯一标识符（与加载自一个二进制大文件一样），就会受父文档内容安全策略的限制

### 使用 `Worker` 对象

在终止工作者线程之前，**不会被垃圾回收**，也不能通过编程方式恢复对之前 `Worker` 对象的引用

`worker.onerrror | worker.addEventListener('error')` 工作者线程中发生 `ErrorEvent` 类型的错误事件时执行

`onmessage` 在工作者线程中发生 `MessageEvent` 类型的**消息事件**时执行

`onmessageerror` 在工作者线程中发生 `MessageEvent` 类型的**错误事件**时执行

`postMessage()` 用于通过异步消息事件向工作者线程发送消息

`terminate()` **用于立即终止工作者线程——外部**

```js
// -------- 内部终止 ----------
// closeWorker.js
self.postMessage('foo');
self.close(); // 取消事件循环中的所有任务，并阻止继续添加新任务
self.postMessage('bar');
setTimeout(() => self.postMessage('baz'), 0);
// main.js
const worker = new Worker('./closeWorker.js');
worker.onmessage = ({data}) => console.log(data);
// foo
// bar 
// -------- 外部终止 ----------
// terminateWorker.js
self.onmessage = ({data}) => console.log(data);
// main.js
const worker = new Worker('./terminateWorker.js');
// 给 1000 毫秒让工作者线程初始化
setTimeout(() => {
  worker.postMessage('foo');
  worker.terminate(); // 清理并锁住消息队列
  worker.postMessage('bar');
  setTimeout(() => worker.postMessage('baz'), 0);
}, 1000);
// foo 
```

`close()` 和 `terminate()` 是幂等操作，多次调用没有问题。这两个方法仅仅是将 `Worker` 标记为 `teardown`，因此多次调用不会有不好的影响

在整个生命周期中，一个专用工作者线程只会关联**一个**网页(文档)

除非明确终止，否则只要关联文档存在，专用工作者线程就会存在

如果浏览器离开网页，它会将与之关联的工作者线程标记为终止，它们的执行也会终止

### 构造函数可选配置对象的属性

`.name` 可以在工作者线程中通过 `self.name` 读取到的字符串标识符

`.type` 表示加载脚本的运行方式：
  - `classic` 作为常规脚本执行，默认值
  - `module` 作为模块执行

`.credentials` 在 `type: 'module'` 时指定如何获取相关的模块脚本
  - `omit` 当 `type: 'classic'` 时的默认值
  - `same-origin`
  - `include`

### 创建行内工作者线程

```js
// 要执行的工作者线程的代码
const ws = `
self.onmessage = ({ data }) => console.log(data);
`;
// 基于脚本生成 Blob 对象
const wb = new Blob([ws]);
// 基于 Blob 生成引用的 URL
const bl = URL.createObjectURL(wb);
// 基于 URL 创建工作者线程
const worker = new Worker(bl);
worker.postMessage('来了老弟');
// 来了老弟
// ----------------- 实际应用 -------------------------
// --------- 将需要大量计算的东西丢给工作者线程 ------------
function fibonacci(n) {
   return n < 1 ? 0
     : n <= 2 ? 1
     : fibonacci(n - 1) + fibonacci(n - 2);
}
const workerScript = `
 self.postMessage(
 (${fibonacci.toString()})(29)
 );
`;
const worker = new Worker(URL.createObjectURL(new Blob([workerScript])));
worker.onmessage = ({data}) => console.log(data);
// 514229
```

### 工作者线程中动态执行脚本

`importScripts(...srcs)`

下载顺序不限，**执行顺序严格遵守**

类似于使用 `<script>` 标签动态加载脚本

所有导入的脚本**共享作用域**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
<script>
const worker = new Worker('./test.js', { name: 'young' });
worker.postMessage('来了老弟');
worker.addEventListener('message', ({ data }) => console.log(data));
</script>
</body>
</html>
```

```js
// test.js
const token = 'aloha';
self.addEventListener('message', ({ data }) => console.log(data));
self.postMessage('我要引入脚本了哦');
importScripts('./a.js', './b.js');
self.postMessage('脚本引入完毕');
// a.js
console.log(`${self.name}---aaaaaa---${token}`);
// b.js
console.log(`${self.name}---bbbbbb---${token}`);
/*
  我要引入脚本了哦
  young---aaaaaa---aloha
  young---bbbbbb---aloha
  脚本引入完毕
  来了老弟
*/
```

### 委托任务到子工作者线程

在有多个 `CPU` 核心的时候，使用多个子工作者线程可以实现并行计算

子工作者线程的脚本路径**根据父工作者线程**而不是相对于网页来解析

```js
// --- main.js
const worker = new Worker('./js/worker.js');
// worker
// subworker
// --- js/worker.js
console.log('worker');
const worker = new Worker('./subworker.js');
// --- js/subworker.js
console.log('subworker');
```

顶级工作者线程的脚本和子工作者线程的脚本都必须从与主页相同的源加载

### 工作者线程错误处理

**`try-catch` 不会捕获到错误，只能通过 `worker.onerror`**

### 通信

直接使用 `postMessage`

使用 `MessageChannel`
  - `port1.postMessage -> port2.onmessage`
  - `port2.postMessage -> port1.onmessage`

```js
// --- worker.js
// 在监听器中存储全局 messagePort
let messagePort = null;
function factorial(n) {
  let result = 1;
  while(n) { result *= n--; }
  return result;
}
// 在全局对象上添加消息处理程序
self.onmessage = ({ ports }) => {
  // 只设置一次端口
  if(!messagePort) {
    // 初始化消息发送端口
    // 给变量赋值并重置监听器
    messagePort = ports[0];
    self.onmessage = null;
    // 在全局对象上设置消息处理程序
    messagePort.onmessage = ({ data }) => {
      messagePort.postMessage(`${data} != ${factorial(data)}`);
    };
  }
};
// --- main.js
const channel = new MessageChannel();
const factorialWorker = new Worker('./worker.js');
// 把`MessagePort`对象发送到工作者线程
// 工作者线程负责处理初始化信道
factorialWorker.postMessage(null, [channel.port1]);
// 通过信道实际发送数据
channel.port2.onmessage = ({data}) => console.log(data);
// 工作者线程通过信道响应
channel.port2.postMessage(5); 
// 5 != 120 
```

使用 `BroadcastChannel`

```js
// --- worker.js
const channel = new BroadcastChannel('worker_channel');
channel.onmessage = ({data}) => {
  console.log(`heard ${data} in worker`);
  channel.postMessage('bar');
}
// --- main.js
const channel = new BroadcastChannel('worker_channel');
const worker = new Worker('./worker.js');
channel.onmessage = ({data}) => console.log(`heard ${data} on page`);
// 没有端口所有权的概念，如果没有实体监听该信道，则不会有人处理
setTimeout(() => channel.postMessage('foo'), 1000);
// heard foo in worker
// heard bar on page
```

### 数据传输

**结构化克隆算法**
- 可用于在两个独立上下文之间共享数据，由浏览器在后台实现，无法直接调用
- **通过 `postMessage()` 传递对象时，浏览器会遍历该对象，并在目标上下文中生成它的一个副本**
- 支持类型：
  - 除 `Symbol` 之外的所有原始类型
  - `Boolean` 对象
  - `String` 对象
  - `Date`
  - `RegExp`
  - `Blob`
  - `File`
  - `FileList`
  - `ArrayBuffer`
  - `ArrayBufferView`
  - `ImageData`
  - `Array`
  - `Object`
  - `Map`
  - `Set`
- 注意：
  - **复制之后，源上下文中对该对象的修改，不会传播到目标上下文中的对象(类似深拷贝)**
  - 结构化克隆算法可以识别对象中包含的循环引用，不会无穷遍历对象
  - 克隆 `Error` 对象、`Function` 对象或 `DOM` 节点会抛出错误
  - 结构化克隆算法并不总是创建完全一致的副本
  - **对象属性描述符、获取方法和设置方法不会克隆，必要时会使用默认值**
  - 原型链不会克隆
  - `RegExp.prototype.lastIndex` 属性不会克隆

在对象比较复杂的时候会存在计算性能消耗，应该避免过大、过多的复制

**可转移对象**
- 把所有权从一个上下文**转移**到另一个上下文
- 类型：
  - `ArrayBuffer`
  - `MessagePort`
  - `ImageBitmap`
  - `OffscreenCanvas`
- **`postMessage()` 方法的第二个可选参数是数组，它指定应该将哪些对象转移到目标上下文**

```js
// --- main.js
const worker = new Worker('./worker.js');
// 创建 32 位缓冲区
const arrayBuffer = new ArrayBuffer(32);
console.log(`page's buffer size: ${arrayBuffer.byteLength}`); // 32
worker.postMessage(arrayBuffer);
console.log(`page's buffer size: ${arrayBuffer.byteLength}`); // 32
// --- worker.js
self.onmessage = ({data}) => {
  console.log(`worker's buffer size: ${data.byteLength}`); // 32
};
// ------------ 转移 --------------
// --- main.js
const worker = new Worker('./worker.js');
// 创建 32 位缓冲区
const arrayBuffer = new ArrayBuffer(32);
console.log(`page's buffer size: ${arrayBuffer.byteLength}`); // 32
worker.postMessage(arrayBuffer, [arrayBuffer]);
console.log(`page's buffer size: ${arrayBuffer.byteLength}`); // 0
// --- worker.js
self.onmessage = ({data}) => {
  console.log(`worker's buffer size: ${data.byteLength}`); // 32
};
```

**共享数组缓冲区**
- `SharedArrayBuffer`
- **既不克隆，也不转移**
- 使用 `postMessage()` 传递时，浏览器**只会传递原始缓冲区的引用**
- 资源争用问题使用 `Atomics API` 解决

### 线程池

启用工作者线程的代价很大，所以某些情况下可以考虑始终保持固定数量的线程活动

工作者线程在执行计算时，会被标记为忙碌状态，直到它通知线程池自己空闲了，才准备好接收新任务

线程池中线程的上限可参考实际 `CPU` 核心的数量(`navigator.hardwareConcurrency`)

## 共享工作者线程

`new SharedWorker(url)`

只会在**相同的标识不存在**的情况下才创建新实例(解析后的 `URL`)

## 服务工作者线程

一种类似浏览器中代理服务器的线程，可以拦截外出请求和缓存响应

用于把网页变成像原生应用一样的工具

服务工作者线程中可使用的 `API`：
  - `Notifications`
  - `Push`
  - `Background Sync`
  - `Channel Messaging`

一个域的多个页面共享一个服务器工作者线程

为了使用 `Push API` 等特性，服务工作者线程可以在相关的标签页关闭后继续等待到来的推送事件

用途：
  - 充当网络请求的缓存层
  - 启用推送通知

**没有全局构造函数，由 `ServiceWorkerContainer` 来管理**

实例保存在 `navigator.serviceWorker` 属性中

### `ServiceWorkerContainer` 支持的方法

`register(url, options)` 注册服务工作者线程，返回结果期约

`getRegistration()` 返回期约，解决为与提供的作用域匹配的 `ServiceWorkerRegistration` 对象，没有返回 `undefined`

`getRegistrations()` 返回期约，解决为与 `ServiceWorkerContainer` 关联的 `ServiceWorkerRegistration` 对象的数组；如果没有关联的服务工作者线程则返回空数组

`startMessage()` 开始传送通过 `Client.postMessage()` 派发的消息
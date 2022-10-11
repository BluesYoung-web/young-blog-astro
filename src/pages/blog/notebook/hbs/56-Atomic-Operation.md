---
layout: "@/layouts/BlogPost.astro"
title: 56-原子化操作
image: /img/hbs.png
description: JavaScript 原子化操作
date: 2021-01-28 09:49:03
---

[[toc]]

## `SharedArrayBuffer`

`ArrayBuffer` 必须在不同执行上下文之间切换

`SharedArrayBuffer` 可以被任意多个执行上下文**同时使用**

多个专用工作线程访问同一个 `SharedArrayBuffer` 导致的**资源争用**的问题

```js
const woker = `
self.onmessage = ({ data }) => {
	const view = new Uint32Array(data);
	for (let i = 0; i < 1E6; i++) {
		view[0] += 1;
	}
	self.postMessage(null);
}
`;
const wokerScriptBlobUrl = window.URL.createObjectURL(new Blob([woker]));
// 创建容量为 4 的工作线程池
const workers = [];
for (let i = 0; i < 4; i++) {
  workers.push(new Worker(wokerScriptBlobUrl));
}
// 在最后一个工作线程完成后打印出最终值
let resCount = 0;
for (const worker of workers) {
  worker.onmessage = () => {
    if (++resCount === workers.length) {
      console.log(`Final buffer value: ${view[0]}`);
    }
  }
}
// 初始化 SharedArrayBuffer
const sharedArrayBuffer = new SharedArrayBuffer(4);
const view = new Uint32Array(sharedArrayBuffer);
view[0] = 1; 
// 把 SharedArrayBuffer 发送到每个工作线程
for (const worker of workers) {
  worker.postMessage(sharedArrayBuffer);
}
```

## 原子操作

任何全局上下文中都有 `Atomics` 对象

这个对象上暴露了用于执行线程安全操作的一套静态方法

其中多数方法以一个 `SharedArrayBuffer` 的引用作为第一个参数

以相关操作数作为后续参数

### 算术及位操作方法

从某个位置读取值

然后从某个位置读取值，并执行相关操作

最后把计算结果写回相同的位置

`Atomics.add(typeArray, index, value)` 原子加

`Atomics.sub(typeArray, index, value)` 原子减

`Atomics.or(typeArray, index, value)` 原子或

`Atomics.and(typeArray, index, value)` 原子与

`Atomics.xor(typeArray, index, value)` 原子异或

```js
// 线程安全的加操作
const woker = `
self.onmessage = ({ data }) => {
	const view = new Uint32Array(data);
	for (let i = 0; i < 1E6; i++) {
		// 线程安全的加操作
 		Atomics.add(view, 0, 1);
	}
	self.postMessage(null);
}
`;
```

### 原子读和写

浏览器的 `JavaScript` 编译器和 `CPU` 架构本身都有权限重排指令以提升程序执行效率

正常情况下， `JavaScript` 的单线程环境是可以随时进行这种优化的

但多线程下的指令重排可能导致资源争用，而且极难排错

**所有原子指令相互之间的顺序永远不会重排**

使用原子读或原子写保证所有指令（包括原子和非原子指令）都不会相对原子读/写重新排序

```js
const sharedArrayBuffer = new SharedArrayBuffer(4);
const view = new Uint32Array(sharedArrayBuffer);
// 执行非原子写
view[0] = 1;
// 非原子写可以保证在这个读操作之前完成，因此这里一定会读到 1
console.log(Atomics.load(view, 0)); // 1
// 执行原子写
Atomics.store(view, 0, 2);
// 非原子读可以保证在原子写完成后发生，因此这里一定会读到 2
console.log(view[0]); // 2 
```

### 原子交换

`Atomics.exchange()` 执行简单的交换，以保证其他线程不会中断值的交换

`Atomics.compareExchange()` 只在目标索引处的值与预期值匹配时才会执行写操作

```js
const sharedArrayBuffer = new SharedArrayBuffer(4);
const view = new Uint32Array(sharedArrayBuffer);
// 在索引 0 处写入 3
Atomics.store(view, 0, 3);
// 从索引 0 处读取值，然后在索引 0 处写入 4
console.log(Atomics.exchange(view, 0, 4)); // 3
// 从索引 0 处读取值
console.log(Atomics.load(view, 0)); // 4
// -------------------------------
const sharedArrayBuffer = new SharedArrayBuffer(4);
const view = new Uint32Array(sharedArrayBuffer);
// 在索引 0 处写入 5
Atomics.store(view, 0, 5);
// 从缓冲区读取值
let initial = Atomics.load(view, 0);
// 对这个值执行非原子操作
let result = initial ** 2;
// 只在缓冲区未被修改的情况下才会向缓冲区写入新值
Atomics.compareExchange(view, 0, initial, result);
// 检查写入成功
console.log(Atomics.load(view, 0)); // 25
// 只在缓冲区未被修改的情况下才会向缓冲区写入新值
Atomics.compareExchange(view, 0, -1, result);
// 检查写入失败
console.log(Atomics.load(view, 0)); // 5 
```

### 原子 `Futex` 操作与加锁

`Futex`(`fast user-space mutex`) 快速用户空间互斥量

`Atomics.wait()` 每个工作线程到达之后就会停止执行

在停止状态下，执行线程存在于一个**等待队列**中

在经过指定时间或在相应索引上调用 `Atomics.notify()` 释放其中一个等待的线程

这个线程执行完毕后会再次调用 `Atomics.notify()` 释放另一个线程

`Atomics.isLockFree()` 在高性能算法中可以用来确定是都有必要获取锁

**所有原子 `Futex` 操作只能用于 `Int32Array` 视图。而且，也只能用在工作线程内部**

## `XDM`

`cross-document messaging` 跨文档消息

`targetWindow.postMessage(msg, targetSource, [transfer])`：
  - `targetWindow` 对将要接收消息的窗口的引用
  - `msg` 要发送的数据
  - `transfer` 与消息一起传输的 `Transferable` 对象序列

`event`：
  - `data` 收到的消息
  - `origin` 发送消息的文档源
  - `source` 发送消息的文档中 `window` 对象的代理

```js
/**
 * 发送端
 */
var iframeWindow = document.querySelector('iframe').contentWindow;
/////////////////////////////////////////
var opener = window.open('http://117.78.0.214/testResult');

var sendTarget = opener || iframeWindow;
var msg = {
	status: 0,
	data: 'hello world',
	msg: ''
};
sendTarget.postMessage(JSON.stringify(msg), 'https://feeds.qq.com');
window.onmessage = function(event){
	console.log(JSON.parse(event.data));
};

/**
 * 接收端
 */
window.onmessage = function(event){
	// 防止跨站点脚本攻击
	if(event.origin === 'https://feeds.qq.com'){
		console.log(JSON.parse(event.data));
		// 回复
		var msg = {
			status: 0,
			data: 'hello',
			msg: ''
		};
		event.source.postMessage(JSON.stringify(msg), 'http://117.78.0.214');
	}
}
```
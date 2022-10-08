---
title: 61-新兴API
image: /img/hbs.png
description: JavaScript 新兴API
date: 2021-01-29 14:54:08
---

[[toc]]

## 通知 API

可以在页面不活跃时向用户显示消息(`win10` 的通知)

允许页面处理用户与通知弹层的交互

通知只能运行在**安全上下文**的代码中被触发

通知必须按照每个源的原则**明确得到用户允许**

### `Notification.requestPermission()`

向用户请求通知权限

返回一个 `Promise`：
  - `granted` 同意
  - `denied` 拒绝

**一旦拒绝就无法通过编程方式返回，因为不可能再触发授权提示**

```js
async function hasPermission() {
  const res = await Notification.requestPermission();
  return res === 'granted';
}
hasPermission().then(console.log); // true
```

### 显示和隐藏通知

`const n = new Notification('title', configOptions)` 创建通知实例

`n.close()` 关闭显示的通知

```js
const msg = new Notification('我是标题', {
  body: '我是主体',
  image: '我是背景图',
  vibrate: true,
  icon: '我是小图标',
  badge: '我是徽标'
});
msg.onshow = () => console.log('显示---------');
msg.onclick = () => console.log('点击---------');
msg.onclose = () => console.log('关闭---------');
msg.onerror = () => console.log('出错---------');

setTimeout(() => msg.close(), 5000);
```

## 页面可视状态

`document.visibilityState`：`hidden | visible | prerender`

`window.addEventListener('visibilitychange')` 可见状态变化时触发

`document.hidden` 是否隐藏，返回布尔值

## 流式 API


大块数据可能不会一次性都可用，使用流式处理可以让应用数据**一到达就能使用**

**大块数据也可以分小部分处理**，而不必等到所有数据都在内存中时再处理

为映射低级 `I/O` 原语而设计，包括适当时候对字节流的规范化

适用于处理网络请求和读写磁盘

可读流：
  - 可以通过某个公共接口**读取**数据块的流
  - 数据在内部从底层源进入流，然后由**消费者**(`consumer`)进行处理

 可写流：
  - 可以通过某个公共接口**写入**数据块的流
  - **生产者**(`producer`)将数据写入流，数据在内部传入底层数据槽(`sink`)

转换流：
  - 由两种流组成，**可写流**用于接收数据，**可读流**用于输出数据
  - 这两个流之间是**转换程序**(`transformer`)，可根据需要检查和修改流内容

### 块

`chunk`，流的基本单位

可以是任意数据类型，通常是定型数组

每个块都是离散的流片段，可作为一个整体来处理

大小不固定，时间间隔也不固定

理想情况下，大小相近，到达时间间隔相同

流出口 > 流入口，浪费一点内存，可以接受

流出口 = 流入口，理想状态

流出口 < 流入口，存在数据积压，需要作出处理(**反压**，暂停流入)

### 可读流

```js
async function* ints() {
  // 每一秒都生成一个递增的整数
  for(let i = 0; i < 5; i++) {
    yield await new Promise((resolve) => setTimeout(resolve, 1000, i));
  }
}
// 创建可读流
const rd = new ReadableStream({
  async start(controller) {
    for await (const chunk of ints()) {
      // 数据块加入队列
      controller.enqueue(chunk);
    }
    controller.close();
  }
});
// 未加锁
console.log(rd.locked); //false
// 获得读取器，加锁
const reader = rd.getReader();
//  已加锁
console.log(rd.locked); //true
// 消费者
(async () => {
  while(true) {
    const { done, value } = await reader.read();
    if(done) {
      break;
    } else {
      console.log(value); 
    }
  }
})();
// 0 1 2 3 4
```

### 可写流

```js
async function* ints() {
  // 每一秒都生成一个递增的整数
  for(let i = 0; i < 5; i++) {
    yield await new Promise((resolve) => setTimeout(resolve, 1000, i));
  }
}
// 创建可写流
const wt = new WritableStream({
  write(chunk) {
    // 获得写入数据
    console.log(chunk);
  }
});
// 未加锁
console.log(wt.locked); //false
// 获得写入器，加锁
const writer = wt.getWriter();
console.log(wt.locked); //true
// 生产者
(async () => {
  for await (const chunk of ints()) {
    await wt.ready;
    writer.write(chunk);
  }
  // 写入完成，关闭流
  writer.close();
})();
// 0 1 2 3 4
```

### 转换流

```js
async function* ints() {
  // 每一秒都生成一个递增的整数
  for(let i = 0; i < 5; i++) {
    yield await new Promise((resolve) => setTimeout(resolve, 1000, i));
  }
}
const { writable, readable } = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk * 2);
  }
});

const reader = readable.getReader();
const writer = writable.getWriter();

// 消费者
(async () => {
  while(true) {
    const { done, value } = await reader.read();
    if(done) {
      break;
    } else {
      console.log(value); 
    }
  }
})();
// 生产者
(async () => {
  for await (const chunk of ints()) {
    await writable.ready;
    writer.write(chunk);
  }
  // 写入完成，关闭流
  writer.close();
})();
// 0 2 4 6 8
```

### 管道

`pipeThrough()`
  -  `ReadableStream -> TransformStream.writableStream -> TransformStream.readable`

`pipeTo()`
  - `ReadableStream -> WritableStream`

```js
async function* ints() {
  // 每一秒都生成一个递增的整数
  for(let i = 0; i < 5; i++) {
    yield await new Promise((resolve) => setTimeout(resolve, 1000, i));
  }
}
// 创建可读流
const integerStream = new ReadableStream({
  async start(controller) {
    for await (const chunk of ints()) {
      controller.enqueue(chunk);
    }
    controller.close();
  }
});
// 创建转换流
const doublingStream = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk * 2);
  }
});
// 管道连接
const pipedStream = integerStream.pipeThrough(doublingStream);
// 从连接流获得读取器
const p_rd = pipedStream.getReader();
// 消费者
(async () => {
  while(true) {
    const { done, value } = await p_rd.read();
    if(done) {
      break;
    } else {
      console.log(value); 
    }
  }
})();
// 0 2 4 6 8
```

```js
async function* ints() {
  // 每一秒都生成一个递增的整数
  for(let i = 0; i < 5; i++) {
    yield await new Promise((resolve) => setTimeout(resolve, 1000, i));
  }
}
// 创建可读流
const integerStream = new ReadableStream({
  async start(controller) {
    for await (const chunk of ints()) {
      controller.enqueue(chunk);
    }
    controller.close();
  }
});
// 创建可写流
const writableStream = new WritableStream({
  write(value) {
    console.log(value);
  }
});
// 管道连接, 隐式从 ReadableStream 获得了一个读取器，并把产生的值填充到 WritableStream
const pipedStream = integerStream.pipeTo(writableStream);
// 0 1 2 3 4
```

## Performance API

`Date.now()` 只有毫秒级精度，如果代码执行速度足够快，时间戳将相等

`window.performance.now()` 返回一个**微秒级**的浮点值，这个方法**可以保证时间戳单调增**

### `performance.now()`

在执行上下文**创建时**从 0 开始计时

这个计时器在**不同上下文中**初始化时可能存在时间差

`performance.timeOrigin` 返回计时器初始化时全局时钟的值

通过使用 `performance.now()` 测量 `L1` 缓存与主内存的延迟差，幽灵漏洞（`Spectre`） 可以执行缓存推断攻击。为弥补这个安全漏洞，所有的主流浏览器有的选择降低 `performance.now()` 的精度，有的选择在时间戳里混入一些随机性

### `performance.getEntries()`

返回代表浏览器的性能时间线的集合

每个对象都有 `name | entryType | startTime | duration` 属性

### `performance.mark(tag)`

用于记录和分析自定义性能条目

压入顺序 `unshift`

```js
performance.mark('foo');
for (let i = 0; i < 1E6; ++i) {}
performance.mark('bar');
const [endMark, startMark] = performance.getEntriesByType('mark');
console.log(startMark.startTime - endMark.startTime); // 1.3299999991431832 
```

### `performance.measure(tag, s_tag, e_tag)`

分析两个标记之间的持续时间

```js
performance.mark('foo');
for (let i = 0; i < 1E6; ++i) {}
performance.mark('bar');
performance.measure('baz', 'foo', 'bar');
const [differenceMark] = performance.getEntriesByType('measure');
console.log(differenceMark);
// PerformanceMeasure {
// name: "baz",
// entryType: "measure",
// startTime: 298.9800000214018,
// duration: 1.349999976810068
// }
```

### 页面加载计时

浏览器会在导航事件发生时自动记录 `PerformanceNavigationTiming`

这个对象会捕获大量的时间戳，用于描述页面时何时以及如何加载的

```js
const [p_e] = performance.getEntriesByType('navigation');
console.log(p_e);
// PerformanceNavigationTiming {
// connectEnd: 2.259999979287386
// connectStart: 2.259999979287386
// decodedBodySize: 122314
// domComplete: 631.9899999652989
// domContentLoadedEventEnd: 300.92499998863786
// domContentLoadedEventStart: 298.8950000144541
// domInteractive: 298.88499999651685
// domainLookupEnd: 2.259999979287386
// domainLookupStart: 2.259999979287386
// duration: 632.819999998901
// encodedBodySize: 21107
// entryType: "navigation"
// fetchStart: 2.259999979287386
// initiatorType: "navigation"
// loadEventEnd: 632.819999998901
// loadEventStart: 632.0149999810383
// name: " https://foo.com "
// nextHopProtocol: "h2"
// redirectCount: 0
// redirectEnd: 0
// redirectStart: 0
// requestStart: 7.7099999762140214
// responseEnd: 130.50999998813495
// responseStart: 127.16999999247491
// secureConnectionStart: 0
// serverTiming: []
// startTime: 0
// transferSize: 21806
// type: "navigate"
// unloadEventEnd: 132.73999997181818
// unloadEventStart: 132.41999997990206
// workerStart: 0
// }
console.log(p_e.loadEventEnd – p_e.loadEventStart);
// 0.805000017862767 
```

### 资源请求计时

浏览器会在加载资源时自动记录 `PerformanceResourceTiming`

这个对象会捕获大量时间戳，用于描述资源加载的速度

```js
const p_e = performance.getEntriesByType('resource')[0];
console.log(p_e);
// PerformanceResourceTiming {
// connectEnd: 138.11499997973442 
// connectStart: 138.11499997973442
// decodedBodySize: 33808
// domainLookupEnd: 138.11499997973442
// domainLookupStart: 138.11499997973442
// duration: 0
// encodedBodySize: 33808
// entryType: "resource"
// fetchStart: 138.11499997973442
// initiatorType: "link"
// name: "https://static.foo.com/bar.png",
// nextHopProtocol: "h2"
// redirectEnd: 0
// redirectStart: 0
// requestStart: 138.11499997973442
// responseEnd: 138.11499997973442
// responseStart: 138.11499997973442
// secureConnectionStart: 0
// serverTiming: []
// startTime: 138.11499997973442
// transferSize: 0
// workerStart: 0
// }
console.log(p_e.responseEnd – p_e.requestStart);
// 493.9600000507198 
```


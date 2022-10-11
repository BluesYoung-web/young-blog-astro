---
layout: "@/layouts/BlogPost.astro"
title: vitest -> vi 超级有用的工具函数
description: vitest -> vi 超级有用的工具函数
image: /img/vitest.svg
date: 2022-05-10 10:40:00
---

[[toc]]

## 计时器相关

### `vi.useFakeTimers()`

启用模拟计时器

<n-alert type="warning">**使用其他一切跟模拟计时器相关API的必要条件**</n-alert>

**通常与生命周期钩子配合使用**

### `vi.useRealTimers()`

启用真实的计时器，通常作为模拟计时器使用结束之后的操作

它将包装对计时器的所有进一步调用 (例如 `setTimeout`、`setInterval`、`clearTimeout`、`clearInterval`、`nextTick`、`setImmediate`、`clearImmediate` 和 `Date`)

### `vi.runAllTimers()`

**调用每个被创建的计时器，直到计时器队列清空**

如果存在一个无限的区间，那么会在调用 10000 次之后尝试抛出异常


### `vi.runOnlyPendingTimers()`

只会触发在 `vi.useFakeTimers()` 之后的每个计时器，**不会触发在其调用期间创建的计时器**

```ts
let i = 0;
setInterval(() => console.log(++i), 50);
// 只会输出 1
vi.runOnlyPendingTimers();
```

### `vi.clearAllTimers()`

**删除所有计划运行的计时器**

### `vi.advanceTimersByTime(time_base_ms)`

**将计时器推进特定的时间**

### `vi.advanceTimersToNextTimer()`

调用下一个可用的计时器

### `vi.setSystemTime(str|num|date)`

**将系统当前的日期修改为特定的日期**

```ts
const date = new Date(1998, 11, 19);
vi.useFakeTimers();
vi.setSystemTime(date);
expect(Date.now()).toBe(date.valueOf());
vi.useRealTimers();
```

### `vi.restoreCurrentDate()`

**恢复真实的系统时间**

### `vi.getMockedSystemTime()`

返回 `setSystemTime` 设置的模拟日期对象，如果没有设置则返回 `null`

### `vi.getRealSystemTime()`

返回**系统真实的时间戳**

## 微任务相关

### `vi.runAllTicks()`

调用每个微任务，他们通常排列在 `process.nextTick` 中，它也将运行其中产生的所有微任务

## 函数(对象)相关

### `vi.fn()`

`Type: (fn: Function) => CallableMockInstance`

<n-alert type="info">**为传入的函数创建一个监听(每次调用函数时，会存储其调用参数、返回值和实例)**</n-alert>

```ts
const getApples = vi.fn(() => 0);

getApples();

expect(getApples).toHaveBeenCalled();
expect(getApples).toHaveReturnedWith(0);

getApples.mockReturnValueOnce(5);

const res = getApples();
expect(res).toBe(5);
expect(getApples).toHaveNthReturnedWith(2, 5);
```

### `vi.spyOn()`

**在对象的方法或者 getter/setter 上创建一个监听**

```ts
// 类型定义 
type spyOn<T, K extends keyof T> = (
  object: T,
  method: K,
  accessType?: 'get' | 'set'
) => MockInstance
// 使用示例
let apples = 0;
const obj = {
  getApples: () => 13,
};

const spy = vi
  .spyOn(obj, 'getApples')
  .mockImplementation(() => apples);

apples = 1;

expect(obj.getApples()).toBe(1);

expect(spy).toHaveBeenCalled();
expect(spy).toHaveReturnedWith(1);
```

### `MockInstance`

**`.mockName(name)` 设置内部模拟对象的名称，便于调试**

**`.getMockName()` 获取内部模拟对象的名称**

**`.mock.calls` 包含每次调用的所有参数的二维数组**

**`.mock.lastCall` 包含最后一次调用的所有参数的数组**

**`.mock.results` 包含每次调用的所有结果的数组(`type:return|throw`)**

**`.mock.instances` 包含所有以 `new` 的形式调用返回的实例组成的数组**

**`.mock.mockImplementation` 接收一个用于模拟对象实现的函数**
```ts
const mockFn = vi.fn().mockImplementation(apples => apples + 1)
// or: vi.fn(apples => apples + 1);

const NelliesBucket = mockFn(0)
const BobsBucket = mockFn(1)

NelliesBucket === 1 // true
BobsBucket === 2 // true

mockFn.mock.calls[0][0] === 0 // true
mockFn.mock.calls[1][0] === 1 // true
```

**`.mockImplementationOnce` 将每次调用设为不同的函数体**
```ts
const myMockFn = vi
  .fn(() => 'default')
  .mockImplementationOnce(() => 'first call')
  .mockImplementationOnce(() => 'second call')

// 'first call', 'second call', 'default', 'default'
console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn())
```

**`.mockResolvedValue` 模拟异步函数的成功返回**
```ts
it('async test', async () => {
  const asyncMock = vi.fn().mockResolvedValue(43);
  console.log(await asyncMock());// 43
});
```

**`.mockResolvedValueOnce` 模拟异步函数的单次成功返回**
```ts
const asyncMock = vi
  .fn()
  .mockResolvedValue('default')
  .mockResolvedValueOnce('first call')
  .mockResolvedValueOnce('second call')

await asyncMock() // first call
await asyncMock() // second call
await asyncMock() // default
await asyncMock() // default
```

**`.mockRejectedValue` 模拟异步函数的拒绝返回**

**`.mockRejectedValueOnce` 模拟异步函数的单次拒绝返回**

**`.mockReturnValue` 模拟函数的返回值**

**`.mockReturnValueOnce` 模拟函数单次的返回值**

**`.mockClear` 清除每一个对象模拟调用的所有信息**

**`.mockReset` 清除每一个对象模拟调用的所有信息并且将内部实现设置为空函数**

**`.mockRestore` 清除每一个对象模拟调用的所有信息并且将内部实现恢复为初始函数**


### `vi.stubGlobal(key, value)`

**注入一个全局变量**

## 高阶操作——模块模拟

### [vi.mock](https://cn.vitest.dev/api/#vi-mock)

### [vi.mocked](https://cn.vitest.dev/api/#vi-mocked)

### [vi.importmock](https://cn.vitest.dev/api/#vi-importmock)

### [vi.importactual](https://cn.vitest.dev/api/#vi-importactual)

### [vi.resetmodules](https://cn.vitest.dev/api/#vi-resetmodules)

### [vi.unmock](https://cn.vitest.dev/api/#vi-unmock)



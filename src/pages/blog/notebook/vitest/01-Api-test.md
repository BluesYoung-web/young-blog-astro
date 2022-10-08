---
title: vitest -> test
description: vitest -> test
image: /img/vitest.svg
date: 2022-05-09 09:30:00
---

[[toc]]

## 概述

**别名：`it`，后续代码全部简写为 `it`**

**定义了一组关于测试期望的方法**

```ts
type Awaitable<T> = T | PromiseLike<T>
type TestFunction = () => Awaitable<void>
// 函数签名
type Test = (
  // 测试名称
  name: string,
  // 含有测试期望的函数
  // 当 fn 为异步函数时，函数调用结束之前，测试不会结束
  fn: TestFunction,
  // 超时时间，默认 5s
  timeout?: number = 5000
) => void
```

## 基础使用

```ts
import { it, expect } from 'vitest';

it('should work as expected', () => {
  expect(Math.sqrt(4)).toBe(2);
});
```

### `it.skip`

在不删除测试代码的情况下**跳过**该测试

```ts
// 测试被跳过，不会导致测试结果失败
it.skip('should work as expected', () => {
  expect(Math.sqrt(4)).toBe(3);
});
```

### `it.skipIf(cond)`

**在满足特定条件的情况下跳过该测试**

```ts
const isDev = process.env.NODE_ENV === 'development';

it.skipIf(isDev)('prod only test', () => {
  // this test only runs in production
});
```

### `it.runIf(cond)`

**在满足特定条件的情况下执行该测试**

```ts
const isDev = process.env.NODE_ENV === 'development';

it.runIf(isDev)('dev only test', () => {
  // this test only runs in development
});
```

### `it.only`

**仅运行被标记的测试**

```ts
// 仅运行 此类 测试，未被标记的会自动跳过
it.only('should work as expected', () => {
  expect(Math.sqrt(4)).toBe(2);
});
```

### `it.todo`

**标记待实现的测试**

```ts
it.todo('unimplemented test');
```

### `it.concurrent`

**并发测试**

可以和 `todo | only | skip` 同时使用

```ts
// 整个测试大概需要消耗 3s = 1 + 1 + 1
it('串行测试1', async () => {
  return new Promise((res) => setTimeout(() => {
    console.log('串行测试1');
    res();
  }, 1000));
});
it('串行测试2', async () => {
  return new Promise((res) => setTimeout(() => {
    console.log('串行测试2');
    res();
  }, 1000));
});
// 并行测试需要使用快照(toMatchSnapshot)时，必须使用上下文的expect!!!
it.concurrent('并行测试1', async ({ expect }) => {
  return new Promise((res) => setTimeout(() => {
    console.log('并行测试1');
    res();
  }, 1000));
});

it.concurrent('并行测试2', async ({ expect }) => {
  return new Promise((res) => setTimeout(() => {
    console.log('并行测试2');
    res();
  }, 1000));
});

it.todo.concurrent('待实现的并行测试');
```


### `it.fails`

**显示标记错误的测试，只有当期望失败时才会通过**

```ts
it.fails('should work as expected', () => {
  expect(Math.sqrt(4)).toBe(3);
});
```

### `it.each`

**使用不同的变量运行相同的测试**

你可以按照测试参数的顺序，在测试名称插入符合 [printf](https://nodejs.org/api/util.html#util_util_format_format_args) 格式的参数
- %s：字符串
- %d：数值
- %i：整数
- %f：小数
- %j：json格式
- %o：对象
- %#：对应的测试参数下标
- %%：单个百分比符号 ('%')

```ts
it.each([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3]
])('add(%i, %i) -> %i', (a, b, res) => {
  expect(a + b).toBe(res);
});
// this will return
// √ add(1, 1) -> 2
// √ add(1, 2) -> 3
// √ add(2, 1) -> 3
```

## `describe`

当在文件顶层直接使用 `test | it` 时，它们将作为**隐式测试套件**的一部分被收集

使用 `describe` 可以在当前上下文中定义一个新的测试套件，将其看作一组相关测试或有别于其它的嵌套测试套件

```ts
const person = {
  isActive: true,
  age: 32,
};

describe('person', () => {
  it('person is defined', () => {
    expect(person).toBeDefined()
  });

  it('is active', () => {
    expect(person.isActive).toBeTruthy();
  });
  // describe 可以嵌套使用
  describe('the age can\'t be larger than 32', () => {
    it('age limit', () => {
      expect(person.age).toBeLessThanOrEqual(32);
    });
  })
});
```

### `describe.skip`

**跳过特定的测试套件**

### `describe.only`

**仅运行特定的测试套件**

### `describe.todo`

**标记待实现的测试套件**

### `describe.concurrent`

**测试套件内的所有测试全部为并行测试**

可以和 `todo | only | skip` 同时使用

### `describe.each`

**当多个测试依赖相同的数据时使用**

```ts
describe.each([
  { a: 1, b: 1, expected: 2 },
  { a: 1, b: 2, expected: 3 },
  { a: 2, b: 1, expected: 3 },
])('describe object add(%i, %i)', ({ a, b, expected }) => {
  it(`returns ${expected}`, () => {
    expect(a + b).toBe(expected);
  });
  it(`returned value not be greater than ${expected}`, () => {
    expect(a + b).not.toBeGreaterThan(expected);
  });
  it(`returned value not be less than ${expected}`, () => {
    expect(a + b).not.toBeLessThan(expected);
  });
});
```
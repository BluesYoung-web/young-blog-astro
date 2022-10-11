---
layout: "@/layouts/BlogPost.astro"
title: vitest -> 生命周期钩子
description: vitest -> 生命周期钩子
image: /img/vitest.svg
date: 2022-05-10 09:45:00
---

[[toc]]

## 概述

**用于在测试特定的生命周期过程中执行某些操作**

如果在顶层使用，则**适用于当前上下文**

如果在 `describe` 内部使用，则**适用于当前测试套件**

## `beforeEach`

注册一个**在当前上下文中的每个测试运行之前被调用的函数**

**如果函数返回一个 Promise，则会等到 Promise 解决之后再运行测试**

```ts
// 函数签名
beforeEach(fn: () => Awaitable<void>, timeout?: number)
// 使用示例
import { beforeEach } from 'vitest';
beforeEach(async () => {
  // 在每个测试运行之前调用一次
  await prepareSomething();

  // 0.10.0 之后新增
  // 相当于 afterEach，但是在 afterEach 之前被调用
  // 清理方法，在每个测试运行后调用一次
  return async () => {
    await resetSomething();
  }
});
```

## `afterEach`

注册一个**在当前上下文中的每个测试运行之后被调用的函数**

**如果函数返回一个 Promise，则会等到 Promise 解决之后再继续**

```ts
// 函数签名
afterEach(fn: () => Awaitable<void>, timeout?: number)
// 使用示例
import { afterEach } from 'vitest';
afterEach(async () => {
  await resetSomething();
});
```

## `beforeAll`

注册一个**在当前上下文中的所有测试运行之前被调用的函数**

**如果函数返回一个 Promise，则会等到 Promise 解决之后再运行测试**

```ts
// 函数签名
beforeAll(fn: () => Awaitable<void>, timeout?: number)
// 使用示例
import { beforeAll } from 'vitest';
beforeAll(async () => {
  // 在所有测试运行之前调用一次
  await prepareSomething();

  // 0.10.0 之后新增
  // 相当于 afterAll，在 afterAll 之后被调用
  // 清理方法，在所有测试运行后调用一次
  return async () => {
    await resetSomething();
  }
});
```

## `afterAll`

注册一个**在当前上下文中的所有测试运行之后被调用的函数**

**如果函数返回一个 Promise，则会等到 Promise 解决之后再继续**

```ts
// 函数签名
afterAll(fn: () => Awaitable<void>, timeout?: number)
// 使用示例
import { afterAll } from 'vitest';
afterAll(async () => {
  // 在所有测试运行之后调用一次
  await prepareSomething();
});
```
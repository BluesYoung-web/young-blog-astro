---
layout: "@/layouts/BlogPost.astro"
title: vue3 provide & inject
description: vue3 provide & inject
date: 2022-02-20 11:35:00
image: /img/vue.jpeg
---

[[toc]]

## `provide`

提供一个值，该值可以**在当前组件的任意代子组件内部获取**

**必须在 `setup` 的顶层同步调用**

```ts
function provide<T>(
  key: InjectionKey<T> | string,
  value: T
): void

// 全局提供
app.provide('key', 'value');

import { provide, inject, InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>
provide(key, 'foo') // 若提供的是非字符串值会导致错误
const foo = inject(key) // foo 的类型：string | undefined
```

## `inject`

从祖先提供的数据中取出对应的数据

**必须在 `setup` 的顶层同步调用**

```ts
// 不提供默认值
function inject<T>(key: InjectionKey<T> | string): T | undefined
// 提供默认值，默认值不为函数
function inject<T>(
  key: InjectionKey<T> | string,
  defaultValue: T
): T
// 提供函数的返回值作为默认值
function inject<T>(
  key: InjectionKey<T> | string,
  // 以函数的形式提供默认值
  defaultValue: () => T,
  // 指定函数是直接作为默认值还是，使用函数的返回值作为默认值
  treatDefaultAsFactory: true
): T
```
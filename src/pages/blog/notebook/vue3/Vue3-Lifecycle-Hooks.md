---
title: vue3 生命周期钩子
description: vue3 生命周期钩子
date: 2022-02-18 13:10:00
image: /img/vue.jpeg
---

[[toc]]


## 生命周期

![vue3生命周期](/img/vue-lifecycle.png)

## 常用

**`SSR` 服务端不会被调用**

### `onBeforeMounted`

组件挂载之前调用(无法获取到真实的 `DOM` 元素，可以进行网络请求)

### `onMounted`

组件挂载之后调用(可以获取到真实的 `DOM` 元素)

### `onBeforeUpdated`

有响应式的数据发生改变之前调用

### `onUpdated`

有响应式的数据发生改变之后调用

### `onBeforeUnMounted`

组件销毁之前调用，可以在此时添加一个离开提示什么的

### `onUnMounted`

组件销毁之后调用，常用于清除事件监听、定时器(副作用)，防止内存溢出

## `<keep-alive> 内部专用`

**`SSR` 服务端不会被调用**

### `onActivated`

组件处于激活(聚焦)状态时调用

### `onDeactivated`

组件处于非激活(失焦)状态时调用

## 错误捕获

`onErrorCaptured` **注册子组件中发生 vue 错误时的处理函数**


```ts
function onErrorCaptured(callback: ErrorCapturedHook): void

type ErrorCapturedHook = (
  err: unknown,
  instance: ComponentPublicInstance | null,
  info: string
) => boolean | void
```

## `SSR` 专属

`onServerPrefetch` **在组件被服务端渲染完成之前注册一个异步函数**

服务端会**等待异步函数解决之后**再渲染组件

## 开发阶段专属

### `onRenderTracked`

注册调试**组件重绘追踪到响应式依赖**的钩子函数

### `onRenderTriggered`

注册调试**响应式依赖触发组件重绘**的钩子函数

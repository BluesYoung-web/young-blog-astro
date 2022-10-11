---
layout: "@/layouts/BlogPost.astro"
title: vue3 异步组件&自定义原生组件(WebComponent)
description: vue3 异步组件&自定义原生组件(WebComponent)
date: 2022-02-21 10:00:00
image: /img/vue.jpeg
---

[[toc]]

## `defineAsyncComponent`

```ts
// 异步导入 () => import('*.vue')
type AsyncComponentLoader = () => Promise<Component>
// 异步组件
interface AsyncComponentOptions {
  // 加载函数
  loader: AsyncComponentLoader
  // 加载中时，展示的组件
  loadingComponent?: Component
  // 加载出错时，展示的组件
  errorComponent?: Component
  // 加载完成到展示之间的延时，默认 200ms
  delay?: number
  // 加载超时
  timeout?: number
  // 加载状态是否受 suspense 组件的控制，默认为 true
  suspensible?: boolean
  onError?: (
    // 错误信息
    error: Error,
    // 重试回调
    retry: () => void,
    // 失败回调
    fail: () => void,
    // 尝试过的次数
    attempts: number
  ) => any
}

function defineAsyncComponent(
  source: AsyncComponentLoader | AsyncComponentOptions
): Component
```

## `defineCustomComponent`

`3.2+`，返回一个原生的 **自定义元素**（原生组件，不受限于框架）

```html
<template>
	<my-vue-element></my-vue-element>
</template>
<script>
import { defineCustomElement } from 'vue';
const MyVueElement = defineCustomElement({
  // 这里是普通的 Vue 组件选项
  props: {},
  emits: {},
  template: `...`,
  // 只用于 defineCustomElement：注入到 shadow root 中的 CSS
  styles: [`/* inlined css */`],
  setup() {}
});
// 注册该自定义元素。
// 注册过后，页面上所有的 `<my-vue-element>` 标记会被升级。
customElements.define('my-vue-element', MyVueElement);
// 你也可以用编程的方式初始化这个元素：
// (在注册之后才可以这样做)
document.body.appendChild(
  new MyVueElement({
    // 初始化的 prop (可选)
  })
);
</script>
```

### 生命周期

当该元素的 `connectedCallback` 初次调用时，一个 `Vue` 自定义元素会在内部挂载一个 `Vue` 组件实例到它的 `shadow root` 上

当此元素的 `disconnectedCallback` 被调用时，`Vue` 会在一个微任务后检查元素是否从文档中脱离
  - 如果元素仍然在文档中，那么说明它是一次移动，组件实例将被保留
  - 如果该元素从文档中脱离，那么说明它是一次移除，组件实例将被解除挂载

### `props`

所有使用 `props` 选项声明了的 `props` **都会作为属性定义在该自定义元素上**

`Vue` 会自动地、恰当地处理其作为 `attribute` 还是属性的反射
  - `attribute` 总是根据需要反射为相应的属性类型
  - 基础类型的属性值 (`string`，`boolean` 或 `number`) 会被反射为 `attribute`

`Vue` 也会在它们被设置为 `attribute` 时**自动转换以 `Boolean` 或 `Number` 类型声明的 `props` 到所期望的类型，当它们被设为 `attributes` 时 (永远是字符串)**

```js
props: {
  selected: Boolean,
  index: Number
}
```

```html
<my-element selected index="1"></my-element>
```

### 事件

通过 `this.$emit` 或者 `setup` 中的 `emit` 触发的事件**都会通过以 [CustomEvents](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events#adding_custom_data_%E2%80%93_customevent) 的形式从自定义元素上派发**

**额外的事件参数 (`payload`) 将会被暴露为 `CustomEvent` 对象上的一个 `details` 数组**

### 插槽

当使用最终的元素时，**它只接受[原生插槽](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots)的语法**：
  - **不支持作用域插槽**
  - 具名插槽时，应使用 `slot attribute` 而不是 `v-slot` 指令

### `provide & inject`

<n-alert class="mt-4" type="warning">**只会在自定义元素之间使用**</n-alert>

### `SFC` 单文件组件

<n-alert class="mt-4" type="info">**文件名称需要以 `.ce.vue` 结尾**</n-alert>

```ts
import { defineCustomElement } from 'vue'
import Example from './Example.ce.vue'

console.log(Example.styles) // ["/* 内联 css */"]

// 转换为自定义元素构造器
const ExampleElement = defineCustomElement(Example)
// 注册
customElements.define('my-example', ExampleElement)
// 实例化
new ExampleElement()
```
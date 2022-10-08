---
title: vue3 渲染机制
description: vue3 渲染机制
date: 2022-02-22 09:30:00
image: /img/vue.jpeg
---

[[toc]]

## `Virtual DOM`

**将真实元素及其 `UI` 以对象的形式抽象出来，保存到内存中并随时保持同步**

**一个运行时的渲染器会遍历整个虚拟 `DOM` 树，并据此构建真实的 `DOM` 树(挂载)**

<n-alert type="info">**最大的好处就是，当需要 `DOM` 更新时，渲染器会先进行 `DOM Diff`，然后只更新需要更新的部分**</n-alert>

## 渲染过程

### 编译

**`Vue` 模板文件被编译为渲染函数**

可以在**构建步骤完成**，也可以在**运行时即时编译**

### 挂载

**运行时渲染器调用渲染函数，遍历返回的虚拟 `DOM` 树，并基于它创建实际的 `DOM` 节点**

这一步会作为**响应式副作用**执行，因此它会追踪其中所用到的所有响应式依赖

### 更新/修补(`patch`)

当一个依赖发生变化之后，**副作用会重新执行**

此时会创建一个**更新之后的虚拟 `DOM`**，渲染器会遍历对比新旧虚拟 `DOM`，然后**将必要的更新应用到真实 `DOM`**

![渲染流程图](/img/render-pipeline.png)

## 使用模板的好处

更加贴近实际的 `HTML`，方便现有代码的重用

更加方便地理解和修改 `CSS` 样式

更容易对模板做**静态分析**，这使得 `Vue` 的模板编译器能够**应用许多编译时优化来提升虚拟 `DOM` 的性能表现**

### 编译时优化

**带编译时信息的虚拟 `DOM`**

*`React` 不带，所以**每次更新时都需要完整遍历整个虚拟 `DOM`***

**以修补标记为例：**

```html
<!-- 仅含 class 绑定 -->
<div :class="{ active }"></div>

<!-- 仅含 id 绑定 -->
<input :id="id" :value="value">

<!-- 仅含文本子节点 -->
<div>{{ dynamic }}</div>
```

```ts
// 转换成的渲染函数
createElementVNode("div", {
  class: _normalizeClass({ active: _ctx.active })
}, null, 2 /* CLASS */)

createElementVNode("input", {
  id: _ctx.id,
  value: _ctx.value
}, null, 8 /* PROPS */, ["id", "value"])

createElementVNode("div", null, _toDisplayString(_ctx.dynamic), 1 /* TEXT */)
```

```ts
// 渲染器逻辑
if (vnode.patchFlag & PatchFlags.CLASS /* 2 */) {
  // 更新节点的 CSS 类
}
```
---
title: vue3 渲染函数
description: vue3 渲染函数
date: 2022-02-22 10:20:00
image: /img/vue.jpeg
---

[[toc]]

## 渲染函数 `h()`

### 类型说明

```ts
// 子元素的类型：字符串 | 数值 | 布尔值 | 虚拟DOM(嵌套渲染函数) | null | 子元素数组
type Children = string | number | boolean | VNode | null | Children[]
// 匿名插槽
type Slot = () => Children
// 具名插槽
type Slots = { [name: string]: Slot }
// 完整的函数签名
function h(
  // 接受元素名称或者组件
  type: string | Component,
  // 传递给元素(组件)的参数
  props?: object | null,
  // 元素(组件)的子元素 | 匿名插槽 | 具名插槽
  children?: Children | Slot | Slots
): VNode

// 不包含参数的函数重载
function h(
  // 接受元素名称或者组件
  type: string | Component,
  // 元素(组件)的子元素 | 匿名插槽
  children?: Children | Slot
): VNode
```

### 使用示例

```ts
import { h } from 'vue'
// 正常使用
// <div></div>
h('div')
// <div id="foo">hello</div>
h('div', { id: 'foo' }, 'hello')
// <div class="bar">hello</div>
h('div', { class: 'bar', innerHTML: 'hello' })
// <div :class="[foo, { bar }]" style="color: red;" @click="() => {}">hello</div>
h('div', { class: [foo, { bar }], style: { color: 'red' }, onClick: () => {} })

// 无参数使用
// <div>hello</div>
h('div', 'hello')
// <div><span>hello</span></div>
h('div', [h('span', 'hello')])
// <div>hello1<span>hello2</span></div>
h('div', ['hello1', h('span', 'hello2')])

// 组件 & 插槽
import Foo from './Foo.vue'
// <Foo some-prop="hello" @update="() => {}" />
h(Foo, {
  someProp: 'hello',
  onUpdate: () => {}
})
// <Foo>default slot</Foo>
h(Foo, () => 'default slot')
// passing named slots
// notice the `null` is required to avoid
// slots object being treated as props
/*
<Foo>
  <template #default>
    default slot
  </template>
  <template #foo>
    <div>foo</div>
  </template>
  <template #bar>
    <span>one</span>
    <span>two</span>
  </template>
</Foo>
*/
h(Foo, null, {
  default: () => 'default slot',
  foo: () => h('div', 'foo'),
  bar: () => [h('span', 'one'), h('span', 'two')]
})
```

## 其他工具函数

### `mergeProps`

**用于合并多个参数对象**

```ts
// 函数签名
function mergeProps(...args: object[]): object
// 使用示例
import { mergeProps } from 'vue'

const one = {
  class: 'foo',
  onClick: handlerA
}

const two = {
  class: { bar: true },
  onClick: handlerB
}

const merged = mergeProps(one, two)
/*
{
  class: 'foo bar',
  onClick: [handlerA, handlerB]
}
*/
```

### `cloneVNode`

**用于克隆一个虚拟 `DOM`**

```ts
// 函数签名
function cloneVNode(
  // 需要克隆的目标 vnode
  vnode: VNode,
  // 需要额外添加进合并之后的 vnode 的参数
  extraProps?: object
): VNode
// 使用示例
import { h, cloneVNode } from 'vue'

const original = h('div')
const cloned = cloneVNode(original, { id: 'foo' })
```

### `isVNode`

**接受一个参数，返回其是否为 `vnode`**

```ts
function isVNode(value: unknown): boolean
```

### `resolveComponent`

**用于使用名称索引一个已经注册过的组件，如果找不到则直接返回字符串并触发 `Vue` 警告**

<n-alert type="info">**如果可以直接导入组件，建议不要使用此函数**</n-alert>

<n-alert type="warning">**为了正确的解析组件上下文，必须在 `setup` 内部调用**</n-alert>

```ts
// 函数签名
function resolveComponent(name: string): Component | string
// 使用示例
import { h, resolveComponent } from 'vue'

export default {
  setup() {
    const ButtonCounter = resolveComponent('ButtonCounter')
    return () => h(ButtonCounter)
  }
}
```

### `resolveDirective`

**用于使用名称索引一个已经注册过的指令，如果找不到则返回 `undefined` 并触发 `Vue` 警告**

<n-alert type="info">**如果可以直接导入指令，建议不要使用此函数**</n-alert>

<n-alert type="warning">**为了正确的解析组件上下文，必须在 `setup` 内部调用**</n-alert>

### `widthDirectives`

**用于给 `vnode` 添加自定义指令**

```ts
// 函数签名
function withDirectives(
  vnode: VNode,
  // 指令及其参数组成的数组
  directives: DirectiveArguments
): VNode

// [Directive, value, argument, modifiers]
type DirectiveArguments = Array<
  | [Directive] // 指令对象
  | [Directive, any] // 指令对象，指令值
  | [Directive, any, string] // 指令对象，指令值，指令属性名
  | [Directive, any, string, DirectiveModifiers]
    // 指令对象，指令值，指令属性名，指令修饰符
>

// 使用示例
import { h, withDirectives } from Vue

// a custom directive
const pin = {
  mounted() { /* ... */ },
  updated() { /* ... */ }
}

// <div v-pin:top.animate="200"></div>
const vnode = withDirectives(h('div'), [
  [pin, 200, 'top', { animate: true }]
])
```

## `TSX`

### 基本使用

```ts
export default defineComponent({
  setup() {
    return () => (<div>Hello World !</div>)
  }
})
```

### 指令

```code
v-if => 三元运算符

v-for => arr.map

v-on => 驼峰属性(+驼峰修饰符) = {() => {/*回调函数*/}}
v-on => 驼峰属性 = { withModifiers(() => {/*回调函数*/}, ['修饰符']) }

v-model => modelValue + onUpdate:modelValue
```

### 插槽

```ts
// 定义
export default defineComponent({
  setup(props, { slots }) {
    return () => (
      <div>
        { slots.default?.() }
        { slots.footer?.({ text: props.message }) ?? 'default footer' }
      </div>
    )
  }
})
// 使用
// 默认插槽
<MyComponent>{() => 'hello'}</MyComponent>
// 具名插槽 1
<MyComponent>
{{
  default: () => 'default slot',
  footer: () => <div>sub footer</div>,
}}
</MyComponent>
// 具名插槽 2
<MyComponent
  v-slots={{
    default: () => 'default slot',
    footer: () => <div>sub footer</div>,
  }}
></MyComponent>
// 具名插槽 3
<MyComponent
  v-slots={{
    footer: () => <div>sub footer</div>,
  }}
>default slot</MyComponent>
```

## 自定义渲染

**提供一个平台无关的渲染函数(没有真实 DOM 操作)**

### 类型定义

```ts
function createRenderer<HostNode, HostElement>(
  options: RendererOptions<HostNode, HostElement>
): Renderer<HostElement>

interface Renderer<HostElement> {
  render: RootRenderFunction<HostElement>
  createApp: CreateAppFunction<HostElement>
}

interface RendererOptions<HostNode, HostElement> {
  patchProp(
    el: HostElement,
    key: string,
    prevValue: any,
    nextValue: any,
    // 下面的内容基本没用
    isSVG?: boolean,
    prevChildren?: VNode<HostNode, HostElement>[],
    parentComponent?: ComponentInternalInstance | null,
    parentSuspense?: SuspenseBoundary | null,
    unmountChildren?: UnmountChildrenFn
  ): void
  insert(
    el: HostNode,
    parent: HostElement,
    anchor?: HostNode | null
  ): void
  remove(el: HostNode): void
  createElement(
    type: string,
    isSVG?: boolean,
    isCustomizedBuiltIn?: string,
    vnodeProps?: (VNodeProps & { [key: string]: any }) | null
  ): HostElement
  createText(text: string): HostNode
  createComment(text: string): HostNode
  setText(node: HostNode, text: string): void
  setElementText(node: HostElement, text: string): void
  parentNode(node: HostNode): HostElement | null
  nextSibling(node: HostNode): HostNode | null

  // 可选部分，与 DOM 耦合
  querySelector?(selector: string): HostElement | null
  setScopeId?(el: HostElement, id: string): void
  cloneNode?(node: HostNode): HostNode
  insertStaticContent?(
    content: string,
    parent: HostElement,
    anchor: HostNode | null,
    isSVG: boolean
  ): [HostNode, HostNode]
}
```

### 使用示例

```ts
import { createRenderer } from '@vue/runtime-core'

const { render, createApp } = createRenderer({
  // 根据需要，自行实现
  patchProp,
  insert,
  remove,
  createElement
})

// `render` is the low-level API
// `createApp` returns an app instance
export { render, createApp }

// re-export Vue core APIs
export * from '@vue/runtime-core'
```
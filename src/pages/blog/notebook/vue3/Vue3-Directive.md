---
title: vue3 指令
description: vue3 指令
date: 2022-02-18 14:32:00
image: /img/vue.jpeg
---

[[toc]]

## `v-bind`

```html
<!-- 基本使用 -->
<div v-bind:id="dynamicId"></div>
<!-- 缩写 -->
<div :id="dynamicId"></div>
<!-- 动态属性名，复杂属性建议使用计算属性 -->
<div :[propName]="dynamicId"></div>
<!-- 动态绑定多个值 -->
<div v-bind="{ foo: 'bar', n: 9527 }"></div>
```

### 修饰符

**`.camel` 短线属性名转驼峰属性名**，默认表现，基本不用管

`.prop` 强制设置属性为 `DOM` 元素的 `property`，`3.2+`，**简写为 `.`**

`.attr` 强制设置属性为 `DOM` 元素的 `attribute`，`3.2+`

## `v-click`

```html
<!-- 基础写法 -->
<button v-on:click="doSomething"> ... </button>
<!-- 缩写 -->
<button @click="doSomething"> ... </button>
<!-- 原生事件对象 -->
<button @click="(event) => doSomething('test', event)"> ... </button>
<button @click="doSomething('test', $event)"> ... </button>
<!-- 动态事件名称 -->
<button @[eventName]="doSomething"> ... </button>
```

### 事件修饰符

`.stop` 阻止事件冒泡

`.prevent` 阻止浏览器默认行为

**`.capture` 以事件捕获模式监听**

**`.self` 限制事件范围为当前元素**

`.once` 只触发一次

`.left` 点击鼠标左键触发

`.right` 点击鼠标右键触发

`.middle` 点击鼠标中键(滚轮)触发

**`.passive` 一般用于触摸事件的监听器，可以用来提升移动端设备上的性能表现 `@scroll.passive`**

`.{keyAlias}` 特定的键盘按键触发 `@keyup.enter`

**`.exact` 确保所需的所有操作都存在才会触发**


## `v-model`

`绑定值 | 触发事件 | 修饰符对象`

默认值 `v-model[:modelValue] | emit('update:modelValue', value) | props.modelModifiers`

自定义值 `v-model:page | emit('update:page', value) | props.pageModifiers`

当添加某个修饰符时，其对应的 **修饰符对象会拥有修饰符对应的属性，值为 true**

### 使用场景

`<input>`

`<select>`

`<textarea>`

`components`

### 修饰符

`.lazy` 懒触发，监听 `change` 事件，而不是 `input` 事件

`.number` 将输入的内容转换为数字

`.trim` 对于输入的内容进行去除首尾空格的操作

## `v-slot`

**简写为 `#`**，用于**具名插槽**或者**接收作用域插槽的参数**

```html
<!-- 常规 -->
<template v-slot:header>
  Header content
</template>
<!-- 简写 -->
<template #header>
  Header content
</template>
<!-- 作用域插槽 -->
<Mouse #default="{ x, y }">
  Mouse position: {{ x }}, {{ y }}
</Mouse>
```

### 使用场景

`<template>`

**只有一个默认的插槽，并且拥有插槽参数的组件**

## 性能优化

`v-pre` **跳过渲染，原封不动的输出**

`v-once` **仅首次渲染，后续不会更新**

`v-memo="[...]"`
  - **`3.2+` 用于 `v-for` 性能优化(长度 > 1000)**
  - 当传入的数组中的每个值都与上次完全相同时，会直接跳过其子树的更新，类似于 `v-once` 的效果

## 视觉优化

`v-cloak` **确保元素编译完成之前不会显示(不会显示模板然后闪现)**

## 自定义指令

<n-alert type="warning" title="不会被 $attr 继承">如果组件拥有多个根节点，不推荐在组件上使用自定义指令</n-alert>

### 钩子接收的参数

`el` 对应元素 `DOM` 的引用

`binding` 为包含以下属性的对象
  - `value` 传递给指令的值
  - `oldValue` 之前的值，**仅在 `beforeUpdate` 和 `updated` 中可用**
  - `arg` 传递给指令的参数
  - `modifiers` 包含所有修饰符为键名，键值为 `true` 的对象
  - `instance` **使用该指令的组件实例 `this`**
  - `dir` **指令定义对象(`app.directive('指令名称', 指令定义对象)`)**

`vnode` 对应元素的底层 `VNode`

`prevNode` 之前渲染中的 `VNode`，**仅在 `beforeUpdate` 和 `updated` 中可用**

```html
<!-- 
app.directive('example', {
  mounted(...args){
    console.log(args)
  },
  created(){}
})
-->
<div id="directive-test-demo" v-example:foo.bar="'baz'">
<!-- el: div#directive-test-demo -->
<!-- 
binding: {
  value: 'baz',
  oldValue: '更新之前的值，部分可用',
  arg: 'foo',
  modifiers: { bar: true },
  instance: div#directive-test-demo -> thisObj,
  dir: {
    mounted(...args){
      console.log(args)
    },
    created(){}
  }
}
-->
```

### 可选生命周期

```ts
const myDirective = {
  // 在绑定元素的 attribute 前调用
  // 或事件监听器应用前调用
  created() {},
  // 在元素被插入到 DOM 前调用
  beforeMount() {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都 挂载 完成后调用
  mounted() {},
  // 绑定元素的父组件更新前调用
  beforeUpdate() {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都 更新 完成后调用
  updated() {},
  // 绑定元素的父组件卸载之前调用
  beforeUnmount() {},
  // 绑定元素的父组件卸载之后调用
  unmounted() {}
}
```

### 简化形式

```ts
app.directive('color', (el, binding) => {
  // 这会在 `mounted` 和 `updated` 时都调用
  el.style.color = binding.value
})
```
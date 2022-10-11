---
layout: "@/layouts/BlogPost.astro"
title: vue3 模板 ref
description: vue3 模板 ref
date: 2022-02-20 14:00:00
image: /img/vue.jpeg
---

[[toc]]

## 定义

`ref` 为一个特殊的 `attribute`

**允许在某个元素或组件被挂载之后，直接获得对其的应用**

## 基本使用

```ts
<script setup>
import { ref, onMounted } from 'vue'

// 声明一个 ref 来存放该元素的引用
// 必须和模板 ref 同名!!!
const input = ref(null)
onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

## `v-for` 中的 `ref`

**值为一个数组，不能保证顺序**

```ts
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([
  /* ... */
])
const itemRefs = ref([])
onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

## 函数 `ref `

**接收一个函数作为属性值，每次更新时都会调用**

**函数参数为该元素的引用**

```ts
<input :ref="(el) => { /* assign el to a property or ref */ }">
```

## 组件 `ref`

**引用的值为组件的实例，可以直接调用组件的属性和方法**

<n-alert type="info">**`Options API` 默认将属性和方法都暴露**</n-alert>

<n-alert type="info">**`<script setup>` 需要主动调用 `defineExpose` 显示暴露**</n-alert>

```html
<!-- MyModal.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const isContentShown = ref(false)
const open = () => (isContentShown.value = true)

const title = ref('hello wolrd')
// defineExpose 会自动解套
defineExpose({
  open,
  title
})
</script>
<!-- App.vue -->
<script setup lang="ts">
import MyModal from './MyModal.vue'

const modal = ref<InstanceType<typeof MyModal> | null>(null)

const openModal = () => {
  console.log(modal.value?.title);
  modal.value?.open()
}
</script>
```
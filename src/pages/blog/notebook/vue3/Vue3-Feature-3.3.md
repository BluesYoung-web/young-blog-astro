---
title: vue3.3 新特性
description: vue3.3 新特性
date: 2023-05-14 16:20:00
image: /img/vue.jpeg
---

[[toc]]

## 支持定义泛型组件

### `.vue`

```html
<script setup lang="ts" generic="T extends string | number, U extends Item">
import type { Item } from './types'
defineProps<{
  id: T;
  list: U[];
}>();
</script>
```

### `tsx`

```tsx
export defineComponent(<T,>(props: T) => {
  return () => <div>{props}</div>;
});
```

## `defineEmits` 简写

```ts
// BEFORE
const emit = defineEmits<{
  (e: 'foo', id: number): void;
  (e: 'bar', name: string, ...rest: any[]): void;
}>();

// AFTER
const emit = defineEmits<{
  foo: [id: number];
  bar: [name: string, ...rest: any[]];
}>();
```

## `defineSlots` 插槽类型定义

```ts
defineSlots<{
  default?: (props: { msg: string }) => any;
  item?: (props: { id: number }) => any;
}>();
```

## 实验特性

### `defineModel`

```html
<script setup>
const modelValue = defineModel();
const nameValue = defineModel('name', { required: false, default: 'bluesyoung' });
</script>

<template>
  <input v-model="modelValue" />
  <input v-model:name="nameValue" />
</template>
```

### `props` 解构赋值不丢失响应

## 其他

### `defineProps` 允许使用从外部导入的类型或者全局类型

### `defineOptions` 定义选项配置

### `toRef / toValue`
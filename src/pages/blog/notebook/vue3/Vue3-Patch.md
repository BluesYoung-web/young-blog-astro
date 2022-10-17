---
title: vue3 查漏补缺
description: vue3 查漏补缺
date: 2022-02-22 12:00:00
image: /img/vue.jpeg
---

[[toc]]

## 计算属性与函数

<n-alert type="info">**仅当响应式依赖发生改变时才会重新计算**</n-alert>

<n-alert type="warning">**函数每次都会重新计算**</n-alert>

```html
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // getter
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // setter
  set(newValue) {
    // 注意：我们这里使用的是解构赋值语法
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})

const bro = computed(() => firstName.value + '\'s bro')
</script>

<template>
  <div>{{ fullName }}</div>
  <div>{{ bro }}</div>
</template>
```

## `is`

`3.1+`，当 `is` 用于原生 `html` 元素时，它会被作为一个 **自定义内置元素** 进行转译

`is="vue:component-name"` **会将普通元素渲染为对应的 vue 组件**

## `setup(props, context)`

### `props`

**reactive 响应式对象，不能解构，解构之后会丢失响应**

**不得直接更改其值**

### `const { attrs, slots, emit, expose } = context`

**attrs：**
- **包含除了 `props` 声明过的属性之外的所有值**
- 随着组件的更新而改变，但**不是响应式对象，不要解构，需要在 `onBeforeUpdate` 钩子函数中监听其改变**
- **不进行驼峰转换**

**slots：**
- **包含除了放入其中的所有插槽内容**
- 随着组件的更新而改变，但**不是响应式对象，不要解构，需要在 `onBeforeUpdate` 钩子函数中监听其改变**

**emit：**
- 触发组件的事件更新
- 同 `$emit`

**expose：**
- 声明对父组件暴露的属性和方法
- 同 `defineExpose`

## `\<style scoped\>`

限制当前 `css` 样式局限于**当前组件**

**父组件样式不会泄露到子组件之中**

### 深度选择器

**在父组件内控制子组件的样式**

`v-html` 所创建的 `DOM` 不受作用域样式的影响，但是可以通过 `:deep()` 来控制

```html
<style scoped>
.a :deep(.b) {
  /* ... */
}
</style>
```

### 插槽选择器

默认情况下，作用域样式不会影响到 `<slot />` 渲染出来的内容

**可以通过 `:slotted` 来实现对插槽内容的影响**

```html
<style scoped>
:slotted(div) {
  color: red;
}
</style>
```

### 全局选择器

如果想**让作用域中的某个样式直接应用到全局**

相较于另起一个 `<style></style>`，`:global()` 会更加优雅

## `\<style module\>`

**会将内部的 `css` 类作为 `$style` 的属性暴露给 `<template>`**

```html
<script setup>
const $style = useCssModule();
// 命名模块 `<style module="s1"> => s1` 
const s1 = useCssModule('s1');
    
const color_ccc = ref('#ccc');
const styleObj = ref({
	border: '1px solid red',
	backgroundColor: '#eee'
});
</script>
<style>
.a {
	color: v-bind('color_ccc');
	border: v-bind('styleObj.border');
	backrgound-color: v-bind('styleObj.backgroundColor');
}
</style>
```

## `props & emits`

```html
<script lang="ts" setup>
import { defineProps, withDefaults, defineEmits } from 'vue';

interface Props {
  msg?: string;
};
const props = withDefaults(defineProps<Props>(), { msg: 'hello world' });

// const emit = defineEmits(['change', 'update']);
interface Emits {
  (e: 'change', id: number): void;
  (e: 'update', value: string): void;
};
const emit = defineEmits<Emits>();
</script>
```

## `slots & attrs`

```html
<script setup>
import { useSlots, useAttrs } from 'vue';

const slots = useSlots();
const attrs = useAttrs();
</script>
```

## `TS` 工具类

### `PropType\<T\>`

**用于在选项式 API 配置属性时声明属性类型**

```ts
import { PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

export default {
  props: {
    book: {
      // 提供更加具体的类型约束
      type: Object as PropType<Book>,
      required: true
    }
  }
}
```

### `ComponentCustomProperties`

**新增自定义全局属性**

```ts
import axios from 'axios'

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
  }
}
```

### `ComponentCustomOptions`

**新增自定义全局组件选项**

```ts
import { Route } from 'vue-router'

declare module 'vue' {
  interface ComponentCustomOptions {
    beforeRouteEnter?(to: any, from: any, next: () => void): void
  }
}
```

### `ComponentCustomProps`

**新增自定义全局组件参数**

```ts
declare module 'vue' {
  interface ComponentCustomProps {
    hello?: string
  }
}
```

```html
<MyComponent hello="world" />
```


## `render`

<n-alert class="my-4" type="info">**ElMessage 的实现原理**</n-alert>

```html
<script setup>
import { ref, render, h, onMounted } from 'vue';
const vm = h('div', {
  style: {
    backgroundColor: 'red'
  }
}, '啦啦啦');

const container = document.createElement('div');
render(vm, container);

const start = () => {
  if (document.body.contains(container)) {
    container.style.display = 'block';
  } else {
  	document.body.appendChild(container);
  }
  setTimeout(() => container.style.display = 'none', 3000);
};

const msg = ref('Hello World!');
</script>

<template>
  <h1 @click="start">{{ msg }}</h1>
</template>
```

```ts
import { render } from 'vue';

export declare const render: RootRenderFunction<Element | ShadowRoot>;
export declare type RootRenderFunction<HostElement = RendererElement> = (
  vnode: VNode | null,
  container: HostElement,
  isSVG?: boolean
) => void;
/**
 * 接收一个 VNode 节点和一个真实的宿主元素(DOM 或 shadowDOM)
 * 将 VNode 转换为真实 DOM 之后渲染到宿主元素内部
 */
```

## 不兼容 `Vue2`

### 全局 `API`

```js
// 替换
Vue.config => app.config

Vue.config.ignoredElements =>
  app.config.compilerOptions.isCustomElement

Vue.component => app.component

Vue.directive => app.directive

Vue.mixin => app.mixin

Vue.use => app.use

Vue.prototype => app.config.globalProperties

// 移除
Vue.config.productionTip
Vue.extend
```

### 修饰符

**按键修饰符，取消 `@keyup.codeNum`**

### `$listener`

**已被合并为 `$attrs` 的一部分**

### 应用挂载

**Vue2 直接替换挂载元素**

**Vue3 作为挂载元素的 innerHTML**

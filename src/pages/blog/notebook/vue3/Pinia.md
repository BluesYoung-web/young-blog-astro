---
layout: "@/layouts/BlogPost.astro"
title: 全新的状态管理库——Pinia
description: 全新的状态管理库——Pinia
image: /img/pinia.svg
date: 2022-02-23 11:18:01
---

[[toc]]

## 概述

**支持 Vue2 + Vue3**

<n-alert type="warning">**抛弃 mutations 操作，更加简洁直观**</n-alert>

**Composition API 式的写法，无需模块嵌套**

**完美支持 TypeScript**

## 插件安装

```ts
// vue3
import { createApp } from 'vue';
import { createPinia } from 'pinia';
const app = createApp();
app.use(createPinia());
app.mount('#app');

// vue2
import Vue from 'vue';
import { createPinia, PiniaVuePlugin } from 'pinia';

Vue.use(PiniaVuePlugin());
new Vue({
  el: '#app',
  pinia
});
```

## `defineStore`

```ts
// 完全形态
defineStore(
  '状态ID，必须全局唯一！！！',
  // 返回 state 的函数
  () => {
    return { name: value }
  },
  {
    // 可选配置
    getters: {
      name: (state): any => { state || this };
    },
    actions: {
      name(...args): void => { this }
    },
    // ssr 专用
    hydrate(state, initialState): void
  }
);
// 变种一
defineStore(
  '状态ID，必须全局唯一！！！',
  {
    // 必填配置
    state: (): any => {}
    // 可选配置
    getters: {
      name: (state): any => {};
    },
    actions: {
      name(...args): void => {}
    },
    // ssr 专用
    hydrate(state, initialState): void
  }
);
// 变种二
defineStore(
  {
    // 必填配置
    id: '状态ID，必须全局唯一！！！',
    state: (): any => {}
    // 可选配置
    getters: {
      name(state): any => {}
    },
    actions: {
      name(...args): void => {}
    },
    // ssr 专用
    hydrate(state, initialState): void
  }
);
// 热更
import { acceptHMRUpdate } from 'pinia';
const useXStore = defineStore();
import.meta.hot && import.meta.hot.accept(acceptHMRUpdate(useXStore, import.meta.hot));
```

## 使用 `Store`

<n-alert class="mt-4" type="warning">**`useStore` 返回的是 `reactive` 对象，不能直接解构使用**</n-alert>

```html
<script lang="ts" setup>
import { useDemoStore } from '/src/stores/demo';

const demo_store = useDemoStore();
// demo_stroe[prop] 可以直接读写
import { storeToRefs } from 'pinia';
// 不能直接解构，需要经过工具函数处理
const { propA, propB } = storeToRefs(demo_store);
// propA.value;
</script>
```

### `store` 实例的属性及方法

**.$reset()** 恢复为初始状态

**.$patch() 触发批量状态更新**
  - `.$patch({ propA: valueA, ... })`
  - `.$patch((state) => { state.propA = valueA; })`

**.$state = { propA: valueA, ... }** 状态替换

**.subscribe((mutation, state) => {})**
  - 注册状态更新时的回调
  - 默认组件卸载之后就会自动销毁，传入第二个参数 `{ detached: true }` 可以在组件销毁后继续监听
  - `mutation.type = 'direct' | 'patch object' | 'patch function'`
  - `mutation.storeId` 状态的 id
  - `mutation.payload` 传递给 `$patch` 的参数

**const unsubscribe = state.$onAction(({ name, store, args, after, onError }) => {})**
  - 注册 `actions` 操作的回调
  - `unsubscribe()` 取消监听
  - 默认组件卸载之后就会自动销毁，传入第二个参数 `true` 可以在组件销毁后继续监听

## `getters`

即可以直接使用传入的 `state`，也可以使用 `this` 获取当前状态

**使用其他模块，直接 `useOtherState()`**

## `actions`

使用 `this` 获取当前状态

**使用其他模块，直接 `useOtherState()`**

## 插件

给状态添加新的属性/方法

定义状态对象的时候添加新的选项

包装现有的方法

修改或甚至取消 `actions` 操作

实现副作用(比如固化到本地存储)

仅仅针对某些特殊的状态对象生效

### 简单示例

```ts
import { createPinia } from 'pinia';
import type { PiniaPluginContext } from 'pinia';

function SecretPiniaPlugin(
  { pinia, app, store, options }: PiniaPluginContext
) {
  // pinia pinia 实例
  // app Vue3 实例
  // store 当前使用插件的 store
  // options 在使用 defineStore 定义时传入的对象
  return { secret: 'the cake is a lie' }
}

const pinia = createPinia()
// give the plugin to pinia
pinia.use(SecretPiniaPlugin)

// in another file
const store = useStore()
store.secret // 'the cake is a lie'
```

### 类型说明文件

```ts
// 新增属性/方法
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomProperties<Y extends any = any> {
    $my_conf?: Y
  }
}

// 新增配置选项
import 'pinia'

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    // allow defining a number of ms for any of the actions
    debounce?: Partial<Record<keyof StoreActions<Store>, number>>
  }
}
```
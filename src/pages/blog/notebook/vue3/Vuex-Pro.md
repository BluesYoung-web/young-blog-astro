---
layout: "@/layouts/BlogPost.astro"
title: Vuex—02.进阶
description: Vuex—02.进阶
image: /img/vue.jpeg
date: 2021-07-21 16:24:25
---

[[toc]]

## `Composition API`

```js
import { useStore, computed } from 'vuex';

const store = useStore();
const count = computed(store.state.count);
store.commit('add', { num: 2 });
store.dispatch('addAsync', { num: 2, time: 3000 });
```

## `plugins`

暴露出每次 `mutation` 操作的参数(`{ type, payload }`)

`Vuex` 的插件就是一个**函数**，接受 `store` 作为唯一参数

**使用场景：**
  - 生成快照
  - 记录日志

```js
const myPlugin = (store) => {
  // store 初始化完成之后调用
  store.subscribe((mutation, state) => {
    // 每次 mutation 之后调用
    const { type, payload } = mutation;
  });
};
import { createStore } from 'vuex';
const store = createStore({
  plugins: [myPlugin]
});
```

## 严格模式

`strict: true`

如果状态发生了变更，并且不是由 `mutation` 函数引起的，就会**直接抛出错误**

**生产模式下不建议开启**

## 构造器选项

`state` 实例对象或函数

`mutations` 所有直接变更状态的方法

`actions` 所有异步触发 mutation 的方法

`getters` 所有自定义计算属性

`modules` 所有子模块

`plugins` 所有插件

`strict` 是否启用严格模式

## 实例属性

`state` 状态，**只读**

`getters` 暴露出注册的 `getter`，**只读**

## 实例方法

`commit` 提交同步变更

`dispatch` 触发异步变更

`replaceState(state)` 状态**替换**

`watch` 响应式侦听

`subscribe` 订阅 `commit` 操作

`subscribeAction` 订阅 `dispatch` 操作

`registerModule` 动态注册模块

`unregisterModule` 动态卸载模块

`hasModule` 检查该模块是否已经被注册

`hotUpdate` 热替换新的 `action` 和 `mutation`

## 辅助函数

`mapState`

`mapGetters`

`mapActions`

`mapMutations`

`createNamespacedHelpers(ns: string)` **基于命名空间创建上面四个函数的偏函数**
---
title: VueRouter—02.进阶-导航守卫
description: VueRouter—02.进阶-导航守卫
image: /img/vue.jpeg
date: 2021-07-27 15:34:17
---

[[toc]]

## 导航守卫

### 全局守卫

**`router.beforeEach()`**

- 全局**前置守卫**，**异步解析**执行
- 接收参数：
  - `(to, from) => boolean | RouteRecordRaw`
    - `to` 目的路由对象
    - `from` 源路由对象
    - 返回值：
      - `true` -> 进入目标路由
      - `false` -> 返回源路由
      - `RouteRecordRaw` -> 进入返回的路由对象对应的路由
  - `(to, from, next) => void`
    - `next(RouteRecordRaw = to)` 导航到传入的地址
    - **next在任何情况下都必须被严格调用一次**

**`router.beforeResolve()`**

- 全局**解析守卫**，**组件内守卫和异步路由组件被解析之后调用**

- **可以在用户无法进入页面的情况下，获取数据或进行任何其他想避免的操作**
- 参数同上
- 示例：请求使用\*\*权限

```js
router.beforeResolve(async (to) => {
  if (to.meta.requiresCamera) {
    try {
      await askForCameraPermission();
    } catch (error) {
      if (error instanceof NotAllowedError) {
        // ... 处理错误，然后取消导航
        return false;
      } else {
        // 意料之外的错误，取消导航并把错误传给全局处理器
        throw error;
      }
    }
  }
});
```

**`router.afterEach()`**

- 全局后置钩子，**无法改变导航本身**
- 参数：`(to, from) => void`
- 常用于分析、更改页面标题等操作

### 路由独享守卫

**`beforeEnter`**

- 只在**进入路由**时触发，不会在 `params` | `query` | `hash` 改变时触发
- 路由配置的选项，可以接受**函数**或者**函数数组**
- 参数：`(to) => RouteRecordRaw | void`

### 组件内的守卫

**传统配置式写法**

- `beforeRouteEnter(to, from[, next]){}` 组件渲染之前被调用，**无法获取 `this`**，不过可以通过传递一个回调函数(参数为`this`)给 `next` 来访问组件实例
- `beforeRouteUpdate(to, from){}` 路由发生改变但是**组件被复用**时调用，**可以获取 `this`**
- `beforeRouteLeave(to, from){}` 离开组件时调用，**可以获取 `this`**，常用于离开提示

**`Composition API`**

```js
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
export default {
  setup() {
    // 与 beforeRouteLeave 相同，无法访问 `this`
    onBeforeRouteLeave((to, from) => {
      const answer = window.confirm('Do you really want to leave? you have unsaved changes!');
      // 取消导航并停留在同一页面上
      if (!answer) return false;
    });
    const userData = ref();
    // 与 beforeRouteLeave 相同，无法访问 `this`
    onBeforeRouteUpdate(async (to, from) => {
      //仅当 id 更改时才获取用户，例如仅 query 或 hash 值已更改
      if (to.params.id !== from.params.id) {
        userData.value = await fetchUser(to.params.id);
      }
    });
  }
}
```

### 完整解析流程

<Step
  class="mt-6"
  title="路由解析流程"
  :data="[
    '导航被触发',
    '失活的组件里面调用 beforeRouteLeave',
    '调用全局 beforeEach',
    '重用组件内部调用 beforeRouteUpdate',
    '路由配置调用 beforeEnter',
    '解析异步路由组件',
    '被激活的组件里面调用 beforeRouteEnter',
    '调用全局 beforeResolve',
    '导航被确认',
    '调用全局的 afterEach',
    '触发 DOM 更新',
    '调用 beforeRouteEnter 之中传递给 next 的回调函数, 并将创建好的组件实例作为回调函数的参数传入'
  ]"
/>


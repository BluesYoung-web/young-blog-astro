---
layout: "@/layouts/BlogPost.astro"
title: VueRouter—04-API
description: VueRouter—04-API
image: /img/vue.jpeg
date: 2021-08-03 09:49:54
---

[[toc]]

## `createRouter(options: RouterOptions)`

**创建路由实例**

### `RouterOptions`

**`history` 历史模式：**
  - `createWebHistory(base?: string)` `H5` 模式，**需要服务端配置支持**
  - `createWebHashHistory(base?: string)` `hash` 模式，无需服务器支持，**不利于 `SEO`**
  - `createMemoryHistory(base?: string)` 基于内存的历史记录，**主要用于处理 `SSR`**

**`linkActiveClass`**
  - 用于激活 `RouterLink` 的默认类
  - 默认值为 `router-link-active`

**`linkExactActiveClass`**
  - 用于精准激活的 `RouterLink` 的默认类
  - 默认值为 `router-link-exact-active`

**`parseQuery`**
  - 用于解析查询的自定义实现
  - `parseQuery?: (searchQuery: string) => Record<string, (string | null)[] | string | null>`

**`stringifyQuery`**
  - 对查询对象进行字符串化的自定义实现

```js
stringifyQuery?: (
  query: Record<
    string | number,
    string | number | null | undefined | (string | number | null | undefined)[]
  >
) => string
```

**`routes` 初始路由表**

**`scrollBehavior` 页面切换时的滚动表现(行为)**

## `START_LOCATION`

**路由所在的初始路由地址**

```ts
import { START_LOCATION } from 'vue-router'

router.beforeEach((to, from) => {
  if (from === START_LOCATION) {
    // 初始导航
  }
})
```

## Router 属性

`currentRoute: Ref<RouteLocationNormalized>` 当前路由的地址，**只读**

`options: RouterOptions` 创建路由传递的原始配置对象，**只读**

### `RouteLocationRaw`

**用户级路由地址**，可以作为参数传递给 `router.push | redirect | replace`

值可以是**字符串或者对象**

**path  属性必须编码，params、query、hash 一定不能编码**

```js
// 这三种形式是等价的
router.push('/users/posva#bio')
router.push({ path: '/users/posva', hash: '#bio' })
router.push({ name: 'users', params: { username: 'posva' }, hash: '#bio' })

// 只改变 hash
router.push({ hash: '#bio' })

// 只改变 query
router.push({ query: { page: '2' } })

// 只改变 param
router.push({ params: { username: 'jolyne' } })
```

### `RouteLocation`

可以包含重定向记录的解析(`RouteLocationRaw`)之后的路由地址，其余同下

### `RouteLocationNormalized`

**标准化路由地址，没有任何重定向记录(`to | from`)**

`fullPath: string` 完整路径

`hash: string` 已解码 `URL` 的 `hash` 部分，总是以 `#` 开头，如果没有则为空字符串

`query: { [key: string]: string | string[] }` 从地址中解析出的查询参数对象

`matched: RouteLocationNormalized[]` 与给定地址匹配的标准化路由记录数组

`meta: RouteMeta` **附加从父级到子级合并的所有匹配记录的数据**

`name: string | symbol | undefined | null` 路由记录的名称，默认 `undefined`

`params: { [key: string]: string | string[] }` 从动态路径中提取的已解码参数的对象

`path: string` 编码 `URL` 的 `pathname` 部分，与路由地址有关

`redirectedFrom: RouteLocation`  重定向的原始地址，默认为 `undefined`

## Router 方法

`addRoute(parentName?: string | symbol, route: RouteRecordRaw): () => void` 添加新的路由，返回一个删除钩子函数

`afterEach(hook: (to, from) => void): () => void` 导航钩子，每次导航完成之后执行，返回一个删除注册钩子的函数

`go(n: number)` 操作历史记录，相当于 `history.go()`

`back()` 历史回溯，相当于 `history.back() | router.go(-1)`

`forward()` 前进，相当于 `history.forward() | router.go(1)`

`beforeEach()` 添加一个导航守卫，任意导航前执行，返回一个删除注册的钩子函数

`beforeResolve()` 添加一个导航守卫，在导航解析之前执行(组件已被获取，其他导航守卫也已成功)，返回一个删除注册的钩子函数

`getRoutes()` 获取所有的路由

`hasRoute()` 判断是否存在指定名称的路由

`isReady()` 返回一个 `Promise` 表示其解析状态

`onError()` 添加一个错误处理程序，导航期间所有未捕获的错误都会传入其中进行处理

`push()` 导航到指定地址

`replace()` 通过替换当前地址的方式导航到指定地址

`removeRoute()` 删除现有路由

`resolve()` 返回路由地址的标准化版本

### `RouteRecordRaw`

**原始路由记录**：
  - 单一视图记录，**有一个 `component` 配置**
  - 多视图记录(命名视图)，**有一个 `components` 配置**
  - 重定向记录，**没有`component` 或者 `components` 配置**

`path: string` 路由地址，应该以 `/` 开头，**子路由除外**

`redirect?: RouteLocationRaw | (to) => RouteLocationNormalized` 重定向地址

`children?: RouteRecordRaw[]` 数组

`alias?: string | string[]` 别名

`name?: string | symbol` **名称，唯一标识**

`beforeEnter?: NavigationGuard | NavigationGard[]` 专属导航守卫

`props? boolean | { [prop: string]: any } | (to) => { [prop: string]: any }` 参数表现

`meta?: RouteMeta` 自定义元数据

### `RouteRecordNormalized`

路由记录的标准化版本

`aliasOf: RouterRecordNormalized | undefined` 表示此记录是否是原始记录(`undefined`)

`beforeEnter: NavigationGuard` 专属导航守卫

`children: RouterRecordNormalized[]` 子路由

`components: { [prop: string]: Component }` 命名视图对象，默认包含键名`default`

`meta: RouteMeta` 自定义元数据

`name: string | symbol | undefined` 路由记录的名称

`path: string` 路由的标准化路径(完整路径)

`props: { [prop: string]: boolean | Function | { [prop: string]: any } }` 与 `components` 对应的表现

`redirect: RouteLocationRaw` 重定向记录

### `NavigationFailure`

`from` 发起导航的标准化路由记录

`to` 导航的目标标准化路由记录

`type` 失败的类型

## 组件注入

**主要针对 `Vue2` 的 `Options API` 写法**

`this.$router`

`this.$route`

`beforeRouteEnter`

`beforeRouteUpdate`

`beforeRouteLeave`
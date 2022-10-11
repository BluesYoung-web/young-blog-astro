---
layout: "@/layouts/BlogPost.astro"
title: VueRouter—01.基础
description: VueRouter—01.基础
image: /img/vue.jpeg
date: 2021-07-22 15:00:09
---

[[toc]]

## `\<router-link\>`

效果类似于 `a` 标签

用于跳转到对应的组件

## `\<router-view\>`

组件占位符，效果类似于 `slot`

**与路由匹配的组件将会被渲染到其放置的地方**

## 动态参数匹配

此时路由变化时，**相同的组件不会二次渲染**

即**不会调用生命周期钩子函数**

可以使用 `watch` 监听 `$route.params` 的变化来感知路由的改变

## <span style="color: red">路由匹配语法</span>

`/:orderId` => 可以匹配任意**非空内容**至 `$route.params`

`/:orderId(\\d+)` => **仅匹配数字**，优先级高于不带正则的，与顺序无关

`/:chapters+` => 匹配**一个或多个**，`/one | /one/two | ...`

`/:chapters*` => 匹配**零个或多个**，`/ | /one | /one/two | ...`

`/:chapters?` => 匹配**零个或一个**，`/ | /one`，**参数不能重复**

`/users/:userId(\\d+)?` => `/users | /users/9527`

```js
const routes = [
  // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下(404 页)
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]
```

## 嵌套路由

```js
import Layout from '/src/layout/index.vue';
const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/Dashboard/dashboard',
    name: 'default'
  },
  {
    path: '/Dashboard',
    component: Layout,
    redirect: '/Dashboard/dashboard',
    name: 'dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('/src/views/dashboard/index.vue'),
        meta: { title: '欢迎使用' }
      }
    ]
  }
];
```

## 编程式导航

### `router.push()`

效果同 `<router-link>`

```js
import { useRouter } from 'vue-router';
const router = useRouter();
// 我们可以手动建立 url，但我们必须自己处理编码!!!
router.push(`/user/${username}`) // -> /user/eduardo
// 同样
router.push({ path: `/user/${username}` }) // -> /user/eduardo

// 如果可能的话，使用 `name` 和 `params` 从自动 URL 编码中获益
router.push({ name: 'user', params: { username } }) // -> /user/eduardo

// `params` 不能与 `path` 一起使用
router.push({ path: '/user', params: { username } }) // -> /user

// 带查询参数，结果是 /register?plan=private
router.push({ path: '/register', query: { plan: 'private' } })

// 带 hash，结果是 /about#team
router.push({ path: '/about', hash: '#team' })
```

### `router.replace()`

相当于 `router.push({ path, replace: true })`

**不会添加新的历史记录**

### `router.go()`

横跨历史记录，相当于 `window.history.go()`

## <span style="color: red">命名视图</span>

同级展示多个视图

如果 `router-view` 没有设置 `name` 属性，那么**默认为 `default`**

```html
<router-view class="view left-sidebar" name="LeftSidebar"></router-view>
<router-view class="view main-content"></router-view>
<router-view class="view right-sidebar" name="RightSidebar"></router-view>
```

```js
import { createRouter } from 'vue-router';
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      components: {
        default: Home,
        LeftSidebar,
        RightSidebar
      }
    }
  ]
});
```

## <span style="color: red">重定向</span>

```js
const routes = [{ path: '/home', redirect: '/' }];
const routes = [{ path: '/home', redirect: { name: 'homepage' } }];
const routes = [
  {
    // /search/screens -> /search?q=screens
    path: '/search/:searchText',
    redirect: to => {
      // 方法接收目标路由作为参数
      // return 重定向的字符串路径/路径对象
      return { path: '/search', query: { q: to.params.searchText } }
    },
  },
  {
    path: '/search',
    // ...
  },
];
```

## 路径别名

```js
const routes = [{ path: '/', component: Homepage, alias: '/home' }];
const routes = [
  {
    path: '/users/:id',
    component: UsersLayout,
    children: [
      // - /users/24
      // - /users/24/list
      // - /24
      { path: 'list', component: UserList, alias: ['/:id', ''] }
    ]
  }
];
```

## props 组件传参

**命名视图的情况下，必须为每个视图都设置 props 配置**

```js
const routes = [
  {
    path: '/user/:id',
    components: { default: User, sidebar: Sidebar },
    props: { default: true, sidebar: false }
  }
];
```

**对象模式，原封不动的设置为组件 `props` 的属性**

```js
const routes = [
  {
    path: '/promotion/from-newsletter',
    component: Promotion,
    props: { newsletterPopup: false }
  }
];
```

**布尔模式，`$route.params` 设置为组件 `props` 的属性**

```js
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
};
// props: true => $route.params 会被 mixin 为组件的 props
const routes = [{ path: '/user/:id', component: User, props: true }];
```

**函数模式，函数的返回值作为组件的 `props` 属性**

```js
const routes = [
  {
    path: '/search',
    component: SearchUser,
    // URL /search?q=vue 将传递 {query: 'vue'} 作为 props 传给 SearchUser 组件
    props: route => ({ query: route.query.q })
  }
];
```

## 路由模式

哈希模式，无需服务端配置，不利于 `SEO`

`HTML5` 模式，需要服务端配合，利于 `SEO`

```js
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHashHistory() // createWebHistory()
});
```

```nginx
# HTML5 模式对应的配置——nginx
location / {
  try_files $uri $uri/ /index.html;
}
```


---
title: VueRouter—03-进阶
description: VueRouter—03-进阶
image: /img/vue.jpeg
date: 2021-08-02 14:25:39
---

[[toc]]

## 路由元信息

**`meta` 字段可以扩展任意自定义属性**

```typescript
// shim.d.ts
import 'vue-router';
declare module 'vue-router' {
  interface RouteMeta {
    isAdmin?: boolean;
    auth: boolean;
  }
}
```

## Composition API

```js
import { useRouter, useRoute } from 'vue-router';
// 响应式的路由对象，包含当前页面的路由信息及各种参数
const route = useRoute();
// 路由器对象，可以进行导航等操作
const router = useRouter();
```

### `useLink`

```js
import { RouterLink, useLink } from 'vue-router';
export default {
  name: 'AppLink',
  props: {
    // 如果使用 TypeScript，请添加 @ts-ignore
    ...RouterLink.props,
    inactiveClass: String,
  },
  setup(props) {
    // route: 解析后的规范化的地址、href: 解析后的 URL(base)
    // isActive: 如果需要应用 active class 则为 true
    // isExactActive: 如果需要应用exact active class 则为 true
    // navigate 触发导航的函数，会在必要的时候自动阻止事件
    const { route, href, isActive, isExactActive, navigate } = useLink(props);
    const isExternalLink = computed(() => typeof props.to === 'string' && props.to.startsWith('http'));
    return { isExternalLink, href, navigate, isActive };
  },
}
```

## 滚动行为

```js
import { router } from 'vue-router';
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    // 直接操作
    return { left: 0, top: 0 };
    // 相对元素的偏移
    return { el: '#main', top: -10 };
    // 保持浏览器原生表现
    return savedPosition;
    // 滚动到指定的锚点
    return { el: to.hash, behavior: 'smooth' };
    // 延迟滚动
    return new Promise(() => setTimeout(() => resolove({ top: 0, left: 0 }), 500));
  }
});
```

## 导航故障

**普通检测**

```js
const navigationResult = await router.push('/my-profile')
if (navigationResult) {
  // 导航被阻止
} else {
  // 导航成功 (包括重新导航的情况)
  this.isMenuOpen = false
}
```

**使用辅助函数**

```js
import { NavigationFailureType, isNavigationFailure } from 'vue-router';
// 试图离开未保存的编辑文本界面
const failure = await router.push('/articles/2');
// aborted: 导航守卫返回了 false
// cancelled: 导航完成之前又产生了新的导航
// duplicated: 已经处于目标位置，导航被阻止
if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
  // failure.to.path failure.from.path
  // 给用户显示一个小通知
  showToast('You have unsaved changes, discard and leave anyway?');
}

await router.push('/my-profile')
// 重定向检测
if (router.currentRoute.value.redirectedFrom) {
  // redirectedFrom 是解析出的路由地址，就像导航守卫中的 to和 from
}
```

## 动态路由

### 添加路由

`router.addRoute(route: RouteRecordRaw)`

只是注册一个新的路由，如果新增的路由**与当前路径匹配**，则需要手动调用`router.push() | router.replace()` 手动触发更新

### 导航守卫中添加路由

**通过返回新的位置来触发重定向**

```js
router.beforeEach(to => {
  if (!hasNecessaryRoute(to)) {
    router.addRoute(generateRoute(to))
    // 触发重定向
    return to.fullPath
  }
})
```

### 添加嵌套路由

```js
outer.addRoute({ name: 'admin', path: '/admin', component: Admin });
router.addRoute('admin', { path: 'settings', component: AdminSettings });
// ===>
router.addRoute({
  name: 'admin',
  path: '/admin',
  component: Admin,
  children: [{ path: 'settings', component: AdminSettings }],
})
```

### 删除路由

```js
// 添加重名的路由，直接覆盖原路由
router.addRoute({ path: '/about', name: 'about', component: About });

// 这将会删除之前已经添加的路由，因为他们具有相同的名字且名字必须是唯一的
router.addRoute({ path: '/other', name: 'about', component: Other });

// 调用添加路由返回的回调
const removeRoute = router.addRoute(routeRecord);
// 删除路由如果存在的话
removeRoute();

// 按名称删除路由，所有的别名和子路由也会被同时删除
router.addRoute({ path: '/about', name: 'about', component: About });
// 删除路由
router.removeRoute('about');
```

### 查看现有路由

`router.hasRoute()` 检查路由是否存在

`router.getRoutes()` 返回一个包含所有路有记录的数组

## `\<router-link\>`

### `props`

`to: RouteLocationRaw` 目标路由的链接，点击之后会被作为参数传入 `router.push()`

`replace: boolean = false` 是否使用 `router.replace()` 进行路由跳转(不会留下历史记录)

`active-class: string = 'router-link-active'` 链接激活时，应用于 `a` 标签的 `class`

`aria-current-value: string = 'page'` 链接激活时，传递给属性 `aria-current` 的值

`custom: boolean = false` `<router-link> 默认将其内容包裹在 <a> 之中，传递 true 可以阻止其默认行为`

`exact-active-class: string = 'router-link-exact-active'` 链接**精准激活**时，应用于 `a` 标签的 `class`

### `v-slot`

通过一个作用域插槽暴露底层的定制能力

`route`: 解析后的规范化的地址

`href`: 解析后的 `URL(base)`

`isActive`: 如果需要应用 `active-class` 则为 `true`

`isExactActive`: 如果需要应用 `exact-active-class` 则为 `true`

`navigate` 触发导航的函数，会在必要的时候自动阻止事件

```html
<router-link
  to="/foo"
  custom
  v-slot="{ href, route, navigate, isActive, isExactActive }"
>
  <li  :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']">
    <!-- 当 target="_blank" 时，必须省略 @click="navigate"  -->
    <a :href="href" @click="navigate">{{ route.fullPath }}</a>
  </li>
</router-link>
```

## `\<router-view\>`

### `props`

`name: string = 'default'` 如果设置了 `name` 属性，则会渲染对应路由配置中的 `components` 下的相应组件

`route: RouteLocationNormalized` 一个路由地址的所有组件都已经被解析

### `v-slot`

```html
<Suspense>
  <template #default>
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <keep-alive>
          <component
            :is="Component"
            :key="route.meta.usePathKey ? route.path : undefined"
          />
        </keep-alive>
      </transition>
    </router-view>
  </template>
  <template #fallback> Loading... </template>
</Suspense>
```
---
title: vue3 内置组件
description: vue3 内置组件
date: 2022-02-20 15:30:00
image: /img/vue.jpeg
---

[[toc]]

## `\<Transition\>`

**定义在一个元素进入和离开 `DOM` 时使用的动画**

**触发场景：**
  - `v-if`
  - `v-show`
  - `<component :is>`

### `css` 过渡类

**v-enter-from：**
  - 进入动画的起始状态
  - 这个 `CSS` 类**在元素插入之前添加，在元素插入完成后的下一帧移除**

**v-enter-active：**
  - 进入动画的生效状态，**应用于整个进入动画阶段**
  - **在元素被插入之前被添加，在过渡/动画完成之后移除**
  - **可以用来定义进入动画的持续时间、延迟与速度曲线类型**

**v-enter-to：**
  - 进入动画的结束状态
  - **在元素插入完成后的下一帧被添加 (也就是 `v-enter-from` 被移除的同时)，在过渡/动画完成之后移除**

**v-leave-from：**
  - 离开动画的起始状态
  - **在离开过渡效果被触发时立即添加，在一帧后被移除**

**v-leave-active：**
  - 离开动画的生效状态，**应用于整个离开动画阶段**
  - **在离开过渡效果被触发时立即添加，在过渡/动画完成之后移除**
  - **可以用来定义离开动画的持续时间、延迟与速度曲线类型**

**v-leave-to：**
  - 离开动画的结束状态
  - **在一个离开动画被触发后的下一帧被添加 (也就是 `v-leave-from` 被移除的同时)，在过渡/动画完成之后移除**

```css
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
```

### 属性

**传入对应的属性名，指定自定义过渡类：**
  - `enter-from-class`
  - `enter-active-class`
  - `enter-to-class`
  - `leave-from-class`
  - `leave-active-class`
  - `leave-to-class`

<n-alert type="info">**`name` 属性的值会取代 `v` 作为类名的前缀**</n-alert>

```html
<!-- 假设你已经引入了 Animate.css -->
<Transition
  name="custom-classes"
  enter-active-class="animate__animated animate__tada"
  leave-active-class="animate__animated animate__bounceOutRight"
>
  <p v-if="show">hello</p>
</Transition>
```

<n-alert type="info">**`type` 属性，指定动画实现方式 `animation | transition`**</n-alert>

**duration 属性指定持续过渡的时间：**
  - `:duration="550"`
  - `:duration="{ enter: 500, leave: 800 }"`

**mode 属性指定过渡模式：**
  - `out-in`
  - `in-out`

**css 属性，控制是否使用 `css` 过渡类**

**appear 单值属性，加入之后可以使初次渲染时就使用过渡效果**

### 钩子函数

```html
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>
  <!-- ... -->
</Transition>
```

```ts
// 在元素被插入到 DOM 之前被调用
// 用这个来设置元素的 "enter-from" 状态
function onBeforeEnter(el) {},

// 在元素被插入到 DOM 之后的下一帧被调用
// 用这个来开始进入动画
function onEnter(el, done) {
  // 调用回调函数 done 表示过渡结束
  // 如果与 CSS 结合使用，则这个回调是可选参数
  done()
}

// 当进入过渡完成时调用。
function onAfterEnter(el) {}
function onEnterCancelled(el) {}

// 在 leave 钩子之前调用
// 大多数时候，你应该只会用到 leave 钩子
function onBeforeLeave(el) {}

// 在离开过渡开始时调用
// 用这个来开始离开动画
function onLeave(el, done) {
  // 调用回调函数 done 表示过渡结束
  // 如果与 CSS 结合使用，则这个回调是可选参数
  done()
}

// 在离开过渡完成、
// 且元素已从 DOM 中移除时调用
function onAfterLeave(el) {}

// 仅在 v-show 过渡中可用
function leaveCancelled(el) {}
```

## `\<TransitionGroup\>`

**定义在一个元素进入和离开 `v-for` 列表时使用的动画**

**其中的元素总是必须有一个独一无二的 key attribute**

**CSS 过渡类会被应用在其中的每一个元素上，而不是这个组的容器上**

```html
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item">
    {{ item }}
  </li>
</TransitionGroup>
```

```css
.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}
```

### 属性

**除了 `mode` 之外，`<Transition>` 其余属性都拥有**

**tag 属性，指定渲染的包裹元素(默认不渲染包裹元素)**

**move-class 属性，指定元素移动时使用的类**

## `\<KeepAlive\>`

**用于动态组件切换时缓存组件(保留组件的状态)**

```ts
// 接受匹配的类型
type MatchPattern = string | RegExp | (string | RegExp)[]

interface KeepAliveProps {
  /**
   * 缓存白名单
   */
  include?: MatchPattern
  /**
   * 缓存黑名单
   */
  exclude?: MatchPattern
  /**
   * 最大缓存数量，超过之后使用 LRU 算法进行排除
   */
  max?: number | string
}

```

### 生命周期

**`onActivated` 激活时执行**

**`onDeactivated` 失活时执行**

## `\<Telport\>`

**传送门(任意门)，可以将元素渲染到任意的目标节点下**

**仅改变渲染位置，不改变组件的逻辑层级**

```ts
interface TeleportProps {
  /**
   * 目标节点的查询字符串或者 dom 引用
   * 必须是已经存在的真实元素！！！
   */
  to: string | HTMLElement
  /**
   * 使用禁用，禁用之后元素不会渲染到目标节点下
   */
  disabled?: boolean
}
```

## `\<Suspense\>`

中文翻译为悬念，应该是取**悬而未决**之意

<n-alert type="warning">**目前仍然为试验状态**</n-alert>

**可以渲染一个加载中的状态，然后等到异步组件加载完成之后再进行替换**

**运行逻辑：**
  - 初始渲染时，渲染默认插槽的内容并存储到内存之中
      - **渲染遇到异步依赖，进入挂起状态，并展示 fallback 插槽的内容直到异步依赖完成**
      - **未遇到异步依赖，直接进入完成状态，展示默认插槽渲染的内容**
  - 进入完成状态之后，**只有当默认插槽的根节点被替换时，才会回到挂起状态**
  - **发生回退时，在 `timeout` 时间之前都会展示之前 `default` 的内容，之后如果还没完成才会显示 `fallback` 的内容**

### 属性

**timeout 属性可以指定超时时间**

### 事件监听

`@resolve` **在 default 插槽完成新内容的获取时触发**

`@pending` **加载(挂起)时触发**

`@fallback` **fallback 插槽展示时触发**

### 插槽

**`#default` 指定异步组件**

**`#fallback` 指定加载中的状态**

### 异步依赖

**`async setup()`**

**`<script setup>` + `top await`**

**`defineAsyncComponent()`**

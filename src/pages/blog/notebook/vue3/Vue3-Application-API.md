---
title: vue3 应用级 API
description: vue3 应用级 API
date: 2022-02-21 11:40:00
image: /img/vue.jpeg
---

[[toc]]

## `createApp`

**创建一个应用实例**

```ts
function createApp(
  // 根组件，也可以直接传入一个组件的选项参数进行创建
  rootComponent: Component,
  // 传递给根组件的参数
  rootProps?: object
): App
```

## `createSSRApp`

**参数同 createApp，只不过是启用 SSR 时使用**

## `app` 的属性及方法

### `app.mount()`

**接受查询字符串或者真实 DOM 的引用，返回 APP 实例以供链式调用**

<n-alert type="warning">只能被调用一次</n-alert>

```ts
interface App {
  mount(
    rootContainer: Element | string
  ): ComponentPublicInstance
}
```

### `app.unmount()`

**触发整个组件树的钩子函数，然后销毁改应用**

```ts
interface App {
  unmount(): void
}
```

### `app.provide()`

**提供全局可用的数据**

```ts
interface App {
  provide<T>(key: InjectionKey<T> | symbol | string, value: T): this
}
```

### `app.component()`

**注册或索引全局组件**

```ts
interface App {
  // 查询对应名称的组件是否存在，如果存在则返回该组件
  component(name: string): Component | undefined
  // 注册一个全局组件
  component(name: string, component: Component): this
}
```

### `app.directive()`

**注册或索引全局指令**

```ts
interface App {
  directive(name: string): Directive | undefined
  directive(name: string, directive: Directive): this
}
```

### `app.use()`

**安装插件**

```ts
type Plugin = {
  install(app: AppInstance, ...options: any[]): void
}

interface App {
  use(plugin: Plugin, ...options: any[]): this
}
```

### `app.mixin()`

**全局混入**

<n-alert type="warning">**不再推荐使用**</n-alert>

```ts
interface App {
  mixin(mixin: ComponentOptions): this
}
```

### `app.version`

**当前 Vue 的版本号，返回字符串**

### `app.config`

**暴露给全局的配置对象**

<n-alert type="info">**仅在挂载应用之前可配置**</n-alert>

### `app.config.errorHandler`

**配置全局的 Vue 错误处理函数**

```ts
interface AppConfig {
  errorHandler?: (
    // 错误
    err: unknown,
    // 产生错误的组件实例
    instance: ComponentPublicInstance | null,
    // Vue 对于错误的描述
    info: string
  ) => void
}
```

### `app.config.warnHandler`

**配置全局的 Vue 警告处理函数**

```ts
interface AppConfig {
  warnHandler?: (
    // 警告的文字描述
    msg: string,
    // 产生警告的组件实例
    instance: ComponentPublicInstance | null,
    // 警告追踪
    trace: string
  ) => void
}
```

### `app.config.performance`

**性能标记开关，设置为 true 之后会在：初始化、编译、渲染、更新阶段都针对 performance 面板做出标识**

<n-alert type="info">**仅在开发模式可用**</n-alert>

### `app.config.compilerOptions`

可用**配置运行时编译选项(浏览器端)**

```ts
interface ComponentOptions {
  compilerOptions?: {
    // 接受一个标签名(字符串)，返回其是否为用户自定义元素
    isCustomElement?: (tag: string) => boolean
    // 调整模板空白字符的处理逻辑，默认 condense 全压缩
    whitespace?: 'condense' | 'preserve'
    // 模板插值符号，默认为 ['{{', '}}']
    delimiters?: [string, string]
    // 生产环境是否保留 HTML 注释，默认不保留
    comments?: boolean
  }
}
```

### `app.config.globalProperties`

**用于注册全局属性的对象，可以在应用程序内的任何组件实例上访问这些属性**

`Vue.prototype` 的替代品，组件自身属性会覆盖全局属性

```ts
interface AppConfig {
  globalProperties: Record<string, any>
}
```

### `app.config.optionMergeStrategies`

**用于定义自定义组件选项的合并策略的对象**

合并策略函数可以通过 `app.config.optionMergeStrategies` 使用选项名称作为键将其分配到对象上来为自定义选项注册

```ts
interface AppConfig {
  optionMergeStrategies: Record<string, OptionMergeFunction>
}

type OptionMergeFunction = (to: unknown, from: unknown) => any

// 示例
const app = createApp({
  // option from self
  msg: 'Vue',
  // option from a mixin
  mixins: [
    {
      msg: 'Hello '
    }
  ],
  mounted() {
    // merged options exposed on this.$options
    console.log(this.$options.msg)
  }
})

// define a custom merge strategy for `msg`
app.config.optionMergeStrategies.msg = (parent, child) => {
  return (parent || '') + (child || '')
}

app.mount('#app')
// logs 'Hello Vue'
```
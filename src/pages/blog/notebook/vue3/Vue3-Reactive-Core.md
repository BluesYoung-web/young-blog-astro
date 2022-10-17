---
title: vue3 响应式——核心
description: vue3 响应式——核心
date: 2022-02-19 16:00:00
image: /img/vue.jpeg
---

[[toc]]

## `ref`

接收任意值，返回值为 `.value` 属性的响应式对象

### 类型定义

```ts
function ref<T>(value: T): Ref<UnwrapRef<T>>

interface Ref<T> {
  value: T
}
```

## `reactive`

接收一个对象，返回该对象的代理(`ref` 对象会自动解套)

### 类型定义

```ts
function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
```

## `readonly`

接收一个响应式对象或者普通对象，返回其**只读代理**

类似于 `reactive` 能自动解套

### 类型定义

```ts
function readonly<T extends object>(
  target: T
): DeepReadonly<UnwrapNestedRefs<T>>
```

## `computed`

**计算属性，返回一个只读的 `ref`**

### 类型定义

```ts
// 只读
function computed<T>(
  getter: () => T,
  // see "Computed Debugging" link below
  debuggerOptions?: DebuggerOptions
): Readonly<Ref<Readonly<T>>>

// 可读可写
function computed<T>(
  options: {
    get: () => T
    set: (value: T) => void
  },
  debuggerOptions?: DebuggerOptions
): Ref<T>
```

## `watch`

**让每次响应式的状态发生变化时都触发的回调函数**

**懒执行，只有监听的源数据发生改变时才会调用**

```ts
const x = ref(0)
const y = ref(0)

const obj = reactive({ v: 1 })

// 单个 ref
watch(x, (newX, oldX) => {
  console.log(`x is ${newX}`)
})

// 单个 reactive 对象，隐式监听深层属性，相当于配置了 deep: true
watch(obj, (newObj, oldObj) => {
  // obj 的属性发生变化时也会触发
});

// 单个 reactive 对象的属性，必须使用函数！！！
watch(() => obj.v, (newV, oldV) => {});

// 函数
watch(
  () => x.value + y.value,
  (sum, oldSum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// 多个源的数组
watch([x, () => y.value], ([newX, newY], [oldX, oldY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```

### 类型定义

```ts
// 监听单个源的函数签名，返回一个函数，可用于停止监听
function watch<T>(
  source: WatchSource<T>,
  callback: WatchCallback<T>,
  options?: WatchOptions
): StopHandle

// 监听多个源的函数签名，返回一个函数，可用于停止监听
function watch<T>(
  sources: WatchSource<T>[],
  callback: WatchCallback<T[]>,
  options?: WatchOptions
): StopHandle

// 监听的回调函数
type WatchCallback<T> = (
  value: T,
  oldValue: T,
  //  二次调用回调函数之前，用于清理之前的副作用残留
  onCleanup: (cleanupFn: () => void) => void
) => void

type WatchSource<T> =
  | Ref<T> // ref
  | (() => T) // getter
  | T extends object ? T : never // reactive object

// 配置选项
interface WatchOptions extends WatchEffectOptions {
  // 是否立即执行，默认: false
  immediate?: boolean
  // 是否为深层监听，默认: false
  deep?: boolean
  //  副作用函数的执行时机，默认为组件更新之前，post 为更新之后，sync 为组件更新的同时
  flush?: 'pre' | 'post' | 'sync' // default: 'pre'

  // 以下两个为调试专用，正式环境不存在
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}
```

## `watchEffect`

**自动依赖追踪**

**积极调用，只要内部的响应式数据发生了改变，就会立即执行**

<n-alert type="info">仅会在其 **同步** 执行期间追踪依赖。当使用一个异步回调时，**只有在第一次 await 前被访问的属性会被追踪为依赖**</n-alert>

### 类型定义

```ts
function watchEffect(
  effect: (onCleanup: OnCleanup) => void,
  options?: WatchEffectOptions
): StopHandle

type OnCleanup = (cleanupFn: () => void) => void

interface WatchEffectOptions {
  // 控制触发时机
  flush?: 'pre' | 'post' | 'sync' // default: 'pre'
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}

type StopHandle = () => void
```

### 偏函数

`watchPostEffect() -> watchEffect() + flush: 'post'` **可以避免手动调用 `nextTick` 更加便捷**

`watchSyncEffect() -> watchEffect() + flush: 'sync'`
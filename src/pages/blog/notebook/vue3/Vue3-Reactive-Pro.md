---
layout: "@/layouts/BlogPost.astro"
title: vue3 响应式——进阶
description: vue3 响应式——进阶
date: 2022-02-20 10:25:00
image: /img/vue.jpeg
---

[[toc]]

## `shallowRef`

接收一个值，返回其**浅层 ref**对象

<n-alert type="info">**普通的 `ref` 创建的是深层监听的对象**</n-alert>

```ts
type ShallowRef<T> = {
  value: T
}
function shallowRef<T>(value: T): ShallowRef<T>

const state = shallowRef({ count: 1 })

// 深层次的修改不会触发更新
state.value.count = 2
// 浅层的修改会触发更新
state.value = { count: 2 }
```

## `triggerRef`

接收一个 `shallowRef`，**主动触发更新**

```ts
function triggerRef(ref: ShallowRef): void

const shallow = shallowRef({
  greet: 'Hello, world'
})

// 初始化的时候会打印一次 Hello, world
watchEffect(() => {
  console.log(shallow.value.greet)
})

// 只进行深层修改，不会触发更新
shallow.value.greet = 'Hello, universe'
// 主动触发更新之后，打印 Hello, universe
triggerRef(shallow)
```

## `customRef`

**自定义 ref**

**接收一个工厂函数**，返回 `ref` 对象

```ts
type CustomRefFactory<T> = (
  // 依赖收集
  track: () => void,
  // 触发更新
  trigger: () => void
) => {
  // 取值函数，内部应该调用 track 进行依赖收集
  get: () => T
  // 赋值函数，内部应该调用 trigger 触发更新
  set: (value: T) => void
}

function customRef<T>(factory: CustomRefFactory<T>): Ref<T>
// 自定义防抖 ref
function useDebouncedRef(value, delay = 200) {
  let timeout
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}
```

## `shallowReactive`

接收一个值，返回其**浅层 reactive**对象，**不会自动解包**

<n-alert type="info">**普通的 `reactive` 创建的是深层监听的对象**</n-alert>

```ts
function shallowReactive<T extends object>(target: T): T

const state = shallowReactive({
  foo: 1,
  nested: {
    bar: 2
  }
})

// 修改其浅层的属性，会触发更新
state.foo++
// 修改深层属性，不会触发更新
state.nested.bar++
```

## `shallowReadonly`

接收一个值，返回其**浅层 readonly**对象，**不会自动解包**

<n-alert type="info">**普通的 `readonly` 创建的是深层监听的对象**</n-alert>

```ts
function shallowReadonly<T extends object>(target: T): Readonly<T>

const state = shallowReadonly({
  foo: 1,
  nested: {
    bar: 2
  }
})

// 浅层对象无法修改，会产生 vue 警告
state.foo++
// 深层对象可以修改
state.nested.bar++
```

## `toRaw`

接收 `isReactive` 为真的对象，返回其**原始对象**

```ts
function toRaw<T>(proxy: T): T

const foo = {}
const reactiveFoo = reactive(foo)
console.log(toRaw(reactiveFoo) === foo) // true
```

## `markRaw`

接收一个对象，返回标记之后的对象，标记后的对象**永远不能转换为 `reactive` 对象**

**只能标记浅层**

```ts
function markRaw<T extends object>(value: T): T

const foo = markRaw({})
// foo 被标记之后就再也不能转换为响应式的了
console.log(isReactive(reactive(foo)))
// 作为属性也无法转换为响应式的
const bar = reactive({ foo })
console.log(isReactive(bar.foo)) // false

const foo = markRaw({
  nested: {}
})
const bar = reactive({
  // 虽然 foo 被标记了，但是 foo.nested 没有被标记
  nested: foo.nested
})
// 所以 foo.nested 可以成功的被转换为响应式
console.log(isReactive(bar.nested)) // true
```

## `effectScope`

**组件的  `setup` 函数能自动收集依赖，并关联到当前的组件实例之上，组件销毁时依赖也会随之销毁**

**`effectScope` 就是为了在组件外部使用，而模拟出的一个类似作用域管理的函数**

```ts
type EffectScope = {
  // 如果作用域处于 非激活 状态则返回 undefined
  run<T>(fn: () => T): T | undefined
  stop(): void
}
// detached 用于控制是否阻止其父级作用域收集依赖
// 默认是 false(受父级作用域的控制)
function effectScope(detached?: boolean): EffectScope

const scope = effectScope()
// 开始运行
scope.run(() => {
  const doubled = computed(() => counter.value * 2)
  watch(doubled, () => console.log(doubled.value))
  watchEffect(() => console.log('Count: ', doubled.value))
})
// 统一停止内部的副作用
scope.stop()
```

### `getCurrentScope`

**获取当前处于激活状态的 `effect scope`**

```ts
import { getCurrentScope } from 'vue'

getCurrentScope() // EffectScope | undefined
```

```ts
function getCurrentScope(): EffectScope | undefined
```

### `onScopeDispose`

注册一个当 `scope.stop()` 调用时触发的回调函数

**用于取代非组件中调用时的 `onUnmounted` 钩子函数**

```ts
function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function handler(e) {
    x.value = e.x
    y.value = e.y
  }

  window.addEventListener('mousemove', handler)
  // 仅能在组件中使用
  // onUnmounted(() => {
  //   window.removeEventListener('mousemove', handler)
  // })

  // 可以在任意地方使用
  onScopeDispose(() => {
    window.removeEventListener('mousemove', handler)
  })
  return { x, y }
}
```
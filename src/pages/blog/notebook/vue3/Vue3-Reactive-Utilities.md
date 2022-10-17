---
title: vue3 响应式——工具
description: vue3 响应式——工具
date: 2022-02-20 09:55:00
image: /img/vue.jpeg
---

[[toc]]

## `isRef`

接收一个变量，判断其是否为 `ref` 对象

```ts
function isRef<T>(r: Ref<T> | unknown): r is Ref<T>

let foo: unknown
if (isRef(foo)) {
  // 只有当 foo 为 ref 对象时才会执行
  foo.value
}
```

## `unref`

接收一个变量，如果其为普通值，则直接返回；如果是 `ref` 对象，则返回其 `.value` 属性

```ts
function unref<T>(ref: T | Ref<T>): T

function useFoo(x: number | Ref<number>) {
  const unwrapped = unref(x)
  // unwrapped 此时必定为 number
}
```

## `toRef`

接收一个 `reactive` 对象及其任意一个键名，**返回以其键值对创建的 `ref`，并且二者之间的联系依然存在**

**非常适用于对组件的 `props` 属性进行处理**

<n-alert type="warning">**`const a = ref(reactiveObj.prop)` 会丢失二者之间的联系**</n-alert>

```ts
type ToRef<T> = T extends Ref ? T : Ref<T>

function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K,
  // 赋予默认值
  defaultValue?: T[K]
): ToRef<T[K]>

const state = reactive({
  foo: 1,
  bar: 2
})

const fooRef = toRef(state, 'foo')

// 修改 ref 的值会影响原始值
fooRef.value++
console.log(state.foo) // 2
// 修改原始值也会影响 ref 的值
state.foo++
console.log(fooRef.value) // 3
```

## `toRefs`

接收一个 `reactive` 对象，返回将其每个键值对都转换为 `ref` 值的对象，**方便解构赋值，不会丢失响应，常用于 Composition API**

```ts
type ToRef = T extends Ref ? T : Ref<T>

function toRefs<T extends object>(
  object: T
): {
  [K in keyof T]: ToRef<T[K]>
}

const state = reactive({
  foo: 1,
  bar: 2
})

const { foo, bar } = toRefs(state)

// 修改原始值，新的 ref 也会发生改变
state.foo++
console.log(foo.value) // 2
// 修改 ref 值，原始值也会改变
foo.value++
console.log(state.foo) // 3
```

## `isProxy`

接收一个值，判断其是否是被 `reactive() | readonly() | shallowReactive() | shallowReadonly()` 其中之一创建的

```ts
function isProxy(value: unknown): boolean
```

## `isReactive`

接收一个值，判断其是否是被 `reactive() | shallowReactive()` 其中之一创建的

## `isReadonly`

接收一个值，判断其是否是被 `readonly() | shallowReadonly()` 其中之一创建的
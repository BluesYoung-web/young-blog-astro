---
layout: "@/layouts/BlogPost.astro"
title: 21-Map
image: /img/hbs.png
description: JavaScript Map 映射
date: 2021-01-04 16:21:55
---

[[toc]]

## 概述

`JavaScript` 的对象（`Object`），本质上是键值对的集合（`Hash` 结构），但是传统上**只能用字符串当作键**，这给它的使用带来了很大的限制

为了解决这个问题，`ES6` 提供了 `Map` 数据结构

它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，**各种类型的值（包括对象）都可以当作键**

也就是说，`Object` 结构提供了“字符串—值”的对应，`Map` 结构提供了“值—值”的对应，是一种更完善的 `Hash` 结构实现

如果你需要“键值对”的数据结构，`Map` 比 `Object` 更合适

## 初始化

```js
// 使用嵌套数组初始化映射
const m1 = new Map([
  ["key1", "val1"],
  ["key2", "val2"],
  ["key3", "val3"]
]);
alert(m1.size); // 3
// 使用自定义迭代器初始化映射
const m2 = new Map({
  [Symbol.iterator]: function*() {
    yield ["key1", "val1"];
    yield ["key2", "val2"];
    yield ["key3", "val3"];
  }
});
alert(m2.size); // 3
// 映射期待的键/值对，无论是否提供
const m3 = new Map([[]]);
alert(m3.has(undefined)); // true
alert(m3.get(undefined)); // undefined 
```

## 方法及属性

**`set(key, value)`**，设置，返回实例，可链式调用**

**`get(key)`**，获取，不存在返回 `undefined`

**`del(key)`**，删除，返回操作结果，布尔值

**`clear()` 清空所有键值对**

**`has(key)`**，判断是否存在对应键，返回布尔值

**`size`**，返回键值对的数量

## 顺序与迭代

`Map `实例会维护键值对的**插入顺序**，因此可以根据插入顺序执行迭代操作

迭代器：
  - `keys()`
  - `values()`
  - `entries()`

## 对比 `Object`

内存占用约为 1/2

插入性能稍强，查找速度稍逊

删除性能更强

## `WeakMap`

**键只能是 Object 或者继承自 Object 的类型**，尝试使用非对象设置键会抛出 `TypeError`

原始值可以**先包装成对象**再用作键 `const stringKey = new String("key1");`

值的类型没有限制

**没有 `clear()`方法与迭代方法**

### 用途

**私有变量**

```js
const User = (() => {
 const wm = new WeakMap();
 class User {
 	 constructor(id) {
    this.idProperty = Symbol('id'); 
    this.setId(id);
   }
   setPrivate(property, value) {
    const privateMembers = wm.get(this) || {};
    privateMembers[property] = value;
    wm.set(this, privateMembers);
   }
   getPrivate(property) {
    return wm.get(this)[property];
   }
   setId(id) {
    this.setPrivate(this.idProperty, id);
   }
   getId(id) {
    return this.getPrivate(this.idProperty);
   }
 }
 return User;
})();
const user = new User(123);
alert(user.getId()); // 123
user.setId(456);
alert(user.getId()); // 456
```

**`DOM` 节点元数据**

```js
const wm = new WeakMap();
const loginButton = document.querySelector('#login');
// 给这个节点关联一些元数据
wm.set(loginButton, {disabled: true}); 
// 删除按钮，关联数据自行删除
```
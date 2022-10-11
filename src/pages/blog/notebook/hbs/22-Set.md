---
layout: "@/layouts/BlogPost.astro"
title: 22-Set
image: /img/hbs.png
description: JavaScript Set 集合
date: 2021-01-04 17:48:32
---

[[toc]]

## 概述

`ES6` 提供了新的数据结构 `Set`

它类似于数组，但是**成员的值都是唯一的，没有重复的值**

`Set` 本身是一个构造函数，用来生成 `Set` 数据结构

向 `Set` 加入值的时候，**不会发生类型转换，所以 `5` 和 `"5"` 是两个不同的值**

`Set` 内部判断两个值是否不同，使用的算法叫做 `Same-value-zero equality`，它类似于精确相等运算符（`===`），主要的区别是向 `Set` 加入值时认为 **`NaN`等于自身**，而精确相等运算符认为`NaN`不等于自身

判断机制类似于 `Object.is`

另外，**两个对象总是不相等的**

**遍历顺序就是插入顺序**

## 初始化

```js
// 使用数组初始化集合
const s1 = new Set(["val1", "val2", "val3"]);
alert(s1.size); // 3
// 使用自定义迭代器初始化集合
const s2 = new Set({
  [Symbol.iterator]: function*() {
    yield "val1";
    yield "val2";
    yield "val3";
  }
});
alert(s2.size); // 3 
```

## 属性及方法

**`add(value)`**，添加，**返回集合本身，可链式调用**

**`delete(value)`**，删除，返回操作结果，布尔值

**`clear()`**，清空

**`has(value)`**，判断是否存在于集合中，返回布尔值

**`size`**，返回集合中元素的个数

## 顺序与迭代

`Set` 实例会维护键值对的**插入顺序**，因此可以根据插入顺序执行迭代操作

迭代器：
  - keys()
  - values()
  - entries()

## 集合的实现

```js
class XSet extends Set {
  union(...sets) {
    return XSet.union(this, ...sets)
  }
  intersection(...sets) {
    return XSet.intersection(this, ...sets);
  }
  difference(set) {
    return XSet.difference(this, set);
  }
  symmetricDifference(set) {
    return XSet.symmetricDifference(this, set);
  }
  cartesianProduct(set) {
    return XSet.cartesianProduct(this, set);
  }
  powerSet() {
    return XSet.powerSet(this);
  }
  // 返回两个或更多集合的并集
  static union(a, ...bSets) {
    const unionSet = new XSet(a);
    for (const b of bSets) {
      for (const bValue of b) {
        unionSet.add(bValue);
      }
    }
    return unionSet;
  }
  // 返回两个或更多集合的交集
  static intersection(a, ...bSets) {
    const intersectionSet = new XSet(a);
    for (const aValue of intersectionSet) {
      for (const b of bSets) {
        if (!b.has(aValue)) {
          intersectionSet.delete(aValue);
        }
      }
    }
    return intersectionSet;
  }
  // 返回两个集合的差集
  static difference(a, b) {
    const differenceSet = new XSet(a);
    for (const bValue of b) {
      if (a.has(bValue)) {
        differenceSet.delete(bValue);
      }
    }
    return differenceSet;
  }
  // 返回两个集合的对称差集
  static symmetricDifference(a, b) {
  // 按照定义，对称差集可以表达为
    return a.union(b).difference(a.intersection(b));
  }
  // 返回两个集合（数组对形式）的笛卡儿积
  // 必须返回数组集合，因为笛卡儿积可能包含相同值的对
  static cartesianProduct(a, b) {
    const cartesianProductSet = new XSet();
    for (const aValue of a) {
      for (const bValue of b) {
        cartesianProductSet.add([aValue, bValue]);
      }
    }
    return cartesianProductSet;
  }
  // 返回一个集合的幂集
  static powerSet(a) {
    const powerSet = new XSet().add(new XSet());
    for (const aValue of a) {
      for (const set of new XSet(powerSet)) {
        powerSet.add(new XSet(set).add(aValue));
      }
    }
    return powerSet;
  }
} 
```

## `WeakSet`

值**只能是** `Object` 或者继承自 `Object` 的类型，尝试使用非对象设置值会抛出 `TypeError`

原始值可以先包装成对象再用作值 `const stringKey = new String("key1");`

**没有 `clear()`方法与迭代方法**

### 用途

给元素打标签

```js
const disabledElements = new WeakSet();
const loginButton = document.querySelector('#login');
// 通过加入对应集合，给这个节点打上“禁用”标签
disabledElements.add(loginButton); 
// 只要节点消失，其相应的内存就会被立即释放
```


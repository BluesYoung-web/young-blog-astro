---
layout: "@/layouts/BlogPost.astro"
title: 18-原型模式
description: 18-原型模式
date: 2022-04-04 17:55:00
image: /img/design-mode.jpeg
---

[[toc]]

## 定义

**复制已有对象，而又无需使代码依赖它们所属的类**

## 适用场景

需要复制一些对象，同时又希望代码独立于这些对象所属的具体类

子类的区别仅在于其对象初始化的方式

## 优缺点

**优点：**
- 可以克隆对象，而无需与它们所属的具体类耦合
- 可以克隆预生成的原型，避免反复运行初始化代码
- 可以更方便地生成复杂对象
- 可以使用继承之外的其他方式来处理复杂对象的不同配置

**缺点：**
- 克隆包含循环引用的复杂对象可能会非常麻烦

## 实现

```ts
/**
 * 原型
 */
class Prototype {
  public primitive!: number | string | boolean;
  public component!: object;
  public circularReference!: ComponentWithBackReference;
  public clone(): this {
    const clone = Object.create(this);
    clone.component = Object.create(this.component);
    clone.circularReference = {
      ...this.circularReference,
      prototype: { ...this },
    };
    return clone;
  }
}
class ComponentWithBackReference {
  constructor(public prototype: Prototype) {}
}
function clientCode() {
  const p1 = new Prototype();
  p1.primitive = 245;
  p1.component = new Date();
  p1.circularReference = new ComponentWithBackReference(p1);
  const p2 = p1.clone();
  if (p1.primitive === p2.primitive) {
    console.log('变量复制成功');
  } else {
    console.log('变量复制失败');
  }
  if (p1.component === p2.component) {
    console.log('组件未被复制');
  } else {
    console.log('组件复制成功');
  }
  if (p1.circularReference === p2.circularReference) {
    console.log('循环引用复制失败');
  } else {
    console.log('循环引用复制成功');
  }
  if (p1.circularReference.prototype === p2.circularReference.prototype) {
    console.log('原型链接到原有对象，复制失败');
  } else {
    console.log('原型链接到复制对象，复制成功');
  }
}
clientCode();
```
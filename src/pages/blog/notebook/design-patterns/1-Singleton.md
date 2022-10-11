---
layout: "@/layouts/BlogPost.astro"
title: 1-单例模式
description: 1-单例模式
date: 2022-04-03 16:20:00
image: /img/design-mode.jpeg
---

[[toc]]

## 定义

**保证一个类只有一个实例，并提供一个全局访问它的节点**

## 适用场景

线程池

全局缓存

浏览器的 window 对象

## 优缺点

**优点：**
- 保证一个类只有一个实例
- 获得了一个指向该实例的全局访问节点
- 仅在首次请求单例对象时将其初始化

**缺点：**
- 违反单一职责原则
- 可能掩盖不良设计(程序各个组件之间了解过多)
- **多线程**需要特殊处理
- 不利于单元测试

## 实现

全局变量——天然的单例模式

**透明单例**——外部依旧使用 `new` 进行创建，内部进行限制

**代理**——将限制外部化为代理类，通过对代理类进行 `new` 获取单例

惰性单例——等到实际使用时再创建

```ts
class Singleton {
  private static instance: Singleton;
  /**
   * 构造函数私有化，保证外部无法使用 new 进行实例化
   */
  private constructor() { }
  /**
   * 通过静态方法控制单例的唯一性
   */
  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}
function fn() {
  const s1 = Singleton.getInstance();
  const s2 = Singleton.getInstance();
  if (s1 === s2) {
    console.log('单例模式成功');
  } else {
    console.log('单例模式失败');
  }
}
fn();
```
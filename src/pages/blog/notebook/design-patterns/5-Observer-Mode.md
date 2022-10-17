---
title: 5-观察者(发布订阅)模式
description: 5-观察者(发布订阅)模式
date: 2022-04-04 09:50:00
image: /img/design-mode.jpeg
---

[[toc]]

## 定义

**定义对象间的一种多对多的依赖关系**

当一个对象的状态发生改变时，所有**订阅(依赖)**它的对象都会得到通知

`JavaScript` 中一般使用**事件模型**来替代传统的发布订阅模式

异步编程中替代回调函数的解决方案

## 适用场景

一个对象状态的改变会影响其他对象

实际对象是事先未知的或动态变化的

应用中的一些对象必须观察其他对象

## 优缺点

**优点：**
- 遵循开闭原则
- 可以在运行时建立对象之间的联系

**缺点：**
- **通知的顺序是随机的**

## 实现

```ts
interface Observer {
  update(s: Subject): void;
};
interface Subject {
  state: number;
  on(o: Observer): this;
  off(o: Observer): this;
  emit(): void;
};

class S1 implements Subject {
  public state = 0;
  private observers: Set<Observer> = new Set();
  public on(o: Observer) {
    this.observers.add(o);
    return this;
  }
  public off(o: Observer) {
    this.observers.delete(o);
    return this;
  }
  public emit() {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }
  public doSth() {
    console.log('我做了一件事');
    this.state = Math.floor(Math.random() * (10 + 1));
    console.log('发布者', this.state);
    this.emit();
    return this;
  }
};

class O1 implements Observer {
  public update(s: Subject) {
    if (s.state < 5) {
      console.log('观察者1作出响应');
    }
  }
};

class O2 implements Observer {
  public update(s: Subject) {
    if (s.state >= 5) {
      console.log('观察者2作出响应');
    }
  }
};

const s = new S1();
const o1 = new O1();
const o2 = new O2();
s.on(o1).on(o2).doSth().doSth().off(o2).doSth();
// 我做了一件事
// 发布者 9
// 观察者2作出响应
// 我做了一件事
// 发布者 2
// 观察者1作出响应
// 我做了一件事
// 发布者 1
// 观察者1作出响应
```
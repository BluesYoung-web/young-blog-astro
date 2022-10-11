---
layout: "@/layouts/BlogPost.astro"
title: 19-桥接模式
description: 19-桥接模式
date: 2022-04-04 18:20:00
image: /img/design-mode.jpeg
---

[[toc]]

## 定义

将一个大类或一系列紧密相关的类拆分为抽象和实现两个独立的层次结构，从而能在开发时分别使用

**抽象层(接口层)，控制实体，自身不负责任何具体工作，它需要将工作委派给实现层**

## 适用场景

拆分或重组一个具有多种功能的庞杂类

在几个独立维度之上扩展一个类

在运行时切换不同的实现方法

## 优缺点

**优点：**
- 符合单一职责、开闭原则
- 可以创建与平台无关的类和程序
- 客户端代码仅与高层抽象部分进行互动，不会接触到平台的详细信息

**缺点：**
- 对高内聚的类使用该模式，可能会使代码更加复杂

## 实现

```ts
/**
 * 抽象层，负责接口调用和事件委派
 */
class Abstraction {
  constructor(protected implementation: Implementation) {}
  public operation() {
    const result = this.implementation.operationImplementation();
    return `原有抽象类:\n${result}`;
  }
}
/**
 * 在不修改实现方法的情况下扩展抽象类
 */
class ExtendedAbstraction extends Abstraction {
  public operation() {
    const result = this.implementation.operationImplementation();
    return `扩展后的抽象类:\n${result}`;
  }
}
/**
 * 定义实现方法接口
 */
interface Implementation {
  operationImplementation(): string;
}
/**
 * 接口的具体实现
 */
class ConcreteImplementationA implements Implementation {
  public operationImplementation() {
    return '使用A平台实现';
  }
}
class ConcreteImplementationB implements Implementation {
  public operationImplementation() {
    return '使用B平台实现';
  }
}
/**
 * 客户端
 */
function clientCode(abstraction: Abstraction) {
  // ..
  console.log(abstraction.operation());
  // ..
}
/**
 * 调用不同的实现接口
 */
let implementation = new ConcreteImplementationA();
let abstraction = new Abstraction(implementation);
clientCode(abstraction);
console.log('\n');
implementation = new ConcreteImplementationB();
abstraction = new ExtendedAbstraction(implementation);
clientCode(abstraction);
```
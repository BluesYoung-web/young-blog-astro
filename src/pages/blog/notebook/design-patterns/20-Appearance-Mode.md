---
layout: "@/layouts/BlogPost.astro"
title: 20-外观模式
description: 20-外观模式
date: 2022-04-04 18:30:00
image: /img/design-mode.jpeg
---

[[toc]]

## 定义

**能为程序库、框架或其他复杂类提供一个简单的接口**

## 适用场景

需要一个指向复杂子系统的直接接口，且该接口的功能有限

需要将子系统组织为多层结构

## 优缺点

**优点：**
- 可以让自己的代码独立于复杂的子系统

**缺点：**
- 外观可能成为与程序中所有类都耦合的上帝对象

## 实现

```ts
/**
 * 基类（服务端的模拟客户端）
 */
class Facade {
  /**
   * 按需构造
   */
  constructor(
    protected subsystem1: Subsystem1 = new Subsystem1(),
    protected subsystem2: Subsystem2 = new Subsystem2()
  ) {}

  public operation() {
    let result = '基类初始化子系统:\n';
    result += this.subsystem1.operation1();
    result += this.subsystem2.operation1();
    result += '基类按照顺序调用子系统的方法:\n';
    result += this.subsystem1.operationN();
    result += this.subsystem2.operationZ();
    return result;
  }
}
/**
 * 子系统1
 */
class Subsystem1 {
  public operation1(): string {
    return '子系统1准备完毕\n';
  }
  public operationN(): string {
    return '子系统1出发\n';
  }
}
/**
 * 子系统2
 */
class Subsystem2 {
  public operation1(): string {
    return '子系统2准备完毕\n';
  }
  public operationZ(): string {
    return '子系统2发射';
  }
}
/**
 * 客户端
 */
function clientCode(facade: Facade) {
  console.log(facade.operation());
}
const subsystem1 = new Subsystem1();
const subsystem2 = new Subsystem2();
const facade = new Facade(subsystem1, subsystem2);
clientCode(facade);
```
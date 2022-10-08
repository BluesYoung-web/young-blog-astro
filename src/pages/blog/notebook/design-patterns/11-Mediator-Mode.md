---
title: 11-中介者模式
description: 11-中介者模式
date: 2022-04-04 15:25:00
image: /img/design-mode.jpeg
---

[[toc]]

## 定义

减少对象之间混乱无序的依赖关系

限制对象之间的直接交互，迫使它们通过一个中介者对象进行合作

## 适用场景

一些对象和其他对象过于紧密耦合以致难以对其进行修改

组件因为过度依赖其他组件而无法在不同应用中复用

为了能在不同情景下复用一些基本行为，导致需要被迫创建大量组件子类

多人游戏、购物车

## 优缺点

**优点：**
- 符合单一职责，开闭原则
- 可以减轻应用中多个组件间的耦合情况
- 可以方便的复用各个组件

**缺点：**
- 中介者会膨胀的很大并且逻辑复杂

## 实现

```ts
interface Mediator {
  notify(sender: object, event: string): void;
}
/**
 * 中介者实现
 */
class ConcreteMediator implements Mediator {
  private component1: Component1;
  private component2: Component2;
  constructor(c1: Component1, c2: Component2) {
    this.component1 = c1;
    this.component1.setMediator(this);
    this.component2 = c2;
    this.component2.setMediator(this);
  }
  public notify(sender: object, event: string): void {
    if (event === 'A') {
      console.log('中介者调用1:');
      this.component2.doC();
    }
    if (event === 'D') {
      console.log('中介者调用2:');
      this.component1.doB();
      this.component2.doC();
    }
  }
}
/**
 * 基础组件
 */
class BaseComponent {
  protected mediator: Mediator | null = null;
  public setMediator(mediator: Mediator): void {
    this.mediator = mediator;
  }
}
/**
 * 子基础组件1
 */
class Component1 extends BaseComponent {
  public doA() {
    console.log('子组件1执行 A.');
    this.mediator?.notify(this, 'A');
  }
  public doB() {
    console.log('子组件1执行 B.');
    this.mediator?.notify(this, 'B');
  }
}
/**
 * 子基础组件2
 */
class Component2 extends BaseComponent {
  public doC() {
    console.log('子组件2执行 C.');
    this.mediator?.notify(this, 'C');
  }
  public doD() {
    console.log('子组件2执行 D.');
    this.mediator?.notify(this, 'D');
  }
}
/**
 * 客户端
 */
const c1 = new Component1();
const c2 = new Component2();
const mediator = new ConcreteMediator(c1, c2);
console.log('客户端触发操作A.');
c1.doA();
console.log('');
console.log('客户端触发操作D.');
c2.doD();
/**
"客户端触发操作A." 
"子组件1执行 A." 
"中介者调用1:" 
"子组件2执行 C." 
"" 
"客户端触发操作D." 
"子组件2执行 D." 
"中介者调用2:" 
"子组件1执行 B." 
"子组件2执行 C." 
*/
```
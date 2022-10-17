---
title: 13-状态模式
description: 13-状态模式
date: 2022-04-04 15:50:00
image: /img/design-mode.jpeg
---

[[toc]]

## 定义

一种非同寻常的优秀模式，也是解决某些需求场景的最好方法(**状态机**)

能让你在一个对象的内部状态变化时改变其行为，使其看上去就像改变了自身所属的类一样

<n-alert type="info">**为对象的所有可能的状态都新建一个类，然后将所有状态对应的行为都抽取到这个类中**</n-alert>

## 适用场景

对象需要根据自身当前的状态进行不同的行为，同时状态的**数量非常多且与状态相关的代码会频繁变更**

某个类需要根据成员变量的当前值改变自身行为，从而需要使用大量的条件语句

相似状态和基于条件的状态机转换中存在许多重复的代码

点灯、文件上传、导航栏 hover、TCP 请求

## 优缺点

**优点：**
- 符合单一职责、开闭原则
- 通过消除臃肿的状态机条件语句简化上下文代码

**缺点：**
- 如果状态机只有很少的几个状态，或者状态很少发生改变，那么应用该模式可能会矫枉过正

## 实现

```ts
/**
 * 上下文接口
 */
class Context {
  constructor(private state: State) {
    this.transitionTo(state);
  }
  /**
   * 状态转换
   */
  public transitionTo(state: State) {
    console.log(`上下文状态转换： ${(state as unknown as any).constructor.name}.`);
    this.state = state;
    this.state.setContext(this);
  }
  public request1() {
    this.state.handle1();
  }
  public request2() {
    this.state.handle2();
  }
}
/**
 * 基础状态
 */
abstract class State {
  /**
   * 上下文
   */
  protected context: Context | null = null;
  /**
   * 设置上下文
   */
  public setContext(context: Context) {
    this.context = context;
  }
  /**
   * 状态1
   */
  public abstract handle1(): void;
  /**
   * 状态2
   */
  public abstract handle2(): void;
}
/**
 * 状态关联
 */
class ConcreteStateA extends State {
  public handle1() {
    console.log('ConcreteStateA 处理请求1');
    console.log('ConcreteStateA 改变上下文');
    this.context?.transitionTo(new ConcreteStateB());
  }
  public handle2() {
    console.log('ConcreteStateA 处理请求2');
  }
}
class ConcreteStateB extends State {
  public handle1() {
    console.log('ConcreteStateB 处理请求1');
  }

  public handle2() {
    console.log('ConcreteStateB 处理请求2');
    console.log('ConcreteStateB 改变上下文');
    this.context?.transitionTo(new ConcreteStateA());
  }
}
/**
 * 客户端
 */
const context = new Context(new ConcreteStateA());
context.request1();
context.request2();
context.request2();
// 上下文状态转换： ConcreteStateA.
// ConcreteStateA 处理请求1
// ConcreteStateA 改变上下文
// 上下文状态转换： ConcreteStateB.
// ConcreteStateB 处理请求2
// ConcreteStateB 改变上下文
// 上下文状态转换： ConcreteStateA.
// ConcreteStateA 处理请求2
```
---
layout: "@/layouts/BlogPost.astro"
title: 12-装饰器模式
description: 12-装饰器模式
date: 2022-04-04 15:40:00
image: /img/design-mode.jpeg
---

[[toc]]

## 定义

允许通过将对象放入**包含特殊行为的封装对象中**为原对象绑定新的行为

**动态添加新行为**

## 适用场景

无需修改代码的情况下即可使用对象(**在运行时增加额外的行为**)

用继承来扩展对象的方案难以实现或者根本不可行

## 优缺点

**优点：**
- 符合单一职责原则
- 无需创建新的子类即可扩展对象的行为
- 可以**在运行时添加或删除对象的功能**
- 可以用多个装饰器来组合几种行为

**缺点：**
- 在装饰栈中删除特定的装饰器比较困难
- 实现不受装饰栈顺序影响的装饰器比较困难
- 各层的初始化配置代码看上去可能会很糟糕

## 实现

```ts
/**
 * 基础组件
 */
interface Component {
  operation(): string;
}
/**
 * 提供默认值的基础组件
 */
class ConcreteComponent implements Component {
  public operation(): string {
    return '默认值';
  }
}
/**
 * 装饰器
 */
class Decorator implements Component {
  protected component: Component;
  constructor(component: Component) {
    this.component = component;
  }
  /**
   * 调用原有组件的方法
   */
  public operation(): string {
    return this.component.operation();
  }
}
/**
 * 子装饰器
 */
class ConcreteDecoratorA extends Decorator {
  /**
   * 增加自己操作的同时调用父级方法
   */
  public operation(): string {
    return `子装饰器A(${super.operation()})`;
  }
}
class ConcreteDecoratorB extends Decorator {
  public operation(): string {
    return `子装饰器B(${super.operation()})`;
  }
}
/**
 * 客户端
 */
function clientCode(component: Component) {
  // ...
  console.log(`客户端调用结果: ${component.operation()}`);
  // ...
}
const simple = new ConcreteComponent();
console.log('调用基础组件:');
clientCode(simple);
console.log('');
const decorator1 = new ConcreteDecoratorA(simple);
const decorator2 = new ConcreteDecoratorB(decorator1);
console.log('调用装饰后的组件:');
clientCode(decorator2);
// 调用基础组件:
// 客户端调用结果: 默认值

// 调用装饰后的组件:
// 客户端调用结果: 子装饰器B(子装饰器A(默认值))
```
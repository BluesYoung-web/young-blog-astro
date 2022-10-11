---
layout: "@/layouts/BlogPost.astro"
title: 16-抽象工厂模式
description: 16-抽象工厂模式
date: 2022-04-04 16:30:00
image: /img/design-mode.jpeg
---

[[toc]]

## 定义

**能创建一系列相关的对象而无需指定其具体类**

为系列中的每件产品明确声明接口，**确保所有产品变体都继承这些接口**

## 适用场景

代码需要与多个不同系列的相关产品交互，但是无法提前获取相关信息

出于对未来扩展性的考虑，不希望代码基于产品的具体类进行构建

有一个基于一组抽象方法的类，且其主要功能因此变得不明确


## 优缺点

**优点：**
- 符合单一职责、开闭原则
- 确保同一工厂生产的产品相互匹配
- 避免客户端和具体的代码耦合

**缺点：**
- 需要向应用中引入许多接口和类，增加代码复杂度

## 实现

```ts
/**
 * 抽象工厂定义一系列的产品接口
 */
interface AbstractFactory {
  createProductA(): AbstractProductA;
  createProductB(): AbstractProductB;
}
/**
 * 具体工厂1实现抽象工厂
 */
class ConcreteFactory1 implements AbstractFactory {
  // 生产具体产品A
  public createProductA() {
    return new ConcreteProductA1();
  }
  // 生产具体产品B
  public createProductB() {
    return new ConcreteProductB1();
  }
}
/**
 * 具体工厂2实现抽象工厂
 */
class ConcreteFactory2 implements AbstractFactory {
  // 生产具体产品A
  public createProductA() {
    return new ConcreteProductA2();
  }
  // 生产具体产品B
  public createProductB() {
    return new ConcreteProductB2();
  }
}
/**
 * 定义抽象产品A的接口
 */
interface AbstractProductA {
  usefulFunctionA(): string;
}
/**
 * 具体产品A1实现抽象产品接口A
 */
class ConcreteProductA1 implements AbstractProductA {
  public usefulFunctionA() {
    return '这是具体产品A1';
  }
}
/**
 * 具体产品A2实现抽象产品接口A
 */
class ConcreteProductA2 implements AbstractProductA {
  public usefulFunctionA() {
    return '这是具体产品A2';
  }
}
/**
 * 定义抽象产品B的接口
 */
interface AbstractProductB {
  usefulFunctionB(): string;
  /**
   * 与抽象产品A不同的特性
   */
  anotherUsefulFunctionB(collaborator: AbstractProductA): string;
}
/**
 * 具体产品B1实现抽象产品接口B
 */
class ConcreteProductB1 implements AbstractProductB {
  public usefulFunctionB() {
    return '我是产品B1';
  }
  /**
   * 实现具体特性，可调用任意的产品A
   */
  public anotherUsefulFunctionB(collaborator: AbstractProductA) {
    const result = collaborator.usefulFunctionA();
    return `这是B1调用的结果(${result})`;
  }
}
/**
 * 具体产品B2实现抽象产品接口B
 */
class ConcreteProductB2 implements AbstractProductB {
  public usefulFunctionB() {
    return '我是产品B2';
  }
  /**
   * 实现具体特性，可调用任意的产品A
   */
  public anotherUsefulFunctionB(collaborator: AbstractProductA) {
    const result = collaborator.usefulFunctionA();
    return `这是B2调用的结果(${result})`;
  }
}
/**
 * 客户端
 */
function clientCode2(factory: AbstractFactory) {
  const productA = factory.createProductA();
  const productB = factory.createProductB();
  console.log(productB.usefulFunctionB());
  console.log(productB.anotherUsefulFunctionB(productA));
}
/**
 * 客户端随意调用
 */
console.log('我是具体工厂1');
clientCode2(new ConcreteFactory1());
console.log('\n');
console.log('我是具体工厂2');
clientCode2(new ConcreteFactory2());
```
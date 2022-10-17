---
title: 15-工厂模式
description: 15-工厂模式
date: 2022-04-04 16:20:00
image: /img/design-mode.jpeg
---

[[toc]]

## 定义

在父类中提供一个创建对象的方法，允许子类决定实例化对象的类型

使用特殊的工厂方法代替对构造函数的直接调用

在工厂方法中使用 `new`

## 适用场景

无法预知对象确切的类别及其依赖关系

扩展软件库或框架的内部组件

复用现有对象来节省系统资源

## 优缺点

**优点：**
- 符合单一职责、开闭原则
- 避免紧耦合

**缺点：**
- 需要引入许多子类，增加代码复杂度

## 实现

```ts
/**
 * 工厂
 */
abstract class Creator {
  /**
   * 工厂规定的接口
   */
  public abstract factoryMethod(): Product;
  /**
   * 具体操作
   */
  public someOperation(): string {
    // 调用工厂方法创建工厂对象
    const product = this.factoryMethod();
    // 使用产品
    return `我是母工厂，生产了： ${product.operation()}`;
  }
}
/**
 * 子工厂1继承工厂
 */
class ConcreteCreator1 extends Creator {
  /**
   *重载工厂构造方法
   */
  public factoryMethod() {
    return new ConcreteProduct1();
  }
}
/**
 * 子工厂2继承工厂
 */
class ConcreteCreator2 extends Creator {
  /**
   *重载工厂构造方法
   */
  public factoryMethod() {
    return new ConcreteProduct2();
  }
}
/**
 * 规定所有工厂必须实现的接口
 */
interface Product {
  operation(): string;
}
/**
 * 产品1实现产品
 */
class ConcreteProduct1 implements Product {
  public operation() {
    return '{产品1}';
  }
}
/**
 * 产品2实现产品
 */
class ConcreteProduct2 implements Product {
  public operation() {
    return '{产品2}';
  }
}
/**
 * 客户端
 */
function clientCode1(creator: Creator) {
  console.log('我是客户端，不关心调用哪个工厂');
  console.log(creator.someOperation());
}
/**
 * 具体调用
 */
console.log('使用工厂1');
clientCode1(new ConcreteCreator1());
console.log('\n');
console.log('使用工厂2');
clientCode1(new ConcreteCreator2());
```
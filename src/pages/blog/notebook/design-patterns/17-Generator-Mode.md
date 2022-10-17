---
title: 17-生成器模式
description: 17-生成器模式
date: 2022-04-04 17:30:00
image: /img/design-mode.jpeg
---

[[toc]]

## 定义

**能够分步创建复杂的对象**

允许使用相同的创建代码生成不同类型和形式的对象

将对象构造代码从产品类中抽取出来，并将其放在一个名为生成器的独立对象中

## 适用场景

避免构造函数重载

使用代码创建不同形式的产品

使用生成器构造组合树或其他复杂对象

## 优缺点

**优点：**
- 符合单一职责原则
- 可以分步创建对象，暂缓或递归运行创建步骤
- 生成不同形式的产品时，可以复用相同的制造代码

**缺点：**
- 需要新增多个类，代码整体的复杂度会增加

## 实现

```ts
/**
 * 生成器对象接口，定义了生产产品的每一步
 */
interface Builder {
  producePartA(): void;
  producePartB(): void;
  producePartC(): void;
}
/**
 * 生成器1实现生成器接口
 */
class ConcreteBuilder1 implements Builder {
  // ! 类型断言，明确知道必定会被赋值
  private product!: Product1;
  /**
   * 执行构造函数
   */
  constructor() {
    console.log('调用构造函数')
    this.reset();
  }
  public reset() {
    console.log('调用---')
    this.product = new Product1();
  }
  public producePartA() {
    this.product.parts.push('第一部分');
  }
  public producePartB() {
    this.product.parts.push('第二部分');
  }
  public producePartC() {
    this.product.parts.push('第三部分');
  }
  /**
   * 获取产品（this.reset(); 保证为独立的产品）
   */
  public getProduct() {
    const result = this.product;
    this.reset();
    return result;
  }
}
/**
 * 产品1
 */
class Product1 {
  public parts: string[] = [];
  public listParts() {
    console.log(`我的产品组成: ${this.parts.join(', ')}\n`);
  }
}
/**
 * 主管类，控制产品的具体生产
 */
class Director {
  private builder!: Builder;
  /**
   * 设置要生产的具体产品
   */
  public setBuilder(builder: Builder) {
    this.builder = builder;
  }
  /**
   * 具体生产步骤1
   */
  public buildMinimalViableProduct() {
    this.builder.producePartA();
  }
  /**
   * 具体生产步骤2
   */
  public buildFullFeaturedProduct() {
    this.builder.producePartA();
    this.builder.producePartB();
    this.builder.producePartC();
  }
}
/**
 * 客户端
 */
function clientCode(director: Director) {
  const builder = new ConcreteBuilder1();
  director.setBuilder(builder);
  console.log('这是简化版:');
  director.buildMinimalViableProduct();
  builder.getProduct().listParts();
  console.log('这是完整版:');
  director.buildFullFeaturedProduct();
  builder.getProduct().listParts();
  // 不使用主管类
  console.log('这是用户自定义:');
  builder.producePartA();
  builder.producePartC();
  builder.getProduct().listParts();
}
/**
 * 实例化主管对象
 */
const director = new Director();
clientCode(director);
/**
"调用构造函数" 
"调用---" 
"这是简化版:" 
"调用---" 
"我的产品组成: 第一部分" 
"这是完整版:" 
"调用---" 
"我的产品组成: 第一部分, 第二部分, 第三部分" 
"这是用户自定义:" 
"调用---" 
"我的产品组成: 第一部分, 第三部分" 
 */
```
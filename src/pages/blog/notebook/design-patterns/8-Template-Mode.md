---
layout: "@/layouts/BlogPost.astro"
title: 8-模板方法模式
description: 8-模板方法模式
date: 2022-04-04 10:30:00
image: /img/design-mode.jpeg
---

[[toc]]

## 定义

**一种只需要使用继承就可以实现的简单模式**

在父类中定义一个算法框架，**允许子类在不修改结构的情况下重写特定的步骤**

## 适用场景

只希望客户端**扩展某个特定的算法步骤**，而不是整个算法或其结构

多个算法除一些细微不同之外，几乎完全一样(**生命周期钩子**)

## 优缺点

**优点：**
- 可以允许客户端重写一个大型算法中的特定部分
- 可以将重复的代码提取到一个超类当中

**缺点：**
- 部分客户端可能会受到算法框架的限制
- 通过子类抑制默认步骤的实现可能会违反里氏替换原则
- 模板方法中的步骤越多，其维护起来可能就会越困难

## 实现

```ts
/**
 * 抽象类定义模板方法
 */
abstract class AbstractClass {
  public templateMethod(): void {
    this.baseOperation1();
    this.requiredOperations1();
    this.baseOperation2();
    this.hook1();
    this.requiredOperation2();
    this.baseOperation3();
    this.hook2();
  }
  protected baseOperation1(): void {
    console.log('模板默认基础操作1');
  }
  protected baseOperation2(): void {
    console.log('模板默认基础操作2');
  }
  protected baseOperation3(): void {
    console.log('模板默认基础操作3');
  }
  /**
   * 子类的请求操作
   */
  protected abstract requiredOperations1(): void;
  protected abstract requiredOperation2(): void;
  /**
   * 生命周期钩子
   */
  protected hook1(): void { }
  protected hook2(): void { }
}
/**
 * 具体类1实现
 */
class ConcreteClass1 extends AbstractClass {
  protected requiredOperations1(): void {
    console.log('我是具体类1的请求1');
  }
  protected requiredOperation2(): void {
    console.log('我是具体类1的请求2');
  }
}
/**
 * 具体类2
 */
class ConcreteClass2 extends AbstractClass {
  protected requiredOperations1(): void {
    console.log('我是具体类2的请求1');
  }
  protected requiredOperation2(): void {
    console.log('我是具体类2的请求2');
  }
  protected hook1(): void {
    console.log('我是具体类2的钩子1');
  }
}
/**
 * 客户端
 */
function clientCode(abstractClass: AbstractClass) {
  abstractClass.templateMethod();
}
console.log('具体类1:');
const c1 = new ConcreteClass1();
clientCode(c1);
console.log('');
console.log('具体类2:');
const c2 = new ConcreteClass2();
clientCode(c2);
/**
"具体类1:" 
"模板默认基础操作1" 
"我是具体类1的请求1" 
"模板默认基础操作2" 
"我是具体类1的请求2" 
"模板默认基础操作3" 
"" 
"具体类2:" 
"模板默认基础操作1" 
"我是具体类2的请求1" 
"模板默认基础操作2" 
"我是具体类2的钩子1" 
"我是具体类2的请求2" 
"模板默认基础操作3"  
 */
```
---
title: 2-策略模式
description: 2-策略模式
date: 2022-04-03 16:30:00
image: /img/design-mode.jpeg
---

[[toc]]

## 定义

定义一系列算法，把它们一个个封装起来，并且使它们之间可以相互替换

**将算法的使用和实现分离开**

## 组成

### 策略类

封装算法的具体实现

### 环境类

接收客户端的请求，然后将请求委托给某个策略类进行处理


## 适用场景

工资(年终奖)计算

缓动动画

表单验证

## 优缺点

**优点：**
- 可以**在运行时切换对象内的算法**
- 可以将算法的实现与使用隔离开来
- 可以使用组合代替继承

**缺点：**
- 算法极少发生改变的情况下，使用该模式只会让程序过于复杂
- 客户端必须知晓策略间的不同，从而选择使用不同的策略
- 许多现代编程语言支持函数类型功能，允许你在一组匿名函数中实现不同版本的算法(**无需借助额外的类和接口来保持代码的简洁**)

## 实现

```js
/**
 * JS 实现，计算年终奖
 */
const strategies = {
  "S": (s) => s * 4,
  "A": (s) => s * 3,
  "B": (s) => s * 2
};

function calculateBonus(level, salary){
  return strategies[level](salary);
}
console.log(calculateBonus('S', 20000));
console.log(calculateBonus('A', 10000));
```

```ts
/**
 * 上下文接口(类)
 */
class Context {
  private strategy: Strategy;
  constructor(strategy: Strategy) {
    this.strategy = strategy;
  }
  public setStrategy(strategy: Strategy) {
    this.strategy = strategy;
  }
  public doSomeBusinessLogic(): void {
    const result = this.strategy.doAlgorithm(['a', 'b', 'c', 'd', 'e']);
    console.log(result.join(','));
  }
}
/**
 * 算法接口
 */
interface Strategy {
  doAlgorithm(data: string[]): string[];
}
/**
 * 算法A实现
 */
class ConcreteStrategyA implements Strategy {
  public doAlgorithm(data: string[]): string[] {
    return data.sort();
  }
}
/**
 * 算法B实现
 */
class ConcreteStrategyB implements Strategy {
  public doAlgorithm(data: string[]): string[] {
    return data.reverse();
  }
}
/**
 * 客户端
 */
const context = new Context(new ConcreteStrategyA());
console.log('正常排序');
context.doSomeBusinessLogic();
console.log('');
console.log('逆序');
context.setStrategy(new ConcreteStrategyB());
context.doSomeBusinessLogic();
```
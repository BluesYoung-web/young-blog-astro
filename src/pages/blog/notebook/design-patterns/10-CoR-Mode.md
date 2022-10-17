---
title: 10-责任链模式
description: 10-责任链模式
date: 2022-04-04 15:12:00
image: /img/design-mode.jpeg
---

[[toc]]

## 定义

允许将请求沿着责任链发送

收到请求之后，每个处理者都可以对请求进行处理或者将它传递给下一个处理者(**`express/koa` 中间件**)

责任链会将特定行为转换为被称作处理者的**独立对象**

## 适用场景

需要使用不同的方式处理不同的请求，而且**请求类型和顺序事先未知**

必须**按顺序**执行多个处理者

所有处理者及其顺序必须在**运行时**进行改变

## 优缺点

**优点：**
- 符合单一职责，开闭原则
- 解耦请求发送者和 N 个接收者之间的关系
- 可以控制处理请求的顺序

**缺点：**
- 部分请求可能未被处理

## 实现

```ts
/**
 * 基类接口
 */
interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: string): string | null;
}
/**
 * 抽象类
 */
abstract class AbstractHandler implements Handler {
  private nextHandler?: Handler;
  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }
  public handle(request: string) {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    return null;
  }
}
/**
 * 具体处理1
 */
class MonkeyHandler extends AbstractHandler {
  public handle(request: string) {
    if (request === 'Banana') {
      return `猴子吃 ${request}.`;
    }
    return super.handle(request);

  }
}
/**
 * 具体处理2
 */
class SquirrelHandler extends AbstractHandler {
  public handle(request: string) {
    if (request === 'Nut') {
      return `松鼠吃 ${request}.`;
    }
    return super.handle(request);
  }
}
/**
 * 具体处理3
 */
class DogHandler extends AbstractHandler {
  public handle(request: string) {
    if (request === 'MeatBall') {
      return `狗吃 ${request}.`;
    }
    return super.handle(request);
  }
}
/**
 * 客户端
 */
function clientCode(handler: Handler) {
  const foods = ['Nut', 'Banana', 'Cup of coffee'];
  for (const food of foods) {
    console.log(`谁吃 ${food}?`);
    const result = handler.handle(food);
    if (result) {
      console.log(`  ${result}`);
    } else {
      console.log(`  ${food} 没人吃`);
    }
  }
}
const monkey = new MonkeyHandler();
const squirrel = new SquirrelHandler();
const dog = new DogHandler();
monkey.setNext(squirrel).setNext(dog);
// ----------------------------------------------------------
console.log('责任链（处理顺序）: Monkey > Squirrel > Dog\n');
clientCode(monkey);
console.log('');
console.log('子责任链: Squirrel > Dog\n');
clientCode(squirrel);
```
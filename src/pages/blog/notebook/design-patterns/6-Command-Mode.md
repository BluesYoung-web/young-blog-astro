---
layout: "@/layouts/BlogPost.astro"
title: 6-命令模式
description: 6-命令模式
date: 2022-04-04 10:00:00
image: /img/design-mode.jpeg
---

[[toc]]

## 定义

最优雅和简单的模式之一

可以将请求转换为一个包含与请求相关的所有信息的独立对象

该转换能让你根据不同的请求：
- 将方法参数化
- 延迟请求执行
- 将请求放入队列
- **可以回滚(撤销请求)**

## 适用场景

需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道请求的操作是什么

需要通过操作来参数化对象

需要将操作放入队列中或远程执行操作

需要实现操作的回滚功能

## 优缺点

**优点：**
- 遵循单一职责，开闭原则
- 可以**实现撤销和恢复功能**
- 可以实现操作的延迟执行
- 可以将一组简单的命令组成一个复杂的命令

**缺点：**
- 增加代码复杂度

## 实现

```ts
/**
 * 定义执行命令的方法
 */
interface Command {
  execute(): void;
}
/**
 * 简单命令实现
 */
class SimpleCommand implements Command {
  private payload: string;
  constructor(payload: string) {
    this.payload = payload;
  }
  public execute() {
    console.log(`我执行了简单命令 (${this.payload})`);
  }
}
/**
 * 复杂命令实现
 */
class ComplexCommand implements Command {
  private receiver: Receiver;
  /**
   * 上下文数据
   */
  private a: string;
  private b: string;
  /**
   * 复杂命令
   */
  constructor(receiver: Receiver, a: string, b: string) {
    this.receiver = receiver;
    this.a = a;
    this.b = b;
  }
  public execute() {
    console.log('复杂命令需要委派给下一级执行');
    this.receiver.doSomething(this.a);
    this.receiver.doSomethingElse(this.b);
  }
}
/**
 * 具体执行
 */
class Receiver {
  public doSomething(a: string) {
    console.log(`a执行 (${a}.)`);
  }
  public doSomethingElse(b: string) {
    console.log(`b执行 (${b}.)`);
  }
}
/**
 * 命令栈
 */
class Invoker {
  private onStart: Command;
  private onFinish: Command;
  public setOnStart(command: Command) {
    this.onStart = command;
  }
  public setOnFinish(command: Command) {
    this.onFinish = command;
  }
  public doSomethingImportant() {
    console.log('是否存在优先级更高的事情需要执行?');
    if (this.isCommand(this.onStart)) {
      this.onStart.execute();
      console.log('执行了优先级更高的事情');
    }
    console.log('是否还有事情要做?');
    if (this.isCommand(this.onFinish)) {
      this.onFinish.execute();
      console.log('最后一件事情已经完成了');
    }
  }
  private isCommand(object: Command) {
    return object.execute !== undefined;
  }
}
/**
 * 客户端
 */
const invoker = new Invoker();
invoker.setOnStart(new SimpleCommand('你好'));
const receiver = new Receiver();
invoker.setOnFinish(new ComplexCommand(receiver, '发邮件', '打电话'));
invoker.doSomethingImportant();
// 是否存在优先级更高的事情需要执行?
// 我执行了简单命令 (你好)
// 执行了优先级更高的事情
// 是否还有事情要做?
// 复杂命令需要委派给下一级执行
// a执行 (发邮件.)
// b执行 (打电话.)
// 最后一件事情已经完成了
```
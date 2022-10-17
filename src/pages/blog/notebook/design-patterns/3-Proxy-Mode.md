---
title: 3-代理模式
description: 3-代理模式
date: 2022-04-03 16:40:00
image: /img/design-mode.jpeg
---

[[toc]]

## 定义

为一个对象提供**代用品或占位符**，以便于控制对它的访问

**允许在将真实请求提交给对象前后进行一些处理**

## 适用场景

### 虚拟代理

延迟初始化

图片懒加载

合并 HTTP 请求

缓存

### 保护代理

进行访问控制(防火墙)

### 远程代理

本地执行远程服务

### 日志记录代理

记录请求的日志

### 智能引用

在没有客户端使用某个**重量级对象**时立即销毁该对象(**自动垃圾回收**)

## 优缺点

**优点：**
- 可以客户端毫无察觉的情况下控制服务对象
- 如果客户端对服务对象的生命周期没有特殊要求，可以对生命周期进行管理
- 即使服务对象还未准备好或者不存在，代理也可以正常工作
- 遵循开闭原则

**缺点：**
- 代码复杂度增加
- 服务响应延迟

## 实现

```ts
/**
 * 基类接口
 */
interface Subject {
  request(): void;
}
/**
 * 接口实现1
 */
class RealSubject implements Subject {
  public request(): void {
    console.log('这是真实对象产生的请求');
  }
}
/**
 * 接口实现2
 */
class MyProxy implements Subject {
  private realSubject: RealSubject;
  constructor(realSubject: RealSubject) {
    this.realSubject = realSubject;
  }
  /**
   * 请求代理
    */
  public request(): void {
    if (this.checkAccess()) {
      this.realSubject.request();
      this.logAccess();
    }
  }
  /**
   * 是否校验数据库
   */
  private checkAccess(): boolean {
    console.log('代理需要校验数据库');
    return true;
  }
  /**
   * 记录日志
   */
  private logAccess(): void {
    console.log('代理记录请求日志');
  }
}
/**
 * 客户端
 */
function clientCode(subject: Subject) {
  subject.request();
}
console.log('不使用代理：');
const realSubject = new RealSubject();
clientCode(realSubject);
console.log('\n');
console.log('使用代理：');
const proxy = new MyProxy(realSubject);
clientCode(proxy);
```
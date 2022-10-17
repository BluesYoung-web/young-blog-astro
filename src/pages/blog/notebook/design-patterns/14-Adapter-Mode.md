---
title: 14-适配器模式
description: 14-适配器模式
date: 2022-04-04 16:10:00
image: /img/design-mode.jpeg
---

[[toc]]

## 定义

解决两个软件实体之间接口不兼容的问题

数据格式转换

实现了其中一个对象的接口，并对另一个对象进行封装

## 适用场景

希望使用某个类，但是其接口与其他代码不兼容

希望复用多个由于缺少相同功能而无法被添加到超类的子类

## 优缺点

**优点：**
- 符合单一职责、开闭原则

**缺点：**
- 代码复杂度增加

## 实现

```ts
/**
 * 定义客户端接口
 */
class Target {
	public request(): string {
		return '默认值';
	}
}
/**
 * 现有接口
 */
class Adaptee {
	public specificRequest(): string {
		return '你是年少的欢喜';
	}
}
/**
 * 适配器
 */
class Adapter extends Target {
	private adaptee: Adaptee;
	constructor(adaptee: Adaptee) {
		super();
		this.adaptee = adaptee;
	}
	/**
	 * 方法重载
	 */
	public request(): string {
		const result = this.adaptee
      .specificRequest()
      .split('')
      .reverse()
      .join('');
		return `适配器处理过的值： ${result}`;
	}
}
/**
 * 客户端
 */
function clientCode(target: Target) {
	console.log(target.request());
}
console.log('使用原有接口：');
const target = new Target();
clientCode(target);
console.log('\n');
const adaptee = new Adaptee();
console.log(`适配器处理之前的接口：${adaptee.specificRequest()}`);
console.log('\n');
console.log('加入适配器：');
const adapter = new Adapter(adaptee);
clientCode(adapter);
```
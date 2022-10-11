---
layout: "@/layouts/BlogPost.astro"
title: 28-类
image: /img/hbs.png
description: JavaScript 类
date: 2021-01-07 14:25:50
---

[[toc]]

## 定义

使用 `ES6` 新增 `class` 关键字来定义

**不存在提升**

受块级作用域的限制

## 组成(全部可选)

构造函数 `constructor`

实例成员

原型方法

获取函数、设置函数(访问器属性)

静态属性及方法

### 实例成员

直接挂载到 `this` 上的

一般在构造函数中挂载，不过在其他地方也可以

**所有的实例成员不会在原型上共享**

### 原型方法

构造函数之外定义的方法都会挂载到原型对象上

所有实例可共享

### 静态属性及方法

需要添加 `static` 前缀

直接使用**类名**调用

静态类方法非常适合作为实例工厂

## `extends`

`ES6` 新增**继承**关键字

`class MyArray extends Array`

可向后兼容普通构造函数

## `super`

引用父类

<n-alert title="只能在构造函数、实例方法、静态方法中使用" type="info" />

<n-alert class="mt-4" title="后代构造函数第一行必须执行 super()，否则不能使用 this" type="warning" />

<n-alert class="mt-4" title="不能单独引用 super 关键字" type="warning">要么用它调用构造函数，要么用它引用静态方法</n-alert>

`ES6` 给类构造函数和静态方法添加了内部特性 `[[HomeObject]]`，这个特性是一个指针，指向定义该方法的对象。这个指针是自动赋值的，而且只能在 `JavaScript` 引擎内部 访问。`super` 始终会定义为 `[[HomeObject]]` 的原型

## 抽象基类

并没有专门对应的语法

但是可以通过 `new.target` 实现

```js
// 抽象基类
class Vehicle {
	constructor() {
		if (new.target === Vehicle) {
			throw new Error('Vehicle cannot be directly instantiated');
		}
		if (!this.foo) {
			throw new Error('Inheriting class must define foo()');
		}
		console.log('success!');
	}
}
// 派生类
class Bus extends Vehicle {
	foo() {}
}
// 派生类
class Van extends Vehicle {}
new Bus(); // success!
new Van(); // Error: Inheriting class must define foo() 
new Bus(); // class Bus {}
new Vehicle(); // class Vehicle {}
// Error: Vehicle cannot be directly instantiated 
```

## 修改继承内置类型

```js
class SuperArray extends Array {
	static get [Symbol.species]() {
		return Array;
	}
}
let a1 = new SuperArray(1, 2, 3, 4, 5);
let a2 = a1.filter(x => !!(x%2))
console.log(a1); // [1, 2, 3, 4, 5]
console.log(a2); // [1, 3, 5]
console.log(a1 instanceof SuperArray); // true
console.log(a2 instanceof SuperArray); // false 
```

## 多继承(混入)

并不像传统语言一样支持 `extends A, B, C`

不过可以使用表达式

```js
class Vehicle {}
let FooMixin = (Superclass) => class extends Superclass {
	foo() {
		console.log('foo');
	}
};
let BarMixin = (Superclass) => class extends Superclass {
	bar() {
		console.log('bar');
	}
};
let BazMixin = (Superclass) => class extends Superclass {
	baz() {
		console.log('baz');
	}
};
function mix(BaseClass, ...Mixins) {
	return Mixins.reduce((accumulator, current) => current(accumulator), BaseClass);
}
class Bus extends mix(Vehicle, FooMixin, BarMixin, BazMixin) {} 
let b = new Bus();
b.foo(); // foo
b.bar(); // bar
b.baz(); // baz 
```

很多 `JavaScript` 框架（特别是 `React`）已经抛弃混入模式，转向了组合模式（把方法提取到独立的类和辅助对象中，然后把它们组合起来，但不使用继承）。这反映了那个众所周知的软件设计原则：“**组合胜过继承**（`composition over inheritance`）。”这个设计原则被很多人遵循，在代码设计中能提供极大的灵活性

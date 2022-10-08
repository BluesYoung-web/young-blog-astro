---
title: 27-继承
image: /img/hbs.png
description: JavaScript 集成
date: 2021-01-07 11:53:16
---

[[toc]]

## 原型链继承

**不够私有化**

创建子类时，**不能向超类的构造函数传递参数**

```js
function GrandFather(){
	this.money = 'rich';
}

GrandFather.prototype.getGrandMoney = function(){
	return this.money;
}

function Father(){
	this.own = 'common';
}

Father.prototype = new GrandFather();

Father.prototype.getFatherMoney = function(){
	return this.own;
}

var son = new Father();
console.log(son.getGrandMoney()); // rich
console.log(son.getFatherMoney());// common
/**
 * son instanceof Object, GrandFather, Father
 * [Object, GrandFather, Father].prototype.isPrototypeOf(son)
 */
```

## 借用构造函数继承

伪构造函数继承

**经典继承**

**方法都在构造函数里面定义，无法复用**

**超类原型中的方法对子类不可见**

```js
function GrandFather(){
	this.colors = ['red', 'green', 'blue'];
}
function Father(){
	GrandFather.call(this);
}
var son1 = new Father();
son1.colors.push('black');
var son2 = new Father();
console.log(son1.colors); // ["red", "green", "blue", "black"]
console.log(son2.colors); // ["red", "green", "blue"]
```

## 组合继承

伪经典继承

**最常用**

`instanceof` 和 `isPrototypeOf()` 也适用

```js
function GrandFather(name){
	this.name = name;
	this.colors = ['red', 'green', 'blue'];
}
GrandFather.prototype.sayName = function(){
	return this.name;
}
function Father(name, age){
	GrandFather.call(this, name);
	this.age = age;
}
Father.prototype = new GrandFather();
Father.prototype.sayAge = function(){
	return this.age;
}
var son1 = new Father('张三丰', 108);
son1.colors.push('black');
var son2 = new Father('张无忌', 18);
console.log(son1.colors, son1.sayName(), son1.sayAge());
// ["red", "green", "blue", "black"] "张三丰" 108
console.log(son2.colors, son2.sayName(), son2.sayAge());
// ["red", "green", "blue"] "张无忌" 18
```

## 原型继承

借助原型可以基于已有的对象创建新的对象

不必为此创建自定义类型

共享原型对象的**引用属性**

```js
var person = {
	name: '张三丰',
	friends: ['张翠山', '老和尚', '谢逊']
}
var p1 = Object.create(person);
p1.name = '张翠山';
p1.friends.push('殷素素');
var p2 = Object.create(person, {
	job: {
		value: '明教教主'
	}
});
p2.name = '张无忌';
p2.friends.push('赵敏');
console.log(person, p1, p2);
// 共享friends属性
```

## 寄生继承

将原型继承封装成函数

无法实现函数复用

```js
function createPerson(p){
	var person = Object.create(p);
	person.introduce = function(){
		console.log(this.name);
	}
	return person;
}
var person = {
	name: '张三丰'
}
var p = createPerson(person);
p.introduce();
```

## 寄生组合继承

避免组合继承中**两次调用**超类的构造函数

不影响 `instanceof` 和 `isPrototypeOf`

**最优解决方案**

```js
function inheritPrototype(sub, sup){
	// 创建对象
	var prototype = Object.create(sup.prototype);
	// 增强对象
	prototype.constructor = sub;
	// 指定对象
	sub.prototype = prototype;
}
function SuperType(name){
	this.name = name;
	this.color = ['red', 'green', 'blue'];
}
SuperType.prototype.sayName = function(){
	console.log(this.name);
}
function SubType(name, age){
	SuperType.call(this, name);
	this.age = age;
}
inheritPrototype(SubType, SuperType);
SubType.prototype.sayAge = function(){
	console.log(this.age);
}

var p = new SubType('张三丰', 108);
console.log(p);
console.log(p.sayName());
console.log(p.sayAge());
```
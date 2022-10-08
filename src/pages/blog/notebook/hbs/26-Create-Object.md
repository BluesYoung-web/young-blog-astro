---
title: 26-创建对象
image: /img/hbs.png
description: JavaScript 创建对象
date: 2021-01-06 15:50:07
---

[[toc]]

## 概述

虽然使用 `Object` 构造函数或对象字面量可以方便地创建对象，但是创建具有同样接口的多个对象需要重复编写很多代码

`ES 5.1` 并没有正式支持面向对象的结构，不过可以使用原型式继承进行模拟实现

**`ES6` 的类只不过是在 `ES5.1` 构造函数+原型继承的语法糖而已**

## 工厂模式

**一种按照特定接口创建对象的方式**

虽然可以解决创建多个类似对象的问题，但没有解决对象标识问题

```js
function createPerson(name, age, job) {
  let o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
  o.sayName = function() {
    console.log(this.name);
  };
  return o;
}
let person1 = createPerson("Nicholas", 29, "Software Engineer");
let person2 = createPerson("Greg", 27, "Doctor"); 
```

## 构造函数模式

没有显示创建对象

属性和方法直接挂载到 `this` 上

没有 `return`

需要使用 `new` 操作符调用

### `new` 操作符的执行过程

1. 在内存中创建一个新对象
2. 新对象内部的 `[[Prototype]]` 特性被赋值为构造函数的 `prototype` 属性
3. 构造函数内部的 `this` 指向新对象
4. 执行构造函数内部的代码(挂载属性及方法)
5. **如果构造函数返回非空对象，则返回该对象；否则返回刚创建的新对象**

```js
function Person(name, age, job){
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function() {
    console.log(this.name);
  };
}
let person1 = new Person("Nicholas", 29, "Software Engineer");
let person2 = new Person("Greg", 27, "Doctor");
person1.sayName(); // Nicholas
person2.sayName(); // Greg 
```

### 构造函数也是函数

如果不需要传递参数，只要有 `new` 操作符，括号可加可不加

如果直接作为函数调用，那么 `this` 指向 `window`

作为函数直接使用的时候也可以使用 `call/apply` 使其作用域发生改变

### 存在的问题

每调用一次，方法对应的函数也会被**重复创建**

**不能实时添加属性和方法**

## 原型模式

每个函数都会创建一个 `prototype` 属性，这个属性是一个对象，包含应该由特定引用类型的实例**共享**的属性和方法

实际上，这个对象就是通过调用构造函数创建的对象的原型

### 原型

无论何时，只要创建一个函数，就会按照特定的规则为这个函数创建一个 `prototype` 属性（指向原型对象）

默认情况下，所有原型对象自动获得一个名为 `constructor` 的属性，指回与之关联的构造函数

<n-alert title="Person.prototype.constructor === Person" type="info" />

然后，因构造函数而异，会给原型对象添加其他属性和方法

在自定义构造函数时，原型对象默认只会获得 `constructor` 属性，其他的所有方法都继承自 `Object`

每次调用构造函数创建一个新**实例**，这个**实例**的内部`[[Prototype]]`指针就会被赋值为构造函数的**原型对象**(浏览器中的 `__proto__`)

**构造函数、原型对象和实例是 3 个完全不同的对象**

**实例**通过 `__proto__` 链接到**原型对象**，实际上指向 `[[Prototype]]`

**构造函数**通过 `prototype` 属性链接到**原型对象**

实例与构造函数之间没有**直接**的联系

```js
function Person() {}
var p = new Person();
p.__proto__ === Person.prototype
p.__proto__.constructor === Person
p.__proto__.__proto__ === Object.prototype
p.__proto__.__proto__.constructor === Object
p.__proto__.constructor.__proto__ === Function.prototype
p.__proto__.constructor.__proto__.constructor === Function
```

### 原型关系判断

```js
Person.prototype.isPrototypeOf(p)
// ===>
p instanceof Person
// ===>
Object.getPrototypeOf(p) === Person.prototype
```

### 原型层级(原型链查找顺序)

1. 对象实例本身的属性
2. 原型对象上的属性

### `in` 操作符

无论属性是在**实例**上还是**原型对象**上，`propName in obj` 都会返回 `true`

### 几种获取属性名的方法对比

**`Object.keys()`**，返回实例自身可枚举属性名

**`Object.getOwnPropertyNames()`**，返回实例自身所有属性名，无论是否可枚举

**`Object.getOwnPropertySymbols()`**，返回实例自身所有**符号**属性，无论是否可枚举
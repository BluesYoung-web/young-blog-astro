---
layout: "@/layouts/BlogPost.astro"
title: 34-函数属性与方法
image: /img/hbs.png
description: JavaScript 函数属性与方法
date: 2021-01-15 11:09:56
---

[[toc]]

## `length`

保存函数**定义的命名参数的个数**

## `prototype`

原型对象

挂载原型方法，**可实时变化**

## `apply(thisObj, [...args] || arguments)`

改变函数执行时的 `this` 指向

**可传数组或者 `arguments` 对象**

```js
function sum(num1, num2) {
  return num1 + num2;
}
function applySum1(num1, num2) {
  return sum.apply(this, arguments);
}
function applySum2(num1, num2) {
  return sum.apply(this, [num1, num2]);
}
console.log(applySum2(10, 10)); // 20
console.log(applySum2(10, 10)); // 20 

const obj = {name: '321321'};
function sayName() { console.log(this.name); }
sayName.apply(obj); // 将 sayName 的执行上下文改为 obj, this.name === obj.name
```

## `call(thisObj, ...args || ...arguments)`

改变函数执行时的 `this` 指向

**只能一个一个的传参**

```js
window.color = 'red';
let o = {
  color: 'blue'
};
function sayColor() {
  console.log(this.color);
}
sayColor(); // red
sayColor.call(this); // red
sayColor.call(window); // red
sayColor.call(o); // blue 
```

## `bind(thisObj)`

`ES5` 新增

创建一个**绑定**了 `this` 值的对象

```js
window.color = 'red';
var o = {
  color: 'blue'
};
function sayColor() {
  console.log(this.color);
}
let objectSayColor = sayColor.bind(o);
/**
 * 等效于修改函数
 * function sayColor() {
 *		var o = { color: 'blue' };
 *		console.log(o.color); 
 * }  
 */
objectSayColor(); // blue
```

## 继承的方法

**`toString()、toLocaleString()`**，始终返回函数的代码

```js
"function () { [native code] }"
```

**`valueOf()`**，返回函数本身
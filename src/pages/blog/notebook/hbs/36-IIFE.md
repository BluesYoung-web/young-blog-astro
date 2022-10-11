---
layout: "@/layouts/BlogPost.astro"
title: 36-闭包
image: /img/hbs.png
description: JavaScript 闭包
date: 2021-01-15 15:05:49
---

[[toc]]

## 定义

引用了**另一个函数作用域中变量**的函数

**函数套函数**

## 作用域链

函数执行时，每个执行上下文都会有一个包含其中变量的对象

全局上下文中的叫**变量对象**，代码执行期间始终存在

函数局部上下文中的叫**活动对象**，只在函数执行期间存在

在**定义**函数时，就会为它创建作用域链，预装载全局**变量对象**，并保存于内部的 `[[Scope]]` 中

在**调用**这个函数的时候，会创建相应的执行上下文，然后通过赋值函数的 `[[Scope]]` 来创建其作用域链

接着创建函数的**活动对象**并将其推入作用域链的前端

```js
function createComparisonFunction(propertyName) {
  return function(object1, object2) {
    let value1 = object1[propertyName];
    let value2 = object2[propertyName];
    if (value1 < value2) {
      return -1;
    } else if (value1 > value2) {
      return 1;
    } else {
      return 0;
    }
  };
} 
// 创建比较函数
let compareNames = createComparisonFunction('name');
// 调用函数
let result = compareNames({ name: 'Nicholas' }, { name: 'Matt' });
// 解除对函数的引用，这样就可以释放内存了
compareNames = null; 
```

因为闭包会保留它们包含函数的作用域，所以比其他函数更占用内存。过度使用闭包可能导致内存过度占用，因此建议仅在十分必要时使用。`V8` 等优化的 `JavaScript` 引擎会努力回收被闭包困住的内存，不过我们还是建议**在使用闭包时要谨慎**

## `IIFE`

立即调用函数表达式

### 用途

**模拟块级作用域**

```js
// ES5 ------------------------- IIFE
(function () {
  for (var i = 0; i < count; i++) {
    console.log(i);
  }
})();
console.log(i); // 抛出错误
// ES6 ------------------------- {}
// 内嵌块级作用域
{
  let i;
  for (i = 0; i < count; i++) {
    console.log(i);
  }
}
console.log(i); // 抛出错误
// 循环的块级作用域
for (let i = 0; i < count; i++) {
  console.log(i);
}
console.log(i); // 抛出错误
```

**锁定回调函数的入参**

```js
// ES5
for(var i = 0; i < 5; i++){
  ((i) => setTimeout(() => {
    console.log(i);
  }, 1000 * i))(i)
}
// ES6
for(let i = 0; i < 5; i++){
  setTimeout(() => {
    console.log(i);
  }, 1000 * i)
}
// 0 1 2 3 4
```

**私有变量及特权方法**

```js
(function() {
  let name = '';
  window.Person = function(value) {
    name = value;
  };
  Person.prototype.getName = function() {
    return name;
  };
  Person.prototype.setName = function(value) {
    name = value;
  };
})();
let person1 = new Person('Nicholas');
console.log(person1.getName()); // 'Nicholas'
person1.setName('Matt');
console.log(person1.getName()); // 'Matt'
let person2 = new Person('Michael');
console.log(person1.getName()); // 'Michael'
console.log(person2.getName()); // 'Michael' 
```
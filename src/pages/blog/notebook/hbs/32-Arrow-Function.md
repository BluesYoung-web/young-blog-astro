---
title: 32-箭头函数
image: /img/hbs.png
description: JavaScript 箭头函数
date: 2021-01-14 09:39:12
---

[[toc]]

## 基本特性

类似于函数表达式，不存在提升

语法简洁，适合嵌入式函数的场景

```js
// 基本写法
const sum = (a, b) => { return a + b };
// 简化写法，直接返回操作结果(此时不能使用 return)
const sum = (a, b) => a + b;
// 简化写法，只有一个参数
const fn = a => a**2;
```

## 限制

**不能使用 `arguments`、`super`、`new.target`**

**不能使用构造函数**

**没有 `this` 以及 `prototype` 属性**

## 函数名

函数名就是**指向函数的指针**

一个函数可以有多个名称

```js
let sum = (a, b) => a + b;
const a_sum = sum;

console.log(sum(1, 2)); // 3
console.log(a_sum(2, 3)); // 5
// 切断 sum 与函数的关联
sum = null;
console.log(a_sum(2, 3)); // 5
```

### `name` 属性

`ES6` 的所有函数都会暴露一个**只读**的 `name` 属性(创建时的函数名称)

匿名函数返回空字符串

使用 `Function` 构造函数创建的，返回 `anonymous`

```js
let sum = (a, b) => a + b;
const a_sum = sum;

sum === a_sum;
sum.name === 'sum';
a_sum.name === 'sum';
console.log((() => {}).name); //（空字符串）
console.log((new Function()).name); // anonymous
```

**特殊情况，自动加前缀**
  - `get` 函数
  - `set` 函数
  - `bind()` 实例化

```js
function foo() {} 
console.log(foo.bind(null).name); // bound foo 
let dog = { 
  years: 1, 
  get age() { 
    return this.years; 
  }, 
  set age(newAge) { 
    this.years = newAge; 
  } 
} 
let propertyDescriptor = Object.getOwnPropertyDescriptor(dog, 'age'); 
console.log(propertyDescriptor.get.name); // get age 
console.log(propertyDescriptor.set.name); // set age
```

## `this`指向

普通函数指向**调用时**上下文

箭头函数指向**定义时**上下文

```js
window.identity = 'The Window';
let object = {
  identity: 'My Object',
  getIdentityFunc() {
    return function() {
      return this.identity;
    };
  },
  getObjIdentity() {
    const that = this;
    return function() {
      return that.identity;
    }
  },
  getArrowIdentity() {
    return () => this.identity;
  },
  getObj() {
    return this.identity;
  }
};
console.log(object.getIdentityFunc()()); // 'The Window' 
console.log(object.getObjIdentity()()); // 'My Object' 
console.log(object.getObj()); // 'My Object' 
console.log((object.getObj = object.getObj)()); // 'The Window' 
```
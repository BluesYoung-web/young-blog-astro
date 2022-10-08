---
title: 29-代理基础
image: /img/hbs.png
description: JavaScript Reflect
date: 2021-01-07 16:42:57
---

[[toc]]

## 定义

给目标定义一个关联的代理对象，可以通过操作代理对象来间接操作目标对象

在对目标对象的各种操作影响目标对象之前，可以在代理对象中对这些操作加以控制

<n-alert title="代理是一种新的基础特性，要么支持，要么不支持，无法通过转译程序实现支持" type="warning" />


## `new Proxy(targetObj, handlerObj)`

创建代理

**两个参数缺一不可**

### 空代理

`handlerObj = {}`

不执行任何**中间操作**的代理，几乎等同于直接操作目标对象(类似于指针)

```js
const targetObj = {
  name: '张三疯'
};
const handlerObj = {};
const proxy = new Proxy(targetObj, handlerObj);
console.log(target === proxy); // false 
```

## 捕获器

`get(targetObj, propertyName, proxyObj)`

```js
const target = {
   foo: 'bar'
};
const handler = {
   // 捕获器在处理程序对象中以方法名为键
   get() {
      return 'handler override';
   }
};
const proxy = new Proxy(target, handler); 
// proxy.any || proxy[any] || Object.create(proxy)[any] === 'handler override'
```

## 反射`API`(`Reflect`)

处理程序对象中**所有可以捕获的方法**都有对应的反射 `Reflect）API ` 方法

这些方法与捕获器拦截的方法具有**相同的名称和函数签名**，而且也具有与被拦截方法**相同的行为**

```js
// 另类空对象
const target = {
   foo: 'bar'
};
const handler = {
   get() {
      return Reflect.get(...arguments);
   }
};
const proxy = new Proxy(target, handler); 
// 更简洁一点
const handler = {
   get: Reflect.get
};
//--------------------------------------------
const target = {
   foo: 'bar',
   baz: 'qux'
};
const handler = {
   get(trapTarget, property, receiver) {
     let decoration = '';
     if (property === 'foo') {
     		decoration = '!!!';
     }
     return Reflect.get(...arguments) + decoration;
   }
};
const proxy = new Proxy(target, handler);
console.log(proxy.foo); // bar!!!
console.log(target.foo); // bar
console.log(proxy.baz); // qux
console.log(target.baz); // qux
```

## 捕获器不变式

如果目标对象有一个**不可配置**且**不可写**的数据属性，那么么在捕获器返回一个与该属性不同的值时，会抛出错误

```js
const target = {};
Object.defineProperty(target, 'foo', {
   configurable: false,
   writable: false,
   value: 'bar'
});
const handler = {
   get() {
      return 'qux';
   }
};
const proxy = new Proxy(target, handler);
console.log(proxy.foo);
// TypeError
```

## 可撤销代理

使用 `new Proxy()` 创建的普通代理，在代理对象的**生命周期内一直持续存在**

`Proxy` 暴露的 `revocable()`，提供了一个撤销代理的方法

**撤销代理的操作是不可逆的**

```js
const target = {
   foo: 'bar'
};
const handler = {
   get() {
      return 'intercepted';
   }
};
const { proxy, revoke } = Proxy.revocable(target, handler);
console.log(proxy.foo); // intercepted
console.log(target.foo); // bar
revoke();
console.log(proxy.foo); // TypeError 
```

## 使用反射 `API`

### 替代可能会报错的对象操作

`Reflect.defineProperty()`

`Reflect.preventExtensions()`

`Reflect.setPrototypeOf()`

`Reflect.set()`

`Reflect.deleteProperty()`

```js
// 初始代码 
const o = {}; 
try { 
   Object.defineProperty(o, 'foo', 'bar'); 
   console.log('success'); 
} catch(e) { 
   console.log('failure'); 
}
// 重构后的代码
const o = {}; 
if(Reflect.defineProperty(o, 'foo', {value: 'bar'})) { 
   console.log('success'); 
} else { 
   console.log('failure'); 
}
```

### 替代操作符

`Reflect.get()`：可以替代 `.` 对象属性访问操作符

`Reflect.set()`：可以替代 `=` 赋值操作符

`Reflect.has()`：可以替代 `in` 操作符或 `with()`

`Reflect.deleteProperty()`：可以替代 `delete` 操作符

`Reflect.construct()`：可以替代 `new` 操作符

### 安全的使用函数

```js
Function.prototype.apply.call(myFunc, thisVal, argumentList); 
// 等效
Reflect.apply(myFunc, thisVal, argumentsList);
```

### 代理的代理

多层代理，每层负责特定的拦截操作

```js
const target = { 
   foo: 'bar' 
}; 
const firstProxy = new Proxy(target, { 
   get() { 
      console.log('first proxy'); 
      return Reflect.get(...arguments); 
   } 
}); 
const secondProxy = new Proxy(firstProxy, { 
   get() { 
      console.log('second proxy'); 
      return Reflect.get(...arguments); 
   } 
}); 
console.log(secondProxy.foo); 
// second proxy 
// first proxy 
// bar
```

## 存在的问题

### `this` 指向

方法中的 `this` 通常指向调用这个方法的对象

如果目标对象**依赖于对象标识**，那就可能碰到意料之外的问题

```js
const wm = new WeakMap(); 
class User { 
   constructor(userId) { 
      wm.set(this, userId); 
   } 
   set id(userId) { 
      wm.set(this, userId); 
   } 
   get id() { 
      return wm.get(this); 
   } 
}

const user = new User(123); 
console.log(user.id); // 123 
// 代理实例
const userInstanceProxy = new Proxy(user, {}); 
console.log(userInstanceProxy.id); // undefined
// 代理类
const UserClassProxy = new Proxy(User, {}); 
const proxyUser = new UserClassProxy(456); 
console.log(proxyUser.id);
```

### 代理与内部槽位

代理与内置引用类型（比如 `Array`）的实例通常可以很好地协同

但是有些类型可能会存在代理无法控制的机制，从而导致抛出错误

```js
const target = new Date(); 
const proxy = new Proxy(target, {}); 
console.log(proxy instanceof Date); // true 
proxy.getDate(); // TypeError: 'this' is not a Date object
```
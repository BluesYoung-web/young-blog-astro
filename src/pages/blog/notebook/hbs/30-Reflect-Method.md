---
title: 30-代理捕获器与反射方法
image: /img/hbs.png
description: JavaScript Reflect Methods
date: 2021-01-13 11:43:53
---

[[toc]]

## `get(target, propName, reciver)`

参数说明：
  - `target` —— '原始对象'
  - `propName` —— '属性名'
  - `reciver` —— '调用时的对象(`.`左边的)'

**获取属性值时调用**，返回值无限制

拦截的操作：
  - `proxy.property`
  - `proxy[property]`
  - `Object.create(proxy)[property]`
  - `Reflect.get(proxy, property, reciver)`

如果 `target.propName` 不可写且不可配置，则处理程序返回的值必须与 `target.property` 匹配

如果 `target.propName` 不可配置且 `[[Get]]` 特性为 `undefined`，处理程序的返回值也必须是 `undefined`

```js
const myTarget = {}; 
const proxy = new Proxy(myTarget, { 
  get(target, property, receiver) { 
    console.log('get()'); 
    return Reflect.get(...arguments) 
  } 
}); 
proxy.foo; 
// get()
```

## `set(target, propName, value, reciver)`

参数说明：
  - `target` —— '原始对象'
  - `propName` —— '属性名'
  - `value` —— '属性值'
  - `reciver` —— '调用时的对象(`.`左边的)'

**设置属性值时调用**

返回值：
  - 成功，`true`
  - 失败，`false`， 严格模式抛出错误

 拦截的操作：
  - `proxy.property = value`
  - `proxy[proterty] = value `
  - `Object.create(proxy)[property] = value`
  - `Reflect.set(proxy, property, value, reciver)`

如果 `target.propName` 不可写且不可配置，则不能修改目标属性的值

如果 `target.propName` 不可配置且 `[[Set]]` 特性为 `undefined`，则不能修改目标属性的值

在严格模式下，处理程序中返回 `false` 会抛出 `TypeError`

```js
const myTarget = {}; 
const proxy = new Proxy(myTarget, { 
  set(target, property, value, receiver) { 
    console.log('set()'); 
    return Reflect.set(...arguments);
  } 
}); 
proxy.foo = 'bar'; 
// set()
```

## `has(target, propName)`

参数说明：
  - `target` —— '原始对象'
  - `propName` —— '属性名'

**`in` 操作符中调用**

必须返回布尔值，表示属性是否存在。返回非布尔值会被转型为布尔值

拦截的操作：
  - `property in proxy`
  - `property in Object.create(proxy)`
  - `with(proxy) {(property);}`
  - `Reflect.has(proxy, property)`

如果 `target.propName` 存在且不可配置，则处理程序必须返回 `true`

如果 `target.propName` 存在且目标对象不可扩展，则处理程序必须返回 `true`

```js
const myTarget = {}; 
const proxy = new Proxy(myTarget, { 
  has(target, property) { 
    console.log('has()'); 
    return Reflect.has(...arguments);
  } 
}); 
'foo' in proxy; 
// has()
```

## `defineProperty(target, propName, configObj)`

参数说明：
  - `target` —— '原始对象'
  - `propName` —— '属性名'
  - `configObj` —— '属性配置对象'

**在 `Object.defineProperty()` 中被调用**

必须返回布尔值，表示属性定义是否成功，返回其他的值会被**自动转换为布尔值**

拦截的操作：
  - `Object.defineProperty(proxy, property, descriptor)`
  - `Reflect.defineProperty(proxy, property, descriptor)`

如果目标对象不可扩展，则无法定义属性

如果目标对象有一个可配置的属性，则不能添加同名的不可配置属性

如果目标对象有一个不可配置的属性，则不能添加同名的可配置属性

```js
const myTarget = {}; 
const proxy = new Proxy(myTarget, { 
  defineProperty(target, property, descriptor) { 
    console.log('defineProperty()'); 
    return Reflect.defineProperty(...arguments);
  } 
}); 
Object.defineProperty(proxy, 'foo', { value: 'bar' }); 
// defineProperty()
```

## `getOwnPropertyDescriptor(target, propName)`

参数说明：
  - `target` —— '原始对象'
  - `propName` —— '属性名'

会在 `Object.getOwnPropertyDescriptor()` 中被调用

必须返回对象，或者在属性不存在时返回 `undefined`

拦截的操作：
  - `Object.getOwnPropertyDescriptor(proxy, property)`
  - `Reflect.getOwnPropertyDescriptor(proxy, property)`

如果自有的 `target.propName` 存在且不可配置，则处理程序必须返回一个表示该属性存在的对象

如果自有的 `target.propName` 存在且可配置，则处理程序必须返回表示该属性可配置的对象

如果自有的 `target.propName` 存在且 `target` 不可扩展，则处理程序必须返回一个表示该属性存在的对象

如果 `target.propName` 不存在且 `target` 不可扩展，则处理程序必须返回 `undefined` 表示该属性不存在

如果 `target.propName` 不存在，则处理程序不能返回表示该属性可配置的对象

```js
const myTarget = {}; 
const proxy = new Proxy(myTarget, { 
  getOwnPropertyDescriptor(target, property) { 
    console.log('getOwnPropertyDescriptor()'); 
    return Reflect.getOwnPropertyDescriptor(...arguments);
  } 
}); 
Object.getOwnPropertyDescriptor(proxy, 'foo'); 
// getOwnPropertyDescriptor()
```

## `deleteProperty(target, propName)`

参数说明：
  - `target` —— '原始对象'
  - `propName` —— '属性名'

在 `delete` 操作符中被调用

必须返回布尔值，表示属性定义是否成功，返回其他的值会被**自动转换为布尔值**

拦截的操作：
  - `delete proxy.property`
  - `delete proxy[property]`
  - `Reflect.deleteProperty(proxy, property)`

如果自有的 `target.property` 存在且不可配置，则处理程序不能删除这个属性

```js
const myTarget = {}; 
const proxy = new Proxy(myTarget, { 
  deleteProperty(target, property) { 
    console.log('deleteProperty()'); 
    return Reflect.deleteProperty(...arguments);
  } 
}); 
delete proxy.foo 
// deleteProperty()
```

## `ownKeys(target)`

在` Object.keys()`及类似方法中被调用

必须返回包含字符串或符号的可枚举对象

拦截的操作：
  - `Object.getOwnPropertyNames(proxy)`
  - `Object.getOwnPropertySymbols(proxy)`
  - `Object.keys(proxy)`
  - `Reflect.ownKeys(proxy)`

返回的可枚举对象必须包含 `target` 的所有不可配置的自有属性

如果 `target` 不可扩展，则返回可枚举对象必须准确地包含自有属性键

```js
const myTarget = {}; 
const proxy = new Proxy(myTarget, { 
  ownKeys(target) { 
    console.log('ownKeys()'); 
    return Reflect.ownKeys(...arguments);
  } 
}); 
Object.keys(proxy); 
// ownKeys()
```

## `getPrototypeOf(target)`

在 `Object.getPrototypeOf()` 中被调用

必须返回对象或 `null`

拦截的操作：
  - `Object.getPrototypeOf(proxy)`
  - `Reflect.getPrototypeOf(proxy)`
  - `proxy.__proto__`
  - `Object.prototype.isPrototypeOf(proxy)`
  - `proxy instanceof Object`

如果 `target` 不可扩展，则 `Object.getPrototypeOf(proxy)` 唯一有效的返回值就是 `Object.getPrototypeOf(target)` 的返回值

```js
const myTarget = {}; 
const proxy = new Proxy(myTarget, { 
  getPrototypeOf(target) { 
    console.log('getPrototypeOf()'); 
    return Reflect.getPrototypeOf(...arguments);
  } 
}); 
Object.getPrototypeOf(proxy); 
// getPrototypeOf()
```

## `setPrototypeOf(target, prototype)`

在 `Object.setPrototypeOf()`中被调用

**必须返回布尔值，表示原型赋值是否成功。返回非布尔值会被转型为布尔值**

拦截的操作：
  - `Object.setPrototypeOf(proxy)`
  - `Reflect.setPrototypeOf(proxy)`

如果 `target` 不可扩展，则唯一有效的 `prototype` 参数就是 `Object.getPrototypeOf(target)` 的返回值

```js
const myTarget = {}; 
const proxy = new Proxy(myTarget, { 
  setPrototypeOf(target, prototype) { 
    console.log('setPrototypeOf()'); 
    return Reflect.setPrototypeOf(...arguments);
  }
}); 
Object.setPrototypeOf(proxy, Object); 
// setPrototypeOf()
```

## `isExtensible(target)`

在 `Object.isExtensible()` 中被调用

必须返回布尔值，表示 `target` 是否可扩展。返回非布尔值会被转型为布尔值

拦截的操作：
  - `Object.isExtensible(proxy)`
  - `Reflect.isExtensible(proxy)`

如果 `target` 可扩展，则处理程序必须返回 `true`

如果 `target` 不可扩展，则处理程序必须返回 `false`

```js
const myTarget = {}; 
const proxy = new Proxy(myTarget, { 
  isExtensible(target) { 
    console.log('isExtensible()'); 
    return Reflect.isExtensible(...arguments);
  }
}); 
Object.isExtensible(proxy); 
// isExtensible()
```

## `preventExtensions(target)`

在 `Object.preventExtensions()` 中被调用

必须返回布尔值，表示 `target` 是否**已经不可扩展**，返回非布尔值会被转换为布尔值

拦截的操作：
  - `Object.preventExtensions(proxy)`
  - `Reflect.preventExtensions(proxy)`

如果 `Object.isExtensible(proxy)` 是 `false`，则处理程序必须返回 `true`

```js
const myTarget = {}; 
const proxy = new Proxy(myTarget, { 
  preventExtensions(target) { 
    console.log('preventExtensions()'); 
    return Reflect.preventExtensions(...arguments);
  } 
}); 
Object.preventExtensions(proxy); 
// preventExtensions()
```

## `apply(target, thisObj, ...argsList)`

参数解释：
  - `target` —— '目标对象'
  - `thisObj` —— 'this指向的对象'
  - `argsList` —— '调用函数时的参数列表'

**在调用函数时被调用**

返回值无限制

拦截的操作：
  - `proxy(...argumentsList)`
  - `Function.prototype.apply(thisArg, argumentsList)`
  - `Function.prototype.call(thisArg, ...argumentsList)`
  - `Reflect.apply(target, thisArgument, argumentsList)`

`target` 必须是一个函数对象

## `construct(target, argsList, newTarget)`

参数解释：
  - `target` —— '目标构造函数'
  - `argsList` —— '传给目标构造函数的参数列表'
  - `newTarget` —— '最初被调用的构造函数'

必须返回一个对象

`target` 必须可以用作构造函数
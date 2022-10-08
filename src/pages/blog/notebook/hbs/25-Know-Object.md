---
title: 25-理解对象
image: /img/hbs.png
description: JavaScript 对象详解
date: 2021-01-06 09:20:51
---

[[toc]]

## 定义

一组属性的无序集合

## 属性的类型

### 数据属性

**`[[Configurable]]`**
  - 是否可以通过 `delete` 删除并重新定义
  - 是否可以修改其特性
  - 是否可以将其改为访问器属性
  - 默认 `true`

**`[[Enumerable]]`**
  - 是否可以通过`for-in`循环返回(可枚举)
  - 默认 `true`

**`[[Writable]]`**
  - 是否可以修改属性值
  - 默认 `true`

**`[[value]]`**
  - 属性实际的值，实时改变
  - 默认 `undefined`

<n-alert title="修改属性的默认值" type="info">`Object.defineProperty(obj, propName, configObj)`</n-alert>

<n-alert title="configObj 中没有显示提供的属性都会默认为 false" type="warning" />

<n-alert class="mt-4" title="configurable 定义为 false 之后不能再次定义为 true，再次修改任何非 writable 的属性都会导致错误" type="error" />

```js
var p = {};
Object.defineProperty(p, 'name', {
  writable: false,
  value: 'blues'
});
console.log(p.name); // blues
p.name = '123124'; // 非严格模式下不生效，严格模式直接报错
console.log(p.name); // blues
```

### 访问器属性

**必须使用 `Object.defineProperty()` 定义**

<n-alert title="在不支持 Object.defineProperty() 的浏览器中没有办法修改 [[Configurable]] 或 [[Enumerable]]" type="warning" />

**在 `ES5` 以前，开发者会使用两个非标准的访问创建访问器属性：`__defineGetter__()` 和 `__defineSetter__()`**。这两个方法最早是 Firefox 引入的，后来 Safari、Chrome 和 Opera 也实现了

**`[[Configurable]]`**，同上

**`[[Enumerable]]`**，同上

**`[[Get]]`**
  - 获取函数
  - 使用 `.` 或者 `[]` 读取属性值的时候调用
  - 默认 `undefined`

<n-alert title="只定义获取函数意味着属性是只读的" type="warning">尝试修改属性会被忽略。在严格模式下，尝试写入只定义了获取函数的属性会抛出错误</n-alert>

**`[[Set]]`**
  - 设置函数
  - 使用 `.` 或者 `[]` 写入属性值的时候调用
  - 默认 `undefined`

<n-alert title="只定义设置函数会导致无法读取" type="error">非严格模式下返回 `undeifned`，严格模式下抛出错误</n-alert>

```js
var book = {
  _year: 2017,
  edition: 1
}
Object.defineProperty(book, 'year', {
  get() {
    return this._year;
  },
  set(n) {
    if(n > 2017) {
      this.edition += n - this._year;
      this._year = n;
    }
  }
});

book.year = 2018;
console.log(book.edition); // 2
book.year = 2020;
console.log(book.edition); // 4
```

### 静态方法

**`Object.defineProperties(obj, { propName: ConfigObj, ... })`**，同时定义多个属性

**`Object.getOwnPropertyDescriptor(obj, propName)`**，获取属性对应的描述对象(`configObj`)

**`Object.getOwnPropertyDescriptors(obj)`**，`ES2017` 新增，获取一个对象所有的属性及对应的描述对象所组成的对象(`{propName: configObj, ...}`)

**`Object.is(v1, v2)`**
  - `ES6` 新增
  - “Same-value equality”（同值相等）算法
  - 基本同 `===`，例外：
    - `NaN === NaN`
    - `+0 === 0`
    - `+0 !== -0`

**`Object.assign(target, ...s)`**
  - `ES6` 新增
  - **浅拷贝**
  - 会将每个源对象中可枚举（`Object.propertyIsEnumerable()` 返回 `true`） 和自有（`Object.hasOwnProperty()` 返回 `true`）属性**浅复制**到目标对象
  - 属性名称相同的情况下右边的会覆盖左边的
  - 对每个符合条件的属性，这个方法会使用源对象上的 `[[Get]]` 取得属性的值，然后使用目标对象上的 `[[Set]]` 设置属性的值
  - 当只有一个参数时：
    - 如果该参数是对象，则直接返回(`===`)
    - 如果不是对象则会先转换成对象，然后返回该对象
      - 基本数据类型直接返回其包装对象
      - `undefined, null` 无法转换，直接报错
  - 有多个参数，但是后面的参数不是对象时：
    - `undefined, null` 无法转换为对象，不会报错，但是直接跳过
    - 除了字符串会以数组形式的键值对拷入目标对象之外，其他的不会产生任何效果
  - 数组直接视为对象处理，索引为键，元素为值
  - 用途：
    - 给对象添加属性/方法
    - 对象克隆
    - 对象合并
    - **设置属性的默认值**

```js
const v1 = 'abc';
const v2 = true;
const v3 = 10;

const obj = Object.assign({}, v1, v2, v3);
console.log(obj); // { "0": "a", "1": "b", "2": "c" }
// --------------------------------------------------------
Object.assign([1, 2, 3], [4, 5])
// [4, 5, 3]
// --------------------------------------------------------
// 基本克隆
function clone(origin) {
  return Object.assign({}, origin);
}
// 保持原型链克隆
function clone(origin) {
  let originProto = Object.getPrototypeOf(origin);
  return Object.assign(Object.create(originProto), origin);
}
// --------------------------------------------------------
const merge = (...sources) => Object.assign({}, ...sources);
// --------------------------------------------------------
const DEFAULTS = {
  logLevel: 0,
  outputFormat: 'html'
};

function processContent(options) {
  options = Object.assign({}, DEFAULTS, options);
  console.log(options);
  // ...
}
```

## 原型方法

**`constructor()`**，创建当前对象的函数

**`hasOwnProperty(pname)`**，检测**自身**(非原型)是否含有该属性

**`isPrototypeOf(obj)`**，检测传入对象是否是另一个对象的原型

**`propertyIsEnumerable(pname)`**，检测给定属性是否可以使用 `for-in` 枚举

**`toLocaleString()`**，返回对象的字符串表示，与地区相关

**`toString()`**，返回对象的字符串表示，与地区无关

**`valueOf()`**，返回对象的字符串、数值、布尔值表示，通常与 `toString` 返回值相同


## `__proto__` 属性

**只有浏览器端必须部署的内部属性**

存在于 `ES6` 附录之中

```js
Object.defineProperty(Object.prototype, '__proto__', {
  get() {
    let _thisObj = Object(this);
    return Object.getPrototypeOf(_thisObj);
  },
  set(proto) {
    if (this === undefined || this === null) {
      throw new TypeError();
    }
    if (!isObject(this)) {
      return undefined;
    }
    if (!isObject(proto)) {
      return undefined;
    }
    let status = Reflect.setPrototypeOf(this, proto);
    if (!status) {
      throw new TypeError();
    }
  },
});

function isObject(value) {
  return Object(value) === value;
}
```

### `Object.setPrototypeOf()`

**`ES6` 正式推荐的设置原型对象的方法**

如果第一个参数不是对象则会自动转为对象，但是由于**返回的还是第一个参数**，所以这个操作**不会产生任何效果**

如果第一个参数是 `undefined | null`，则会直接报错

**可能会严重影响代码性能**，不建议直接使用

```js
let proto = {};
let obj = { x: 10 };
Object.setPrototypeOf(obj, proto);

proto.y = 20;
proto.z = 40;

obj.x // 10
obj.y // 20
obj.z // 40
```

### `Object.getPrototypeOf()`

获取一个对象的原型对象

`Object.getPrototypeOf(1) === Number.prototype`

### `Object.keys()`

返回对象**自身**所有**可遍历属性**的键名所组成的数组，`ES5`

### `Object.values()`

返回对象**自身**所有**可遍历属性**的键值所组成的数组，`ES2017`

### `Object.entries()`

返回对象**自身**所有**可遍历属性**的键值对所组成的二维数组，`ES2017`

### `Object.fromEntries()`

`Object.entries()` 的逆向操作，`ES2017`，特别适合将 `Map` 结构转换为对象

## 对象增强语法

### 属性值简写

当属性名和变量名相同的时候，可以直接写变量名而不用写成`变量名：变量名`

如果简写的情况下没有找到同名变量则会报错

### 可计算属性

在方括号中使用表达式的结果作为属性名

如果可计算属性表达式中抛出了错误，该对象的创建会立即中断

### 方法名简写

`方法名：匿名函数表达式` => `方法名(){函数体}`

## 对象解构

### 简单解构与默认值

**原始值会被当成其对应的包装对象进行解构**

**`undefined\null` 不能解构，会报错**

```js
const p = {
  name: '张三疯',
  age: 108
};
const { name, age: nowAge, default_test = 666 } = p;
// name = '张三疯', nowAge = 108, default_test = 666
```

### 嵌套解构

在外层属性没有定义的情况下不能使用嵌套解构

```js
let person = {
  name: 'Matt',
  age: 27,
  job: {
    title: 'Software engineer'
  }
};
// 声明 title 变量并将 person.job.title 的值赋给它
let { job: { title } } = person;
console.log(title); // Software engineer 
```

### 部分解构

涉及多个属性的解构赋值是一个输出无关的顺序化操作

如果一个解构表达式涉及多个赋值，开始的赋值成功而后面的赋值出错，则整个解构赋值只会完成一部分

```js
let person = {
  name: 'Matt',
  age: 27
};
let personName, personBar, personAge;
try {
  // person.foo 是 undefined，因此会抛出错误
  ({name: personName, foo: { bar: personBar }, age: personAge} = person);
} catch(e) {}
console.log(personName, personBar, personAge);
// Matt, undefined, undefined 
```

### 函数参数解构

会创建对应的局部变量，不会影响 `arguments` 对象
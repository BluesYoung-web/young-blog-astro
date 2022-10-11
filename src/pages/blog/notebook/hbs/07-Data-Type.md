---
layout: "@/layouts/BlogPost.astro"
title: 07-数据类型
image: /img/hbs.png
description: JavaScript 数据类型
date: 2020-12-28 16:28:37
---

[[toc]]

## 简单数据类型

`Undefined`

`Null`

`Boolean`

`Number`

`String`

`Symbol(ES6 新增)`

`BigInt(Stage4)`

## `Undefined`

单值 `undefined`

已声明未初始化，或者变量提升

**无论是声明还是未声明，`typeof` 返回的都是字符串`"undefined"`**

```js
typeof undefined === 'undefined'
```

*一般来说，**永远不用显式地给某个变量设置 `undefined` 值**。字面值`undefined `主要用于比较，而且在 `ES3 `之前是不存在的。增加这个特殊值的目的就是为了正式明确空对象指针(`null`)和未初始化变量的区别*

*即使未初始化的变量会被自动赋予 `undefined` 值，但我们仍然建议在声明变量的同时进行初始化。这样，当 `typeof` 返回 `"undefined"` 时，你就会知道那是因为给定的变量尚未声明，而不是声明了但未初始化*

## `Null`

单值 `null`

逻辑上讲，`null` 值表示一个**空对象指针**

`undefined` 派生自 `null`，`undefined == null`

```js
typeof null === 'object'
```

## `Boolean`

`true | false`

类型转换`Boolean()`

<script lang="ts" setup>
const tableHead1 = [
  { label: '数据类型', prop: 'type' },
  { label: '为真(true)', prop: 'true' },
  { label: '为假(false)', prop: 'false' }
];
const tableData1 = [
  { type: 'Boolean', true: `true`, false: `false` },
  { type: 'String', true: `非空字符串`, false: `空字符串` },
  { type: 'Number', true: `<span class="text-red-600 font-bold">非零，包括负数和正负无穷</span>`, false: `0, NaN` },
  { type: 'Object', true: `任意对象`, false: `null` },
  { type: 'Undefined', true: `<span class="text-red-600 font-bold">不存在</span>`, false: `undefined` }
];

const tableHead2 = [
  { label: '值', prop: 'value' },
  { label: '转换结果', prop: 'des' }
];
const tableData2 = [
  { value: `true`, des: `1` },
  { value: `false, null, ''`, des: `0` },
  { value: `number`, des: `number` },
  { value: `undefined`, des: `NaN` },
  { value: `纯数值的字符串`, des: `去掉引号转换为十进制，<span class="text-red-600 font-bold">忽略前导零</span>` },
  { value: `十六进制字符串`, des: `转换为对应的十进制数值` },
  { value: `其余字符串`, des: `NaN` },
  { value: `Object`, des: `<span class="text-red-600 font-bold">优先调用 valueOf()，取其值，如果为 NaN，则调用 toString() 将其值作为字符串转换之后返回<span>` }
];

const tableHead3 = [
  { label: '字面量', prop: 'value' },
  { label: '含义', prop: 'des' }
];
const tableData3 = [
  { value: `<strong>\\n</strong>`, des: `换行符` },
  { value: `<strong>\\t</strong>`, des: `制表符` },
  { value: `<strong>\\b</strong>`, des: `空格/退格` },
  { value: `<strong>\\r</strong>`, des: `回车` },
  { value: `<strong>\\f</strong>`, des: `进纸/换页` },
  { value: `<strong>\\</strong>`, des: `\\` },
  { value: `<strong>\'</strong>`, des: `'` },
  { value: `<strong>\"</strong>`, des: `"` },
  { value: `<strong>\`</strong>`, des: `\`` },
  { value: `<strong>\\xnn</strong>`, des: `两个十六位进制表示字符` },
  { value: `<strong>\\unnnn</strong>`, des: `两个十六位进制表示字符` },
];

const tableHead4 = [
  { label: '名称', prop: 'name' },
  { label: '类型', prop: 'type' },
  { label: '对应含义', prop: 'des' },
];
const tableData4 = [
  { name: `<strong>iterator</strong>`, type: 'Function', des: `for-of 迭代器 API 函数` },
  { name: `<strong>asyncIterator</strong>`, type: 'Function', des: `for-await-of 异步迭代器 API 函数` },
  { name: `<strong>hasInstance</strong>`, type: 'Function', des: `决定 instanceof 结果的函数` },
  { name: `<strong>isConcatSpreadable</strong>`, type: 'Boolean', des: `使用 Array.prototype.concat() 拼接时，是否拆解其数组元素(合并/或整体压入)` },
  { name: `<strong>match</strong>`, type: 'Function', des: `由 String.prototype.match() 方法使用` },
  { name: `<strong>replace</strong>`, type: 'Function', des: `由 String.prototype.replace() 方法使用` },
  { name: `<strong>search</strong>`, type: 'Function', des: `由 String.prototype.search() 方法使用` },
  { name: `<strong>split</strong>`, type: 'Function', des: `由 String.prototype.split() 方法使用` },
  { name: `<strong>toStringTag</strong>`, type: 'Function', des: `由 Object.prototype.toString() 方法使用` },
  { name: `<strong>species</strong>`, type: 'Function', des: `<strong>作为创建派生对象的构造函数,用 Symbol.species 定义静态的获取器(getter)方法，可以覆盖新创建实例的原型定义</strong>` },
  { name: `<strong>toPrimitive</strong>`, type: 'Function', des: `将对象转换为相应的原始值(<strong>隐式转换</strong>)，由 ToPrimitive 抽象操作使用` },
  { name: `<strong>unscopables</strong>`, type: 'Object', des: `<strong>该对象所有的以及继承的属性， 都会从关联对象的 with 环境绑定中排除，不推荐使用</strong>` },

];
</script>

<NTable :bordered="false" :single-line="false" striped>
  <thead>
    <tr>
      <th v-for="(item, index) in tableHead1" :key="index + 'head'" :width="item.width ?? ''">
        {{ item.label }}
      </th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(item, index) in tableData1" :key="index + 'dasdasd'">
      <td v-for="(it, idx) in tableHead1" :key="idx + 'eret'" v-html="item[String(it.prop)]"></td>
    </tr>
  </tbody>
</NTable>

```js
Boolean(true) === true
Boolean(false) === false
Boolean('123') === true
Boolean('') === false
Boolean({}) === true
Boolean(null) === false
Boolean(undefined) === false

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
Boolean(-1) === true
Boolean(1) === true
Boolean(Infinity) === true
Boolean(0) === false
Boolean(NaN) === false
```


## `Number`

默认十进制

八进制 `0` 开头，无效值转为十进制(**严格模式无效**，`ES6` 使用 `0o`)

十六进制`0x`开头，无效转为十进制(**前缀区分大小写，数值不区分大小写**)

**算术计算时都将转为十进制**

最小值`Number.MIN_VALUE`

最大值`Number.MAX_VALUE`

正无穷`Number.POSITIVE_INFINITY`

负无穷`Number.NEGATIVE_INFINITY`

判断是否无穷大`Number.isFinite(num)`

### 浮点数

数值中必须包含小数点，且小数点后至少有一位数字

小数点之前可以不加数字，但推荐加上

浮点数所占用的内存空间是整数的两倍，所以`1.`和`1.0`之类的数值都会被转换为整数

科学记数法 `1000 === 1e3`，默认情况下，`ECMAScript` 会将小数点后至少包含 6 个零的浮点值转换为科学记数法

浮点值的精确度最高可达 **17** 位小数，但在算术计算中远不如整数精确。例如，**0.1 加 0.2 得到的不 是 0.3，而是 0.300 000 000 000 000 04**

### `NaN`

`Not a Number`

`NaN` 参与的运算结果都是 `NaN`

狠起来连自己都怕 `NaN != NaN`

判断是否 `NaN`，`Number.isNaN()`

会先对参数进行数值转换 `Number()`，转换失败返回 `true`，转换成功返回 `false`

### `Number`

<NTable :bordered="false" :single-line="false" striped>
  <thead>
    <tr>
      <th v-for="(item, index) in tableHead2" :key="index + 'head'" :width="item.width ?? ''">
        {{ item.label }}
      </th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(item, index) in tableData2" :key="index + 'dasdasd'">
      <td v-for="(it, idx) in tableHead2" :key="idx + 'eret'" v-html="item[String(it.prop)]"></td>
    </tr>
  </tbody>
</NTable>


### `parseInt`

```js
parseInt(转换值, [进制: 2, 8, 10, 16]);
```

**忽略字符串前部的空格，直到第一个非空字符**

如果**第一个非空字符不是数字字符或负号则返回 `NaN`**

如果**第一个字符是数字字符则继续解析直至结束或遇到非数字字符**

**可以解析八进制，最好显示说明，说明之后可不带进制符**

<span class="text-red-600 font-bold">进制值不指定或者传 0，都表示十进制, 如果转换值大于等于进制值则返回 NaN</span>

```js
parseInt('') => NaN
parseInt('1234sgfakf') => 1234
parseInt('0xa') => 10
parseInt(22.5) => 22
parseInt(070) => 56

[1, 2, 3].map(parseInt) => [1, NaN, NaN]
// parseInt(1, 0) => 1
// parseInt(2, 1) => NaN
// parseInt(3, 2) => NaN
```

### `parseFloat`

**只能转换十进制，16 进制始终返回 0**

**始终忽略前导零**

**只有第一个小数点有效**

**没有小数点或小数点之后都是零则返回整数**

```js
parseFloat('1234dsgk') => 1234
parseFloat('0xa') => 0
parseFloat('22.5') => 22.5
parseFloat('12.34.56') => 12.34
parseFloat('0448.99') => 448.99
```

## `String`

表示零个或多个 16 位的 `Unicode` 字符序列

可以使用单引号、双引号、反引号定义，但一定要匹配

**字符串不可变，修改字符串的值等效于销毁原始字符串，保存新的字符串到变量**

<NTable :bordered="false" :single-line="false" striped>
  <thead>
    <tr>
      <th v-for="(item, index) in tableHead3" :key="index + 'head'" :width="item.width ?? ''">
        {{ item.label }}
      </th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(item, index) in tableData3" :key="index + 'dasdasd'">
      <td v-for="(it, idx) in tableHead3" :key="idx + 'eret'" v-html="item[String(it.prop)]"></td>
    </tr>
  </tbody>
</NTable>


### `toString()`

除了 `null` 和 `undefined` 之外都有的方法

数值调用时**可选参数为进制数，默认十进制**

### `String()`

如果有 `toString()` 方法，则返回其调用结果

`null => 'null'`

`undefined => 'undefined'`

### 模板字符串

使用反引号包裹

内部可保留换行符

可通过`${}`进行插值，大括号内部可放入变量或者表达式

所有插入的值都会使用 `toString()` 强制转化为字符串

#### 标签函数

- 标签函数会接收被插值记号分隔后的模板和对每个表达式求值的结果
- 标签函数本身是一个常规函数，通过**前缀到模板字面量**来应用自定义行为
- 标签函数接收到的**参数**依次是**原始字符串数组**和**对每个表达式求值的结果**
- 函数的返回值就是模板字符串的最终值

```js
const a = 6, b = 9;
function tag(str, ...arr) {
  console.log(str);
  console.log('-------------------');
  arr.forEach((v) => console.log(v));
  console.log('-------------------');
  return '我是标签函数的返回值';
}
const formal = `${a} + ${b} = ${a + b}`;
// 此时会直接执行标签函数，并将其返回值赋值给 unFormal
const unFormal = tag`${a} + ${b} = ${a + b}`;
console.log(formal);
console.log('-------------------');
console.log(unFormal);
/////////////////////////////////////////////
// 标签函数的 str
["", " + ", " = ", "", raw: Array(4)]
-------------------
// 遍历打印标签函数的 arr
6
9
15
-------------------
// 打印 formal
6 + 9 = 15
-------------------
// 打印 UnFormal 即标签函数的返回值
我是标签函数的返回值
```

#### 获取字符串的原始值

```js
console.log(`\u00A9`); // ©
console.log(String.raw`\u00A9`); // \u00A9 
// ------------------------------------------------------------
console.log(`first line\nsecond line`);
// first line
// second line
console.log(String.raw`first line\nsecond line`);
// "first line\nsecond line" 
```

## `Symbol`

`ES6` 新增数据类型

符号实例是**唯一的、不可变的**

用于确保对象属性使用唯一标识符，不会发生属性冲突

**直接作为函数调用，不可使用 `new` 操作符**

调用时可传入对于符号的描述，但与符号定义或标识完全无关

因为符号属性是对内存中符号的一个引用，所以直接创建并用作属性的符号不会丢失。但是，如果没有**显式地保存**对这些属性的引用，那么必须遍历对象的所有符号属性才能找到相应的属性键

```js
let genericSymbol = Symbol();
let otherGenericSymbol = Symbol();
console.log(genericSymbol === otherGenericSymbol); // false 
let fooSymbol = Symbol('foo');
let otherFooSymbol = Symbol('foo');
console.log(fooSymbol === otherFooSymbol); // false 
typeof genericSymbol === 'symbol'; // true
```

### `Symbol.for()`

如果运行时的不同部分需要**共享**和**重用**符号实例，那么可以用一个字符串作为键，**在全局符号注册表中创建并重用符号**

即使采用相同的符号描述，在全局注册表中定义的符号跟使用 `Symbol()` 定义的符号也并不等同

全局注册表中的符号**必须使用字符串键来创建**，因此**作为参数传给 `Symbol.for()` 的任何值都会被转换为字符串**

**注册表中使用的键同时也会被用作符号描述(`Symbol.for('str').description === 'str'`)**

```js
let fooGlobalSymbol = Symbol.for('foo'); // 创建新符号
let otherFooGlobalSymbol = Symbol.for('foo'); // 重用已有符号
console.log(fooGlobalSymbol === otherFooGlobalSymbol); // true 

let localSymbol = Symbol('foo');
let globalSymbol = Symbol.for('foo');
console.log(localSymbol === globalSymbol); // false 

let emptyGlobalSymbol = Symbol.for();
console.log(emptyGlobalSymbol); // Symbol(undefined) 
```

### `Symbol.keyFor()`

查询全局注册表，这个方法接收符号，返回该全局符号对应的字符串键

如果查询的不是全局符号，则返回 `undefined`

如果传给 `Symbol.keyFor()` 的不是符号，则该方法抛出 `TypeError`

```js
// 创建全局符号
let s = Symbol.for('foo');
console.log(Symbol.keyFor(s)); // foo 
// 创建普通符号
let s2 = Symbol('bar');
console.log(Symbol.keyFor(s2)); // undefined 
// 类型不对
Symbol.keyFor(123); // TypeError: 123 is not a symbol 
```

### 获取对象属性

`Object.getOwnPropertyNames()` 返回对象实例的**常规属性**数组

`Object.getOwnPropertySymbols()` 返回对象实例的**符号属性**数组

`Object.getOwnPropertyDescriptors()` 会返回同时包含**常规和符号属性描述符**的**对象**

`Reflect.ownKeys()`会返回**两种类型**的**键数组**

```js
let s1 = Symbol('foo'), s2 = Symbol('bar');
let o = {
  [s1]: 'foo val',
  [s2]: 'bar val',
  baz: 'baz val',
  qux: 'qux val'
};
console.log(Object.getOwnPropertySymbols(o));
// [Symbol(foo), Symbol(bar)]
console.log(Object.getOwnPropertyNames(o));
// ["baz", "qux"]
console.log(Object.getOwnPropertyDescriptors(o));
// {baz: {...}, qux: {...}, Symbol(foo): {...}, Symbol(bar): {...}}
console.log(Reflect.ownKeys(o));
// ["baz", "qux", Symbol(foo), Symbol(bar)] 
```

### 常用内置符号

用于暴露语言内部行为，开发者可以直接访问、重写或模拟这些行为

以 `Symbol` 工厂函数字符串属性的形式存在(**静态属性**)


<NTable :bordered="false" :single-line="false" striped>
  <thead>
    <tr>
      <th v-for="(item, index) in tableHead4" :key="index + 'head'" :width="item.width ?? ''">
        {{ item.label }}
      </th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(item, index) in tableData4" :key="index + 'dasdasd'">
      <td v-for="(it, idx) in tableHead4" :key="idx + 'eret'" v-html="item[String(it.prop)]"></td>
    </tr>
  </tbody>
</NTable>


```js
let initial = ['foo'];
let array = ['bar'];
console.log(array[Symbol.isConcatSpreadable]); // undefined
console.log(initial.concat(array)); // ['foo', 'bar']
array[Symbol.isConcatSpreadable] = false;
console.log(initial.concat(array)); // ['foo', Array(1)] 

let arrayLikeObject = { length: 1, 0: 'baz' };
console.log(arrayLikeObject[Symbol.isConcatSpreadable]); // undefined
console.log(initial.concat(arrayLikeObject)); // ['foo', {...}]
arrayLikeObject[Symbol.isConcatSpreadable] = true;
console.log(initial.concat(arrayLikeObject)); // ['foo', 'baz'] 

let otherObject = new Set().add('qux');
console.log(otherObject[Symbol.isConcatSpreadable]); // undefined
console.log(initial.concat(otherObject)); // ['foo', Set(1)]
otherObject[Symbol.isConcatSpreadable] = true;
console.log(initial.concat(otherObject)); // ['foo'] 
////////////////////////////////////
class Baz extends Array {
  static get [Symbol.species]() {
    return Array;
  }
} 
let baz = new Baz();
console.log(baz instanceof Array); // true
console.log(baz instanceof Baz); // true
baz = baz.concat('baz');
console.log(baz instanceof Array); // true
console.log(baz instanceof Baz); // false 
/////////////////////////////////////
class Bar {
  constructor() {
    this[Symbol.toPrimitive] = function(hint) {
    switch (hint) {
      case 'number':
        return 3;
      case 'string':
        return 'string bar';
      case 'default':
      default:
        return 'default bar';
      }
    }
  }
} 
let bar = new Bar();
console.log(3 + bar); // "3default bar"
console.log(3 - bar); // 0
console.log(String(bar)); // "string bar" 
```

## `BigInt`

目前处于 [Stage4](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

用于大数(**大于 2<sup>53</sup> - 1 的整数**)运算

**不能和任何 Number 实例混合运算，但是可以在数组内混合排序**

**转换为 Number 时会丢失精度**

**不能使用 Math 对象中的方法**

**不支持无符号右移运算，不支持单目运算**

**运算结果不存在小数**

使用方法：

```js
1n === BigInt(1); // true
1n === 1; // false
1n == 1; // true
const previousMaxSafe = BigInt(Number.MAX_SAFE_INTEGER);
// 9007199254740991n
const multi = previousMaxSafe * 2n;
// 18014398509481982n
const subtr = multi – 10n;
// 18014398509481972n
const mod = multi % 10n;
// 2n
const bigN = 2n ** 54n;
// 18014398509481984n
bigN * -1n;
// –18014398509481984n
const rounded = 5n / 2n;
// 2n 不存在小数
```

### 静态方法

`BigInt.asIntN(xn)` 将 `BigInt` 值转换为一个 -2<sup>width-1</sup> 与 2<sup>width-1</sup>-1 之间的有符号整数

`BigInt.asUintN(xn)` 将 `BigInt` 值转换为一个 0 与 2<sup>width</sup>-1 之间的无符号整数

### 实例方法

`BigInt.prototype.toLocaleString()` 覆盖 `Object.prototype.toLocaleString()`

`BigInt.prototype.toString()` 覆盖 `Object.prototype.toString()`


`BigInt.prototype.valueOf()` 覆盖 `Object.prototype.valueOf()`

### 序列化

**默认不会序列化**

需要自行实现 `BigInt.prototype.toJSON`


## 复杂数据类型 `Object`

### `typeof` 操作符

使用 `typeof 'str'` or `typeof('str')`

返回值：
  - `'undefined'` -> 未定义
  - `'boolean'` -> 布尔值
  - `'string'` -> 字符串
  - `'number'` -> 数值
  - `'object'` -> **对象或者`null`**
  - `'function'` -> 函数
  - `'symbol'` -> 符号
  - `'bigint'` -> 超大整数

严格来讲，函数在 `ECMAScript` 中被认为是对象，并不代表一种数据类型。可是，函数也有自己特殊的属性。为此，就有必要通过`typeof`操作符来区分函数和其他对象

### `Object`

一组数据和功能的集合

可以通过创建 `Object` 类型的实例来创建自己的对象，然后再给对象添加属性和方法

`const obj = new Object();` 不带括号也合法，但**不推荐**

`const obj = {};` 字面量直接创建

#### 实例的方法及属性

`constructor` 用于创建当前对象实例的构造函数

`hasOwnProperty(propertyName)` 判断当前对象**实例(非原型)**上是否存在给定的属性

`isPrototypeOf(object)` 判断当前对象是否为另一个对象的原型

`propertyIsEnumerable(propertyName)` 判断给定属性是否可以通过 `for-in` 遍历

`toLocaleString()`：返回对象的字符串表示，该字符串反映对象所在的本地化执行环境

`toString()`：返回对象的字符串表示

`valueOf()`：返回对象对应的字符串、数值或布尔值表示。通常与 `toString()` 的返回值相同

因为在 `ECMAScript` 中 `Object` 是所有对象的基类，所以任何对象都有这些属性和方法

严格来讲，`ECMA-262` 中对象的行为不一定适合 `JavaScript` 中的其他对象。比如浏览器环境中的 `BOM` 和 `DOM` 对象，都是由宿主环境定义和提供的宿主对象。而宿主对象不受 `ECMA-262` 约束，所以它们可能会也可能不会继承 `Object`
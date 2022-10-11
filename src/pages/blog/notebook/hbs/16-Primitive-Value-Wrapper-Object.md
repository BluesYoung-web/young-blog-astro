---
layout: "@/layouts/BlogPost.astro"
title: 16-原始值包装对象
image: /img/hbs.png
description: JavaScript 原始值的包装对象
date: 2020-12-28 17:30:08
---

[[toc]]

## 概述

为了方便操作原始值，`ECMAScript `提供了 3 种特殊的引用类型：`Boolean`、`Number` 和 `String`

每当用到某个原始值的方法或属性时，后台都会创建一个相应原始包装类型的对象，从而暴露出操作原始值的各种方法

在以读模式访问字符串值的任何时候，后台都会执行以下 3 步：
  1. 创建一个 `String` 类型的实例
  2. 调用实例上特定的方法
  3. 销毁实例

```js
let s1 = "some text";
let s2 = s1.substring(2); 
// ===>
let s1 = new String("some text");
let s2 = s1.substring(2);
s1 = null; 
```

## 引用类型与包装类型的区别

在通过 `new` 实例化引用类型后，得到的实例会在**离开作用域时被销毁**

而自动创建的原始值包装对象则**只存在于访问它的那行代码执行期间**

```js
let s1 = "some text";
s1.color = "red";
console.log(s1.color); // undefined 
///////////////////////////////////
let s1 = new String("some text");
s1.color = "red";
console.log(s1.color); // red
///////////////////////////////////
let value = "25";
let number = Number(value); // 转型函数
console.log(typeof number); // "number"
let obj = new Number(value); // 构造函数
console.log(typeof obj); // "object" 
```

## `Boolean`

对应布尔值的引用类型

要创建一个 `Boolean` 对象，就使用 `Boolean` 构造函数并传入 `true` 或 `false`

### 继承自 Object 的方法

`valueOf()` 方法，返回一个原始值 `true` 或 `false`

`toString()` 方法，返回字符串 `"true"` 或 `"false"`

`toLocaleString()` 方法，返回字符串 `"true"` 或 `"false"`

**不推荐使用包装对象，容易出错**

```js
let falseObject = new Boolean(false);
let result = falseObject && true;
console.log(result); // true

let falseValue = false;
result = falseValue && true;
console.log(result); // false 
```

## `Number`

对应数值的引用类型

要创建一个 `Number` 对象，就使用 `Number` 构造函数并传入一个**数值**

### 继承自 Object 的方法

`valueOf()` 方法，返回一个原始数值

`toString()` 方法，返回数值字符串

`toLocaleString()` 方法，返回数值字符串

### 格式化为字符串的方法

#### `toFixed(n)`

保留小数点后 n 位数

`n ∈ [0, 20]` 通常被支持的范围，具体情况取决于浏览器

#### `toExpoenetial(n)`

返回以科学记数法表示的数值字符串，保留 n 位小数

```js
let num = 10;
console.log(num.toExponential(1)); // "1.0e+1" 
```

#### `toPrecision(n)`

根据具体情况返回适当的形式（固定长度 | 科学记数法）

n **为数字总位数**，不包括小数点及指数

`n ∈ [1, 21]` 通常被支持的范围，具体情况取决于浏览器

## `String`

对应字符串的引用类型

要创建一个 `String` 对象，使用 `String` 构造函数并传入一个值

`String` 对象的方法**可以在所有字符串原始值上调用**

每个 `String` 对象都有一个 `length` 属性，表示字符串中字符的数量

`JavaScript` 字符串由 16 位码元（`code unit`）组成。对多数字符来说，每 16 位码元对应一个字符。换句话说，字符串的 `length` 属性**表示字符串包含多少 16 位码元**

### 继承自 Object 的方法

`valueOf()` 方法，返回对象的原始字符串值

`toString()` 方法，返回对象的原始字符串值

`toLocaleString()` 方法，返回对象的原始字符串值

### 字符方法

**`charAt()`**
  - 返回给定索引位置的字符，由传给方法的整数参数指定
  - 具体来说，这个方法查找指定索引位置的 16 位码元，并返回该**码元对应的字符**

**`charCodeAt()`**
  - 查看指定码元的**字符编码**

```js
let message = "abcde";
console.log(message.charAt(2)); // "c" 
// Unicode "Latin small letter C"的编码是 U+0063
console.log(message.charCodeAt(2)); // 99 === 0x63
```

**`fromCharCode()`**
  - 对于根据给定的 `UTF-16` 码元创建字符串中的字符，可以接受任意多个数值，并返回将所有数值对应的字符拼接起来的字符串

```js
// Unicode "Latin small letter A"的编码是 U+0061
// Unicode "Latin small letter B"的编码是 U+0062
// Unicode "Latin small letter C"的编码是 U+0063
// Unicode "Latin small letter D"的编码是 U+0064
// Unicode "Latin small letter E"的编码是 U+0065
console.log(String.fromCharCode(0x61, 0x62, 0x63, 0x64, 0x65)); // "abcde"
// 0x0061 === 97
// 0x0062 === 98
// 0x0063 === 99
// 0x0064 === 100
// 0x0065 === 101
console.log(String.fromCharCode(97, 98, 99, 100, 101)); // "abcde" 
```

对于 `U+0000~U+FFFF` 范围内的字符，`length`、`charAt()`、`charCodeAt()`和 `fromCharCode()` 返回的结果都跟预期是一样的。这是因为在这个范围内，每个字符都是用 16 位表示的，而这几个方法也都基于 16 位码元完成操作。只要字符编码大小与码元大小一一对应，这些方法就能如期工作。 **这个对应关系在扩展到 Unicode 增补字符平面时就不成立了**。问题很简单，即 16 位只能唯一表示 65536 个字符。这对于大多数语言字符集是足够了，在 Unicode 中称为基本多语言平面（`BMP`）。为了表示更多的字符，Unicode 采用了一个策略，即每个字符使用另外 16 位去选择一个增补平面。这种**每个字符使用两个 16 位码元**的策略称为**代理对**

```js
// "smiling face with smiling eyes" 表情符号的编码是 U+1F60A
// 0x1F60A === 128522
let message = "ab☺de";
console.log(message.length); // 6
console.log(message.charAt(1)); // b
console.log(message.charAt(2)); // <?>
console.log(message.charAt(3)); // <?>
console.log(message.charAt(4)); // d
console.log(message.charCodeAt(1)); // 98
console.log(message.charCodeAt(2)); // 55357
console.log(message.charCodeAt(3)); // 56842
console.log(message.charCodeAt(4)); // 100
console.log(String.fromCodePoint(0x1F60A)); // ☺
console.log(String.fromCharCode(97, 98, 55357, 56842, 100, 101)); // ab☺de 
```

### Unicode 增补字符平面替代方案

**`codePointAt()` 代替 `charCodeAt()`**

**`fromCodePoint()` 代替 `fromCharCode()`**

### 规范化方法

**`normalize(key)`**

`key in ['NFD', 'NFC', 'NFKD', 'NFKC']`

某些 `Unicode `字符可以有多种编码方式。有的字符既可以通过一个 `BMP` 字符表示，也可以通过一个代理对表示

```js
let a1 = String.fromCharCode(0x00C5),
    a2 = String.fromCharCode(0x212B),
    a3 = String.fromCharCode(0x0041, 0x030A);
console.log(a1, a2, a3); // Å, Å, Å
console.log(a1 === a2); // false
console.log(a1 === a3); // false
console.log(a2 === a3); // false 
//////////////////////////////////////////////
// U+00C5 是对 0+212B 进行 NFC/NFKC 规范化之后的结果
console.log(a1 === a1.normalize("NFD")); // false
console.log(a1 === a1.normalize("NFC")); // true
console.log(a1 === a1.normalize("NFKD")); // false
console.log(a1 === a1.normalize("NFKC")); // true
// U+212B 是未规范化的
console.log(a2 === a2.normalize("NFD")); // false
console.log(a2 === a2.normalize("NFC")); // false
console.log(a2 === a2.normalize("NFKD")); // false
console.log(a2 === a2.normalize("NFKC")); // false
// U+0041/U+030A 是对 0+212B 进行 NFD/NFKD 规范化之后的结果
console.log(a3 === a3.normalize("NFD")); // true
console.log(a3 === a3.normalize("NFC")); // false
console.log(a3 === a3.normalize("NFKD")); // true
console.log(a3 === a3.normalize("NFKC")); // false 
////////////////////////////////////////////////
console.log(a1.normalize("NFD") === a2.normalize("NFD")); // true
console.log(a2.normalize("NFKC") === a3.normalize("NFKC")); // true
console.log(a1.normalize("NFC") === a3.normalize("NFC")); // true 
```

### 操作方法

**`concat(...str)`**，字符串拼接，**返回拼接后的字符串，不影响源串**

**`slice(start, [end - 1 = str.length - 1])`**
  - 提取子字符串，**不影响源串**
  - **所有负值参数都当成字符串长度加上负参数值**

**`substring(start, [end - 1 = str.length - 1])`**
  - 提取子字符串，**不影响源串**
  - **所有负参数值都转换为 0**

**`substr(start, [num = length - start])`**
  - 提取子字符串，**不影响源串**
  - **第一个负参数值当成字符串长度加上该值，第二个负参数值转换为 0**

```js
let stringValue = "hello world";
console.log(stringValue.slice(3)); // "lo world"
console.log(stringValue.substring(3)); // "lo world"
console.log(stringValue.substr(3)); // "lo world"
console.log(stringValue.slice(3, 7)); // "lo w"
console.log(stringValue.substring(3,7)); // "lo w"
console.log(stringValue.substr(3, 7)); // "lo worl" 
////////////////////////////////////////////////////////
console.log(stringValue.slice(-3)); // "rld"				  8 - end
console.log(stringValue.substring(-3)); // "hello world"      0 - end
console.log(stringValue.substr(-3)); // "rld"				  8 - end
console.log(stringValue.slice(3, -4)); // "lo w"			  3, 7
console.log(stringValue.substring(3, -4)); // "hel"			  3, 0 反向切片
console.log(stringValue.substr(3, -4)); // "" (empty string)  3, 0 长度为0
```

### 位置方法

**`indexOf(str, [start = 0])`**，从前往后查找子串，找到返回索引，找不到返回 -1

**`lastIndexOf(str, [start = str.length - 1])`**，从后往前查找子串，找到返回索引，找不到返回 -1

### 包含方法

**`startsWith(str, [start])`**，检查开始于索引 0 的匹配项

**`endsWidth(str)`**，检查开始于索引 `(string.length - substring.length)` 的匹配项

**`includes(str, [start])`**，检查整个字符串

### 去除空格符

**返回处理后的副本，都不影响源串**

**`trim()`**，清理字符串前后的空格

**`trimLeft()`**，删除字符串前面的空格

**`trimRight()`**，删除字符串后面的空格

### 重复方法

**`repeat(n)`**，接收一个整数参数，表示要将字符串复制多少次，然后返回拼接所有副本后的结果

```js
let stringValue = "na ";
console.log(stringValue.repeat(16) + "batman");
// na na na na na na na na na na na na na na na na batman 
```

### 填充方法

**`padStart(length, [char = ' '])`**
  - 复制字符串，如果小于指定长度，则在**左边填充字符**，直至满足长度条件
  - 填充字符串，默认为空格
  - 如果提供了多个字符的字符串，则会将其拼接并截断以匹配指定长度
  - 如果长度小于或等于字符串长度，则会返回原始字符串

**`padEnd(length, [char = ' '])`**
  - 复制字符串，如果小于指定长度，则在**右边填充字符**，直至满足长度条件
  - 填充字符串，默认为空格
  - 如果提供了多个字符的字符串，则会将其拼接并截断以匹配指定长度
  - 如果长度小于或等于字符串长度，则会返回原始字符串

### 迭代器方法

```js
let message = "abc";
let stringIterator = message[Symbol.iterator]();
console.log(stringIterator.next()); // {value: "a", done: false}
console.log(stringIterator.next()); // {value: "b", done: false}
console.log(stringIterator.next()); // {value: "c", done: false}
console.log(stringIterator.next()); // {value: undefined, done: true} 
//////////////////////////////////////////////////////////////////////
for (const c of "abcde") {
 console.log(c);
}
// a
// b
// c
// d
// e 
//////////////////////////////////////////////////////////////////////
let message = "abcde";
console.log([...message]); // ["a", "b", "c", "d", "e"] 
```

### 大小写转换方法

**`toLowerCase()`**，转小写

**`toLocaleLowerCase()`**，转小写

**`toUpperCase()`**，转大写

**`toLocaleUpperCase()`**，转大写

### 比较方法

**`lcaleCompare(str1)`**

具体实现与地区相关

比较两个字符串，返回如下 3 个值中的一个：
  - 如果按照字母表顺序，字符串应该排在字符串参数前头，则返回负值（通常是-1，具体还要看 与实际值相关的实现）
  - 如果字符串与字符串参数相等，则返回 0
  - 如果按照字母表顺序，字符串应该排在字符串参数后头，则返回正值（通常是 1，具体还要看与实际值相关的实现）

### `HTML` 方法

```js
'str'.anchor(name) === `<a name="name">str</a>`;
'str'.big() === `<big>str</big>`;
'str'.bold() === `<b>str</b>`;
'str'.fixed() === `<tt>str</tt>`;
'str'.fixed(color) === `<font color="color">str</font>`;
'str'.fontsize(size) === `<font size="size">str</font>`;
'str'.italics() === `<i>str</i>`;
'str'.link(url) === `<a href="link">str</a>`;
'str'.small() === `<small>str</small>`;
'str'.strike() === `<strike>str</strike>`;
'str'.sub() === `<sub>str</sub>`;
'str'.sup() === `<sup>str</sup>`;
'str'.blink() === `<blink>str</blink>`;
```
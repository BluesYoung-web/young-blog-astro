---
layout: "@/layouts/BlogPost.astro"
title: 09-语句
image: /img/hbs.png
description: JavaScript 语句
date: 2020-12-28 17:18:34
---

[[toc]]

## `if`

`if (condition) statement1 else statement2 `

条件（`condition`）可以是任何表达式，并且求值结果不一定是布尔值

**`ECMAScript` 会自动调用 `Boolean()` 函数将这个表达式的值转换为布尔值**

```js
if (i > 25) {
	console.log("Greater than 25.");
} else if (i < 0) {
	console.log("Less than 0.");
} else {
	console.log("Between 0 and 25, inclusive.");
} 
```

## `do-while`

后测试循环语句，循环体内的代码至少执行一次

```js
let i = 0;
do {
	i += 2;
} while (i < 10); 
```

## `while`

先测试循环语句，即先检测退出条件，再执行循环体内的代码

```js
let i = 0;
while (i < 10) {
	i += 2;
} 
```

## `for`

先测试语句

增加了进入循环之前的初始化代码，以及循环执行后要执行的表达式

无法通过 `while` 循环实现的逻辑，同样也无法使用 `for` 循环实现

```js
let count = 10;
for (let i = 0; i < count; i++) {
	console.log(i);
} 
for (;;) { // 无穷循环
	doSomething();
} 
// 等同于 while 循环
let count = 10;
let i = 0;
for (; i < count; ) {
	console.log(i);
	i++;
} 
```

## `for-in`

是一种严格的迭代语句，用于枚举对象中的**非符号键属性**

不能保证返回对象属性的顺序

如果 `for-in` 循环要迭代的变量是 `null` 或 `undefined`，则不执行循环体

```js
for (const propName in window) {
	document.write(propName);
} 
```

## `for-of`

一种严格的迭代语句，用于遍历**可迭代对象**的元素

会按照可迭代对象的 `next()` 方法产生值的顺序迭代元素

**如果尝试迭代的变量不支持迭代，则 `for-of` 语句会抛出错误**

```js
for (const el of [2,4,6,8]) {
	document.write(el);
} 
```

## 标签

用于给语句加标签

配合`break` 和 `continue` 使用可直接跳出多重循环

```js
start: for (let i = 0; i < 8; i++) {
	for(j = 0; j < i; j++) {
		console.log(i);
		if (j === 1) {
			break start;
		}
	}
}
// 1 2 2
```

## `break` 和 `continue`

`break` 立即结束当前层级的循环

`continue` 立即结束当次循环，继续开始下一轮循环

```js
let num = 0;
for (let i = 1; i < 10; i++) {
	if (i % 5 == 0) {
		break;
	}
	num++;
}
console.log(num); // 4

let num = 0;
for (let i = 1; i < 10; i++) {
	if (i % 5 == 0) {
		continue;
	}
	num++;
}
console.log(num); // 8 
```

## `with`

将代码作用域设置为**特定的对象**

严格模式不允许使用 `with `语句，否则会抛出错误

影响性能且难于调试其中的代码，不推荐使用

```js
let qs = location.search.substring(1);
let hostName = location.hostname;
let url = location.href; 
// ===>
with(location) {
	let qs = search.substring(1);
	let hostName = hostname;
	let url = href;
} 
```

## `switch`

多条件分支语句

可以用于所有数据类型（在很多语言中，它只能用于数值），因此可以使用字符串甚至对象

条件的值不需要是常量，也可以是变量或表达式

`switch `语句在比较每个条件的值时会使用**全等**操作符

为避免不必要的条件判断，**最好给每个条件后面都加上 `break `语句**

```js
switch (i) {
	case 25:
		console.log("25");
		break;
	case 35:
		console.log("35");
		break;
	case 45:
		console.log("45");
		break;
	default:
		console.log("Other");
} 
```
---
layout: "@/layouts/BlogPost.astro"
title: 64-错误处理
image: /img/hbs.png
description: JavaScript 错误处理
date: 2021-02-03 11:28:11
---

[[toc]]

## try-catch

`try` 包含可能出错的代码

`catch` 接收错误对象，处理错误

`finally` 无论是否出错都会执行，`try` 或 `catch` 内部的 `return` 会被忽略

```js
try{
	const a = '1324';
	a = 222;
} catch (e) {
	console.log(e);
	console.log(e.message);
} finally {
	alert('are you ok');
}
```

## 错误类型

`Error` 基础错误类型

`InternalError` 底层引擎异常(栈溢出)

`EvalError` 使用 `eval()` 函数发生异常时抛出

`RangeError` 数值越界时抛出

`ReferenceError` 引用错误时抛出

`SyntaxError` 给 `eval()` 传入的字符串包含 `JavaScript` 语法错误时发生

`TypeError` 主要发生在变量不是预期类型，或者访问不存在的方法时

`URIError` 只会在使用 `encodeURI()` 或 `decodeURI()` 但传入了格式错误的 `URI` 时发生

```js
// 抛出错误
throw new Error('msg ...');
```

## 抛出错误

- throw 操作符
- 用于随时抛出自定义的错误
- 在遇到throw操作符时代码会立即停止执行，仅当被捕获时才会继续执行

```js
throw 12345;
throw 'hello';
throw true;
throw {name: 'zfb'};
throw new Error('afgkasdjfg');
/**
 * 自定义错误类型
 */
class MyError extends Error{
	constructor(message){
		super();
		this.name = 'MyError';
		this.message = message;
	}
}

throw new MyError('惟有饮者留其名');
//////////////////////////////////////////////////////////////////
function process(values){
	if(!(values instanceof Array)){
		throw new Error('process(): argument must be an array');
	}
	console.log('processing');
}
```

## `error` 事件

`msg` 错误消息

`url` 发生错误的 `URL`

`line` 行号

任何没有通过 `try-catch` 处理的错误都会触发 `window` 对象的 `error` 事件

`return false` 会阻止浏览器报告错误的默认行为

这个事件处理函数是阻止浏览器报告的最后一道防线

```js
window.onerror = (msg, url, line) => {
  console.log(msg);
  console.log(url);
  console.log(line);
  return false;
};
```

## 多catch从句

```js
try{
	throw 1;
} catch(e if e instanceof ReferenceError){
} catch(e if e === 1){
} catch(e){
}
```

## 常见错误类型

### 类型转换错误

```js
// not good
function concat(str1, str2, str3){
	var res = str1 + str2;
	if(str3){
		res += str3;
	}
	return res;
}
// good
function concat(str1, str2, str3){
	var res = str1 + str2;
	if(typeof str3 === 'string'){
		res += str3;
	}
	return res;
}
```

### 数据类型错误

```js
function getSearch(url){
	if(typeof url === 'string'){
		var pos = url.indexOf("?");
		if(pos > -1){
			return url.substring(++pos);
		}
	}
	return "";
}
```

### 通信错误

```js
function addQueryString(url, name, value){
	if(url.indexOf("?") == -1){
		url += '?';
	} else {
		url += '&';
	}
	url = `${url}${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
	return url;
}
```

## 调试

`console.error(msg)` 打印错误消息

`console.info(msg)` 打印消息性内容

`console.log(msg)` 打印常规消息

`console.warn(msg)` 打印警告消息

### `debugger`

`ES5.1` 定义

用于调用可能存在的调试功能，如果没有则会被跳过

正常打开页面没有影响，打开控制台的时候会作为断点

### 自定义断言函数

```js
function assert(cond, errMsg) {
	if(!cond) {
		throw new Error(errMsg);
	}
}
assert(1 > 2, '开什么玩笑');
```

## 旧版 `IE` 常见的错误

无效字符

未找到成员

未知运行时错误(将块级元素插入不恰当的位置...)

语法错误(分号，括号...)

系统找不到指定资源(可能是 `URL` 过长)
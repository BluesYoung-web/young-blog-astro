---
title: 05-语法
image: /img/hbs.png
description: JavaScript 基本语法
date: 2020-12-28 16:24:02
---

[[toc]]

## 区分大小写

**无论是变量、函数名还是操作符，全部区分大小写**

## 合法标识符

第一个字符必须是一个字母、下划线或者美元符号

其余的字符可以是数字、字母、下划线、美元符号

推荐使用小驼峰

**关键字、保留字、true、false、null 不能作为标识符**

## 注释

单行注释 `//`

多行注释`/*  */`

`shell` 脚本开头的注释 `#!/usr/bin/env node`

## 严格模式

`ES5` 中新增的概念

在脚本或者函数内部开头加入 `"use strict";`

不破坏 `ES3` 语法，会影响执行结果

## 语句

推荐添加句尾分号，不添加也不会报错

代码块 `{}` 

## 关键字

```js
// ES3
break		do		instanceof		typeof
case		else		new			var
catch		finally		return			void
continue	for		switch			while
function	this		with			default
if		throw		delete			in
try
// ES5
debugger
// ES6
class		extends		export			const
super		yield		import			let
```

## 保留字

```js
// 始终保留
enum
// 严格模式下保留
implements	package		public			interface
protected	static		private			
// 模块代码中保留
await
```
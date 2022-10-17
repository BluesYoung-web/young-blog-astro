---
title: 02-实现
date: 2020-12-28 15:36:00
image: /img/hbs.png
description: JavaScript 的组成
---

[[toc]]

## 组成

核心（`ECMAScript`）

文档对象模型（`DOM`）

浏览器对象模型（`BOM`）

## `ECMAScript`

只定义基准

没有具体的输入输出方法

不局限于浏览器

具体的实现由宿主环境自行决定

### 定义部分

语法

类型

语句

关键字

保留字

操作符

全局对象

### 版本

`ES1` 在 JavaScript 1.1 的基础上删除浏览器特定的代码并加以修改

`ES2` 编辑校验，使之符合 ISO 标准

`ES3` 第一次真正意义上的更新：
  - 更新字符串处理、错误定义和数值输出
  - 增加对正则表达式、新的控制语句、`try/catch` 异常处理的支持
  - 针对标准国际化的少量修改

`ES4` 一次彻底的修订，过于激进，正式发布之前被放弃
  - 在第三版的基础上完全重新定义的一门语言
  - 强类型变量、新的语句和数据结构
  - 真正的类和经典类的继承
  - 操作数据的新手段

`ES5`(`ES3.1`) ，2009 年 12 月 3 日
  - 理清 `ES3` 存在的歧义
  - 加入原生解析和序列化 `JSON` 数据的 `JSON` 对象
  - 加入方便继承和高级属性的定义方法
  - 加入严格模式
  - 2011 年 6 月 发布修订版，只修正规范中的错误，未增加新特性

`ES6`(`ES2015`、`ES Harmony`)，2015 年 6 月
  - **包含有史以来最重要的一批增强特性**
  - 正式支持类、模块、迭代器、生成器、箭头函数、`Promise`、`Reflect`、`Proxy` 和众多新的数据类型

`ES7`(`ES2016`)，2016 年 6 月
  - 只包含少量语法层面的增强
  - `Array.prototype.includes()`
  - 指数操作符

`ES8`(`ES2017`)，2017 年 6 月
  - 增加异步函数（`async/await`）、`SharedArrayBuffer `及 `Atomics API`
  - `Object.values() | .entries() | .getOwnPropertyDescriptors()`
  - 字符串填充方法
  - **明确支持尾逗号**

`ES9`(`ES2018`)，2018 年 6 月
  - 异步迭代 **for await of**
  - 剩余和扩展属性 **`...`**
  - 新的正则表达式特性
  - `Promise finally()`
  - 模板字面量修订

`ES10`(`ES2019`)，2019 年 6 月
  - `Array.prototype.flat() | .flatMap()`
  - `String.prototype.trimStart() | .trimEnd()`
  - `Object.fromEntries()`
  - `Symbol.prototype.description`
  - 明确定义 `Function.prototype.toString()` 的返回值
  - 固定 `Array.prototype.sort()` 的顺序
  - 解决 `JSON` 字符串兼容的问题
  - 定义 `catch` 子句的可选绑定

## `DOM`

文档对象模型

一个应用编程接口（`API`）

用于在 `HTML `中使用扩展的 `XML` 

将整个页面抽象为一组分层节点，包含不同的数据

通过创建表示文档的树，让开发者可以随心所欲地控制网页的内容和结构

使用 `DOM API` 可以轻松的删除、添加、替换和修改节点

万维网联盟（`W3C1`）定制 `DOM` 标准

### `DOM`级别

`DOM0`，不存在，通常指`DHTML`

`DOM1`，1998 年 10 月，目标——映射文档结构
  - `DOM Core` + `DOM HTML`
  - `DOM Core` 提供一种映射 `XML` 文档，从而方便访问和操作文档任意部分的方式
  - `DOM HTML` 增加了特定于 `HTML` 的对象和方法
  - **DOM 并非只能通过 JavaScript 访问**

`DOM2` 
  - 增加 `DOM` 视图：描述追踪文档不同视图的接口
  - 增加 `DOM` 事件：描述事件及事件处理的接口
  - 增加 `DOM` 样式：描述处理元素 `CSS` 样式的接口
  - 增加 `DOM` 遍历和范围：描述遍历和操作 DOM 树的接口

`DOM3`
  - 增加了以统一的方式加载和保存文档的方法、验证文档的方法
  - 支持 `XML Infoest`/`XPath`/`XML Base`

`DOM Living Standard`(`DOM4`)
  - 替代 `Mutation Events` 的 `Mutation Observers`

### 其他 `DOM`

可伸缩矢量图（`SVG`)

数学标记语言（`MathML`）

同步多媒体集成语言（`SMIL`）

## `BOM`

浏览器对象模型

支持访问和操作浏览器窗口

可以控制浏览器显示页面之外的部分

唯一一个没有相关标准的 `JavaScript`实现，`HTML5`改变了这个局面

主要针对浏览器窗口和子窗口

**特定于浏览器的扩展：**
  - 弹出新浏览器窗口
  - 移动、缩放和关闭浏览器窗口
  - `navigator` 对象，提供关于浏览器的详尽信息
  - `location` 对象，提供浏览器加载页面的详尽信息
  - `screen` 对象，提供关于用户屏幕分辨率的详尽信息
  - `performance` 对象，提供浏览器内存占用、导航行为和时间统计的详尽信息
  - 对 `cookie` 的支持
  - 其他自定义对象（`XMLHttpRequest` 和 `IE` 的 `ActiveXObject`）
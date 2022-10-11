---
layout: "@/layouts/BlogPost.astro"
title: 73-模块
image: /img/hbs.png
description: JavaScript 模块
date: 2021-02-06 16:18:46
---

[[toc]]

## 模块模式

逻辑分块

各自封装

相互独立

每个模块自行决定对外暴露什么，同时自行决定引入执行哪些外部代码

### 模块标识符

所有模块系统通用的概念

可能是字符串或者模块文件的实际路径

**解析：**
  - 原生浏览器必须提供实际文件的路径
  - 除了文件路径，`node` 还会搜索 `node_modules` 目录，用标识符去匹配包含 `index.js` 的目录

### 模块依赖

**模块系统的核心——依赖管理**

本地模块向模块系统声明一组外部模块（依赖），这些外部模块对于当前模块正常运行是必需的

模块系统检视这些依赖，进而保证这些外部模块能够被加载并在本地模块运行时初始化所有依赖

每个模块都会与某个唯一的标识符关联，该标识符可用于检索模块

## 模块加载

加载模块的概念派生自依赖契约

当一个外部模块被指定为依赖时，本地模块期望在执行它时，依赖已准备好并已初始化

在浏览器中，加载模块涉及几个步骤：
  1. 加载模块涉及执行其中的代码，但必须是在所有依赖都加载并执行之后
  2. 如果浏览器没有收到依赖模块的代码，则必须发送请求并等待网络返回
  3. 收到模块代码之后，浏览器必须确定刚收到的模块是否也有依赖
  4. 然后递归地评估并加载所有依赖，直到所有依赖模块都加载完成
  5. 只有整个依赖图都加载完成，才可以执行入口模块

## 异步依赖

**必要时加载新模块，并在模块加载完成后提供回调**

```js
// 在模块 A 里面
load('moduleB').then((moduleB) => {
 moduleB.doStuff();
}); 
```

## 动态依赖

**依赖必须在模块执行前加载完毕**

```js
if (loadCondition) { require('./moduleA'); } 
```

## 循环依赖

要构建一个没有循环依赖的 `JavaScript` 应用程序几乎是不可能的，因此包括 `CommonJS`、`AMD` 和 `ES6` 在内的所有模块系统都支持循环依赖

在包含循环依赖的应用程序中，**模块加载顺序可能会出人意料**

**只要恰当地封装模块，使它们没有副作用，加载顺序就应该不会影响应用程序的运行**

```js
require('./moduleD');
require('./moduleB');
console.log('moduleA');
require('./moduleA');
require('./moduleC');
console.log('moduleB');
require('./moduleB');
require('./moduleD');
console.log('moduleC');
require('./moduleA');
require('./moduleC');
console.log('moduleD');
// moduleB moduleC moduleD moduleA
// moduleD moduleA moduleB moduleC
// 以上打印顺序都是正常的
```

## `CommonJS`

使用 `require()` 指定依赖

使用 `exports` 对象定义自己的公共 `API`

**无论一个模块在 `require()` 中被引用多少次，模块永远是单例**

```js
var moduleB = require('./moduleB');
module.exports = { stuff: moduleB.doStuff(); };
```

## `AMD`

`Asynchronous Module Definition`，异步模块定义

**以浏览器为目标执行环境**

让模块声明自己的依赖，浏览器在运行时按需获取依赖，依赖加载完成后立即执行模块

```js
// ID 为'moduleA'的模块定义。moduleA 依赖 moduleB，
// moduleB 会异步加载
define('moduleA', ['moduleB'], function(moduleB) {
	return {
		stuff: moduleB.doStuff();
	};
}); 
```

`AMD` 也支持 `require` 和 `exports` 对象，通过它们可以在 `AMD` 模块工厂函数内部定义 `CommonJS` 风格的模块

这样可以像请求模块一样请求它们，但 `AMD` 加载器会将它们识别为原生 `AMD` 结构而不是模块定义

```js
define('moduleA', ['require', 'exports'], function(require, exports) {
	var moduleB = require('moduleB');
	exports.stuff = moduleB.doStuff();
});
// 动态依赖也是通过这种方式支持的：
define('moduleA', ['require'], function(require) {
	if (condition) {
		var moduleB = require('moduleB');
	}
});
```

## `UMD`

`Universal Module Definition`，通用模块定义

**`UMD` 可用于创建 `CommonJS\AMD` 都可以使用的模块代码**

```js
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD。注册为匿名模块
		define(['moduleB'], factory);
	} else if (typeof module === 'object' && module.exports) {
		// Node。不支持严格 CommonJS
		// 但可以在 Node 这样支持 module.exports 的类 CommonJS 环境下使用
		module.exports = factory(require('moduleB'));
	} else {
		// 浏览器全局上下文（root 是 window）
		root.returnExports = factory(root.moduleB);
}
}(this, function (moduleB) {
	// 以某种方式使用 moduleB，将返回值作为模块的导出
	// 这个例子返回了一个对象，但是模块也可以返回函数作为导出值
	return {};
})); 
```

## `ES6` 模块

全方位简化模块加载器，原生浏览器支持(**`ESM`**)

`<script type="module"></script>`

**所有模块都会像 `<script defer>` 加载的脚本一样按顺序执行(立即下载模块文件，文档解析完成之后执行)**

```html
<!-- 第二个执行 -->
<script type="module" src="module.js"></script>
<!-- 第三个执行 -->
<script type="module" src="module.js"></script>
<!-- 第一个执行 -->
<script><script> 
```

### 模块加载

既可以通过浏览器原生加载

也可以与第三方加载器和构建工具一起加载

使用第三方浏览器工具会更加方便

### 模块行为

模块代码**只在加载后执行**

模块**只能加载一次**

模块是单例

模块可以定义公共接口，其他模块可以基于这个公共接口观察和交互

模块可以请求和加载其他模块

支持循环依赖

**默认在严格模式下执行，不共享全局命名空间**

顶级 `this` 的值是 `undefined`(常规脚本中是 `window`)

`var` 声明的变量**不会挂载到 `window` 上**

**异步加载和执行**

### 模块导出

**导出语句必须在模块顶级**

```js
// 命名导出
export const foo = 'foo';
// 等效命名导出
const foo = 'foo';
export { foo };
// 别名导出
export { foo as YoungFoo };
// 默认导出
export default foo;
// 等效默认导出
export { foo as default };
```

### 模块导入

**导入语句必须出现在模块顶级**

模块标识符(路径)必须是**纯字符串**，不能是动态计算的结果

**导入对模块而言是只读的，相当于使用 `const` 声明的变量**

### 模块转移导出

```js
// 把一个模块的所有命名导出集中在一块，忽略默认导出
export * from './foo.js';
// 重写导出
// --- foo.js
export const baz = 'origin:foo';
// --- bar.js
export * from './foo.js';
export const baz = 'origin:bar';
// --- main.js
import { baz } from './bar.js';
console.log(baz); // origin:bar 
// 别名导出
export { foo, bar as myBar } from './foo.js';
// 重用默认导出
export { default } from './foo.js';
```

### 工作者模块

在基于模块的工作者内部，`self.importScripts()` 方法通常用于在基于脚本的工作者中加载

**外部脚本调用它会抛出错误，这是因为模块的 `import` 行为包含了 `importScripts()`**

### 向后兼容

```html
<script type="module">
// 支持模块的浏览器执行
async function count() {
  await 1;
  await 2;
  await 3;
}
</script>
<script nomodule>
// 不支持模块的浏览器执行
</script>
```

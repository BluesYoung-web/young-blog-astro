---
title: 62-Web原生组件
image: /img/hbs.png
description: JavaScript Web Component
date: 2021-02-02 09:43:07
---

## 定义

一套用于增强 `DOM` 行为的工具

组成：
  - `HTML` 模板
  - 影子 `DOM`
  - 自定义元素

存在的问题：
  - 没有统一的规范
  - 向后不兼容
  - 浏览器实现及其不一致

腻子脚本 `Polymer` 模拟浏览器中缺失的 `Web` 组件

## `HTML` 模板

组件之前的解决方案：
  - **`innerHTML` 存在严重的安全隐患**
  - `document.createElement()` 构建每个元素，然后逐渐它们添加到非页面内的(孤儿)节点，但是特别麻烦，完全与标记无关

模板核心思想——**提前在页面中写出特殊的标记，但是跳过渲染**

### `<template>` 

专为模板而生，它的内容不属于活动文档(**不会被渲染**)

`template.content` 取得对它的内容(`document-fragment`)的引用

`document-fragment` 可以一次性添加所有子节点，最多只会有一次布局重排

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
	<h1>来了老弟</h1>
	<template id="temp">
		<h2>好嗨哟......</h2>
		<h2>好嗨哟......</h2>
		<h2>好嗨哟......</h2>
		<h2>好嗨哟......</h2>
		<h2>好嗨哟......</h2>
		<h2>好嗨哟......</h2>
		<script>console.log('来了老弟');</script>
	</template>
	<script>
	const tp = document.querySelector('#temp');
	const tp_frag = tp.content;
	// 插入之后，template 的内容会消失
	// setTimeout(() => document.body.appendChild(tp_frag), 3000);
	// 插入之后，克隆内容，不会改变 template 的内容
	const cp_content = document.importNode(tp_frag, true);
	setTimeout(() => document.body.appendChild(cp_content), 3000);
	</script>
</body>
</html>
```

## 影子 `DOM`

`shadow DOM`

可以将一个完整的 `DOM` 树作为节点添加到父 `DOM` 树

这意味着 `CSS` 样式和 `CSS` 选择符可以**限制**在影子 `DOM` 子树而不是顶级 `DOM` 树中

### 创建影子 `DOM`

考虑到安全及避免影子 `DOM` 冲突，并非所有元素都可以包含影子 `DOM`

尝试给已经有了影子 `DOM` 的元素添加影子 `DOM` 会导致抛出错误

可以容纳影子 `DOM` 的元素：
  - 自定义元素
  - `<article>`
  - `<aside>`
  - `<blockquote>`
  - `<body>`
  - `<div>`
  - `<footer>`
  - `<h1~6>`
  - `<header>`
  - `<main>`
  - `<nav>`
  - `<p>`
  - `<section>`
  - `<span>`

影子 `DOM` 时通过 `attachShadow(initObj)` 方法创建并添加给有效 `HTML` 元素的

容纳影子 `DOM` 的元素被称为影子宿主

影子 `DOM` 的根节点被称为影子根

`initObj.mode`
  - `open` 影子 `DOM` 的引用可以通过 `shadowRoot` 属性在 `HTML` 元素上获得
  - `closed` 影子 `DOM` 的引用无法获取

```js
document.body.innerHTML = `
 <div id="foo"></div>
 <div id="bar"></div>
`;
const foo = document.querySelector('#foo');
const bar = document.querySelector('#bar');
const openShadowDOM = foo.attachShadow({ mode: 'open' });
const closedShadowDOM = bar.attachShadow({ mode: 'closed' });
console.log(openShadowDOM); // #shadow-root (open)
console.log(closedShadowDOM); // #shadow-root (closed)
console.log(foo.shadowRoot); // #shadow-root (open)
console.log(bar.shadowRoot); // null 
```

### 常规使用

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
<script>
for (let color of ['red', 'green', 'blue']) {
	const div = document.createElement('div');
	const shadowDOM = div.attachShadow({ mode: 'open' });
	document.body.appendChild(div);
	shadowDOM.innerHTML = `
	<p>Make me ${color}</p>
	<style>
	p { color: ${color}; }
	</style>
	`;
}
</script>
</body>
</html>
```

### 合成与影子 `DOM` 槽位

影子 `DOM` 一添加到元素中，浏览器就会赋予它最高优先级

默认情况下，挂载影子 `DOM` 的元素内部的子元素不会显示

```js
document.body.innerHTML = `<div><p>Foo</p></div>`;
// 1s 之后，页面会显示为一片空白
setTimeout(() => document.querySelector('div').attachShadow({ mode: 'open' }), 1000); 
```

匿名插槽，将实际子元素**投射**到影子 `DOM`

```js
document.body.innerHTML = `
<div id="foo">
 <p>Foo</p>
</div>
`; 
document.querySelector('div').attachShadow({ mode: 'open' }).innerHTML = `
<div id="bar">
 <slot></slot>
<div>`;
```

- 命名插槽，通过匹配进行对应的投射

```js
document.body.innerHTML = `
<div>
 <p slot="foo">Foo</p>
 <p slot="bar">Bar</p>
</div>
`;
document.querySelector('div').attachShadow({ mode: 'open' }).innerHTML = `
 <slot name="bar"></slot>
 <slot name="foo"></slot>
`;
// Renders:
// Bar
// Foo 
```

### 事件重定向

只会发生在影子 `DOM` 中**实际存在的**元素上

使用 `<slot>` 标签从外部投射进来的元素不会发生事件重定向，因为它们**实际上的位置依然在影子 `DOM` 外部**

```js
// 创建一个元素作为影子宿主
document.body.innerHTML = `
<div onclick="console.log('Handled outside:', event.target)"></div>
`;
// 添加影子 DOM 并向其中插入 HTML
document.querySelector('div').attachShadow({ mode: 'open' }).innerHTML = `
<button onclick="console.log('Handled inside:', event.target)">Foo</button>
`;
// 点击按钮时：(因为浏览器安全策略的限制，现在会报错)
// Handled inside: <button onclick="..."></button>
// Handled outside: <div onclick="..."></div> 
```

## 自定义元素

浏览器会尝试将无法识别的元素作为通用元素整合进 `DOM`

同时，这些元素默认也不会做任何通用 `HTML` 元素不能做的事

```js
document.body.innerHTML = `<x-foo >I'm inside a nonsense element.</x-foo >`;
console.log(document.querySelector('x-foo') instanceof HTMLElement); // true 
```

<n-alert type="info">自定义元素名必须**至少包含一个**不在名称开头和末尾的**连字符**(`-`)，而且元素标签不能**自关闭**</n-alert>

```js
class FooElement extends HTMLElement {
  constructor() {
    super();
    console.log('来了老弟');
  }
}
customElements.define('x-foo', FooElement);
customElements.define('y-foo', FooElement, { extends: 'div' });
document.body.innerHTML = `
<x-foo>1</x-foo>
<x-foo>2</x-foo>
<x-foo>3</x-foo>
<div is="y-foo">4</div>
<div is="y-foo">5</div>
<div is="y-foo">6</div>
`;
```

### 添加 `Web` 组件的内容

```js
class FooElement extends HTMLElement {
  constructor() {
    super();
    // 在创建元素实例或将已有 DOM 元素升级为自定义元素时调用
    // this 引用 Web 组件节点
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<p>我是内部元素<p>`;
  }
  // 生命周期函数
	// 每次将这个自定义元素实例添加到 DOM 中调用
  connectedCallback() {}
	// 每次将这个自定义元素实例从 DOM 中移除时调用
  disconnectedCallback() {}
	// 在每次可观察属性的值发生变化时调用，在元素实例初始化时，初始值的定义也算一次变化
  attributeChangedCallback() {}
	// 在通过 document.adoptNode() 将这个自定义元素实例移动到新文档对象时调用
  adoptedCallback() {}
  get bar() {} // 获取属性时触发
  set bar() {} // 设置属性时触发
  static get observedAttributes() {
    // 让自定义元素的属性值每次改变时都调用
    return ['bar', ...]
  }
}
customElements.define('x-foo', FooElement);
document.body.innerHTML = `<x-foo></x-foo>`;
```

### 升级自定义元素

并不一定需要先定义自定义元素，然后再在 `DOM` 中使用相应的元素标签

连接到 `DOM` 的元素在自定义元素有定义时会**自动升级**

```js
// 返回一个期约，当相应的自定义元素定义之后解决
customElements.whenDefined('x-foo').then(() => console.log('defined!'));
console.log(customElements.get('x-foo'));
// undefined
customElements.define('x-foo', class {});
// defined!
console.log(customElements.get('x-foo'));
// class FooElement {} 

// 在自定义元素有定义之前会创建 HTMLUnknownElement 对象
const fooElement = document.createElement('x-foo');
// 创建自定义元素
class FooElement extends HTMLElement {}
customElements.define('x-foo', FooElement);
console.log(fooElement instanceof FooElement); // false
// 强制升级
customElements.upgrade(fooElement);
console.log(fooElement instanceof FooElement); // true
```
---
title: 47-DOM扩展
image: /img/hbs.png
description: JavaScript DOM 扩展
date: 2021-01-21 17:09:04
---

[[toc]]

## 元素获取扩展

### `querySelector()`

返回匹配该模式的**第一个**后代元素

如果没有匹配项则返回 `null`

### `querySelectorAll()`

返回所有匹配的节点

### `element.matches()`

检测该元素是否会被前两个方法获取

返回布尔值

所有的主流浏览器都支持

## 元素遍历扩展

`childElementCount` 返回子元素数量（不包含文本节点和注释）

`firstElementChild` 指向第一个 `Element` 类型的子元素（`Element` 版 `firstChild`）

`lastElementChild` 指向最后一个 `Element` 类型的子元素（`Element` 版 `lastChild`）

`previousElementSibling` 指向前一个 `Element` 类型的同胞元素（ `Element` 版 `previousSibling`）

`nextElementSibling` 指向后一个 `Element` 类型的同胞元素（`Element` 版 `nextSibling`）

## `CSS` 扩展

**`element.className`**，返回该元素的 `class` 属性的值

**`element.classList`**，返回该类名组成的列表(`DOMTokenList`)
  - `add(value)`，向类名列表中添加指定的字符串值 `value`。如果这个值已经存在，则什么也不做
  - `contains(value)`，返回布尔值，表示给定的 `value `是否存在
  - `remove(value)`，从类名列表中删除指定的字符串值 `value`
  - `toggle(value)`，如果类名列表中已经存在指定的 `value`，则删除；如果不存在，则添加

## 焦点管理

`element.focus()` 元素聚焦

`document.hasFocus()` 判断该文档是否拥有焦点

## `HTMLDocument` 扩展

**`document.readyState`**
  - `loading` 表示文档正在加载
  - `complete` 表示文档加载完成

**`document.compatMode`**
  - `CSS1Compat` 标准模式
  - `BackCompat` 混杂模式

**`document.head`**，获取 `<head>` 元素

**`document.characterSet`**
  - 可以获取当前文档实际使用的字符集
  - 也可以用来指定新的字符集

**`element.dataset`**
  - `html` 代码中使用 `data-name` 属性定义数据
  - `js` 代码中使用 `element.dataset[name]` 获取数据

**`element.innerHTML`**
  - 读取/写入元素后代的 `HTML` 字符串
  - 现代浏览器，插入 `<script>` 标签不会执行

## 跨站点脚本 `XSS`

`innerHTML` 虽然不会执行 `<script>` 标签，但是可以创建并执行元素的 `onclick` 之类的属性

### `element.outerHTML`

读取/写入该元素自身及其后代的 `HTML` 字符串

### `element.insertAdjacentHTML()` 与 `element.insertAdjacentText()`

最早源自 `IE`

接受两个参数：要插入标记的位置和要插入的 `HTML` 或文本

第一个参数：
  - `beforebegin` 插入当前元素前面，作为前一个同胞节点
  - `afterbegin` 插入当前元素内部，作为新的子节点或放在第一个子节点前面
  - `beforeend` 插入当前元素内部，作为新的子节点或放在最后一个子节点后面
  - `afterend` 插入当前元素后面，作为下一个同胞节点

第二个参数作为 `HTML` 字符串解析或者作为纯文本解析

### `element.innerText` 与 `element.outerText`

读取该元素内部的文本

写入时 `outerText` 会替换整个元素

### `element.scrollIntoView(aliginToTop | obj)`

`aliginToTop` 布尔值：
  - `true` 窗口滚动后，**元素的顶部与视口的顶部对齐**
  - `false` 窗口滚动后，**元素的底部与视口的底部对齐**

`obj`：
  - `behavior` 过渡动画，`smooth || auto`，默认 `auto`
  - `block` 定义垂直方向的对齐，`start || center || end || nearest`，默认`nearest`
  - `inline` 定义水平方向的对齐，`start || center || end || nearest`，默认`nearest`

不传参数默认为 `true`

```js
element.scrollIntoView({ behavior: 'smooth', block: 'start' });
// 将元素平滑地滚入视口
```

## 专有扩展

### `children` 属性

`IE9` 之前的版本与其他浏览器在处理空白文本节点上的差异导致了 `children` 属性的出现

`children` 属性是一个 `HTMLCollection`，只包含元素的 `Element` 类型的子节点

**如果元素的子节点类型全部是元素类型，那 `children` 和 `childNodes` 中包含的节点应该是一样的**

### `element.contains(target)`

判断目标节点是否为被搜索节点的后代，返回布尔值

### `element.compareDocumentPosition(target)`

用法同上，返回掩码：
  - `0x1` 传入的节点不在文档中
  - `0x2` 位于参考节点之前
  - `0x4` 位于参考节点之后
  - `0x8` 传入节点是参考节点的祖先
  - `0x10` 传入节点是参考节点的后代

```js
let result = document.documentElement.compareDocumentPosition(document.body);
console.log(!!(result & 0x10)); // true
```
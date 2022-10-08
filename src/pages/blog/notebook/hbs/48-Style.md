---
title: 48-样式
image: /img/hbs.png
description: JavaScript Style
date: 2021-01-22 10:03:31
---

[[toc]]

## 存取元素样式

### `element.style`

`.propName` 获取/设置属性，属性名为**小驼峰**命名法

`.cssText` 包含 `style` 属性中的 `CSS` 代码

`.length` 应用给元素的 `CSS` 属性的数量

`.parentRule` 表示 `CSS` 信息的 `CSSRule` 对象

`.getPropertyPriority(propertyName)` 如果该属性使用了 `!important` 属性则返回 `'important'` 否则返回空字符串

`.getPropertyValue(propertyName)` 返回属性对应的值

`.item(index)`，返回索引为 `index` 的 `CSS` 属性名

`.removeProperty(propertyName)`，从样式中删除 `CSS` 属性 `propertyName`

`.setProperty(propertyName, value, priority)`，设置 `CSS` 属性 `propertyName` 的值为 `value`，`priority` 是 `"important"` 或空字符串

## 计算样式

`document.defaultView === window`

`window.getComputedStyle(element, '伪元素字符串')`

获取最终的样式

**所有浏览器中计算样式都是只读的**，不能修改 `getComputedStyle()` 方法返回的对象

## 样式表

`document.styleSheets` 获取所有样式表的集合

`sheet.disabled` 布尔值，表示是否被禁用了

`sheet.href` 如果是使用 `<link>` 返回样式表的 `URL`，否则返回 `null`

`sheet.media` 样式表支持的媒体类型集合

`sheet.ownerNode` 指向拥有当前样式表的节点

`sheet.parentStyleSheet` 如果当前样式表是通过 `@import` 被包含在另一个样式表中，则这个属性指向导入它的样式表

`sheet.title`，`ownerNode` 的 `title` 属性

`sheet.type` 字符串，表示样式表的类型

`sheet.cssRules` 当前样式表包含的样式规则的集合

`sheet.ownerRule` 如果样式表是使用 `@import` 导入的，则指向导入规则；否则为 `null`

`sheet.deleteRule(index)` 在指定位置删除 `cssRules` 中的规则

`sheet.insertRule(rule, index)`，在指定位置向 `cssRules` 中插入规则

```js
let sheet = document.styleSheets[0];
let rules = sheet.cssRules || sheet.rules; // 取得规则集合
let rule = rules[0]; // 取得第一条规则
console.log(rule.selectorText); // "div.box"
console.log(rule.style.cssText); // 完整的 CSS 代码
console.log(rule.style.backgroundColor); // "blue"
console.log(rule.style.width); // "100px"
console.log(rule.style.height); // "200px" 
```

## `NodeIterator`

`document.createNodeIterator(root, whatToShow, filter)`

`whatToShow`：
  - `NodeFilter.SHOW_ALL`，所有节点
  - `NodeFilter.SHOW_ELEMENT`，元素节点
  - `NodeFilter.SHOW_ATTRIBUTE`，属性节点(无用)
  - `NodeFilter.SHOW_TEXT`，文本节点
  - `NodeFilter.SHOW_CDATA_SECTION`，`CData` 区块节点
  - `NodeFilter.SHOW_ENTITY_REFERENCE`，实体引用节点
  - `NodeFilter.SHOW_ENTITY`，实体节点
  - `NodeFilter.SHOW_PROCESSING_INSTRUCTION`，处理指令节点
  - `NodeFilter.SHOW_COMMENT`，注释节点
  - `NodeFilter.SHOW_DOCUMENT`，文档节点
  - `NodeFilter.SHOW_DOCUMENT_TYPE`，文档类型节点
  - `NodeFilter.SHOW_DOCUMENT_FRAGMENT`，文档片段节点
  - `NodeFilter.SHOW_NOTATION`，记号节点
  - 除了 `NodeFilter.SHOW_ALL` 之外，都可以组合使用

```js
let div = document.getElementById("div1");
let filter = function(node) {
	return node.tagName.toLowerCase() == "li"
		? NodeFilter.FILTER_ACCEPT
		: NodeFilter.FILTER_SKIP;
};
let iterator = document.createNodeIterator(div, NodeFilter.SHOW_ELEMENT, filter, false);
let node = iterator.nextNode();
while (node !== null) {
	console.log(node.tagName); // 输出标签名
	node = iterator.nextNode();
} 
```

## `TreeWalker`

`walker.parentNode()` 遍历到当前节点的父节点

`walker.firstChild()` 遍历到当前节点的第一个子节点

`walker.lastChild()` 遍历到当前节点的最后一个子节点

`walker.nextSibling()` 遍历到当前节点的下一个同胞节点

`walker.previousSibling()` 遍历到当前节点的上一个同胞节点

```js
let walker = document.createTreeWalker(div, NodeFilter.SHOW_ELEMENT, filter, false);
let node = iterator.nextNode();
while (node !== null) {
	console.log(node.tagName); // 输出标签名
	node = iterator.nextNode();
} 
```

## `DOM` 范围

`range.startContainer` 范围起点所在的节点，选区中第一个子节点的父节点

`range.startOffset` 范围起点在 `startContainer` 中的偏移量。如果 `startContainer` 是文本节点、注释节点或 `CData` 区块节点，则 `startOffset` 指范围起点之前跳过的字符数；否则，表示范围中第一个节点的索引

`range.endContainer`，范围终点所在的节点

`range.endOffset`，范围起点在 `startContainer` 中的偏移量

`range.commonAncestorContainer`，文档中以 `startContainer` 和 `endContainer` 为后代的最深的节点

`range.selectNode(element)` 选择整个节点及其后代节点

`range.selectNodeContents(element)` 选择节点的后代节点

`range.setStartBefore(ref)` 把范围起点设置到 `ref` 之前，使其成为选区的第一个子节点

`range.setStartAfter(ref)` 把范围起点设置到 `ref` 之后，将其排除在选区之外

`range.setEndBefore(ref)` 把范围终点设置到 `ref` 之前，将其排除在选区之外

`range.setEndAfter(ref)` 把范围终点设置到 `ref` 之后，使其成为选区的最后一个子节点

`range.setStart(ref, offset)`

`range.setEnd(ref, offset)`

`range.deleteContents()` 从文档中删除范围包含的节点

`range.extractContents()` 从文档中移除范围选区，返回范围对应的文档片段

`range.cloneContents()` 返回范围对应的文档片段的副本

`range.insertNode(element)` 向范围中插入内容

`range.surroundContents()` 插入包含范围的内容

`range.collapse(position)`：
  - `true` 折叠到起点
  - `false` 折叠到终点
  - `range.collapsed` 返回折叠属性

`range.compareBoundaryPoints()` 范围比较

`range.cloneRange()` 复制范围

`range.detach()` 从文档中剥离范围

```js
let range = document.createRange();
```
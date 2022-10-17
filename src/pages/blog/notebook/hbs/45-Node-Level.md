---
title: 45-节点层级
image: /img/hbs.png
description: JavaScript 节点层级
date: 2021-01-20 17:41:10
---

[[toc]]

## 节点类型

JavaScript 中的所有节点类型都继承自 Node 类型

共享相同的基本属性和方法

每个节点都有一个 `nodeType` 属性，用于表明节点的类型

**任何节点的类型都必将属于以下12个类型之一**

对于元素节点 `nodeName` 始终保存的是元素的标签名，`nodeValue` 始终为 `null`

每个节点都有一个 `childNodes` 属性，其中保存着一个 `NodeList` 对象

`NodeList` 对象是**类数组对象**，用于保存一组有序的节点

可使用 `[number]` 也可使用 `.item(number)` 访问

```js
Node.ELEMENT_NODE === 1;
Node.ATTRIBUTE_NODE === 2;
Node.TEXT_NODE === 3;
Node.CDATA_SECTION_NODE === 4;
Node.ENTITY_REFERENCE_NODE === 5;
Node.ENTITY_NODE === 6;
Node.PROCESSING_INSTRUCTION_NODE === 7;
Node.COMMENT_NODE === 8;
Node.DOCUMENT_NODE === 9;
Node.DOCUMENT_TYPE_NODE === 10;
Node.DOCUMENT_FRAGMENT_NODE === 11;
Node.NOTATION_NODE === 12;
```

## 节点之间的关系

`firstChild` 第一个子节点

`lastChild` 最后一个子节点

`parentNode` 父节点

`nextSibling` 后一个兄弟节点

`previousSibling` 前一个兄弟节点

`hasChildNodes()` 是否存在子节点

## 操作节点

`appendChild(node)` 向 `NodeList` 列表末尾插入一个节点并返回该节点

`insertBefore(new, old)` 插入参考节点之前并返回该节点

`replaceChild(new, old)` 以旧换新

`removeChild(node)` 删除子节点

`cloneNode(deep = false)` 复制（传入 `true` 深复制）节点，不复制事件处理

`normalize()` 处理子节点中的**文本节点**：
  - 如果发现空节点，将其删除
  - **如果两个同胞节点是相邻的，将其合并为一个**

## `document`

在浏览器中 `document` 对象是 `HTMLDocument` 的一个实例

表示整个页面

`nodeType = 9`

`nodeName = "#document"`

`nodeValue = null`

`parentNode = null`

`ownerDocument = null`

子节点可以是 `DocumentType`（最多一个）、`Element`（最多一个）、`ProcessingInstruction` 或 `Comment` 类型

### 属性

`document.documentElement` 始终指向 `<html>` 元素

`document.body` 指向 `<body>` 元素

`document.doctype` 获取 `doctype` 属性

`document.title` 获取网页标题

`document.location` 指向 `location` 对象

`document.URL` 获取完整的 `URL`

`document.domain` 获取当前域名，**可设置**
  - 二级域名 -> 一级域名 -x- 二级域名
  - 将不同的二级域名都修改为相同的顶级域名之后，就可以相互通信了(*即将被禁用*)

`document.referrer` 获取来源

### 获取元素(定位)的方法

`getElementById` 通过 `id` 属性获取，返回实例

`getElementsByTagName` 通过标签名获取，返回数组

`getElementsByTagNameNS`

`getElementsByName` 通过 `name` 属性获取，返回数组

`getElementsByClassName` 通过 `class` 属性获取，返回数组

`anchors` 获取所有具有 `name` 属性的 `a` 元素，返回数组

`forms` 获取所有 `form` 元素，返回数组

`images` 获取所有 `img` 元素，返回数组

`links` 获取所有带 `href` 特性的 `a` 元素，返回数组

仿 `JQuery`：
  - `querySelector`，获取对应实例
  - `querySelectorAll`，获取对应实例组成的数组

### 文档写入的方法

`write` 写入

`writeln` 写入并换行

`open` 打开输入流，清空屏幕

`close` 关闭输出流，下次写入将覆盖

## `Element`

用于表现页面元素

`nodeType = 1`

`nodeName = 元素名`

`nodeValue = null`

`parentNode = Document or Element`

### 属性

`tagName, nodeName` 标签名

`id` 唯一标识符

`title` 说明

`lang` 语言

`dir` 文字方向

`className` 类名

`attributes` 属性对象，类数组

**操作属性**
  - `getAttribute(key)` 获取键名对应的属性，不存在返回 `null`
  - `setAttribute(key, value)` 设置键名对应的键值，存在则更新，不存在则创建
  - `removeAttribute(key)` 删除键名对应的键值

**`attributes`**
  - 返回 `NamedNodeMap` 实例
  - `getNamedItem(name)`，返回 `nodeName` 属性等于 `name` 的节点
  - `removeNamedItem(name)`，删除 `nodeName` 属性等于 `name` 的节点
  - `setNamedItem(node)`，向列表中添加 `node` 节点，以其 `nodeName` 为索引
  - `item(pos)`，返回索引位置 `pos` 处的节点

**创建元素** `document.createElement(tagname or htmlstring)`

**元素后代**
  - `element.childNodes`
  - 包含元素所有的子节点，这些子节点可能是其他元素、文本节点、注释或处理指令

## Text

`nodeType = 3`

`nodeName = "#text"`

`nodeValue = 节点所包含的文本`

`parentNode = Element`

**不支持子节点**

`Text` 节点中包含的文本可以通过 `nodeValue` 属性访问，也可以通过 `data` 属性访问，这两个属性包含相同的值

修改 `nodeValue` 或 `data` 的值，也会在另一个属性反映出来

### 文本操作

`appendData(text)`，向节点末尾添加文本 `text`

`deleteData(offset, count)`，从位置 `offset` 开始删除 `count` 个字符

`insertData(offset, text)`，在位置 `offset` 插入 `text`

`replaceData(offset, count, text)`，用 `text` 替换从位置 `offset` 到 `offset` + `count` 的文本

`splitText(offset)`，在位置 `offset` 将当前文本节点拆分为两个文本节点

`substringData(offset, count)`，提取从位置 `offset` 到 `offset`+ `count` 的文本

**创建文本节点** `document.createTextNode(string or htmlstring)`

### 拆分文本节点

`ellement.splitText(offset)`

在指定的偏移位置拆分文本节点，一分为二，返回偏移位置至结尾的文本节点

```js
let element = document.createElement("div");
element.className = "message";
let textNode = document.createTextNode("Hello world!");
element.appendChild(textNode);
document.body.appendChild(element);
let newNode = element.firstChild.splitText(5);
alert(element.firstChild.nodeValue); // "Hello"
alert(newNode.nodeValue); // " world!"
alert(element.childNodes.length); // 2
```

## `Comment`

注释节点，**必须是 `<html>` 元素的后代**

`nodeType = 8`

`nodeName = "#comment"`

`nodeValue = 注释的内容`

`parentNode = Document or Element`

**不支持子节点**

与 `Text` 同基类(操作方法大同小异)

## `CDATASection`

**只在 `XML` 中有效**，用于存储数据

`nodeType = 4`

`nodeName = "#cdata-section"`

`nodeValue = CDATA 区块的内容`

`parentNode = Document or Element`

不支持子节点

## `DocumentType` 

`nodeType = 10`

`nodeName = "文档类型的名称"`

`nodeValue = null`

`parentNode = Document对象`

不支持子节点

## `DocumentFragment` 

文档片段(“轻量级”文档)

`nodeType = 11`

`nodeName = "#document-fragment"`

`nodeValue = null`

`parentNode = null`

子节点可以是 `Element`、`ProcessingInstruction`、`Comment`、`Text`、`CDATASection` 或 `EntityReference`

**不能直接把文档片段添加到文档**

文档片段**不会被渲染**

类似于**虚拟DOM**的操作

```js
let fragment = document.createDocumentFragment();
let ul = document.getElementById("myList");
for (let i = 0; i < 3; ++i) {
  let li = document.createElement("li");
  li.appendChild(document.createTextNode(`Item ${i + 1}`));
  fragment.appendChild(li);
}
ul.appendChild(fragment); 
```

## `Attr`

`nodeType = 2`

`nodeName = "属性名"`

`nodeValue = 属性值`

`parentNode = null`

在 `HTML` 中不支持子节点

在 `XML` 中子节点可以是 `Text` 或 `EntityReference`

不推荐使用

```js
let attr = document.createAttribute("align");
attr.value = "left";
element.setAttributeNode(attr); 
```
---
title: 46-DOM编程
image: /img/hbs.png
description: JavaScript DOM 编程
date: 2021-01-21 14:03:36
---

[[toc]]

## 动态脚本

`<script>` 元素用于向网页中插入 `JavaScript` 代码

可以是 `src` 属性包含的外部文件

也可以是作为该元素内容的源代码

动态脚本就是在**页面加载之后使用脚本额外加载**的代码

```js
function loadScriptString(code){
   var script = document.createElement("script");
   script.type = "text/javascript";
   try {
      script.appendChild(document.createTextNode(code));
   } catch (e){
      script.text = code;
   }
   document.body.appendChild(script);
}
loadScriptString("function sayHi(){alert('hi');}"); 
```

## 动态样式

`<link>` 标签动态引入

`<style>` 标签动态写入

```js
function loadStyles(url){
   let link = document.createElement("link");
   link.rel = "stylesheet";
   link.type = "text/css";
   link.href = url;
   let head = document.getElementsByTagName("head")[0];
   head.appendChild(link);
} 
loadStyles("styles.css"); 
function loadStyleString(css){
   let style = document.createElement("style");
   style.type = "text/css";
   try{
      style.appendChild(document.createTextNode(css));
   } catch (ex){
      style.styleSheet.cssText = css;
   }
   let head = document.getElementsByTagName("head")[0];
   head.appendChild(style);
} 
loadStyleString("body{background-color:red}"); 
```

## 动态表格

```js
// 创建表格
let table = document.createElement("table");
table.border = 1;
table.width = "100%";
// 创建表体
let tbody = document.createElement("tbody");
table.appendChild(tbody);
// 创建第一行
let row1 = document.createElement("tr");
tbody.appendChild(row1);
let cell1_1 = document.createElement("td");
cell1_1.appendChild(document.createTextNode("Cell 1,1"));
row1.appendChild(cell1_1);
let cell2_1 = document.createElement("td");
cell2_1.appendChild(document.createTextNode("Cell 2,1"));
row1.appendChild(cell2_1);
// 创建第二行
let row2 = document.createElement("tr");
tbody.appendChild(row2);
let cell1_2 = document.createElement("td");
cell1_2.appendChild(document.createTextNode("Cell 1,2"));
row2.appendChild(cell1_2);
let cell2_2= document.createElement("td");
cell2_2.appendChild(document.createTextNode("Cell 2,2"));
row2.appendChild(cell2_2);
// 把表格添加到文档主体
document.body.appendChild(table); 
```

### `<table>` 元素的属性及方法

`caption` 指向 `<caption>` 元素的指针(如果存在)

`tBodies` 包含 `<tbody>` 元素的集合

`tFoot` 指向 `<tfoot>` 元素

`tHead` 指向 `<thead>` 元素

`rows` 包含表示所有行的集合

`createTHead()` 创建 `<thead>` 元素，放到表格中，返回引用

`createTFoot()` 创建 `<tfoot>` 元素，放到表格中，返回引用

`createCaption()` 创建 `<caption>` 元素，放到表格中，返回引用

`deleteTHead()` 删除 `<thead>` 元素

`deleteTFoot()` 删除 `<tfoot>` 元素

`deleteCaption()` 删除 `<caption>` 元素

`deleteRow(index)` 删除指定位置的行

`insertRow(index)` 在指定位置插入一行

### `<tbody>` 元素的属性及方法

`rows` 包含 `<tbody>` 元素中所有行的集合

`deleteRow(index)` 删除指定行

`insertRow(index)` 在指定位置插入一行，返回该行的引用

### `<tr>` 元素的属性及方法

`cells` 包含 `<tr>` 元素所有表元的集合

`deleteCell(index)` 删除指定位置的表元

`insertCell(index)` 在指定位置插入一个表元，返回该表元的引用

```js
let table = document.createElement("table");
table.border = 1;
table.width = "100%";
// 创建表体
let tbody = document.createElement("tbody");
table.appendChild(tbody);
// 创建第一行
tbody.insertRow(0);
tbody.rows[0].insertCell(0);
tbody.rows[0].cells[0].appendChild(document.createTextNode("Cell 1,1"));
tbody.rows[0].insertCell(1);
tbody.rows[0].cells[1].appendChild(document.createTextNode("Cell 2,1"));
// 创建第二行
tbody.insertRow(1);
tbody.rows[1].insertCell(0);
tbody.rows[1].cells[0].appendChild(document.createTextNode("Cell 1,2"));
tbody.rows[1].insertCell(1);
tbody.rows[1].cells[1].appendChild(document.createTextNode("Cell 2,2"));
// 把表格添加到文档主体
document.body.appendChild(table); 
```

## `NodeList`

基于 `DOM` 文档的**实时查询**

文档结构的变化会**实时**地在它们身上反映出来

任何时候要迭代 `NodeList`，最好再**初始化一个变量**保存当时查询时的长度，然后用循环变量与这个变量进行比较

```js
let divs = document.getElementsByTagName("div");
for (let i = 0, len = divs.length; i < len; ++i) {
   let div = document.createElement("div");
   document.body.appendChild(div);
} 
```

## `MutationObserver`

可以在 `DOM` 被修改时异步执行回调

```js
let observer = new MutationObserver(() => console.log('<body> attributes changed'));
observer.observe(document.body, { attributes: true }); 
document.body.className = 'foo';
console.log('Changed body class');
// Changed body class
// <body> attributes changed 
```

### 回调与 `MutationRecord`

```js
let observer = new MutationObserver((mutationRecords) => console.log(mutationRecords));
observer.observe(document.body, { attributes: true });
document.body.className = 'foo';
document.body.className = 'bar';
document.body.className = 'baz'; 
// [MutationRecord, MutationRecord, MutationRecord] 
```

### 实例属性

`target` 被修改影响的目标节点

`type` 字符串，表示变化类型

`oldValue` 如果在 `MutationObserverInit` 对象中启用（`attributeOldValue `或 `characterData ` `OldValue` 为 `true`），"`attributes`"或"`characterData`"的变化事件会设置这个属性为被替代的值 "`childList`"类型的变化始终将这个属性设置为 `null`

`attributeName` 对于"`attributes`"类型的变化，这里保存被修改属性的名字其他变化事件会将这个属性设置为 `null`

`attributeNamespace` 对于使用了命名空间的"`attributes`"类型的变化，这里保存被修改属性的名字其他变化事件会将这个属性设置为 `null`

`addedNodes` 对于"`childList`"类型的变化，返回包含变化中添加节点的 `NodeList` 默认为空 `NodeList`

`removedNodes` 对于"`childList`"类型的变化，返回包含变化中删除节点的 `NodeList` 默认为空 `NodeList`

`previousSibling` 对于"`childList`"类型的变化，返回变化节点的前一个同胞 `Node` 默认为 `null`

`nextSibling` 对于"`childList`"类型的变化，返回变化节点的后一个同胞 `Node` 默认为 `null`

### 提前结束观察

`observer.disconnect()`

### 复用 `MutationObserver`

多次调用 `observe()` 方法，可以复用一个 `MutationObserver` 对象观察多个不同的目标节点

```js
let observer = new MutationObserver((mutationRecords) => console.log(mutationRecords.map((x) => x.target)));
// 向页面主体添加两个子节点
let childA = document.createElement('div'),
 childB = document.createElement('span');
document.body.appendChild(childA);
document.body.appendChild(childB);
// 观察两个子节点
observer.observe(childA, { attributes: true });
observer.observe(childB, { attributes: true }); 
```

### 重用 `MutationObserver`

**调用 `disconnect()` 并不会结束 `MutationObserver` 的生命**

```js
let observer = new MutationObserver(() => console.log('<body> attributes changed'));
observer.observe(document.body, { attributes: true });
// 这行代码会触发变化事件
document.body.setAttribute('foo', 'bar');
setTimeout(() => {
   observer.disconnect();
   // 这行代码不会触发变化事件
   document.body.setAttribute('bar', 'baz');
}, 0);
setTimeout(() => {
   // Reattach
   observer.observe(document.body, { attributes: true });
   // 这行代码会触发变化事件
   document.body.setAttribute('baz', 'qux');
}, 0);
// <body> attributes changed
// <body> attributes changed 
```

### 初始化对象与观察范围

**初始化对象的属性**
   - `subtree` 布尔值，表示除了目标节点，是否观察目标节点的子树（后代）
      - 如果是 false，则只观察目标节点的变化
      - 如果是 true，则观察目标节点及其整个子树 默认为 false
   - `attributes` 布尔值，表示是否观察目标节点的属性变化，默认为 false
   - `attributeFilter` 字符串数组，表示要观察哪些属性的变化；把这个值设置为 true 也会将 attributes 的值转换为 true，默认为观察所有属性
   - `attributeOldValue` 布尔值，表示 `MutationRecord` 是否记录变化之前的属性值；把这个值设置为 true 也会将 attributes 的值转换为 true，默认为 false
   - `characterData` 布尔值，表示修改字符数据是否触发变化事件；默认为 false
   - `characterDataOldValue` 布尔值，表示 `MutationRecord` 是否记录变化之前的字符数据，把这个值设置为 true 也会将 `characterData` 的值转换为 true，默认为 false
   - `childList` 布尔值，表示修改目标节点的子节点是否触发变化事件，默认为 false

在调用 `observe()` 时，`MutationObserverInit` 对象中的 **`attribute`、`characterData `和 `childList` 属性必须至少有一项为 `true`**（无论是直接设置这几个属性，还是通过设置 `attributeOldValue` 等属性间接导致它们的值转换为 true）。否则会抛出错误，因为没有任何变化事件可能触发回调

#### 观察属性

```js
let observer = new MutationObserver((mutationRecords) => console.log(mutationRecords));
observer.observe(document.body, { attributes: true });
// 添加属性
document.body.setAttribute('foo', 'bar');
// 修改属性
document.body.setAttribute('foo', 'baz');
// 移除属性
document.body.removeAttribute('foo');
// 以上变化都被记录下来了
// [MutationRecord, MutationRecord, MutationRecord] 

observer.observe(document.body, { attributeFilter: ['foo'] });
// 添加白名单属性
document.body.setAttribute('foo', 'bar');
// 添加被排除的属性
document.body.setAttribute('baz', 'qux'); 
// 只有 foo 属性的变化被记录了
// [MutationRecord] 
```

#### 观察字符数据

```js
let observer = new MutationObserver((mutationRecords) => console.log(mutationRecords));
// 创建要观察的文本节点
document.body.firstChild.textContent = 'foo';
observer.observe(document.body.firstChild, { characterData: true });
// 赋值为相同的字符串
document.body.firstChild.textContent = 'foo';
// 赋值为新字符串
document.body.firstChild.textContent = 'bar';
// 通过节点设置函数赋值
document.body.firstChild.textContent = 'baz';
// 以上变化都被记录下来了
// [MutationRecord, MutationRecord, MutationRecord] 
```

### 记录队列

每次 `MutationRecord` 被添加到 `MutationObserver` 的记录队列时，仅当之前没有已排期的微任务回调时（队列中微任务长度为 0），才会将观察者注册的回调（在初始化 `MutationObserver` 时传入）作为微任务调度到任务队列上

这样可以保证记录队列的内容不会被回调处理两次

`observe.takeRecords()` 清空记录队列，取出并返回其中的所有 `MutationRecord` 实例
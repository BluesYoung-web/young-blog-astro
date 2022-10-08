---
title: 55-表单
image: /img/hbs.png
description: JavaScript 表单
date: 2021-01-25 10:43:21
---


## `<form>`

`HTMLFormElement extends HTMLElement`

`document.forms` 获取页面中的所有表单元素

### 属性及方法

`accecptCharset` 服务器可以接收的字符集，等价于 `accept-charset` 属性

`action` 请求的 `URL`，等价于 `HTML `的 `action `属性

`elements` 表单中所有控件的 `HTMLCollection`

`enctype` 请求的编码类型，等价于 `enctype` 属性

`length` 表单中控件的数量

`method` 请求方法，等价于 `method` 属性

`name` 表单的名字，等价于 `name` 属性

**因为浏览器的向后兼容 `form.elements.name`，所以 `form.name` 可能会存在歧义**

`reset()` 重置表单

`submit()` 提交表单

`target` 用于发送请求和接收响应的窗口的名字，等价于 `target` 属性

### 表单提交

```html
<!-- 通用提交按钮 -->
<input type="submit" value="Submit Form" />
<!-- 自定义提交按钮 -->
<button type="submit">Submit Form</button>
<!-- 图片按钮 -->
<input type="image" src="graphic.gif" /> 
<!-- e.preventDefault() 可以阻止默认的提交 -->
```

### 表单重置

```html
<!-- 通用重置按钮 -->
<input type="reset" value="Reset" />
<!-- 自定义重置按钮 -->
<button type="reset">Reset Form</button> 
```

### 表单字段

表单元素可以像页面中的其他元素一样使用原生 `DOM `方法来访问

`form.elements[index] === form.elements[eleName]`

**公共属性**
  - 除了 `<fieldset>` 元素之外，所有表单字段都有一组同样的属性：
  - `disabled` 布尔值，表示表单字段是否禁用
  - `form` 指针，指向所属表单，**只读**
  - `name` 字符串，字段名
  - `readOnly` 布尔值，表示这个字段是否只读
  - `tabIndex` 数值，表示这个字段在按 `Tab` 键时的切换顺序
  - `type` 字符串，表示字段类型
  - `value` 要提交给服务器的字段值，**文件输入时只读**

**公共方法**
  - `element.focus()` 聚焦，`autofocus` 属性
  - `element.blur()` 失焦

**公共事件**
  - `blur` 失焦时触发
  - `change` 发生变化时触发
  - `focus` 获得焦点时触发

## `<input>`

创建单行输入框(`type="text"`)

`size` 指定宽度，以字符数计量

`value` 指定初始值

`maxlength` 指定文本框允许的最多的字符数

```html
<input type="text" size="25" maxlength="50" value="initial value" />
```

## `<textarea>`

输入文本域

`rows` 指定文本框的高度，以字符数计量

`cols` 指定文本框的宽度，以字符数计量

默认值必须包含在内部

```html
<textarea>默认值</textarea>
```

## 文本操作

```js
// 选取文本
ele.addEventListener('focus', (e) => {
  e.target.select();
});

// 获取选中的文本
function getSelectedText(element) {
  const value = element.value;
  // 设置选中范围
  element.setSelectionRange(selectionStart, selectionStart);
  // 开始偏移地址，结束偏移地址
	return value.substring(element.selectionStart, element.selectionEnd);
}

// 屏蔽特定字符的输入
element.addEventListener("keypress", (event) => {
 if (
   !/\d/.test(String.fromCharCode(event.charCode))
   &&
   event.charCode > 9
   &&
   !event.ctrlKey
  ) {
  event.preventDefault();
 }
});
```

## 剪切板

`beforecopy` 复制之前

`copy` 复制之时

`beforecut` 剪切之前

`cut` 剪切之后

`beforepaste` 粘贴之前

`paste` 粘贴之后

```js
function getClipboardText(event){
 var clipboardData = (event.clipboardData || window.clipboardData);
 return clipboardData.getData("text");
}
function setClipboardText (event, value){
 if (event.clipboardData){
 return event.clipboardData.setData("text/plain", value);
 } else if (window.clipboardData){
 return window.clipboardData.setData("text", value);
 }
}
textbox.addEventListener("paste", (event) => {
 let text = getClipboardText(event);
 if (!/^\d*$/.test(text)){
 	event.preventDefault(); 
 }
});
```

## 自动切换

- 输入一定字符数之后，自动切换到下一个

```html
<input type="text" name="tel1" id="txtTel1" maxlength="3">
<input type="text" name="tel2" id="txtTel2" maxlength="4">
<input type="text" name="tel3" id="txtTel3" maxlength="4"> 
<script>
function tabForward(event){
	const target = event.target;
	// 到达最大输入的长度
	if (target.value.length === +target.maxLength){
		const form = target.form;
		for (let i = 0, len = form.elements.length; i < len; i++) {
			if (form.elements[i] === target) {
				form.elements[i+1]?.focus();
				return;
			}
		}
	}
}
const inputIds = ["txtTel1", "txtTel2", "txtTel3"];
for (const id of inputIds) {
	let textbox = document.getElementById(id);
	textbox.addEventListener("keyup", tabForward);
}
let textbox1 = document.getElementById("txtTel1");
let textbox2 = document.getElementById("txtTel2");
let textbox3 = document.getElementById("txtTel3");
</script>
```

## `H5` 约束验证 `API`

### 必填字段

给表单字段添加 `required` 属性 `<input type="text" name="username" required>`

任何带有 `required` 属性的字段都必须有值，否则无法提交表单

适用于 `input | textarea | select`

```js
// 检测浏览器是否支持 required 属性：
let isRequiredSupported = "required" in document.createElement("input"); 
// 检测对应元素的 required 属性来判断表单字段是否为必填：
let isUsernameRequired = document.forms[0].elements["username"].required; 
```

### 更多输入类型

**`email | url`**
- 浏览器提供自定义验证，不过不怎么可靠
- 老版本浏览器会自动将未知类型值设置为 "text"

**数值**，`<input type="number" min="0" max="100" step="5" name="count" />`

`range` 滑动条

`datetime | datetime-local` 日期时间控件

`date` 日期控件

`month` 月份控件

`week` 周控件

`time` 时间控件

### 表单校验

**`<input type="text" pattern="\d+" name="count">`**
- `pattern` 属性，指定正则表达式
- 假设开头结尾有 `^$`，输入内容必须从头到尾都严格与模式匹配

**有效性检测**
- `element.checkValidity()`
- 根据之前的约束进行判断
- 返回布尔值

**`element.validity`**
- `.customError` 如果设置了 `setCustomValidity()` 就返回 `true`，否则返回 `false`
- `.patternMismatch` 如果字段值不匹配指定的 `pattern` 属性则返回 `true`
- `.rangeOverflow` 如果字段值大于 `max` 的值则返回 `true`
- `.rangeUnderflow` 如果字段值小于 `min` 的值则返回 `true`
- `.stepMisMatch` 如果字段值与 `min`、`max` 和 `step` 的值不相符则返回 `true`
- `.tooLong` 如果字段值的长度超过了 `maxlength` 属性指定的值则返回 `true`，某些浏览器会自动限制字符数量，始终为 `false`
- `.typeMismatch` 如果字段值不是"`email`"或"`url`"要求的格式则返回 `true`
- `.valid` 如果其他所有属性的值都为 `false` 则返回 `true`， `checkValidity()` 的条件一致
- `.valueMissing` 如果字段是必填的但没有值则返回 `true`

```js
if (input.validity && !input.validity.valid){
	if (input.validity.valueMissing){
		console.log("Please specify a value.")
	} else if (input.validity.typeMismatch){
		console.log("Please enter an email address.");
	} else {
		console.log("Value is invalid.");
	}
} 
```

### 禁用验证

`html` 增加 `novalidate` 属性

`element.noValidate = true`

给特定的提交按钮添加 `formnovalidate` 属性可跳过表单验证，直接提交表单

## `<select>`

`.add(newOptionElement, relElement)` 在 `rel` 选项之前添加新的选项

`.multiple` 布尔值，表示是否允许多选，等价于 `HTML` 的 `multiple` 属性

`.options` 控件中所有 `<option>` 元素的集合

`.remove(index)` 移除给定位置的选项

`.selectedIndex` 选中项基于 0 的索引值，如果没有选中则为 -1，对于多选则始终为第一个选项的索引

`.size` 选择框中可见的行数，等价于 `HTML` 的 `size` 属性

`.value`：
  - 如果没有选中项，则其为空字符串
  - 如果有一个选中项且其有 `value` 属性，则其为 `value` 属性的值
  - 如果有一个选中项且其没有 `value` 属性，则其为选项内部的值
  - 如果为多选，则为第一个选中的值(可选顺序)

## `<option>`

`index` 选项在 `options` 集合中的索引

`label` 选项的标签，等价于 `HTML` 的 `label` 属性

`selected` 布尔值，可读写，表示是否选中了当前选项，等价于 `HTML` 的 `selected` 属性

`text` 选项的文本

`value` 选项的值，等价于 `HTML` 的 `value` 属性

## 选项处理

**获取选中项**，遍历 `select.options`，查找 `selected` 属性为 `true` 的项

**添加选项：**

```js
let newOption = document.createElement("option");
newOption.appendChild(document.createTextNode("Option text"));
newOption.setAttribute("value", "Option value");
selectbox.appendChild(newOption); 
// ---------------
let newOption = new Option("Option text", "Option value");
selectbox.appendChild(newOption); // 在 IE8 及更低版本中有问题
selectbox.add(newOption, undefined); // 最佳方案
```

**移除选项：**

```js
selectbox.removeChild(selectbox.options[0]); // 移除第一项
selectbox.remove(0); // 移除第一项
selectbox.options[0] = null; // 移除第一项
```

**移动选项：**

```js
let selectbox1 = document.getElementById("selLocations1");
let selectbox2 = document.getElementById("selLocations2");
selectbox2.appendChild(selectbox1.options[0]);
```

## 表单发送至服务器

字段名和值是 `URL` 编码的，并以 `&` 分隔

**禁用的字段不会发送**

**复选框或者单选按钮只在被选中时才发送**

**类型为 `reset` 或 `button` 的按钮不会发送**

多选字段的每个选中项都有一个值

通过点击提交按钮提交表单时，才会发送该提交按钮

**类型为 `image` 的 `<input>` 元素视同提交按钮**

```js
function serialize(form) {
	let parts = [];
	let optValue;
	for (let field of form.elements) {
	switch(field.type) {
		case "select-one":
		case "select-multiple":
			if (field.name.length) {
			for (let option of field.options) {
				if (option.selected) {
					if (option.hasAttribute){
						optValue = option.hasAttribute("value")
							? option.value
							: option.text;
					} else {
						optValue = option.attributes["value"].specified
							? option.value
							: option.text;
					}
						parts.push(`${encodeURIComponent(field.name)}=${encodeURIComponent(optValue)}`);
					}
				}
			}
		break;
		case undefined: // 字段集
		case "file": // 文件输入
		case "submit": // 提交按钮
		case "reset": // 重置按钮
		case "button": // 自定义按钮
		break;
		case "radio": // 单选按钮
		case "checkbox": // 复选框
			if (!field.checked) {
				break;
			}
		default:
			// 不包含没有名字的表单字段
			if (field.name.length) {
				parts.push(`${encodeURIComponent(field.name)}=${encodeURIComponent(field.value)}`);
			}
	}
	return parts.join("&");
} 
```

## 富文本编辑器

### `iframe`

`ctrl + B` 加粗

`ctrl + I` 斜体

`ctrl + U` 下划线

```html
<iframe name="richedit" style="height: 100px; width: 100px"></iframe>
<script>
window.addEventListener("load", () => {
	frames["richedit"].document.designMode = "on";
});
</script> 
```

### `div-contenteditable`

快捷键同上

`<html contenteditable>` **将浏览器伪装成记事本使用**

```html
<div class="editable" id="richedit" contenteditable></div> 
<script>
let div = document.getElementById("richedit");
richedit.contentEditable = "true"; 
</script>
```

### 与富文本交互

**`document.execCommand('command', isShowUI, value)`**
  - `command` 指令
  - `isShowUI` 是否为命令行提供用户界面，一般为 `false`
  - `value` 执行命令必须的值，如果不需要则为 `null`

`document.queryCommandEnabled('command')` 判断是否可以执行该命令，返回布尔值

`document.queryCommandState('command')` 判断相关命令是否应用到了当前文本选区，返回布尔值

`document.queryCommandValue('command')` 返回执行命令时所使用的值

| 命令                   | 值                   | 说明                                    |
| ---------------------- | -------------------- | --------------------------------------- |
| `backcolor`            | 颜色字符串           | 设置文档背景颜色                        |
| `bold`                 | `null`               | 切换选中文本的粗体样式                  |
| `copy`                 | `null`               | 将选中文本复制到剪切板                  |
| `createlink`           | `URL` 字符串         | 给当前选中文本添加链接                  |
| `cut`                  | `null`               | 将选中文本剪切到剪切板                  |
| `delete`               | `null`               | 删除当前选中的文本                      |
| `fontname`             | 字体名               | 将选中的文本改为指定的字体              |
| `fontsize`             | 1~7                  | 将选中文本改为指定字体大小(反向对应`h`) |
| `forecolor`            | 颜色字符串           | 将选中文本改为指定的颜色                |
| `formatblock`          | `HTML`标签，如`<h1>` | 将选中文本包含在指定的 `HTML` 标签中    |
| `indent`               | `null`               | 缩进光标所在行                          |
| `inserthorizontalrule` | `null`               | 在光标位置插入`<hr>`元素                |
| `insertimage`          | 图片`URL`            | 在光标位置插入图片                      |
| `insertorderedlist`    | `null`               | 在光标位置插入`<ol>`元素                |
| `insertparagraph`      | `null`               | 在光标位置插入`<p>`元素                 |
| `insertunorderedlist`  | `null`               | 在光标位置插入`<ul>`元素                |
| `italic`               | `null`               | 切换选中文本的斜体样式                  |
| `justifycenter`        | `null`               | 在光标位置居中文本块                    |
| `justifyleft`          | `null`               | 在光标位置左对齐文本块                  |
| `outdent`              | `null`               | 光标所在行减少缩进                      |
| `removeformat`         | `null`               | 移除包含光标所在位置块的 `HTML` 标签    |
| `selectall`            | `null`               | 选中文档中的所有文本                    |
| `underline`            | `null`               | 切换选中文本的下划线样式                |
| `unlink`               | `null`               | 移除文本的链接                          |
| `paste`                | `null`               | 在选中文本上粘贴剪切板内容              |

## 富文本选择

`Selection = document.getSelection()`

### `Selection`

`anchorNode` 选区开始的节点

`anchorOffset` 在 `anchorNode `中，从开头到选区开始跳过的字符数

`focusNode` 选区结束的节点

`focusOffset` `focusNode `中包含在选区内的字符数

`isCollapsed` 布尔值，表示选区起点和终点是否在同一个地方

`rangeCount` 选区中包含的 `DOM` 范围数量

`addRange(range)` 把给定的 `DOM` 范围添加到选区

`collapse(node, offset)` 将选区折叠到给定节点中给定的文本偏移处

`collapseToEnd()` 将选区折叠到终点

`collapseToStart()` 将选区折叠到起点

`containsNode(node)` 确定给定节点是否包含在选区中

`deleteFromDocument()` 从文档中删除选区文本。与执行 `execCommand("delete", false, null)` 命令结果相同

`extend(node, offset)` 通过将 `focusNode` 和 `focusOffset` 移动到指定值来扩展选区

`getRangeAt(index)` 返回选区中指定索引处的 `DOM` 范围

`removeAllRanges()` 从选区中移除所有 `DOM` 范围。这实际上会移除选区，因为选区中至少要包含一个范围

`removeRange(range)` 从选区中移除指定的 `DOM` 范围

`selectAllChildren(node)` 清除选区并选择给定节点的所有子节点

`toString()` 返回选区中的文本内容

**编辑完成，通过 `document.body.innerHTML` 获取编辑的内容**

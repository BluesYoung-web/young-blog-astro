---
title: 60-原生拖放
image: /img/hbs.png
description: JavaScript 原生拖放
date: 2021-01-29 09:02:21
---

[[toc]]

<Step
  title="历史回顾"
  :data="[
    `IE4 最先加入拖放功能，只支持拖动图片和文本唯一有效的放置目标是文本框`,
    `IE5 扩展了拖放能力，添加了新的事件，让网页中几乎一切都可以成为放置目标`,
    `IE5.5 几乎一切都可以拖动`,
    `HTML5 在 IE 的拖放实现基础上标准化了拖放功能`
  ]"
/>

## 控制元素是否可以拖动

`<element draggable="true | false | auto" />`
- `true` 允许拖动
- `false` 不允许拖动
- `auto` 默认，使用浏览器默认特性
- **默认情况下，图片、链接可直接拖动，文本选中后可拖动**

## 拖放事件

在某个元素被拖动时，会依次触发以下事件

`dragstart -> drag -> dragend`
- `dragstart` 开始拖动时触发
- `drag` 按住鼠标时，持续触发
- `dragend` 松开鼠标时触发

## 自定义放置目标

**禁用 `dragenter && dragover` 事件**

**监听 `drop` 事件并禁用默认行为**

`dragenter -> dragover -> drop | dragleave`
- `dragenter` 元素拖动到放置目标上立即触发
- `dragover` 拖动到放置目标范围内持续触发
- `drop` 在放置目标范围内，松开鼠标时触发
- `dragleave` 拖动离开放置目标范围时触发

## `dataTransfer` 对象

**用于从被拖动元素向放置目标传递数据**

`event.dataTransfer.setData(typeStr, string)` 拖动元素存储数据

`event.dataTransfer.getData(typeStr)` 放置目标读取数据

`typeStr`：
  - `Text` 存储文本数据，拖动到文本域内自动放置
  - `URL` 存储链接，拖动到浏览器地址栏自动导航
  - ......

### `.dropEffect`

告诉浏览器允许哪种放置行为

必须在放置目标的 **ondragenter** 事件处理程序中设置

`none` 元素不可放置，除文本框之外所有元素的默认值

`move` 被拖动元素应该移动到放置目标

`copy` 被拖动元素应该复制到放置目标

`link` 表示放置目标会导航到被拖动元素(仅 `URL`)

**除非同时设置 `effectAllowed`，否则 `dropEffect` 属性也没有用**

### `.effectAllowed`

表示对被拖动元素是否允许 `dropEffect`

必须在 **ondragstart** 事件处理程序中设置这个属性

`uninitialized` 没有给被拖动元素设置动作

`none` 被拖动元素上没有允许的操作

`copy` 只允许 `copy` 操作

`link` 只允许 `link` 操作

`move` 只允许 `move` 操作

`copyLink` 允许 `copy | link` 操作

`copyMove`

`linkMove`

`all` 允许所有操作

### `.addElement(element)`

为拖动操作添加元素

纯粹是为了传输数据，不会影响拖动操作的外观

暂时未实现

### `.clearData(typeStr)`

清除特定格式存储的数据

### `.setDragImage(element, x, y)`

指定拖动发生时显示在光标下面的图片

`element` 要显示的 `HTML` 元素

`x/y` 图片上的坐标

### `.types`

当前存储的数据类型列表

```html
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	<title>测试</title>
	<style>
	.f {
		width: 500px;
		height: 500px;
		background-color: #efefef;
	}
	</style>
</head>
<body>
	<div class="f" id="target"></div>
	<input type="textarea" name="" id="">
	<p id="f" draggable="true">这是我要拖动的元素</p>
	<script>
	let f = document.getElementById("f");
	let t = document.getElementById("target");
	function handleEvent(event) {
		event.preventDefault();
		// 放入
		if (event.type === 'drop') {
			const data = event.dataTransfer.getData('text');
			console.log(event.dataTransfer)
			console.log(event.dataTransfer.types) //  ["text/plain", "text/uri-list"]
			t.innerHTML = data;
		}
	}
	t.addEventListener('dragenter', handleEvent)
	t.addEventListener('dragover', handleEvent)
	t.addEventListener('drop', handleEvent)

	f.addEventListener('dragstart', (e) => {
		e.dataTransfer.setData('text', '来了老弟')
		e.dataTransfer.setData('URL', 'https://www.mi.com')
	});
	// f.addEventListener('drag', (e) => console.log('持续拖动', e))
	// f.addEventListener('dragend', (e) => console.log('结束拖动', e))
	</script>
</body>
</html>
```
---
title: 40-window对象
image: /img/hbs.png
description: JavaScript Window 对象
date: 2021-01-19 14:51:35
---

[[toc]]

## 定义

浏览器实例对象

**`BOM` 的核心**

`ECMAScript` 定义中的 `Global` 对象

## `Global` 作用域

通过 `var` 声明的所有全局变量和函数都会成为 `window` 对象的属性和方法

访问未声明的变量会抛出错误，但是可以在 `window` 对象上查询是否存在可能未声明的变量

## 窗口相关

### 层级关系

**`window.top` 始终指向最顶层窗口，即浏览器窗口本身**

`window.parent` 始终指向当前窗口的父窗口

`window.self` 保存 `window` 对象的副本

`window.name` 窗口名称，如果不是通过 `window.open()` 打开的，则为空字符串

### 位置

`window.moveTo(x, y)` 将窗口移动到指定位置

`window.moveBy(offsetX, offsetY)` 窗口偏移指定距离

*可能被浏览器禁用*

### 像素比

`window.devicePixelRatio`

物理像素 / 逻辑像素

### 尺寸

`window.innerWidth | window.innerHeight` 不包含边框与工具栏的宽度/高度

`window.outerWidth | window.outerHeight` 返回当前窗口自身的宽度/高度

`window.resizeTo(newWidth, newHeight)` 调整窗口大小

`window.resizeBy(scaleWidth, scaleHeight)` 调整窗口大小

调整窗口大小的方法可能被浏览器禁用

```js
let pageWidth = window.innerWidth;
let pageHeight = window.innerHeight;
if (typeof pageWidth != "number") {
	if (document.compatMode == "CSS1Compat"){
		pageWidth = document.documentElement.clientWidth;
		pageHeight = document.documentElement.clientHeight;
	} else {
		pageWidth = document.body.clientWidth;
		pageHeight = document.body.clientHeight;
	}
} 
```

### 视口位置

`window.pageXoffset === window.scrollX` 横向偏移距离

`window.pageYoffset === window.scrollY` 纵向偏移距离

`window.scroll(x, y)` 滚动到指定位置

`window.scrollTo(x, y)` 滚动到指定位置

`window.scrollBy(offsetX, offsetY)` 滚动指定的偏移距离

```js
// 正常滚动
window.scrollTo({
	left: 100,
	top: 100,
	behavior: 'auto'
});
// 平滑滚动
window.scrollTo({
	left: 100,
	top: 100,
	behavior: 'smooth'
}); 
```

### 导航与打开新窗口

**`window.open(url = '', targetName = '_blank', features = '', isReplaceHistory = false)`**
  - `url` 打开窗口要浏览的页面地址，不能是本地地址
  - `targetName` 目标窗口的名称，如果不存在则打开新的窗口并将其名称属性改为对应值
    - '_self'，当前窗口
    - '_parent'，当前窗口的父级窗口
    - '_top'，顶层窗口
    - '_blank'，新的空白窗口
  - `features` 浏览器特性配置(工具栏、状态栏...)
  - `isReplaceHistory` 是否替代当前页的历史记录(在当前窗口打开时有效)

返回对新窗口的引用

新窗口 `window.opener` 为对原始窗口的引用，可进行窗口间的通信

如果将 `opener` 属性设置为 `null`，则该标签会运行在**独立**的进程中，也失去了与原窗口通信的能力

#### `features` 

以逗号分隔的字符串

"height=400,width=400,top=10,left=10,resizable=yes"

可选配置项：
- **`fullscreen = yes | no` 窗口是否最大化，仅IE支持**
- **`height = number` 新窗口高度，不得小于100**
- **`width = number` 新窗口宽度，不得小于100**
- **`left = number` 新窗口x轴坐标，大于等于0**
- **`top = number` 新窗口y轴坐标，大于等于0**
- **`location = yes | no` 是否显示地址栏，因浏览器而异**
- **`Menubar = yes | no` 是否显示菜单栏**
- **`resizable = yes | no` 是否可以拖动改变新窗口的大小**
- **`scrollbars = yes | no` 是否可以在内容过长时滚动**
- **`status = yes | no` 是否显示状态栏**
- **`toolbar = yes | no` 是否显示工具栏**


```js
// 与<a href="http://www.wrox.com" target="topFrame"/>相同
window.open("http://www.wrox.com/", "topFrame"); 
// 检测是否屏蔽弹窗
let blocked = false;
try {
  const newWindow = window.open('');
  if(newWindow === null) {
    blocked = true;
  }
} catch(e) {
  blocked = true;
}
if(blocked) {
  alert('the popup was blocked');
}
```

## 定时器

推荐优先使用 `setTimeout`

### `setTimeout(cbk, delay, ...args)`

一段时间之后执行(将回调函数放入任务队列，等待调用)，返回定时器id(`timeoutId`)

`clearTimeout(timeoutId)`，取消等待中的任务

### `setInterval(cbk, delay, ...args)`

每隔一段时间执行一次(往任务队列中压入回调函数，等待调用)，直到页面被卸载

每次间隔不能确定，返回定时器id(`intervalId`)

`clearInterval(intervalId)`，取消等待中的任务

## 系统对话框

**同步执行，线程阻塞**

### `alert(msg = '')`

传入字符串直接显示，传入其他值，调用对应的 `toString()` 方法

### `confirm(msg = '')`

显示同上，返回操作结果，布尔值

### `prompt(msg = '', default = '')`

显示同上，`default` 为输入框中的默认值

**“确认”返回输入框中的字符串，“取消”返回 `null`**

### `find()`

查找(可能禁用)，`ctrl + F` 调出

### `print()`

打印，`ctrl + P` 调出
---
layout: "@/layouts/BlogPost.astro"
title: 50-事件类型
image: /img/hbs.png
description: JavaScript 事件类型
date: 2021-01-23 11:39:12
---

[[toc]]

## 事件类型

用户界面事件(`UI`)

焦点事件

鼠标事件

滚轮事件

输入事件

键盘事件

合成事件

## 用户界面事件

用户界面事件或 `UI` 事件**不一定跟用户操作有关**

**`DOMActivate`**
  - 元素被用户通过鼠标或键盘操作激活时触发
  - 比 `click` 或 `keydown` 更通用，**已废弃**
  - **浏览器之间存在差异，不推荐使用**

**`load`**
  - 加载完成触发
  - `window.onload`
  - `img.onload`
  - `script.onload`
  - `link.onload`

**`unload`**
  - 页面完全卸载后触发(页面跳转)
  - 清除引用，避免内存泄漏

**`abort`**，提前终止时触发

**`error`**，加载出错触发

**`select`**，文本框选择了一个或多个字符时触发

**`resize`**，窗口缩放时触发

**`scroll`**，滚动时触发

## 焦点事件

`blur` 失去焦点时触发

`focus` 获得焦点时触发

`focusin`，`focus` 的冒泡版

`focusout`，`blur` 的通用版

`focusout -> focusin -> blur -> focus`

## 鼠标事件

`click` 点击左键(主键)或者回车触发

`dbclick` 双击左键触发

`mousedown` 点击任意键触发

`mouseenter` 鼠标移入触发，**不冒泡**

`mouseleave` 鼠标移出触发，**不冒泡**

`mousemove` 鼠标移动时反复触发

`mouseout` 一个元素移动到另一个元素时触发

`mouseover` 鼠标移入触发

`mouseup` 释放鼠标键时触发

`mousewheel` 滚动滚轮触发

`mousedown -> mouseup -> click -> mousedown -> mouseup -> click -> dbclick`

### 修饰键

`e.shiftKey`

`e.ctrlKey`

`e.altKey`

`e.metaKey`

### 相关元素

```js
// mouseout | mouseover
const atedTarget = function(event) {
	if (event.relatedTarget) {
		return event.relatedTarget;
	} else if (event.toElement) {
		return event.toElement;
	} else if (event.fromElement) {
		return event.fromElement;
	} else {
		return null;
	}
}
```

### 鼠标按键

`e.button`：
  - 0 主键
  - 1 中键
  - 2 副键

### 额外事件信息

`e.detail` 单个位置上的点击次数

### `mousewheel` 事件

`e.wheelDelta`，向前(后)滚动 +(-)120

### 触摸屏设备

不支持 `dbclick`

单指点触屏幕上的可点击元素会触发 `mousemove` 事件。如果操作会导致内容变化，则不会再触发其他事件。如果屏幕上没有变化，则会相继触发 `mousedown`、`mouseup` 和 `click` 事件。点触不可点击的元素不会触发事件。可点击元素是指点击时有默认动作的元素（如链接）或指定了 `onclick` 事件处理程序的元素

`mousemove` 事件也会触发 `mouseover` 和 `mouseout` 事件

双指点触屏幕并滑动导致页面滚动时会触发 `mousewheel` 和 `scroll` 事件

### 无障碍

不推荐使用除了 `click` 之外的事件

## 键盘事件

`keydown` 按下某个键时触发，**持续按住会重复触发**

`keypress` 按下某个键并产生字符时触发，持续按住会重复触发，`Esc` 也会触发(**废弃**)

`keyup` 释放某个键时触发

`textInput` 是对 `keypress` 的扩展，**会在文本被插入到文本框之前触发**

### 键码

`e.keyCode` 值与小写字母对应的 `ASCII` 码相对应

`e.key`：
  - 按下字符时，值等于文本字符
  - 按下非字符时，值等于键名('Shift ...')

`e.char`：
  - 按下字符时，值等于文本字符
  - 按下非字符时，值等于 `null`

### `textInput` 事件

在字符被**输入到可编辑区域时**触发

**只在可编辑区域触发**

只有在**新字符**被插入时触发，**不包括退格键**

`e.data` 要被插入的字符

`e.inputMethod` 输入方式：
  - 0 无法确定
  - 1 键盘输入
  - 2 粘贴
  - 3 拖放
  - 4 `IME`
  - 5 表单选项
  - 6 手写
  - 7 语音
  - 8 组合
  - 9 脚本

## 合成事件

使用 `IME` 输入时的复杂输入序列

可以输入物理键盘上没有的字符

`compositionstart` 输入即将开始时触发

`compositionupdate` 新字符插入时触发

`compositionend` 输入结束时触发

## `HTML5` 事件

`contextmenu` 上下文菜单事件

`beforeunload` 页面关闭事件

`DOMContentLoaded` `DOM` 树构建完成后立即触发

`readystatechange` 文档加载状态，`e.readyState`：
  - `uninitialized` 对象存在并尚未初始化
  - `loading` 对象正在加载数据
  - `loaded` 对象已经加载完数据
  - `interactive` 对象可以交互，但尚未加载完成
  - `complete` 对象加载完成

`pageshow` 页面显示

`pagehide` 页面隐藏

`hashchange` 哈希值变化时触发：
  - `e.oldURL` 变化之前
  - `e.newURL` 变化之后

## 设备事件

`orientationchange` 屏幕旋转

`deviceorientation` 获取设备的加速计信息

`devicemotion` 设备移动

## 触摸事件

`touchstart` 手指放到屏幕上时触发

`touchmove` 手指在屏幕上滑动时持续触发

`touchend` 手指离开屏幕时触发

`touchcancel` 系统停止跟踪触摸时触发

`touchstart -> mouseover -> mousemove -> mousedown -> mouseup -> click -> touchend`

`gesturestart` 一个手指已经放到屏幕上，再把另一个手指放到屏幕上时触发

`gesturechange` 任何一个手指在屏幕上的位置发生变化时触发

`gustureend` 其中一个手指离开屏幕时触发
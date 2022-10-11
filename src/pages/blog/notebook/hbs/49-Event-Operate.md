---
layout: "@/layouts/BlogPost.astro"
title: 49-事件处理
image: /img/hbs.png
description: JavaScript 事件处理
date: 2021-01-23 09:29:17
---

[[toc]]

## 事件阶段

事件捕获阶段

处于目标阶段

事件冒泡阶段

## 事件捕获

**自顶向下**，最不具体的节点最先收到事件，最具体的节点最后收到事件

`document -> html -> body -> div`

为了在事件达到最终目标之前拦截事件

## 事件冒泡

被点击的元素，最先触发 `click` 事件

然后沿着 `DOM` 树一路向上，直到 `document` 对象

`div -> body -> html -> document`

旧版本浏览器不支持，事件冒泡最常用

## 事件处理程序

### `HTML` 事件处理程序

直接以属性的形式来指定，**为了安全考虑，现在被浏览器禁用了**

### `DOM0` 级事件处理程序

`element.onclick = function(){};`

**`this`指向元素自身**

`element.onclick = null;` 删除事件处理程序

### `DOM2` 级事件处理程序

`element.addEventListener('eventName', cbk, buble = false)`

`element.removeEventListener('eventName', cbk, buble = false)`

事件冒泡/捕获标志，默认冒泡 `buble`

### `IE` 事件处理程序

**只支持事件冒泡**

`element.attachEvent('on' + 'eventName', cbk)`

以添加顺序**反向**触发

### 跨浏览器事件处理程序(兼容)

```js
const EventUtil = {
	addHandler: function(element, type, handler) {
		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + type, handler);
		} else {
			element["on" + type] = handler;
		}
	},
	removeHandler: function(element, type, handler) {
		if (element.removeEventListener) {
			element.removeEventListener(type, handler, false);
		} else if (element.detachEvent) {
			element.detachEvent("on" + type, handler);
		} else {
			element["on" + type] = null;
		}
	}
}; 
```

## `DOM` 事件对象

### 属性及方法

| `name`                       | `type`         | `des`                                                        |
| ---------------------------- | -------------- | ------------------------------------------------------------ |
| `bubbles`                    | `boolean`      | 只读，表示事件是否冒泡                                       |
| `cancelable`                 | `boolean`      | 只读，表示**是否可以取消**事件的默认行为                     |
| `currentTarget`              | `element`      | 只读，表示**当前事件处理程序所在的元素**                     |
| `defaultPrevented`           | `boolean`      | 只读，表示是否已经调用 `preventDefault()` 方法               |
| `detail`                     | `int`          | 只读，事件相关的其他信息                                     |
| `eventPhase`                 | `int`          | 只读，事件阶段：1->捕获，2->目标，3->冒泡                    |
| `preventDefault()`           | `function`     | 只读，取消事件默认行为，只有 `cancelable=true` 才可以调用    |
| `stopImmediatePropagation()` | `function`     | 只读，取消所有后续事件的捕获或冒泡，并阻止调用任何后续的事件处理程序 |
| `stopPropagation()`          | `function`     | 只读，用于取消所有后续事件捕获或事件冒泡。只有 `bubbles` 为 `true` 才可以调用这个方法 |
| `target`                     | `element`      | 只读，事件目标                                               |
| `trusted`                    | `boolean`      | 只读，是否为浏览器生成，true->是，false->开发者调用          |
| `type`                       | `string`       | 只读，被触发的事件类型                                       |
| `view`                       | `AbstractView` | 只读，事件所发生的 `window` 对象                             |

## `IE` 事件对象

### 属性及方法

| `name`         | `type`    | `des`                                         |
| -------------- | --------- | --------------------------------------------- |
| `cancelBubble` | `boolean` | 可读写，默认 `false`，设置为 `true` 可以取消冒泡     |
| `returnValue`  | `boolean` | 可读写，默认 `true`，设置为 `false` 可以取消默认行为 |
| `srcElement`   | `element` | 只读，事件目标                                |
| `type`         | `string`  | 只读，触发的事件类型                          |

## 跨浏览器事件对象

```js
var getEvent = function(e){
	return e ? e : window.event;
}

var getTarget = function(e){
	return e.target || e.srcElement;
}

var preventDefault = function(e){
	if(e.preventDefault){
		e.preventDefault();
	} else {
		e.returnValue = false;
	}
}

var stopPropagation = function(e){
	if(e.stopPropagation){
		e.stopPropagation();
	} else {
		e.cancelBubble = true;
	}
}
```


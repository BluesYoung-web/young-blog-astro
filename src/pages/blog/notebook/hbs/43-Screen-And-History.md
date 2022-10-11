---
layout: "@/layouts/BlogPost.astro"
title: 43-screen及history对象
image: /img/hbs.png
description: JavaScript Screen & History
date: 2021-01-20 11:44:37
---

## `screen` 对象

**保存纯粹的客户端信息(显示器信息)**

### 属性

`availHeight` 屏幕像素高度减去系统组件高度（只读）

`availLeft` 没有被系统组件占用的屏幕的最左侧像素（只读）

`availTop` 没有被系统组件占用的屏幕的最顶端像素（只读）

`availWidth` 屏幕像素宽度减去系统组件宽度（只读）

`colorDepth` 表示屏幕颜色的位数；多数系统是 32（只读）

`height` 屏幕像素高度

`left` 当前屏幕左边的像素距离

`pixelDepth` 屏幕的位深（只读）

`top` 当前屏幕顶端的像素距离

`width` 屏幕像素宽度

`orientation` 返回 `Screen Orientation API` 中屏幕的朝向

## `history` 对象

表示当前窗口首次使用以来用户的导航历史记录

不会暴露用户访问过的 `URL`，但可以前进或后退

### `history.go(number | string)`

当参数为数字时：
  - 大于0，前进对应页数
  - 小于0，后退对应页数

当参数为字符串时：
  - 导航到含有该字符串的最近一个页面
  - 如果没有匹配则什么都不做

### `history.back()`

后退一页

### `history.forward()`

前进一页

### `history.length`

页面历史记录数

大于等于1

### `history.pushState(obj = {}, title = '', ralativeUrl = '')`

创建新的历史记录

基于 `obj` 重置页面状态，大小通常在 `500KB～1MB` 以内

浏览器在调用 `pushState()` 方法后**不会加载**该地址

`ralativeUrl ` 与当前 `URL` 必须同源，否则报错

```js
location.href = 'https://www.mi.com';
history.pushState({ foo: 'bar' }, '', '?pc=12138');
console.log(history.state); // '{ foo: "bar" }'
console.log(location.href); // 'https://www.mi.com/?pc=12138'

window.addEventListener("popstate", (event) => {
	let state = event.state;
	if (state) { // 第一个页面加载时状态是 null
		processState(state);
	}
});
```

### `history.replaceState()`

参数同上，**不会创建新的历史记录**
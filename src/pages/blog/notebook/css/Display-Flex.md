---
title: Flex 布局
description: CSS Flex 布局
image: /img/css.jpg
date: 2021-03-11 09:46:50
---

[[toc]]

## 定义

**弹性布局**

使用 `Flex` 布局之后，里面的 **float、clear、vertical-align 属性将失效**

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
	<style>
		.box {
			display: flex;
			background-color: #ccc;
		}
		.box .item {
			margin: 10px 10px;
			padding: 10px;
			width: 50px;
		}
	
		.item {
			background-color: #efc;
			background-clip: border-box;
		}
	</style>
</head>
<body>
	<div class="box">
		<span class="item">你好1</span>
		<span class="item">你好2</span>
		<span class="item">你好3</span>
		<span class="item">你好4</span>
		<span class="item">你好5</span>
	</div>
</body>
</html>
```

<style lang="scss" scoped>
.box {
	display: flex;
	background-color: #ccc;

	.item {
		margin: 10px 10px;
		padding: 10px;
		width: 50px;
		
		background-color: #efc;
		background-clip: border-box;
	}
}
</style>

<div class="box">
	<span class="item">你好1</span>
	<span class="item">你好2</span>
	<span class="item">你好3</span>
	<span class="item">你好4</span>
	<span class="item">你好5</span>
</div>

## 容器属性

### `flex-direction`

**定义子元素布局方向**
  - `row` 默认值，**从左到右** 12345
  - `row-reverse` **从右到左** 12345
  - `column` **从上到下** 12345
  - `column-reverse` **从下到上** 12345


### `flex-wrap`

**定义子元素是否位于同一行/列**
  - `nowrap` **默认值**，即使缩放也要强行将所有元素放在一行
  - `wrap` 当宽度不够时，自动将元素放到**下一行**，从左到右
  - `wrap-reverse` 当宽度不够时，自动将元素放到**上一行**，从左到右

### `flex-flow`
  相当于 `flex-direction` + `flex-wrap`

### `justify-content`

**定义子元素在<span class="text-red-500 font-900">主轴</span>上的对齐方式**
  - **`flex-start` 默认值，左对齐**
  - `center` 居中对齐
  - `flex-end` 右对齐
  - `space-between` 两边贴边，中间间隔等分
  - `space-around` 两边不贴边，每个元素左右边距相等，两元素之间的间距**叠加**
  - `space-evenly` 两边不贴边，每个元素左右边距相等，两元素之间的间距**不叠加**

### `aligin-items`

**定义子元素在<span class="text-red-500 font-900">交叉轴</span>上的对齐方式**
  - **`stretch` 默认值，全部拉升到同一高度**
  - `flex-start` 顶部对齐
  - `flex-end` 底部对齐
  - `center` 中心对齐
  - `baseline` 元素第一行文字的基线对齐

### `aligin-content`

**多轴线对齐(`wrap` 时才生效)**
  - `flex-start` 内容贴顶
  - `flex-end` 内容贴底
  - `center` 内容居中
  - `space-between` 上下贴边，中间等分
  - `space-around` 上下不贴边，每行上下边距相等，相邻行间距**叠加**
  - **`stretch` 默认值，未设高度的直接拉到最大行高**

## 元素属性

### `order`

默认 0，**数值越小排列越靠前**

### `flex-grow`

元素放大的比例，**定义子元素如何分配父元素剩余的宽度**

默认 0

### `flex-shrink`

定义元素的缩小比例，默认 1

**为 0 时，不缩小**

### `flex-basis`

定义元素**在分配多余空间之前占据的主轴空间**

**会覆盖已经设置的宽度**，默认 `auto`

### `flex`
  
`flex-grow` + `flex-shrink` + `flex-basis`

默认 `0 1 auto`

### `aligin-self`

单独设置某个元素的对齐方式，默认 `auto`

覆盖 `aligin-items` 属性
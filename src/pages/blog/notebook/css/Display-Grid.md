---
layout: "@/layouts/BlogPost.astro"
title: Grid 布局
description: CSS Grid 布局
image: /img/css.jpg
date: 2022-03-16 11:26:50
---

[[toc]]

## 定义

**网格布局**

<n-alert type="info">**CSS3 引入的二维布局方式，能极大地简化页面布局**</n-alert>

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
	<style>
		.box {
			display: grid;
			background-color: #ccc;
			grid-template-columns: 1fr 1fr 1fr;
			grid-template-rows: 2fr 1fr;
			gap: 1rem;
			text-align: center;
		}
		.box .item {
			background-color: #efc;
		}
		.box .second {
			grid-row: 1/3;
			grid-column: 2/3;
		}

		.box .last {
			grid-column: 3/4;
		}
	</style>
</head>
<body>
	<div class="box">
		<span class="item">你好1</span>
		<span class="item second">你好2</span>
		<span class="item">你好3</span>
		<span class="item">你好4</span>
		<span class="item last">你好5</span>
	</div>
</body>
</html>
```

<style lang="scss" scoped>
.box {
	display: grid;
	background-color: #ccc;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: 2fr 1fr;
	gap: 1rem;
	text-align: center;

	.item {
		background-color: #efc;
	}

	.second {
		grid-row: 1/3;
		grid-column: 2/3;
	}

	.last {
		grid-column: 3/4;
	}
}
</style>

<div class="box">
	<span class="item">你好1</span>
	<span class="item second">你好2</span>
	<span class="item">你好3</span>
	<span class="item">你好4</span>
	<span class="item last">你好5</span>
</div>

## 使用

`display: grid | inline-grid;`

## 容器属性

### 网格轨道

**grid-template-columns，定义网格每一列的宽度**

**grid-template-rows， 定义网格每一行的高度**

**尺寸单位：**
- **1fr，全新的尺寸单位，代表 1 等份**
- auto 自动
- px | em | rem | vw | vh | ...

**间隔：**
- `gap === grid-gap = grid-row-gap + grid-column-gap`

### `justify-content`

**定义子元素在<span class="text-red-500 font-900">水平方向</span>上的对齐方式**
  - **`start` 默认值，左对齐**
  - `center` 居中对齐
  - `end` 右对齐
  - `space-between` 两边贴边，中间间隔等分
  - `space-around` 两边不贴边，每个元素左右边距相等，两元素之间的间距**叠加**
  - `space-evenly` 两边不贴边，每个元素左右边距相等，两元素之间的间距**不叠加**

<n-alert type="warning">**仅在网格(子元素)总宽度小于容器宽度时生效**</n-alert>


### `aligin-content`

**定义子元素在<span class="text-red-500 font-900">垂直方向</span>上的对齐方式**
  - `start` 内容贴顶
  - `end` 内容贴底
  - `center` 内容居中
  - `space-between` 上下贴边，中间等分
  - `space-around` 上下不贴边，每行上下边距相等，相邻行间距**叠加**

<n-alert type="warning">**仅在网格(子元素)总高度小于容器高度时生效**</n-alert>


## 元素属性

### 网格线

<n-image src="https://www.runoob.com/wp-content/uploads/2021/10/1_diagram_numbered_grid_lines.png" />

**grid-row = grid-row-start / grid-row-end**

grid-row-(start|end) | grid-column-(start|end) 指定位置为**第几根网格线**

```scss
grid-row: 1/3;
// ===>
grid-row: 1 / span 2;
// ===>
grid-row-start: 1;
grid-row-end: 3;
```

## 常用函数

### `repeat(num, value)`

**将一个值或模式，重复对应的次数**

```scss
repeat(3, 120px 10px);
// ===>
120px 10px 120px 10px 120px 10px;
```

**auto-fill 单元格大小固定，容器大小不确定**
**auto-fit 单元格自动平分容器**

### `minmax(minValue, maxValue)`

**产生一个长度范围，最小为 minValue，最大为 maxValue**
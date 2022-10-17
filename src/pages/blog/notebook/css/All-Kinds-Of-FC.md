---
title: 各种各样的格式化上下文(FC)
description: CSS 各种各样的格式化上下文(FC)
image: /img/css.jpg
date: 2022-03-15 17:16:50
---

[[toc]]

## FC

**`Formatting Contexts` 格式化上下文**

**页面中的一块渲染区域，拥有一套独立的渲染规则，能决定其子元素如何定位以及和其他元素之间的关系和相互作用**

## BFC

**块级格式化上下文**

决定了元素如何对其**内容**进行定位，以及**与其它元素的关系和相互作用**

### 触发方式

**根元素或其他包含它的元素**

**float: left | right | inhreit**

**position: absolute | fixed**

**display: inline-block | table-cell | table-caption | flex | inline-flex**

**overflow: hidden | scroll | auto | inhreit**

### 布局规则

**沿垂直方向排列**

**垂直距离由 margin 决定，属于同一个 BFC 的相邻盒子会发生 margin 折叠**

<n-alert type="warning">**计算高度时，浮动元素也会参与计算**</n-alert>

### 应用场景

解决块级元素垂直方向的 margin 折叠

解决 float 造成的高度塌陷

清除浮动

## IFC

**行内格式化上下文**

### 触发方式

**块级元素之中仅包含行内元素时**

<n-alert type="warning">**当 IFC 中有块级元素插入时，会将现有的 IFC 分隔成两个**</n-alert>

### 布局规则

**横向排列，垂直方向的样式不会被计算**

**垂直方向对齐方式：**
  - baseline
  - sub
  - super
  - top
  - text-top
  - middle
  - bottom
  - text-bottom
  - length
  - 百分比(line-height属性值的百分比，允许负值)
  - inherit

### 应用场景

**子元素水平居中(display: inline-box; text-align: center;)**

## FFC

**弹性格式化上下文**

### 触发方式

块级元素 `display: flex`

行内元素 `display: inline-flex`

<n-alert type="warning">**FFC 布局中，float、clear、vertical-align 属性不会生效**</n-alert>

<n-alert type="info">**只能指定子元素针对轴线的位置，可以看做一维布局**</n-alert>

### 应用场景

**自动撑开剩余的高度/宽度**

## GFC

**网格格式化上下文**

<n-alert type="info">**将容器划分为行和列，产生单元格，然后指定元素所在的单元格，可以看做二维布局**</n-alert>

> **相较于弹性布局更加强大，但支持率也稍低**

### 触发方式

`display: grid | inline-grid`

### 应用场景

**任意魔方布局**

<style>
.magic {
  display: grid;
  grid-gap: 2px;
  width:300px;
  height:300px;
}
.magic div {
  border: 1px solid coral;
}
.m_1 {
  grid-column-start: 1;
  grid-column-end: 3;
}
.m_3 {
  grid-column-start: 2;
  grid-column-end: 4;
  grid-row-start: 2;
  grid-row-end: 3;
}
</style>
<div class="magic">
  <div class="m_1">1</div>
  <div class="m_2">2</div>
  <div class="m_3">3</div>
  <div class="m_4">4</div>
  <div class="m_5">5</div>
  <div class="m_6">6</div>
  <div class="m_7">7</div>
</div>

```html
<style>
.magic {
  display: grid;
  grid-gap: 2px;
  width:300px;
  height:300px;
}
.magic div {
  border: 1px solid coral;
}
.m_1 {
  grid-column-start: 1;
  grid-column-end: 3;
}
.m_3 {
  grid-column-start: 2;
  grid-column-end: 4;
  grid-row-start: 2;
  grid-row-end: 3;
}
</style>
<body>
  <div class="magic">
    <div class="m_1">1</div>
    <div class="m_2">2</div>
    <div class="m_3">3</div>
    <div class="m_4">4</div>
    <div class="m_5">5</div>
    <div class="m_6">6</div>
    <div class="m_7">7</div>
  </div>
</body>
```
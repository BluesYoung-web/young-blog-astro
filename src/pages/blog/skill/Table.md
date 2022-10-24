---
title: 表格小技巧
description: 表格小技巧
date: 2021-12-19 16:29:29
---

[[toc]]

## 场景

由于工作原因，需要自行封装一个原生的表格组件

## 历程

### 基于原生的 table 元素实现

样式太丑

不容易控制

### 基于 table 布局实现(`display: table;`)

样式便于控制

单一 table 表头不能固定，会和内容一起滚动

双 table 又会出现**表头不能和内容对齐**

### 回归本质——基于原生的 table 元素 + colgroup 元素

阅读开源框架的源码 + 百度解决方案之后的决定

**`<colgroup>` 是 `<table>` 的一级子元素，用来包含一组列的定义**，<span style="color: red;">**专门用于控制表格每一列的样式**</span>

**终极解决方案：**
  - 双 table 实现表头固定，内容滚动
  - table 内部使用相同的 `<colgroup>` 配置实现表头与内容的对齐

## `<col />`

单标签，不包含任何内容

`span` 属性，**正整数，用于设置列宽**，默认值为 1

对其设置的 css 会应用到表格中对应的列上

```html
<!--
第一列应用 c1
第二三列应用 c2
第四列应用 c3
-->
<table>
  <colgroup>
    <col class="c1">
    <col span="2" class="c2">
    <col class="c3">
  </colgroup>
  <tr>
    <td>1</td>
    <td>2</td>
    <td>3</td>
    <td>4</td>
  </tr>
</table>
```
---
title: CSS3-01伪类选择器
date: 2020-12-24 10:36:13
image: /img/css.jpg
description: CSS 伪类选择器
---

[[toc]]


## 类型

### 动态伪类选择器

**不存在与 HTML 中，只有动态交互时才会体现**

```css
a:link {
    /* 未访问链接的样式 */
}
a:visited {
    /* 访问过的链接的样式 */
}
a:active {
    /* 按住左键的样式 */
}
a:hover {
    /* 鼠标悬浮时的样式 */
}

input:enabled {
    /* 启用状态下的样式 */
}
input:disabled {
    /* 禁用状态下的样式，通常与上面的配合使用 */
}

input:checked {
    /* 勾选时的样式 */
}
input:focus {
    /* 聚焦时的样式 */
}

input:in-range {
    /* 选择元素指定范围内的值 */
}
input:out-of-range {
    /* 选择元素指定范围外的值，通常与上面的配合使用 */
}

input:valid {
    /* 选择的所有内容合法元素的样式 */
}
input:invalid {
    /* 选择的所有内容非法元素的样式，通常与上面的配合使用 */
}

input:read-only {
    /* 所有只读元素的样式 */
}
input:read-write {
    /* 所有可读写元素的样式 */
}
```

### 结构伪类选择器

```css
.content ul li:first-child {
    /* 选择第一个元素，且该元素为 li */
    background-color: cyan;
}
.content ul li:last-child {
    /* 选择最后一个元素，且该元素为 li */
    background-color: cyan;
}
.content ul li:nth-child(2n) {
    /* 选择 ul 所有偶数 子元素 */
  	background-color: cyan;
}
.content ul li:nth-last-child(2n) {
    /* 反向选择 ul 所有偶数 子元素 */
  	background-color: cyan;
}
.content ul li:nth-of-type(2n) {
    /* 选择 ul 所有偶数类型为 li 的子元素 */
  	background-color: cyan;
}
.content ul li:nth-of-type(2n) {
    /* 反向选择 ul 所有偶数类型为 li 的子元素 */
  	background-color: cyan;
}
.content ul li:first-of-type {
    /* 选择第一个为 li 的元素 */
    background-color: cyan;
}
.content ul li:last-of-type {
    /* 选择最后一个为 li 的元素 */
    background-color: cyan;
}
.content ul li:only-child {
    /* 当ul只有一个子元素，且该子元素为li */
  	background-color: cyan;
}
.content ul p:only-of-type {
    /* 当 ul 只有一个 p 元素 */
  	background-color: cyan;
}
.content ul li:empty {
 	/* 选择内容为空的 li */
    background-color: cyan;
}
```


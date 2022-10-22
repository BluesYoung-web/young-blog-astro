---
title: CSS3-02伪元素
date: 2020-12-24 14:02:07
image: /img/css.jpg
description: CSS 伪元素
---

[[toc]]

## 伪元素

<style lang="scss" scoped>
.fake1::first-letter {
  /* 选择内部的第一个字符 */
  background-color: #efc;
  font-size: 50px;
  font-weight: bold;
}
.fake2::first-line {
  /* 选择内部的第一行字符 */
  background-color: #efc;
  font-size: 50px;
  font-weight: bold;
}

.fake3::before {
  /* 在内部元素之前加入以下内容，content可以为空但是必须写 */
  content: '来了老弟-----------';
  color: red;
}
.fake4::after {
  /* 在内部元素之后加入以下内容，content可以为空但是必须写 */
  content: '来了老弟-----------';
  color: red;
}
</style>

<div class="fake1">啦啦啦啦啦啦啦</div>
<div class="fake2">哈哈哈哈哈哈哈</div>
<div class="fake3">原始内容</div>
<div class="fake4">原始内容</div>

```css
.fake::first-letter {
  /* 选择内部的第一个字符 */
  background-color: #efc;
  font-size: 50px;
  font-weight: bold;
}
.fake::first-line {
  /* 选择内部的第一行字符 */
  background-color: #efc;
  font-size: 50px;
  font-weight: bold;
}

.fake::before {
  /* 在内部元素之前加入以下内容，content可以为空但是必须写 */
  content: '来了老弟-----------';
  color: red;
}
.fake::after {
  /* 在内部元素之后加入以下内容，content可以为空但是必须写 */
  content: '来了老弟-----------';
  color: red;
}
```


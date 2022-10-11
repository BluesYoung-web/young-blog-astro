---
layout: "@/layouts/BlogPost.astro"
title: 弹性滚动
description: CSS 弹性滚动
image: /img/css.jpg
date: 2022-07-10 09:40:50
---

[[toc]]

## 父元素

```css
.parent {
  scroll-snap-type: [ x | y ] [ mandatory | proximity ];
  /* scroll-padding: 30px; */
}
```

## 子元素

```css
.child {
  scroll-snap-align: start | center | end;
  /* scroll-margin: 30px; */
}
```

## demo

<style>
.container-demo {
  position: relative;
  height: 30vh;
  overflow: auto;
  scroll-snap-type: y mandatory;
}
.slide {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30vh;
  scroll-snap-align: center;
}

/* Simple coloration */
body {
  margin: 0;
}
.slide {
  font-family: sans-serif;
  background: #FED0D1;
  color: #F34A4E;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.slide:nth-child(2n) {
  background: #F34A4E;
  color: #FED0D1;
}

</style>

<div class="container-demo mt-8">
  <div class="slide">
    <p>Content 1</p>
  </div>
    <div class="slide">
    <p>Content 2</p>
  </div>
    <div class="slide">
    <p>Content 3</p>
  </div>
</div>

```html
<style>
.container-demo {
  position: relative;
  height: 30vh;
  overflow: auto;
  scroll-snap-type: y mandatory;
}
.slide {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30vh;
  scroll-snap-align: center;
}

/* Simple coloration */
body {
  margin: 0;
}
.slide {
  font-family: sans-serif;
  background: #FED0D1;
  color: #F34A4E;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.slide:nth-child(2n) {
  background: #F34A4E;
  color: #FED0D1;
}
</style>

<div class="container-demo mt-8">
  <div class="slide">
    <p>Content 1</p>
  </div>
    <div class="slide">
    <p>Content 2</p>
  </div>
    <div class="slide">
    <p>Content 3</p>
  </div>
</div>
```
---
title: 常用的现代布局
description: CSS 常用的现代布局
image: /img/css.jpg
date: 2022-03-17 16:56:50
---

[[toc]]

## 超级居中

<div class="demo1">
  <div class="son1"></div>
</div>
<style>
.demo1 {
  display: grid;
  place-items: center;
  background-color: skyblue;
  width: 100%;
  height: 20rem;
}
.son1 {
  width: 3rem;
  height: 3rem;
  background-color: pink;
}
</style>

```html
<div class="demo1">
  <div class="son1"></div>
</div>
<style>
.demo1 {
  display: grid;
  place-items: center;
  background-color: skyblue;
  width: 100%;
  height: 20rem;
}
.son1 {
  width: 3rem;
  height: 3rem;
  background-color: pink;
}
</style>
```

## 自适应布局

<div class="demo2">
  <div class="son2"></div>
  <div class="son2"></div>
  <div class="son2"></div>
</div>
<style>
.demo2 {
  display: flex;
  flex-wrap: wrap;
  background-color: skyblue;
  width: 100%;
  height: 20rem;
}
.son2 {
  width: 3rem;
  height: 3rem;
  margin: 1rem;
  background-color: pink;
  /* 自由拉伸 */
  flex: 1 1 150px;
  /* 不拉伸 */
  /* flex: 0 1 150px; */
}
</style>

```html
<div class="demo2">
  <div class="son2"></div>
  <div class="son2"></div>
  <div class="son2"></div>
</div>
<style>
.demo2 {
  display: flex;
  flex-wrap: wrap;
  background-color: skyblue;
  width: 100%;
  height: 20rem;
}
.son2 {
  width: 3rem;
  height: 3rem;
  margin: 1rem;
  background-color: pink;
  /* 自由拉伸 */
  flex: 1 1 150px;
  /* 不拉伸 */
  /* flex: 0 1 150px; */
}
</style>
```

## 经典侧边栏

<div class="demo3">
  <div class="son3 bg-yellow-100" contenteditable>
    Min: 150px / Max: 25%
  </div>
  <div class="son3 bg-purple-100" contenteditable>
    我会占据剩余的空间
  </div>
</div>
<style>
.demo3 {
  display: grid;
  /*分两列，一列最小150px,最大占比25%， 一列自适应*/
  grid-template-columns: minmax(150px, 25%) 1fr;
}
</style>

```html
<div class="demo3">
  <div class="son3 bg-yellow-100" contenteditable>
    Min: 150px / Max: 25%
  </div>
  <div class="son3 bg-purple-100" contenteditable>
    我会占据剩余的空间
  </div>
</div>
<style>
.demo3 {
  display: grid;
  /*分两列，一列最小150px,最大占比25%， 一列自适应*/
  grid-template-columns: minmax(150px, 25%) 1fr;
}
</style>
```

## 上下定高，中间自适应

<div class="demo4">
  <div class="header bg-yellow-100">
    我是顶部
  </div>
  <div class="body bg-blue-100" contenteditable>
    我是中间的内容，我可以自适应
  </div>
  <div class="footer bg-purple-100">
    我是底部
  </div>
</div>
<style>
.demo4 {
  display: grid;
  grid-template-rows: auto 1fr auto;
}
</style>

```html
<div class="demo4">
  <div class="header bg-yellow-100">
    我是顶部
  </div>
  <div class="body bg-blue-100" contenteditable>
    我是中间的内容，我可以自适应
  </div>
  <div class="footer bg-purple-100">
    我是底部
  </div>
</div>
<style>
.demo4 {
  display: grid;
  grid-template-rows: auto 1fr auto;
}
</style>
```

## 圣杯布局

<div class="demo5">
  <div class="left"></div>
  <div class="top"></div>
  <div class="main"></div>
  <div class="bottom"></div>
  <div class="right"></div>
</div>

<style>
.demo5 {
  width: 100%;
  height: 500px;
  background-color: skyblue;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: 1fr 3fr 1fr;
}
.demo5 .top {
  grid-row: 1;
  grid-column: 1/4;
  background: brown;
}
.demo5 .left {
  grid-row: 2/3;
  background: green;
}
.demo5 .main {
  background-color: purple;
  grid-row: 2/3;
  grid-column: 2/3;
}
.demo5 .right {
  background-color: yellow;
  grid-row: 2/3;
}
.demo5 .bottom {
  background-color: gray;
  grid-row: 3;
  grid-column: 1/4;
}
</style>

```html
<div class="demo5">
  <div class="left"></div>
  <div class="top"></div>
  <div class="main"></div>
  <div class="bottom"></div>
  <div class="right"></div>
</div>

<style>
.demo5 {
  width: 500px;
  height: 500px;
  background-color: skyblue;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: 1fr 3fr 1fr;
}
.demo5 .top {
  grid-row: 1;
  grid-column: 1/4;
  background: brown;
}
.demo5 .left {
  grid-row: 2/3;
  background: green;
}
.demo5 .main {
  background-color: purple;
  grid-row: 2/3;
  grid-column: 2/3;
}
.demo5 .right {
  background-color: yellow;
  grid-row: 2/3;
}
.demo5 .bottom {
  background-color: gray;
  grid-row: 3;
  grid-column: 1/4;
}
</style>
```

## 瀑布流布局

<div class="demo6">
  <div></div>
  <div></div>
  <div></div>
  <div></div>
</div>

<style>
.demo6 {
  width: 100%;
  height: 500px;
  background-color: skyblue;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(6, 1fr);
}
.demo6 div:nth-child(1) {
  grid-row: 1 / span 3;
  grid-column: 1 / span 2;
  background-color: blue;
}
.demo6 div:nth-child(2) {
  grid-row: 1 / span 2;
  grid-column: 3 / span 2;
  background-color: red;
}
.demo6 div:nth-child(3) {
  grid-row: 3 / span 4;
  grid-column: 3 / span 2;
  background-color: cyan;
}
.demo6 div:nth-child(4) {
  grid-row: 4 / span 3;
  grid-column: 1 / span 2;
  background-color: brown;
}
</style>

```html
<div class="demo6">
  <div></div>
  <div></div>
  <div></div>
  <div></div>
</div>

<style>
.demo6 {
  width: 100%;
  height: 500px;
  background-color: skyblue;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(6, 1fr);
}
.demo6 div:nth-child(1) {
  grid-row: 1 / span 3;
  grid-column: 1 / span 2;
  background-color: blue;
}
.demo6 div:nth-child(2) {
  grid-row: 1 / span 2;
  grid-column: 3 / span 2;
  background-color: red;
}
.demo6 div:nth-child(3) {
  grid-row: 3 / span 4;
  grid-column: 3 / span 2;
  background-color: cyan;
}
.demo6 div:nth-child(4) {
  grid-row: 4 / span 3;
  grid-column: 1 / span 2;
  background-color: brown;
}
</style>
```

## RAM(随机布局)

<div class="demo7">
  <div class="box">1</div>
  <div class="box">2</div>
  <div class="box">3</div>
  <div class="box">4</div>
</div>

<style>
.demo7 {
  display: grid;
  grid-gap: 1rem;
  /*核心*/
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}
.demo7 .box:nth-child(1) {
  background-color: pink;
}
.demo7 .box:nth-child(2) {
  background-color: purple;
}
.demo7 .box:nth-child(3) {
  background-color: skyblue;
}
.demo7 .box:nth-child(4) {
  background-color: green;
}
</style>

```html
<div class="demo7">
  <div class="box">1</div>
  <div class="box">2</div>
  <div class="box">3</div>
  <div class="box">4</div>
</div>

<style>
.demo7 {
  display: grid;
  grid-gap: 1rem;
  /* 核心，当宽度足够时，直接一行展示，宽度不足时自动换行 */
  /* auto-fit 宽度足够大时依然拉伸填充 */
  /* auto-fill 宽度足够大时不会拉伸 */
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}
.demo7 .box:nth-child(1) {
  background-color: pink;
}
.demo7 .box:nth-child(2) {
  background-color: purple;
}
.demo7 .box:nth-child(3) {
  background-color: skyblue;
}
.demo7 .box:nth-child(4) {
  background-color: green;
}
</style>
```

## 弹性卡片

<div class="demo-8">
  <div class="card bg-yellow-100">
    <h3>Title - Card 1</h3>
    <p contenteditable>Medium length description with a few more words here.</p>
    <div class="visual bg-pink-100"></div>
  </div>
  <div class="card bg-yellow-100">
    <h3>Title - Card 2</h3>
    <p contenteditable>Long Description. Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
    <div class="visual bg-blue-100"></div>
  </div>
  <div class="card bg-yellow-100">
    <h3>Title - Card 3</h3>
    <p contenteditable>Short Description.</p>
    <div class="visual bg-green-100"></div>
  </div>
</div>

<style>
.demo8 {
  height: auto;
  display: grid;
  grid-gap: 1rem;
  /*核心*/
  grid-template-columns: repeat(3, 1fr);
}

.visual {
  height: 100px;
  width: 100%;
}

.card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  justify-content: space-between;
}
</style>

```html
<div class="demo-8">
  <div class="card bg-yellow-100">
    <h3>Title - Card 1</h3>
    <p contenteditable>Medium length description with a few more words here.</p>
    <div class="visual bg-pink-100"></div>
  </div>
  <div class="card bg-yellow-100">
    <h3>Title - Card 2</h3>
    <p contenteditable>Long Description. Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
    <div class="visual bg-blue-100"></div>
  </div>
  <div class="card bg-yellow-100">
    <h3>Title - Card 3</h3>
    <p contenteditable>Short Description.</p>
    <div class="visual bg-green-100"></div>
  </div>
</div>

<style>
.demo8 {
  height: auto;
  display: grid;
  grid-gap: 1rem;
  /*核心*/
  grid-template-columns: repeat(3, 1fr);
}

.visual {
  height: 100px;
  width: 100%;
}

.card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  justify-content: space-between;
}
</style>
```

## 流式布局

**根据不同尺寸展示不同的宽度，核心 —— clamp 函数**

<div class="demo-9">
  <div class="card bg-purple-100">
    <h1>Title Here</h1>
    <div class="visual bg-yellow-100"></div>
    <p>Descriptive Text. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed est error repellat veritatis.</p>
  </div>
</div>

<style>
.demo-9 {
  width: 100%;
  height: 500px;
  background-color: skyblue;
  display: grid;
  place-items: center;
}
.demo-9 .card {
  /* 核心：最小尺寸，首先尺寸，最大尺寸 */
  width: clamp(23ch, 50%, 46ch);
  display: flex;
  flex-direction: column;
  padding: 1rem;
}
.demo-9 .visual {
  height: 125px;
  width: 100%;
}
</style>

```html
<div class="demo-9">
  <div class="card bg-purple-100">
    <h1>Title Here</h1>
    <div class="visual bg-yellow-100"></div>
    <p>Descriptive Text. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed est error repellat veritatis.</p>
  </div>
</div>

<style>
.demo-9 {
  width: 100%;
  height: 500px;
  background-color: skyblue;
  display: grid;
  place-items: center;
}
.demo-9 .card {
  /* 核心：最小尺寸，首先尺寸，最大尺寸 */
  width: clamp(23ch, 50%, 46ch);
  display: flex;
  flex-direction: column;
  padding: 1rem;
}
.demo-9 .visual {
  height: 125px;
  width: 100%;
}
</style>
```

## 展示固定的比例

<div class="demo-10">
  <div class="card blue">
    <h1>Video Title</h1>
    <div class="visual green"></div>
    <p>Descriptive text for aspect ratio card demo.</p>
  </div>
</div>

<style>
.demo-10 {
  display: grid;
  place-items: center;
  background-color: skyblue;
}

.demo-10 .visual {
  /* 核心：保持 16：9 的宽高比 */
  aspect-ratio: 16 / 9;
  background-color: brown;
}

.demo-10 .card {
  width: 50%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: lightblue;
}
</style>

```html
<div class="demo-10">
  <div class="card blue">
    <h1>Video Title</h1>
    <div class="visual green"></div>
    <p>Descriptive text for aspect ratio card demo.</p>
  </div>
</div>

<style>
.demo-10 {
  display: grid;
  place-items: center;
  background-color: skyblue;
}

.demo-10 .visual {
  /* 核心：保持 16：9 的宽高比 */
  aspect-ratio: 16 / 9;
  background-color: brown;
}

.demo-10 .card {
  width: 50%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: lightblue;
}
</style>
```
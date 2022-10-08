---
title: 52-requestAnimationFrame
image: /img/hbs.png
description: JavaScript 动画 API
date: 2021-01-25 08:38:36
---

[[toc]]

## 由来

`setTimeout/setInterval` 实现的定时动画时间间隔及其不确定
  - 每隔一段时间将动画函数加入任务队列
  - 但是任务队列中的任务可能并不会立即执行

浏览器定时器精度：
  - `<=IE8 15.625ms`
  - `>=IE9 4ms`
  - `Firefox 10ms`
  - `Safari 10ms`
  - `Chrome 4ms`

`requestAnimationFrame(cbk)`
  - 浏览器自动计算时间间隔，到时间刷新用户界面
  - 基本不会卡顿
  - `cbk` 可接受一个参数，为下次重绘时间与当前时间戳的差值

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>测试</title>
  <style>
    .main {
      background-color: skyblue;
    }
  </style>
</head>
<body>
  <div style="width: 100px; height: 100px;" class="main"></div>
  <script>
    const d = document.querySelector('.main');
    let width = 0;
    let index = true;
    function update(e) {
      console.log(e);
      width = parseInt(d.style.width) + 5;
      if(width <= 200 && index) {
        d.style.width = width + 'px';
      } else {
        index = false;
      }
      if(width > 100 && !index) {
        width = parseInt(d.style.width) - 5;
        d.style.width = width + 'px';
      } else {
        index = true;
      }
      requestAnimationFrame(arguments.callee);
    }
    requestAnimationFrame(update);
  </script>
</body>
</html>
```

## 取消动画

```js
const reqId = requestAnimationFrame(() => console.log('repaint'));
cancelAnimationFrame(reqId);
```

## 通过`requestAnimationFrame`节流

如果直接将回调函数放在 `scroll` 的事件监听里面执行，在滚动的时候会无数次调用

回调之前封装一层 `requestAnimationFrame`，会将调用限制在每次重绘前发生

加入开关状态，可以过滤多余的调用

再加入定时器，可以限制一段时间内只执行一次

```js
let enabled = true;
function exe() {
  console.log(Date.now());
}
window.addEventListener('scroll', () => {
  if(enabled) {
    enabled = false;
    window.requestAnimationFrame(exe);
    window.setTimeout(() => enabled = true, 50);
  }
});
```
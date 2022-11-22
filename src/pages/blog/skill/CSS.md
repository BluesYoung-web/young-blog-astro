---
title: CSS 相关
description: CSS 相关
date: 2021-12-09 17:42:25
---

[[toc]]

## 移动端拖动不跟手

PC 端的拖动非常流畅，但是切换到移动端之后就会断触(只能移动一小段距离，之后就不再跟手)


```css
.el {
  /* 禁用默认的触摸事件，移动端的拖动就恢复正常了 */
  touch-action: none;
}
```

## 点击穿透

### 具体场景

- A 元素在 B 元素上层
- B 元素需要处理各种鼠标事件
- A 元素需要在除了 B 元素所在位置的其他元素处理鼠标事件

### 解决方案

- **给 A 元素添加 CSS 属性(`pointer-events: none;`)** ，实现**点击 A 穿透到 B**
- **给 A 元素中需要处理鼠标事件的元素添加 `pointer-events: all;` 属性**，恢复需要处理事件的元素处理事件的能力
- JS 阻止点击穿透，`event.stopPropagation()`

```scss
.A {
  position: absolute;
  z-index: 3;
  pointer-events: none;
  .A1, .A2 {
    pointer-events: all;
  }
}
.B {
  position: absolute;
  z-index: 2;
}
```

## `loading="lazy"`

**浏览器原生懒加载**，支持图片和 `iframe`

## 页面滚动无法禁用

尝试监听 `document.on('scroll')`，虽然可以监听到对应的事件，但是无法禁用

**滚动属于 `UI `事件，无法通过 `e.preventDefault()` 来禁用**

**解决方法**
  - 换个角度，禁用所有可以造成页面滚动的事件
  - `window.on`：
    - `'wheel'`
    - `'keyup'/'keydown'`
      - '↑ 38'
      - '↓ 40'
      - 'home 36'
      - 'end 35'
      - 'page up 33'
      - 'page down 34'

```js
// 禁用 wheel 事件的时候报错，添加第三个参数！！！
// Unable to preventDefault inside passive event listener due to target being
window.addEventListener('wheel', (e) => {
  e.preventDefault()
}, { passive: false })
```

## 移动端/CSS

### 使用 vh 布局，软键盘弹出导致的样式错乱

当软件盘弹出时，会导致 `window.innerHeight` 发生改变

```html
<!DOCTYPE html>
<html lang="">
  <head>
    <script>
    window.onerror = function() {
      window.alert('您的浏览器版本过低，请尝试使用其他浏览器或将浏览器升级至最新版本后重试！');
    }
    </script>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta id="viewportMeta" name="viewport" content="maximum-scale=1.0,minimum-scale=1.0,user-scalable=0,width=device-width,initial-scale=1.0">
		<meta name="format-detection" content="telephone=no,email=no,date=no,address=no">
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <script src="<%= BASE_URL %>thinkingdata.umd.min.js"></script>
    <title>分享</title>
  </head>
  <body>
    <noscript>
      <strong>请启用 JavaScript 以获得最佳体验</strong>
    </noscript>
    <script>
      // 设定视口高度，防止软键盘影响布局
      const metaElement = document.querySelector('#viewportMeta');
      metaElement.setAttribute('content', `maximum-scale=1.0,minimum-scale=1.0,user-scalable=0,width=device-width,initial-scale=1.0,height=${window.innerHeight}`);  
    </script>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
```

### 调试

```html
<script src="https://cdn.bootcdn.net/ajax/libs/vConsole/3.9.0/vconsole.min.js"></script>
<script>
new VConsole();
</script>
```

### 钉钉内置浏览器图像变形

**给 img 标签外层包裹 div 标签**

### globalThis is not defined

`node12+, chrome71+` 才支持的标准，之前的版本不存在

```html
<!-- hack -->
<script>
this.globalThis || (this.globalThis = this);
</script>
```

### 360 极速浏览器图片设置为百分比高度，首次加载变形

```js
img.onload = function (e) {
  e.style.height = `${e.natureHeight}px`
}
```

### 网站添加到手机主屏幕

```html
<head>
  <!-- 主题色，如果不设置可能会导致不同机型导航栏颜色表现不一致 -->
  <meta name="theme-color" content="#ffffff">

  <!-- 安卓图标 -->
  <link rel="shortcut icon" type="image/x-icon" href="图片地址">
  <!-- <link rel="mask-icon" href="//res.wx.qq.com/a/wx_fed/assets/res/MjliNWVm.svg" color="#4C4C4C" reportloaderror=""> -->
  <!-- apple-touch-icon 系统会自动给图标添加圆角及高光 -->
  <!-- apple-touch-icon-precomposed 系统不会添加圆角及高光 -->
  <!-- 苹果图标 -->
  <!-- <link rel="apple-touch-icon-precomposed" href=""> -->
  <link rel="apple-touch-icon" href="">
  <!-- 一键添加到桌面，并且打开状态为全屏 -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <!-- 控制苹果状态栏样式 -->
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <!-- title 会默认作为应用名称 -->
  <title>xxxx-高光</title>
</head>
```
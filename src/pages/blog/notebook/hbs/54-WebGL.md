---
title: 54-WebGL
image: /img/hbs.png
description: JavaScript WebGL
date: 2021-01-25 10:16:05
---

## 定义

画布的 `3d` 上下文

基于 `OpenGL 2.0` 定制

`WebGl` 涉及的复杂计算需要提前知道数值的精度，而标准的 `JavaScript` 无法满足精度的需求

为此 `WebGL` 引入了 **类型化数组**

类型化数组的核心就是一个名为 `ArrayBuffer` 的类型

每个 `ArrayBuffer` 对象表示的只是内存中指定的字节数

`ArrayBuffer` 对象能获得的信息只有它包含的字节数

```js
var buffer = new ArrayBuffer(20);
var bytes = buffer.byteLength;
// 基于缓冲区创建视图
var view = new DataView(buffer);
// 创建一个开始于字节9的视图
var view = new DataView(buffer, 9);
// 创建一个从字节9到字节18的视图
var view = new DataView(buffer, 9, 10);
```

[Web GL 中文网](http://www.hewebgl.com/)
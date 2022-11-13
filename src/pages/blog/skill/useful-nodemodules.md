---
title: 实用的 node 依赖包
description: 实用的 node 依赖包
date: 2022-11-13 17:20:00
---

[[toc]]

## canvas 操作

### `fabric`

**`@types/fabric` 需要依赖 `canvas` 包！！！**

```ts
import { fabric } from 'fabric';

// 需要不交互的 canvas 时使用，有交互需求直接实例化 fabric.Canvas
const canvas = new fabric.StaticCanvas('poster', {
  width,
  height
});

// 顶部黑色背景
const top = new fabric.Rect({
  left: 0,
  top: 0,
  fill: 'black',
  width,
  height: topHeight
});
canvas.add(top);

// 图形绘制
const icon = new Image();
// 如果图片跨域，则需要以下两个属性，否则无法正常导出
icon.crossOrigin = 'anonymous';
icon.referrerPolicy = 'no-referrer';

icon.src = '图片地址';
icon.onload = () => {
  const oImg = new fabric.Image(icon);
  // 将图片缩放到指定的宽高
  oImg.scaleToHeight(iconWidth);
  oImg.scaleToWidth(iconWidth);

  oImg.left = width / 5 * 2;
  oImg.top = (topHeight - iconWidth) / 2;

  canvas.add(oImg);
};

```

## 二维码

### `qrcode-with-logos`

能绘制出带有 logo 图像的二维码

```ts
import QRCode from 'qrcode-with-logos';

// 得到 base64 编码的图片
const qrcode_src = await new QRCode({
  content: '用于生成目标地址的链接',
  logo: {
    src: '要放入二维码中心的 logo 地址'
  }
}).getCanvas().then((c) => c.toDataURL());
```
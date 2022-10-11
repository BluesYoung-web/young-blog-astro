---
layout: "@/layouts/BlogPost.astro"
title: 53-Canvas
image: /img/hbs.png
description: JavaScript Canvas
date: 2021-01-25 09:46:23
---

[[toc]]

## 画布类型

`2d`

`webgl`

## 使用步骤

获取 `element`

获取上下文对象 `ctx = element.getContext('2d' || 'webgl')`

绘制

导出图片 `element.toDataURL('MIME/TYPE')`

## `2d`上下文

可绘制简单的 `2d` 图形，比如矩形、弧线和路径

`ctx.save()` 保存现场

`ctx.restore()` 恢复现场

### 画笔属性

`ctx.fillStyle` 设置或返回用于**填充**绘画的颜色、渐变或模式

`ctx.strokeStyle` 设置或返回用于**笔触**的颜色、渐变或模式

`ctx.shadowColor` 设置或返回用于**阴影**的颜色，默认黑色

`ctx.shadowBlur` 设置或返回用于阴影的模糊级别，默认0

`ctx.shadowOffsetX` 设置或返回阴影距形状的水平距离，默认0

`ctx.shadowOffsetY` 设置或返回阴影距形状的垂直距离，默认0

`ctx.lineCap` 设置或返回线条的结束端点样式

`ctx.lineJoin` 设置或返回两条线相交时，所创建的拐角类型

`ctx.lineWidth` 设置或返回当前的线条宽度

`ctx.miterLimit` 设置或返回最大斜接长度

### 矩形相关

`ctx.fillRect(x, y, width, height)` 填充矩形

`ctx.strokeRect(x, y, width, height)` 矩形描边

`ctx.clearRect(x, y, width, height)` 清除矩形区域

### 路径相关

`ctx.beginPath()` 开始绘制新路径

`ctx.closePath()` 绘制一条连接到起点的线条

`ctx.fill()` 填充路径

`ctx.stroke()` 给路径描边

`ctx.clip()` 剪切路径所包含的区域，填充在外部的图像不会显示

`ctx.isPointInPath(x, y)` 确定 `(x, y)` 是否位于路径上

`ctx.arc(x, y, r, start, end, isReverse)` 以 `(x, y)` 为圆心，`r` 为半径，起始角 `start`（弧度）,结束角 `end`，是否逆时针绘制(`true`)

`ctx.arcTo(x1, y1, x2, y2, r)` 从上一点开始绘制一条弧线，到 `(x2, y2)` 为止，并以半径 `r` 穿过 `(x1, y1)`

`ctx.quadraticCurveTo(c1x, c1y, x, y)` 从上一点开始绘制一条二次贝塞尔曲线，到 `(x, y)` 为止，以 `(c1x, c1y)` 为控制点

`ctx.bezierCurveTo(c1x, c1y, c2x, c2y, x, y)` 从上一点开始绘制一条三次贝塞尔曲线，到 `(x, y)` 为止，以 `(c1x, c1y)`，`(c2x, c2y)` 为控制点

`ctx.lineTo(x, y)` 从上一点开始绘制一条直线到 `(x, y)` 为止

`ctx.moveTo(x, y)` 将画笔移动到 `(x, y)` **不绘制**图形

`ctx.rect(x, y, width, height)` 从 `(x, y)` 开始绘制一个矩形路径

### 文本相关

`ctx.fillText(str, x, y, maxwidth)` 绘制文本

`ctx.strokeText(str, x, y, maxwidth)` 文本描边

`ctx.font` 字体，`"10px Arial"`

`ctx.textAlign` 对齐方式，`start,center,end`

`ctx.textBaseline`文本的基线，`top | hanging | middle | alphabetic | ideographic | bottom`

### 变换相关

`ctx.rotate(angle)` 围绕原点旋转 `angle` 弧度

`ctx.scale(x, y)`，**缩放**，`x` 方向变换 `x` 倍，`y` 方向变换 `y` 倍

`ctx.translate(x, y)` 移动坐标原点到 `(x, y)`

`ctx.transform()` 直接修改变换矩阵

`ctx.setTransform()` 将变换矩阵重置为默认状态，再调用 `transform()`

### 图像相关

`ctx.drawImage()`
  - `(img, x, y)` `img` 元素，绘制图像的起点，终点
  - `(img, x, y, width, height)` `img`元素，绘制图像的起点，终点，绘制后的宽度和高度（可用于缩放）
  - `(img, sx, sy, sw, sh, dx, dy, dw, dh)` `img`元素，原图中的起点，终点，宽度，高度，目标画布中的起点，终点，宽度，高度

可绘制图像、画布或视频

不支持跨域

```html
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	<title>Canvas测试</title>
</head>
<body>
	<p>要使用的视频：</p>
	<video id="video1" controls width="270" src="https://www.runoob.com/wp-content/uploads/2013/11/mov_bbb.mp4" autoplay>
	</video>
	<p>画布（每 20 毫秒，代码就会绘制视频的当前帧）：</p>
	<canvas id="myCanvas" width="270" height="135" style="border:1px solid #d3d3d3;">
		Your browser does not support the HTML5 canvas tag.
	</canvas>
	<script>
		const v = document.getElementById("video1");
		const c = document.getElementById("myCanvas");
		ctx = c.getContext('2d');

		let i;
		v.addEventListener('play', () => {
			i = window.setInterval(() => {
				ctx.drawImage(v, 0, 0, 270, 135)
			}, 20);
		});
		v.addEventListener('pause', () => {
			window.clearInterval(i);
		});
		v.addEventListener('ended', () => {
			clearInterval(i);
		});
	</script>
</body>
</html>
```

### 渐变

**线性渐变**
- `ctx.createLinearGradient(sx, sy, ex, ey)` 创建渐变对象，起点 `x`，起点 `y`，终点 `x`，终点 `y`
- `ctx.addColorStop(0 ~ 1, colorstring)` 指定起点 ~ 终点颜色
- 将渐变对象赋给 `fillStyle` 或 `strokeStyle`

**径向渐变**
- `ctx.createRadialGradient(sx, sy, sr, ex, ey, er)` 创建渐变对象，起点 `x`，起点 `y`，起点半径，终点 `x`，终点 `y`，终点半径
- 指定颜色
- 将渐变对象赋给 `fillStyle` 或 `strokeStyle`

### 模式

**重复的图像，类似于 `css` 的 `repeat`**

`ctx.createPattern(img, 'repeat')`

将模式对象赋给 `fillStyle` 或 `strokeStyle`

### 使用图像的数据

可对图像进行处理

**`ctx.getImageData`**
- `ctx.getImageData(x, y, w, h)` 要获取数据的区域的 `x，y` 以及宽度，高度
- 返回的对象具有 `width`，`height` 以及 `data` 三个属性
- `data` 为保存图像数据的数组，每4个相邻的元素分别保存 `r,g,b,a`
- 取值均为 `[0, 255]`
- 求平均值再赋值可二值化

**`ctx.putImageData(imgData, x, y, dx, dy, dw, dh)`**
- 规定要放回画布的 `ImageData` 对象
- `ImageData` 对象左上角的 `x` 坐标，以像素计
- `ImageData` 对象左上角的 `y` 坐标，以像素计
- 可选。在画布上放置图像 `x` 的位置
- 可选。在画布上放置图像 `y` 的位置
- 可选。在画布上绘制图像所使用的宽度
- 可选。在画布上绘制图像所使用的高度

**`ctx.createImageData`**
- 创建新的空白`ImageData`对象
- 默认像素值 `transparent``black`
- `createImageData(width,height)`
- **`createImageData(imageData)` 只复制宽高，不复制内容**

### 合成

`ctx.globalAlpha` 全局透明度

`ctx.globalCompositionOperation` 后绘制的图形与先绘制的图形的位置关系
- `source-over` 后来居上，默认值
- `source-in` 重叠部分可见，两者其余部分全透明
- `source-out` 不重叠部分可见，先绘制的全透明
- `source-atop` 重叠部分可见，先绘制的不受影响
- `destination-over` 后绘制的位于下方，只有透明像素下的部分可见
- `destination-in` 后绘制的位于下方，两者其余部分全透明
- `destination-out` 后绘制的擦除重叠部分
- `destination-atop` 后绘制的位于下方，不重叠部分先绘制的变透明
- `lighter` 重叠部分的值相加，变亮
- `copy` 后绘制的图形完全替代与之重叠的先绘制的图形
- `xor` 重叠部分进行异或操作
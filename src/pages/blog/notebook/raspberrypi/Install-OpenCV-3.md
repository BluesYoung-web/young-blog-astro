---
layout: "@/layouts/BlogPost.astro"
title: 树莓派安装 OpenCV3
date: 2020-12-23 15:40:26
image: /img/raspberrypi.jpg
---

[[toc]]

## 安装 OpenCV 3

### 配置并更新树莓派系统

```bash
sudo raspi-config   // 进入后打开摄像头、SSH
sudo apt-get update
sudo apt-get upgrade
sudo rpi-update
```

### 安装OpenCV的相关工具

```bash
sudo apt-get install build-essential cmake git pkg-config
```

### 安装OpenCV的图像工具包

```bash
sudo apt-get install libjpeg8-dev 
sudo apt-get install libtiff5-dev 
sudo apt-get install libjasper-dev 
sudo apt-get install libpng12-dev 
```

### 安装视频I/O包

```bash
sudo apt-get install libavcodec-dev libavformat-dev libswscale-dev libv4l-dev
```

### 安装gtk2.0和优化函数包

```bash
sudo apt-get install libgtk2.0-dev
sudo apt-get install libatlas-base-dev gfortran
```

### 下载OpenCV源码

推荐电脑下载压缩包后传入树莓派，git 太慢

https://github.com/opencv/opencv

### 安装OpenCV

```bash
// 进入 opencv 目录
cd opencv
// 创建release文件夹
mkdir release
// 进入release目录下
cd release
// cmake读入所有源文件之后，自动生成makefile
cmake -D CMAKE_BUILD_TYPE=RELEASE \
-D CMAKE_INSTALL_PREFIX=/usr/local ..
// 编译，时间很长（我的 8GB 树莓派4B 花了 3 个多小时）
sudo make
// 安装
sudo make install
//更新动态链接库
sudo ldconfig
```

### 解决无法打开摄像头硬件问题

我没有出现过这个问题

```bash
sudo nano /etc/modules
// 进入编辑界面后，在末尾添加输入
snd-bcm2835
bcm2835-v4l2
```

## 测试代码

简易监控

```python
#!/usr/bin/python3
# -*- coding: utf-8 -*-
import cv2
import tkinter as tk

'''
获取屏幕参数
'''
def getScreenCenter():
	root = tk.Tk()
	return root.winfo_screenwidth() // 2, root.winfo_screenheight() // 2

'''
获取窗口居中位置
'''
def getRealCenter(width, height):
	cw, ch = getScreenCenter()
	return (cw - width // 2), (ch - height // 2)

# 开启摄像头
cap = cv2.VideoCapture(0)
print("is open?", cap.isOpened())

# 定义窗口大小
winWidth = 800
winHeight = 600

# 实时显示摄像头拍到的界面
while(True):
	# 读取摄像头图像
	ret, frame = cap.read()
	# 创建窗口
	cv2.namedWindow("frame", 0)
	# 调整窗口大小（宽度， 高度）
	cv2.resizeWindow("frame", winWidth, winHeight)
	# 移动窗口至屏幕中心
	offsetX, offsetY = getRealCenter(winWidth, winHeight)
	cv2.moveWindow("frame", offsetX, offsetY)
	'''显示灰色
	# 图像中心点位置
	center = (frame.shape[1] // 2, frame.shape[0] // 2)
	# 转灰度图
	gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
	# 画圆圈
	cv2.circle(gray, center = center, radius = 100, color=(0, 0, 255))
	# 显示图片
	cv2.imshow("frame", gray)
	'''
	
	# ‘’'显示彩色
	# 显示原始图像
	cv2.imshow("frame", frame)
	# '''
	
	# 结束显示
	if cv2.waitKey(1) & 0xFF == ord('q'):
		break
    
# 释放摄像头
cap.release()
# 关闭窗口
cv2.destroyAllWindows()
```
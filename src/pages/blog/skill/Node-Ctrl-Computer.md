---
title: 使用 node 脚本操控图形界面的应用程序执行特定的任务
description: 使用 node 脚本操控图形界面的应用程序执行特定的任务
date: 2022-03-26 11:00:00
---

[[toc]]

## 目标

实现使用 node 脚本替代人工执行重复的操作

## 核心库

[robotjs](https://github.com/jitsi/robotjs)

[官方文档](https://robotjs.io/docs/syntax)

### 优点

可以使用代码操作鼠标及键盘动作

### 缺陷

模拟输入字符串时，可能会出现**重复字符只输入一次的 bug**

### 核心代码

```js
const robot = require("@jitsi/robotjs");
// 设置字符间隔
robot.setKeyboardDelay(50);
// 设置鼠标移动间隔
robot.setMouseDelay(50);
// 移动鼠标到特定的位置
robot.moveMouse(x, y);
// 点击鼠标
robot.mouseClick();

// 按下特定的按键
robot.keyTap('delete');

// 切换窗口(按键加修饰键)
robot.keyTap('tab', 'alt');
    

const shell = require('shelljs');
// 复制字符串到剪切板
shell.exec(`echo ${str} | clip`);
// 粘贴替代输入
robot.keyTap('v', 'control');
```
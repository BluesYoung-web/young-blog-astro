---
title: 51-事件模拟
image: /img/hbs.png
description: JavaScript 事件模拟
date: 2021-01-23 16:02:17
---

[[toc]]

## 创建模拟事件

`const event = document.createEvent(eventType)`

`eventType`：
  - `DOM2->UIEvents | DOM3->UIEvent`
  - `MouseEvents | MouseEvent`
  - `HTMLEvents | 被拆解`
  - `无 | KeyboardEvent`
  - `无 | CustomEvent`

### 模拟鼠标事件

`event.initMouseEvent(...args)`

`args`：
  - `type` 要触发的事件，'click'
  - `bubbles` 布尔值，是否冒泡
  - `cancelable` 布尔值，是否可以取消
  - `view` 与事件关联的视图，`document.defaultView`
  - `detail` 整数，关于事件的额外信息，0
  - `screenX` 相对于屏幕的 x 坐标
  - `screenY` 相对于屏幕的 y 坐标
  - `clientX` 相对于视口的 x 坐标
  - `clientY` 相对于视口的 y 坐标
  - `ctrlkey` 是否按下 `ctrl` 键，默认 false
  - `altkey` 是否按下 `alt` 键，默认 false
  - `shiftkey` 是否按下 `shift` 键，默认 false
  - `metakey` 是否按下 `meta` 键，默认 false
  - `button` 按下了的按钮，默认 0
  - `relatedTarget` 与事件相关的对象

### 模拟键盘事件

`event.initKeyboardEvent(...args)`

`args`：
  - `type` 要触发的事件，'keydown'
  - `bubbles`
  - `cancelable`
  - `view`
  - `key` 按下按键的字符串代码
  - `location` 按下按键的位置：
    - 0 默认键
    - 1 左边
    - 2 右边
    - 3 数字键盘
    - 4 虚拟按键盘
    - 5 游戏手柄
  - `modifiers` 空格分隔的修饰键列表
  - `repeat` 连续按键次数

### 自定义事件

`event.initCustomEvent(...args)`

`args`
  - `type`
  - `bubbles`
  - `cancelable`
  - `detail`

## 触发模拟事件

`element.dispatchEvent(event)`

`element.focus()`

`element.click()`

`...`
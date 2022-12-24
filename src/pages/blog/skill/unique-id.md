---
title: 生成唯一ID
description: 生成唯一ID
date: 2022-12-24 09:20:00
---

[[toc]]

## 原生

### 极简

```js
// 获取随机数，转换为 36 进制，截取小数点后面的字符串
Math.random().toString(36).slice(8);
```

### 加密

基于 [crypto.randomUUID()](https://caniuse.com/?search=crypto.randomUUID)

使用简单便捷，但是兼容性目前还不够完善

## 第三方库

### uuid

传统工具库

### nanoid

新兴工具库

`uuid` 的替代者
---
title: nuxt3 相关
description: nuxt3 相关
date: 2023-09-02 10:10:00
image: https://api.iconify.design/logos:nuxt.svg
---

[[toc]]

## 项目部署到非根路径

1. 修改 `nuxt.config.ts`：
  
  - `ssr: false`
  - `router.options.hashMode: true`

2. 注入环境变量：

  - `NUXT_APP_CDN_URL`
  - 项目部署后的完整路径，包含协议，以 `/` 结尾

## 低端浏览器兼容

修改 `nuxt.config.ts`：

  - `vite.build.target: 'es2015`
  - 目前测试过最低兼容 `Chrome69`
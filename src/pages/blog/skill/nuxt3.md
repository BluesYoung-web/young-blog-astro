---
title: nuxt3 相关
description: nuxt3 相关
date: 2023-09-02 10:10:00
image: /img/logos-nuxt.svg
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

## 模块开发

> **注意：最好只编译 esm 的，不然运行时会报错**

### 可能会用到的依赖

```json
{
  "devDependencies": {
    "@nuxt/kit": "^3.7.3",
    "@nuxt/schema": "^3.7.3",
    "nuxt": "^3.7.3",
    "unbuild": "^2.0.0"
  }
}
```

### 插件配置类型提示

> 需要在插件入口文件配置下列的内容，不然 `unbuild` 之后会得到一个空的类型文件

```ts
// NAME 为当前的包名, YoungLazyLoadOptions 为选项类型, 按需替换
declare module '@nuxt/schema' {
  interface NuxtConfig {
    [NAME]?: YoungLazyLoadOptions
  }
  interface NuxtOptions {
    [NAME]?: YoungLazyLoadOptions
  }
}
```

## 部署到 netlify

必要条件：**正确设置 `Functions directory`**

> 如果这一步出错了，那么部署之后永远都是 `404`。例如：我将默认的编译目录修改成了 `dist`，那么**配置目录应当为：`dist/server`**

不知道是不是必须条件，反正在摸索过程中设置了。`package.json -> scripts -> start: "node dist/server/index.mjs"`
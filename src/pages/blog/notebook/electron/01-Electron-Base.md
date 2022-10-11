---
layout: "@/layouts/BlogPost.astro"
title: Electron 基础
description: Electron 基础
date: 2022-06-13 10:12:00
image: /img/electron.svg
---

[[toc]]

## 安装

<n-alert type="warning">**应该会失败，需要多试几次**</n-alert>

```bash
# 开发
yarn add -D electron
# 安装打包需要的依赖
yarn add --dev @electron-forge/cli
# 初始化
npx electron-forge import
# 打包
# (可以看到源码的包，其他格式需要配置复杂的证书什么的，暂不考虑)
yarn package
```

## 项目结构

```bash
.
├── dist # 前端页面源码
│   ├── assets
│   ├── favicon.ico
│   └── index.html # 部署情况下引用此静态文件
├── index.html
├── LICENSE
├── main.js # electron 应用入口文件
├── node_modules
├── out # 打包输出目录
├── package.json
# 在页面渲染之前调用
# 可以访问 node api 并且拥有同扩展程序对页面 DOM 的访问能力
# 可以对 window 对象进行注入
├── preload.js
├── public
│   └── favicon.ico
├── README.md
├── src # 前端页面源码
│   ├── App.vue
│   ├── auto-imports.d.ts
│   ├── env.d.ts
│   ├── hooks
│   └── main.ts
├── src.txt
├── tsconfig.json
├── tsconfig.node.json
├── unocss.config.ts
├── vite.config.ts
└── yarn.lock
```

## 注意事项

<n-alert type="warning">**前端项目的基础路径必须为 `./`，否则打包之后无法访问 `js` 和 `css` 文件**</n-alert>

```html
<!-- CSP，不加控制台会有警告，官方示例未提供 "worker-src blob:;" -->
<meta
  http-equiv="Content-Security-Policy"
  content="script-src 'self' 'unsafe-inline';worker-src blob:;"
/>
```

## skill

```js
// main.js 跨域
win.webContents.session.webRequest.onBeforeSendHeaders(
  (details, cbk) => {
    cbk({
      requestHeaders: {
        ...details.requestHeaders,
        origin: '*',
      }
    });
  }
);
win.webContents.session.webRequest.onHeadersReceived(
  (details, cbk) => {
    cbk({
      responseHeaders: {
        ...details.responseHeaders,
        'Access-Control-Allow-Origin': ['*']
      }
    });
  }
);
// 启用调试工具(开启控制台)
win.webContents.openDevTools();

// preload.js 对 window 对象进行注入
const { contextBridge } = require('electron')
contextBridge.exposeInMainWorld('YoungLiveData', [
  {
    name: 'cctv',
    url: 'http://xxx.xxx.xxx.xxx:xxxx/xxx.m3u8'
  }
]);

// index.html
window.YoungLiveData ==> [
  {
    name: 'cctv',
    url: 'http://xxx.xxx.xxx.xxx:xxxx/xxx.m3u8'
  }
];
```
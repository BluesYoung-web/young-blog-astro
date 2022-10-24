---
title: pnpm workspace 操作
description: pnpm workspace 操作
date: 2022-05-17 10:29:29
---

[[toc]]

## 构建项目

1. 根据预期建立对应的目录，执行 `pnpm init`
2. 新建文件 `pnpm-workspace.yaml`，内容如下:

```yaml
# 指出所包含的子包(包名为子目录下 package.json 的 name)
packages:
  - 'packages/*' # 此目录下的所有包
  - 'playground' # 单个包
```

3. 分别进入每个子目录，执行 `pnpm init`，最终的目录结构如下：

```bash
.
├── node_modules
├── packages
│   ├── call-app
│   │   └── package.json
│   └── casdoor-auth
│       └── package.json
├── playground
│   └── package.json
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

## 命令执行

`-w` 针对整个工作区

`--filter package-name` 针对特定的包

```bash
# 依赖安装
# 给整个工作区安装
pnpm add package-name -w
# 针对特定的包安装(优先在工作区内查找，找不到再安装远程包)
pnpm add package-name --filter sub-package-name

# 指令执行(只执行特定子包下的命令)
pnpm test --filter playground
```

## `package.json` 中与 npm 包有关的字段

```json
{
  // 默认导出部分
  // 指定 require 的入口文件
  "main": "dist/index.cjs.js",
  // 指定 import 的入口文件
  "module": "dist/index.es.js",
  // 指定 TypeScript 类型声明文件
  "types": "dist/index.d.ts",
  
  // 多入口导出
  "exports": {
    ".": {
      "require": "./dist/index.cjs.js",
      "import": "./dist/index.es.js",
      "types": "./dist/index.d.ts"
    }
  },

  // 浏览器端使用，主要是为了兼容 webpack4
  "browser": {
    ".": "dist/index.umd.js"
  },

  // 指定 unpkg cdn 读取的文件
  // <script src="//unpkg/young-call-app"></script>
  "unpkg": "dist/index.umd.js",
  // 指定 jsdelivr cdn 读取的文件
  // <script src="//cdn.jsdelivr.net/npm/young-call-app"></script>
  "jsdelivr": "dist/index.umd.js",
  // 指定要上传到 npm 的白名单
  "files": [
    "dist"
  ],
  // 副作用配置，指定为 false 可以随意进行摇树优化
  "sideEffects": false
}

```
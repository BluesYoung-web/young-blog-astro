---
layout: "@/layouts/BlogPost.astro"
title: webpack-02-优化
description: webpack-02-优化
date: 2021-09-22 09:54:53
image: /img/webpack.jpeg
---

[[toc]]

## 开发环境

```js
module.exports = {
  devServer: {
    // 开启热更新
    hot: true,
    // 启用 gzip 压缩
    compress: true,
    // 监听端口
    port: 8080,
    // 打开浏览器
    open: true
  },
  // eveal-source-map 速度快且调试友好
  // eveal-cheap-module-source-map 速度快且调试友好
  // nosource-source-map 隐藏源代码
  // hidden-source-map 隐藏源代码
  // source-map 调试友好
  // cheap-module-source-map 调试友好
  devtools: 'eveal-source-map'
}
```

## 生产环境

### `oneOf`

每个文件对于 `rules` 中的规则都会**遍历**一遍

使用 `oneOf` 可以实现**只要匹配到了任意一条规则即可退出**

不过在 `oneOf` 的配置中**不能两个配置处理同一种类型的文件**

```js
module.exports = {
  module: {
    rules: [
      {
        oneOf: [
          // ...
        ]
      }
    ]
  }
}
```

### `babel` 缓存

`babel` 在转译 `js` 的过程中性能消耗非常大

启用 `babel` 缓存，当在二次打包时会尝试读取缓存中的内容，从而提高打包速度

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          // 开启babel缓存。第二次构建时，会读取之前的缓存
          cacheDirectory: true
        }
      }
  ]
  }
}
```

### 多进程

`thread-loader`

```js
module.exports = {
  module: {
    rules: [
      {
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 2 //两个进程
            }
          },
          // ...
        ]
      }
    ]
  }
}
```

### `externals`

拒绝打包的外部模块

```js
module.exports = {
  jquery: 'jQuery'
}
```

### DLL

动态链库技术(`webpack.DllPlugin`)

对某些库(`vue`)进行单独的打包

### 缓存

缓存可以降低网络流量，提升网站的加载速度

但是强缓存会导致文件不能及时更新的问题

打包时，通过给文件名增加 `hash` 值可以有效解决

`hash` 值的类型：
  - `hash` 每次打包时生成的唯一一个 `hash` 值
  - `chunkhash` 根据 `chunk` 生成 `hash` 值，来源于同一个 `chunk`， `hash` 值就一样
  - `contenthash` 根据文件内容生成 `hash` 值，文件内容不变，`hash` 值就不变

### 摇树优化

使用 `ES6` 模块

启用 `production` 环境

**防止误删副作用文件，需要将其加入 `package.json` 中的 `sideEffects` 配置**

`"sideEffects":["*.css"]`

### 代码分割

`node_modules` 自成一脉

多入口大于 `30k` 单独打包

```js
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}
// 魔法注释(带预加载) 
import(/*webpackChunkName: 'test',webpackPrefetch: true*/./test)
  .then(() => {})
  .catch(() => {})
```
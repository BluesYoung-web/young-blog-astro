---
title: webpack-03-Loader
description: webpack-03-Loader
date: 2021-09-22 09:55:12
image: /img/webpack.jpeg
---

[[toc]]

## `Loader`

**单一职责，只需完成一种转换**

### 同步

同步返回转换后的内容

转换过程会阻塞整个构建，构建缓慢，不适用于耗时较长的环境

**返回方式：**
  - `return`
  - `this.callback`

```js
module.exports = function(source, map, meta){
  // 直接返回，output为处理后结果
  return output；
  // 使用回调函数返回
  this.callback(
    err: Error | null, // 是否出错
    content: string | Buffer, // 转换后的内容
    sourceMap?: SourceMap, // 与编译后代码所映射的源代码
    meta?: any // 传递给下一个 loader 所使用的数据
  );
}
```

### 异步

异步返回转换后的内容

适用于计算量大，耗时较长的场景

```js
module.exports = function(content, map, meta) {
  // 获取callback函数
  const callback = this.async();
  // 用setTimeout模拟该异步过程
  setTimeout(() => {
    // 处理后获得的结果output
    const output = dealOperation(source);
    // 调用回调函数
    callback(null, output, map, meta);
  }, 100);
}
```

### 文件转换后的类型

一般情况下，资源文件经过转换之后都是 `utf-8` 格式的字符串

**但是对于图片这种二进制格式的内容，为了让 `loader` 支持接收二进制资源，需要设置 `raw`**

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          'url-loader',
          'raw-test-loader',// 自己的loader
        ]
      }
    ]
  }
}
// raw-test-loader.js
module.exports = function(source, map, meta) {
  // 处理输入的资源
  const output = dealOperation(source);
  return output;
}
// 通过该属性告诉webpack该loader是否需要二进制数据
module.exports.raw = true;
```

### `options` 选项

对于 `webpack` 配置中，`loader` 往往有一些 `options` 参数

推荐使用官方提供的 `loader-utils` 获取 `options` 参数

```js
const loaderUtils = require('loader-utils');

module.exports = function (source, map, meta){
  // 获取options
  const options = loaderUtils.getOptions(this);
  const output = dealOperation(source, options); 
  return output;
}
```

### 缓存

`webpack` **默认会缓存所有 `loader` 的处理结果**

可以通过执行 `this.cacheable(false)` 来关闭缓存

### 自定义 `Loader`

```js
// format-letters-loader.js
const loaderUtils = require('loader-utils');

const Lowercase2Uppercase = 'L2U';
const Uppercase2Lowercase = 'U2L';

module.exports = function (source, map, meta) {
  let output = '';
  // 获取options
  const options = loaderUtils.getOptions(this);
  const { formatType } = options;
  switch(formatType) {
    case Lowercase2Uppercase: 
      output = source.toUpperCase();
      break;
    case Uppercase2Lowercase: 
      output = source.toLowerCase();
      break;
    default: 
      output = source;
      break;
  }

  this.callback(null, output, map, meta);
};
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [
      {
        exclude: /\.(css|js|html|png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'asset',
            }
          },
          {
            loader: 'format-letters-loader',
            options: {
              formatType: 'U2L'
            }
          },
        ]
      }
    ]
  },
  // 解析loader包是设置模块如何被解析
  resolveLoader: {
    // 告诉 webpack 解析loader时应该搜索的目录。
    modules: ['./node_modules', './loader'],
  },
}
```
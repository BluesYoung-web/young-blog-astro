---
title: webpack-01-基础
description: webpack-01-基础
date: 2021-09-22 09:47:53
image: /img/webpack.jpeg
---

[[toc]]

## 入口配置(`entry`)

### 单入口

键值为 `string`

打包形成一个 `chunk`，输出一个 `bundle`

```js
module.exports = {
  entry: './index.js'
}
```

### 多入口

键值为：
  - `string[]`，打包形成一个 `chunk`，输出一个 `bundle`
  - `Record<string, string>`，打包形成 `n` 个 `chunk`，输出 `n` 个 `bundle`

```js
// string[]
module.exports = {
  entry: ['./index1.js', './index2.js']
}
// Record<string, string>
module.exports = {
  entry: {
    a: './index-a.js',
    b: './index-b.js'
  }
}
```

### 动态入口

**键值为一个函数，返回 `string | string[] | Record<string, string>`**

## 输出

### 名称

```js
module.exports = {
  // 输出路径 + 文件名称
  filename: '[name].js',
  // 非入口 chunk 的名称
  chunkFilename: '[name]_chunk.js'
}
```

### 路径

```js
module.exports = {
  // 配置输出文件的存放目录，必须为 string 类型的绝对路径
  path: path.resolve(__dirname, 'dist_[hash]'),
  // 配置所有资源引入公共路径的前缀
  publicPath: 'https://cdn.example.com'
}
```

### 输出库

需要构建一个可以被其他模块导入使用的库的时候配置

`library` 库名称

`libraryTarget` 配置导出库的模块类型(`esm | cjs | iife`)

## `Loader`

**`webpack` 本身只能理解 `js` 和 `json` 文件**

**通过 `loader` 让 `webpack` 能够去处理其他类型的文件**，并将其转换为有效的模块以供程序使用

### 样式资源

```js
module.exports = {
  module: {
    // 逆序执行
    rules: [
      {
        // 对以 css 结尾的文件进行的处理
        test: /\.css$/,
        use: [
          // 创建 style 标签，将 js 中的样式资源插入 html 之中
          'style-loader',
          // 将 css 文件装换为 commonjs 模块加载到 js 中
          'css-loader',
          // 处理 css 兼容(加入特定的前缀之类的)
          'postcss-loader' 
        ]
      },
      {
        // 对以 less 结尾的文件进行的处理
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          // 将 less 文件编译为 css 文件
          'less-loader'
        ]
      }
    ]
  }
}
```

### 图片资源

非 `html` 中的图片资源，`url-loader` 可以直接处理

`html` 中的图片资源，需要先使用 `html-loader` 引入 `img`

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        options: {
          // 大于 8k 以图片存储，否则直接 base64
          limit: 8 * 1024,
          name: '[hash:10].[ext]',
          outputPath: 'asset/imgs'
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  }
}
```

### `js` 文件

**主要是进行语法转换和 `polyfill`**

```js
module.exports = {
  module: {
    rules: {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        preset: [
          '@babel/preset-env',
          {
            // 按需加载
            useBuiltIns: 'usage',
            // 指定core-js版本
            corejs: {
              version: 3
            },
            // 指定兼容性做到哪个版本浏览器
            targets: {
              chrome: '60',
              firefox: '60',
              // ...
            }
          }
        ]
      }
    }
  }
}
```

### 其他文件

不需要进行优化压缩等操作的文件，直接引入

```js
module.exports = {
  module: {
    rules: [
      exclude: /\.(css|js|html|less|jpg|png|gif)$/,
      loader: 'file-loader',
      options: {
        name: '[hash:10].[ext]'
      }
    ]
  }
}
```

## `Plugin`

**解决 `loader` 无法实现的事情，执行范围更广的任务**

### `html` 文件

`html-webpack-plugin` 自动引入，代码压缩等

```js
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      // 初始模板文件
      template: './src/index.html',
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true,
      }
    })
  ]
}
```

### `css` 文件

`mini-css-extract-plugin` 提取 `css` 文件

`post-preset-env` 兼容性处理

`optimize-css-assets-webpack-plugin` 压缩

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          // 用这个loader取代style-loader，提取js中的css成单独文件
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-preset-env')()
              ]
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // 对输出的css文件进行重命名
      filename: 'css/[name].css'
    }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
  ]
}
```
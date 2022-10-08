---
title: webpack-04-Plugin
description: webpack-04-Plugin
date: 2021-09-22 09:56:38
image: /img/webpack.jpeg
---

[[toc]]

## `Plugin`

`webpack` 生态系统的重要组成部分

**解决 `loader` 无法解决的问题**

### 构建流程

初始化：
  - 启动构建，从配置文件和 `Shell` 语句中读取合并参数得到最终的参数
  - 加载所有配置的插件
  - 实例化 `Compiler` 对象

编译：
  - 从入口文件出发，针对每个模块串行调用对应的 `Loader` 去翻译文件的内容
  - 再找到该模块所依赖的模块，递归地进行编译处理，得到每个模块被翻译之后的内容以及它们之间的依赖关系

输出：
  - 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 `Chunk`
  - 在将每个 `Chunk` 转换为单独的文件加入到输出列表之中
  - 最终将所需输出的文件内容写入文件系统

### 编写步骤

**1. 创建一个拥有 `apply` 方法的具名类**
  - `apply` 方法会在安装的时候被 `webpack compiler` 所调用
  - `apply` 方法可以**接收一个 `webpack compiler` 对象的引用**

**2. 注册所需的钩子函数**

**3. 在钩子函数中利用 `compiler | compilation` 进行相应的操作，达到所需的效果**

### `compiler` 与 `compilation`

**`compiler` :**
  - **包含了 `webpack` 环境所有的配置信息**(`options | loaders | plugins`)
  - **在 `webpack` 被创建时实例化，全局唯一**，可视为 `webpack` 实例
  - 暴露的钩子函数：
    - `afterPlugins` 设置完初始插件之后
    - `afterResolvers` `resolver` 安装完成之后
    - `run` 启动一次新的编译
    - `watchRun` 监听模式下，一次新的编译**(`compilation`)触发**之后
    - `compile` 一次新的编译**创建**之后
    - `emit` 生成资源到输出目录之前
    - `done` 编译(`compilation`)成功
    - `failed` 编译(`compilation`)失败

**`compilation`：**
  - **包含当前的模块资源、编译生成的资源、变化的文件等等**
  - 当运行在开发模式时，每当检测到一个文件发生变化，便有一个新的 `compilation` 被创建
  - 通过 `compilation` 可以读取到 `compiler`
  - 暴露的钩子函数：
    - `buildModule` 模块构建开始之前
    - `seal` 停止接收新模块时触发
    - `optimize` 优化阶段开始时触发

### 注册钩子函数

```js
// 该代码中有注册的同步钩子函数和异步钩子函数和其触发过程
const { SyncHook, AsyncSeriesHook } = require('tapable');

class MyPlugin {
  constructor(options) {}
  
  apply(compiler) {
    // 挂载自定义钩子
    compiler.hooks.myHook = new SyncHook(['arg1', 'arg2']);
    compiler.hooks.myAsyncHook = new AsyncSeriesHook(['arg1', 'arg2']);

    // 注册自定义钩子
    compiler.hooks.myHook.tap('myHook', (arg1, arg2) => {
      console.log('自己定义的钩子函数被触发', arg1, arg2);
    });

    // 异步1
    compiler.hooks.myAsyncHook.tapAsync('myHook', (arg1, arg2, callback) => {
      console.log('异步钩子 tapAsync ', arg1, arg2);
      callback();
    });
    // 异步2
    compiler.hooks.myAsyncHook.tapPromise('myHook', (arg1, arg2) => {
      return new Promise((resolve) => {
        resolve({arg1, arg2});
      }).then((context) => {
        console.log('异步钩子 tapPromise', context)
      });
    });

    compiler.hooks.environment.tap('MyPlugin', () => {
      // 触发
      // 同步
      compiler.hooks.myHook.call(1, 2);
      // 异步1
      compiler.hooks.myAsyncHook.callAsync(1, 2, err => {
        console.log('触发完毕……   callAsync')
      })
      // 异步2
      compiler.hooks.myAsyncHook.promise(1, 2).then(err => {
        console.log('触发完毕……   promise')
      });
    });

    console.log(compiler);
    // 注册同步或者异步钩子函数
    compiler.hooks.compile.tap('MyPlugin', (params) => {
      // do sth
    });
    // 注册异步钩子1
    compiler.hooks.run.tapAsync('MyPlugin', (compiler, callback) => {
      console.log('tapAsync 异步');
      callback();
    });
    // 注册异步钩子2
    compiler.hooks.run.tapPromise('MyPlugin', async (compiler) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('tapPromise 异步')
    });
  }
}
module.exports = MyPlugin;
```

### 自定义

```js
class MyPlugin {
  constructor(options) {}

  apply(compiler) {
    compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
      console.log('plugin is used!!!', "emit事件");
      const mainfest = {}
      for (const name of Object.keys(compilation.assets)) {
        // compilation.assets[name].size()获取输出文件的大小
        // compilation.assets[name].source()获取内容
        mainfest[name] = compilation.assets[name].size();
        console.log(compilation.assets[name].source())
      }

      compilation.assets['mainfest.json'] = {
        source() {
          return JSON.stringify(mainfest);
        },
        size() {
          return this.source().length;
        }
      };

      callback();
    });
  }
}

module.exports = MyPlugin;
```
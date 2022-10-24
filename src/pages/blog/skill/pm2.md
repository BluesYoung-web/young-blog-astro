---
title: 使用 pm2 部署项目
description: 守护进程，自动重启
image: /img/pm2.svg
date: 2022-08-21 16:25:52
---

[[toc]]

## 准备工作

```bash
# 全局安装 pm2
npm i -g pm2

# 将 pm2 注册为系统服务
pm2 startup # 根据输出的提示，执行对应的命令
```

## 项目配置

```js
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'laiyouxi.com',
      exec_mode: 'cluster',
      instances: 'max',
      script: './dist/server/index.mjs',
      // 以下为注入的环境变量
      env: {
        LOG_LEVEL: 'info',
        NODE_ENV: 'production',
        NITRO_PORT: 3001,
        // ...
      }
    }
  ]
}

```

## 管理项目

```bash
# 启动，以 nuxt 为例
pm2 start ecosystem.config.js

# 查看所有服务的列表，online 为正在运行的服务
pm2 list

# 保存当前启动的服务列表的状态
pm2 save

# 其他操作
pm2 restart project-name
pm2 stop project-name
pm2 delete project-name
pm2 kill project-name
pm2 logs project-name
```
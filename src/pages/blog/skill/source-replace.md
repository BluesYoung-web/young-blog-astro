---
title: 开发换源
description: 常用开发环境换源
date: 2022-11-06 15:00:00
---

[[toc]]

## 开发换源

[阿里云镜像源](https://developer.aliyun.com/mirror/)

### `npm | yarn`

```bash
# 切换 淘宝 镜像源
npm config set registry https://registry.npmmirror.com
yarn config set registry https://registry.npmmirror.com
pnpm config set registry https://registry.npmmirror.com

# 设置代理，在安装某些需要从 github 直接下载的依赖包时很有用
# 设置 http 的代理，基本没用
npm config set proxy 代理地址:代理端口号
# 设置 https 的代理
npm config set https-proxy 代理地址:代理端口号
yarn config set https-proxy 代理地址:代理端口号
pnpm config set https-proxy 代理地址:代理端口号
```

### `apt`

```bash
# 保留备份
sudo mv /etc/apt/sources.list /etc/apt/sources.list.bak

# 开始换源，内容如下：
sudo nano /etc/apt/sources.list


# 默认注释了源码镜像以提高 apt update 速度，如有需要可自行取消注释
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-updates main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-backports main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-backports main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-security main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-security main restricted universe multiverse

# 预发布软件源，不建议启用
# deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-proposed main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-proposed main restricted universe multiverse
```


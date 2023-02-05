---
title: 利用 Dockerfile 定制镜像
description: 利用 Dockerfile 定制镜像
image: /img/docker.svg
date: 2022-12-30 12:00:00
---

[[toc]]


## 典型示例

### Dockerfile

```dockerfile
# 拉取基础镜像
FROM node:16-alpine as builder
# 定义元数据 key1=value1 key2=value2
LABEL author="BluesYoung"
# 维护者信息
MAINTAINER BluesYoung "bluesyoung_web@163.com"

# 工作目录
WORKDIR /app

# 对比依赖是否变更，没有压缩包，首选 COPY，如果需要自动解包或下载，则使用 ADD
COPY package.json yarn.lock /app/

# 设置npm仓库 + 下载依赖，上面的文件如果没有变化则跳过下载，直接使用缓存
RUN npm config set registry https://registry.npmmirror.com && \
    yarn config set registry https://registry.npmmirror.com && \
    yarn

# 加入代码，打包
COPY . /app
RUN yarn build

# -----

FROM node:16-alpine

WORKDIR /app
# 复制运行时需要的文件
# 直接复制源代码
COPY boot.mjs /app/
COPY config /app/config
# 复制上一步的打包产物
COPY --from=builder /app/.output /app/.output

# EXPOSE 3001

ENTRYPOINT ["node", "boot.mjs"]
```

### 开始构建

```bash
# 在代码根目录，根据 Dockerfile 进行构建
docker build -t 镜像名称:镜像的语义化版本 .
```

## 基础命令

### `FROM`

指定镜像的来源

### `RUN`

使用命令行执行命令，**在 `docker build` 时执行**

**每执行一次 `RUN` 命令，都会在 `docker` 上新建一层**，能合并的命令尽量合并成一次

通常和 `COPY` 或者 `ADD` 命令一起使用，二次构建时，如果文件 `hash` 值没有发生变化，则会直接跳过，大大加快构建的速度

### `COPY`

从上下文目录中复制文件或者目录到容器内的指定路口

### `ADD`

基本功能同 `COPY`

可以自动解压缩包或者下载

同等条件下推荐使用 `COPY`

### `CMD`

为启动的容器指定默认要运行的程序，程序运行结束的时候容器也就结束了

多个 `CMD` 指令，仅最后一个生效

可以被 `docker run` 参数指定的程序所覆盖

### `ENTRYPOINT`

类似 `CMD` 指令，但是**不会被 `docker run` 覆盖**

结合 `CMD` 指令可以设置可变参数

```dockerfile
ENTRYPOINT ["nginx", "-c"] # 定参
CMD ["/etc/nginx/nginx.conf"] # 变参 
```

```bash
# 使用默认参数
docker run  nginx:test
# 指定可变参数
docker run  nginx:test -c /etc/nginx/new.conf
```

### `ENV`

指定环境变量

```dockerfile
ENV KEY1=VALUE1 KEY2=VALUE2
```

### `ARG`

指定**构建过程中的环境变量**

### `EXPOSE`

声明容器内会监听的端口号

### `WORKDIR`

构建镜像过程中的，每一个 `RUN` 命令都是新建的一层。**只有通过 `WORKDIR` 创建的目录才会一直存在**

[菜鸟教程](https://www.runoob.com/docker/docker-dockerfile.html)

## 扩展

[前端工程师 Docker 快速入门](https://mp.weixin.qq.com/s/phWk-tw0fdUokcRMOeCJIw)

[前端工程师 Docker 进阶与实战](https://mp.weixin.qq.com/s/DB38jsvzrNWc1NqQOEqdKw)

[前端工程师 Docker 容器编排](https://mp.weixin.qq.com/s/LzYsq4-vOU7SWoGhSH3OBQ)
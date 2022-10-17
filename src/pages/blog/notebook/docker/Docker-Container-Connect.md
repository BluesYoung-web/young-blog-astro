---
title: Docker 容器连接
description: Docker 容器连接
date: 2020-12-23 16:10:47
image: /img/docker.jpg
---

[[toc]]

## 网络端口映射

```bash
docker run -itd --name redis009 -p 6379:6379 redis
# 创建 redis 容器
# -p 主机端口:容器内部端口，默认 tcp，6379:6379/udp
# -P 随机映射到主机的高端口
```

## 容器互联

端口映射并不是唯一把 `docker` 连接到另一个容器的方法

`docker` 有一个**连接系统**允许将多个容器连接在一起，共享连接信息

**`docker` 连接会创建一个父子关系，其中父容器可以看到子容器的信息**

### 新建网络

```bash
docker network create -d bridge test-net
# -d, 指定 docker 网络类型, bridge | overlay
```

### 运行容器并连接至网络

```bash
docker run -itd --name test1 --network test-net node
docker run -itd --name test2 --network test-net node
```

### 进入容器内部进行测试

```bash
docker exec -it test1 /bin/bash
ping test2
# ------
docker exec -it test2 /bin/bash
ping test1
```

## 配置 DNS

我们可以在宿主机的 `/etc/docker/daemon.json` 文件中增加以下内容来设置全部容器的 DNS：

```json
{
  "dns" : [
    "114.114.114.114",
    "8.8.8.8"
  ]
}
```

设置后，启动容器的 `DNS` 会自动配置为 `114.114.114.114` 和 `8.8.8.8`

**配置完，需要重启 docker 才能生效**

查看容器的 `DNS` 是否生效可以使用以下命令，它会输出容器的 `DNS` 信息：

```bash
docker run -it --rm  ubuntu  cat etc/resolv.conf
# --rm 容器退出时自动清理内部的文件系统
```

### 给指定的容器配置 DNS

```bash
docker run -it --rm -h y_u  --dns=114.114.114.114 --dns-search=test.com ubuntu
# -h HOSTNAME 或者 --hostname=HOSTNAME：
#    设定容器的主机名，它会被写到容器内的 /etc/hostname 和 /etc/hosts

# --dns=IP_ADDRESS：
#    添加 DNS 服务器到容器的 /etc/resolv.conf 中，让容器用这个服务器来解析所有不在 /etc/hosts 中的主机名

# --dns-search=DOMAIN：
#    设定容器的搜索域，当设定搜索域为 .example.com 时，在搜索一个名为 host 的主机时，DNS 不仅搜索 host，还会搜索 host.example.com

# 如果在容器启动时没有指定 --dns 和 --dns-search，Docker 会默认用宿主主机上的 /etc/resolv.conf 来配置容器的 DNS
```
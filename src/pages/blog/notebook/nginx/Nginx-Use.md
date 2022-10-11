---
layout: "@/layouts/BlogPost.astro"
title: Nginx 用途
description: Nginx 用途
image: /img/nginx.jpg
date: 2021-09-27 20:00:00
---

[[toc]]

## 用途

web 服务器

正向代理(**隐藏客户端信息**)

反向代理(**隐藏服务器信息**)

**负载均衡**

动静分离，配合其他服务器使用(静态文件直接返回，动态文件交给其他服务器)

## 负载均衡

### 轮询

```nginx
upstream myserver {
  server 192.168.1.101:8080;
  server 192.168.1.101:8081;
  server 192.168.1.101:8082;
}
server {
  listen      8070;
  server_name _;
  location / {
    proxy_pass http://myserver;
  }
}
```

### 加权轮询

```nginx
upstream myserver {
  # 1 : 3 : 2
  server 192.168.1.101:8080;
  server 192.168.1.101:8081 weight=3;
  server 192.168.1.101:8082 weight=2;
}
```

### `ip_hash`

将前端访问的 ip 进行 hash 操作后，然后**根据 hash 的结果将请求分配到不同的节点上**

**保证每个 ip 都会访问固定的服务器节点**，无法区分内网机器

```nginx
upstream myserver {
  ip_hash;
  server 192.168.1.101:8080;
  server 192.168.1.101:8081 weight=3;
  server 192.168.1.101:8082 weight=2;
}
```

### url_hash

将 url 地址进行 hash 操作，根据 hash 结果请求定向到同一服务器节点上

**可以提高后端缓存服务器的效率**

```nginx
upstream myserver {
  hash $request_uri;
  server 192.168.1.101:8080;
  server 192.168.1.101:8081;
  server 192.168.1.101:8082;
}
```

### fair

fair 策略默认不被编译进 nginx 内核，**需要额外安装**

根据请求的**响应时间**判断节点负载，将请求转发到负载最小的节点上

```nginx
upstream myserver {
  fair;
  server 192.168.1.101:8080;
  server 192.168.1.101:8081;
  server 192.168.1.101:8082;
}
```

### sticky

sticky 策略默认不被编译进 nginx 内核，**需要额外安装**

**基于 cookie 实现，可以区分内网机器(需要客户端启用 cookie)**

```nginx
upstream myserver {
  sticky name=sticky_cookie expires=6h;
  server 192.168.1.101:8080;
  server 192.168.1.101:8081;
  server 192.168.1.101:8082;
}
```

## 数值计算

`Nginx` 能建立的最大连接数 `worker_processes * worker_connections`

`HTTP` **请求本地资源**支持的最大并发数 `worker_processes * worker_connections`

`HTTP` **作为反向代理**支持的最大并发数 `(worker_processes / 2) * worker_connections`

## more

https://juejin.cn/post/6982340966946439199#heading-0

https://juejin.cn/post/6861513798012895245#heading-0

https://www.nginx.cn/doc/
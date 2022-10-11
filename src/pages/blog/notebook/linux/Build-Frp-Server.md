---
layout: "@/layouts/BlogPost.astro"
title: Linux 搭建 frp 内网穿透服务器
description: Linux 搭建 frp 内网穿透服务器
image: /img/linux.jpeg
date: 2022-01-03 14:41:09
---

[[toc]]

## frpc 服务端搭建

### 编写配置文件

```ini
# 服务端(拥有公网ip的服务器)
[common]
# 绑定本机所有 ip 地址
bind_addr = 0.0.0.0
# 转发服务的端口号
bind_port = 7000
# http / https 服务
vhost_http_port = 80
vhost_https_port = 443
# 管理后台相关配置
dashboard_addr = 0.0.0.0
dashboard_port = 7500
dashboard_user = admin
dashboard_pwd = asd123..
# 使用秘钥
token = xxxxxxxxxxxxxxxxx
# 允许使用的的端口
allow_ports = 10001-50000
```

```ini
# 客户端(内网机)
[common]
server_addr = 服务器ip或者域名
server_port = 上面转发服务使用的端口号
token = 同服务端配置

# 注意下面方括号内为服务的名称，必须全局唯一
[young_linux_ssh]
# 转发类型，一般 tcp 即可，http/https 需要同时配置域名
type = tcp
local_ip = 127.0.0.1
local_port = 22
remote_port = 22223

[young_linux_admin]
type = tcp
local_ip = 127.0.0.1
local_port = 8080
remote_port = 15151

[young_dashbord]
type = tcp
local_ip = 127.0.0.1
local_port = 9000
remote_port = 29000
```

### 启动 docker 容器

```bash
# 服务端
docker run --restart=always \                                                         ─╯
--network host -d \
-v /本机内的配置文件存放的目录/frps.ini:/etc/frp/frps.ini \
--name=aliyun-frps \
snowdreamtech/frps
```

```bash
# 客户端
docker run --restart=always \                                                 ─╯
--network host -d \
-v /home/pi/frpc_conf/frpc-aliyun.ini:/etc/frp/frpc.ini \
--name=aliyun-frpc \
snowdreamtech/frpc
```

## 遇到的坑

**阿里云安全组必须开放对应的端口**

**10080 端口被 Chrome 浏览器封禁，无法使用**，[详情](https://cloud.tencent.com/developer/article/1848477)
---
title: 树莓派免费 FRP 内网穿透
description: 树莓派免费 FRP 内网穿透
image: /img/raspberrypi.jpg
date: 2021-10-16 16:10:26
---

[[toc]]

## 最新配置地址

[地址](https://frp.104300.xyz/)

## 使用步骤

首先从上面的地址下载配置文件 `frpc.ini` 内容如下：

```ini
[common]
server_addr = frp.104300.xyz
server_port = 7000
token = www.126126.xyz

# 上面的内容不用改，下面的配置自行修改
# 方括号内的名字必须唯一，远程的端口号(10001-50000)也不能和别人发生冲突
[young_linux_ssh]
type = tcp
local_ip = 127.0.0.1
local_port = 22
remote_port = xxxxx

[young_linux_api]
type = tcp
local_ip = 127.0.0.1
local_port = 8080
remote_port = xxxxx
```

使用 `docker` 运行容器

```bash
docker run -d \
--network host \
--restart=always \
-v /home/pi/frpc_conf/frpc.ini:/etc/frp/frpc.ini \
--name my-frpc \
snowdreamtech/frpc
```

查看 `docker` 运行日志

```bash
docker logs my-frpc
# 能够看到以下内容，证明启动成功
# [I] [service.go:304] [1081af41cfa98698] login to server success, get run id [1081af41cfa98698], server udp port [0],
# [I] [proxy_manager.go:144] [1081af41cfa98698] proxy added: [young_linux_api young_linux_ssh],
# [I] [control.go:180] [1081af41cfa98698] [young_linux_ssh] start proxy success,
# [I] [control.go:180] [1081af41cfa98698] [young_linux_api] start proxy success
```

## 访问

`frp.104300.xyz:xxxxx(remote_port 的值)`
---
title: Linux 使用 TinyProxy 搭建代理服务器
description: Linux 使用 TinyProxy 搭建代理服务器
image: /img/linux.jpeg
date: 2022-01-04 16:34:08
---

## 命令行

```bash
sudo apt-get update
sudo apt-get upgrade
# 安装
sudo apt-get install tinyproxy
# 编辑配置文件
sudo nano /etc/tinyproxy/tinyproxy.conf
# Port 8888 默认端口号，根据情况选择是否修改
# Allow xxx.xxx.xxx.xxx 放行的端口号，建议修改为 0.0.0.0
# 注册开机自启的服务
sudo systemctl enable tinyproxy.service
# 启动
sudo service tinyproxy start
```

## 使用

打开客户端的系统代理

配置为对应的服务器的 IP 和端口号即可

## 注意

**不配置 Allow 会导致无法上网的问题**

`Tinyproxy-The administrator of this proxy has not configured it to service requests from your host`


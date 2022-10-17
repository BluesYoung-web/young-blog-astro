---
title: Nginx 基础
description: Nginx 基础
image: /img/nginx.jpg
date: 2021-09-27 15:17:00
---

[[toc]]

## 定义

一个高性能的 **HTTP** 和 **反向代理** web 服务器

同时也提供了 `IMAP/POP3/SMTP` 服务

## 优缺点

### 优点

**高并发量**
  - 采用**异步非阻塞**的方式来处理请求，**支持高达 `50,000` 个并发连接**

**内存消耗小**
  - 采用事件处理方式，无需创建线程
  - 每个请求占用的内存很少，也没有上下文切换

**配置简单**(`conf` 文件配置)

**性能稳定**(分段资源分配技术，使得 `CPU` 和内存占有量非常低)

**模块化程度高**(高度模块化设计)

**支持 `Rewrite` 重写**
  - 能根据域名(`URL`)将 `http` 请求分配到不同的服务器

低成本(**开源免费**)

**内置健康检查**
  - **当某台服务器宕机的时候，会继续请求其他服务器**
  - 不影响前端访问

节省带宽(`gzip`)

支持**热部署**
  - 启动容易，并且可以 `7 * 24` 不间断运行
  - 还能够在不间断服务的情况下对软件的版本进行升级

### 缺点

适用范围小，仅支持 `http | https | email` 协议

不支持 `url` 检测

不支持 `Session` 保持 **(可以通过 `ip_hash` 解决)**

## 原理

`nginx` 以**多进程**的方式来工作，采用**异步非阻塞**的方式来处理请求

`nginx` 启动之后会有**一个 master 进程和多个 worker 进程**

**master 进程**
  - 接收来自外界的信号
  - 向各 worker 进程发送信号
  - 监控 worker 进程的运行状态，当 worker 进程异常退出时自动启动新的 worker 进程

**worker 进程**
  - 处理来自客户端的请求
  - 各个进程之间相互独立，一个请求只可能在一个 worker 进程中处理
  - **worker 进程数量可配置，一般同 cpu 数量**

多进程的好处：
  - 进程独立，无需加锁
  - 进程之间互不影响，一个进程退出之后其他进程正常工作

## 常用命令

```bash
# 重启Nginx
sudo nginx -s reopen
# 重新加载Nginx配置文件，然后以优雅的方式重启Nginx
sudo nginx -s reload
# 强制停止
sudo nginx -s stop
# 优雅地停止Nginx服务（即处理完所有请求后再停止服务）
sudo nginx -s quit
# 打开帮助信息
sudo nginx -h
# 显示版本信息并退出
sudo nginx -v
# 显示版本和配置选项信息，然后退出
sudo nginx -V
# 检测配置文件是否有语法错误，然后退出
sudo nginx -t
# 检测配置文件是否有语法错误，转储并退出
sudo nginx -T
# 在检测配置文件期间屏蔽非错误信息
sudo nginx -q
# 设置前缀路径(默认是:/usr/share/nginx/)
sudo nginx -p prefix
# 设置配置文件(默认是:/etc/nginx/nginx.conf)
sudo nginx -c filename
# 设置配置文件外的全局指令
sudo nginx -g directives
# 杀死所有nginx进程
sudo killall nginx
```
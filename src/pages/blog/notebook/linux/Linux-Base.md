---
layout: "@/layouts/BlogPost.astro"
title: Linux 基础操作
description: Linux 基础操作
image: /img/linux.jpeg
date: 2021-06-12 17:38:49
---

[[toc]]

## 命令别名固化

```bash
# 进入用户家目录
cd ~
# 编辑预处理文件
nano .bashrc
# 末尾加入命令
# eg:   alias cls='clear';
# 更新配置
source .bashrc
```

## 无用软件卸载

```bash
sudo apt-get purge 软件名称
sudo apt-get clean

sudo apt-get remove 软件名称

sudo apt-get autoremove
```

## 软件安装

```bash
# 拉取包的更新信息
sudo apt-get update
# 更新软件/系统
sudo apt-get upgrade

# 忽略特软件的升级信息
sudo apt-mark hold 软件名

# 安装新的软件
sudo apt-get install 软件名
```

### 安装 deb 包

```bash
sudo dpkg -i 包名称
```


### 安装 `.tar.gz` 包

```bash
# 解压
tar -xvf *.tar.gz
# 复制到常用的软件目录
cp -ar 解压之后的目录名 ~/软件
# 转到软件目录
cd ~/软件/目录名
# 给目标可执行文件添加软连接
sudo ln -s ~/软件/目录名/文件名 /usr/local/bin/文件名
# 启动软件
文件名
```

## 文件传输

### scp

```bash
scp -r -P 远程主机端口号 远程主机用户名@远程主机地址:/远程目录  当前主机目录
# 基础使用，将 test1 主机上的 1.txt 复制到 test2 主机上并重命名为 1-copy.txt
# scp test1@test.com:/home/test1/1.txt test2@test.com:/home/test2/1-copy.txt
# 复制目录需要加上 -r
# ！！！此处最容易出错，指定端口号需要使用 -P
```

### rsync

类似于 `scp`，还支持排除目录、限速等功能

### rcp

需要目标主机先打开 `rcp` 功能，并设置好 `rcp` 权限

然后将源主机加入信任白名单

操作比较麻烦

### wget

只能从远程主机下载文件

## systemctl 服务管理

```bash
# 启动服务
sudo systemctl start docker.service
# 关闭服务
sudo systemctl stop docker.service
# 重启服务
sudo systemctl restart docker.service
# 开机时启用服务(设置开机自启)
sudo systemctl enable docker.service
# 开机时禁用服务(禁用开机自启)
sudo systemctl disable docker.service
# 查看服务是否开机自启
sudo systemctl is-enable docker.service
# 查看已启动的服务列表
sudo systemctl list-unit-files|grep enabled
# 查看启动失败的服务列表
sudo systemctl --failed
```

## ps 进程查看

```bash
# 显示现行终端机下的所有程序，包括其他用户的程序
ps a
# 显示所有程序
ps -A
# 列出程序时，显示每个程序真正的指令名称，而不包含路径，参数或常驻服务的标示
ps c
# 此参数的效果和指定"A"参数相同
ps -e
# 列出程序时，显示每个程序所使用的环境变量
ps e
# 用ASCII字符显示树状结构，表达程序间的相互关系
ps f
# 显示树状结构，表示程序间的相互关系
ps -H
# 显示所有的程序，除了执行ps指令终端机下的程序之外
ps -N
# 采用程序信号的格式显示程序状况
ps s
# 列出程序时，包括已中断的子程序资料
ps S
# 指定终端机编号，并列出属于该终端机的程序的状况
ps -t <终端机编号>
# 以用户为主的格式来显示程序状况
ps u
# 显示所有程序，不以终端机来区分
ps x
# 最常用的方法是ps aux,然后再通过管道使用grep命令过滤查找特定的进程,然后再对特定的进程进行操作
# 显示出所有的java进程，去处掉当前的grep进程
ps -ef|grep java|grep -v grep
```

## kill 杀进程

```bash
kill 进程号
killall 进程名称
```

## 使用跳板机

跳板机(堡垒机)可用于服务器隔离与精准的权限控制

一般会有一个 `.pem` 的文件

```bash
# 将权限调小一点(如果连接正常可以直接忽略)
sudo chmod 400 username.pem
# 连接
ssh -i username.pem -p 对应的端口号 username@跳板机的域名或IP
```

## 修改交换内存(Swp)的大小

```bash
# 切换为超级管理员
sudo su
cd /
# 关闭交换内存
swapoff -a
# 修改 swap 大小(调整为 6G)
dd if=/dev/zero(系统存储位置) of=/swapfile(交换内存文件名称) bs=1G(内存大小的单位) count=6(对应单位的数值)
# 设置文件为 swap file 类型，不执行会导致无法启用
mkswap swapfile
# 启用
swapon -a
```

### 建议设置的大小

`<2G`，设置为 2 倍

`[2G, 8G]`，设置为同等大小

`>8G`，至少 `4G`

### 使用交换内存的概率

查看：`cat /proc/sys/vm/swappiness`

修改：`sudo sysctl vm.swappiness=0~100之间的值`
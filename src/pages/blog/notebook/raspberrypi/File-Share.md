---
layout: "@/layouts/BlogPost.astro"
title: 树莓派局域网文件共享
image: /img/raspberrypi.jpg
date: 2021-04-10 20:18:01
---

[[toc]]

## Samba

### 安装

```bash
# 更新现有的软件包
sudo apt-get update
# 安装 Samba 及其常用的命令包
sudo apt-get install samba samba-common-bin
# 重启系统
sudo reboot
# 编写配置文件
sudo nano /etc/samba/smb.conf
# -------------
# [共享目录显示的名称]
# comment = Public Storage
# path = 共享目录的路径
# read only = no        #任何人都具有了访问修改的权限；因为是公共文件夹，所以给了所有用户全部权限，可以自定义
# create mask = 0777    #新创建文件的默认属性
# directory mask = 0777 #新创建文件夹的默认属性
# guest ok = yes        #默认的访问用户名为guest
# browseable = yes
# -------------
# 将系统用户添加为 Samba 用户
sudo smbpasswd -a pi    #输入两次密码
# 启动 Samba 服务
sudo service smbd start
# 关闭 Samba 服务
sudo service smbd stop
# 重启(修改配置文件之后)
sudo service smbd restart
```

### 挂载移动硬盘

由于移动硬盘的格式为 `NTFS`

但是树莓派文件系统的格式为 `EXT4`

所以当我直接将硬盘插上去的时候不能识别

### 解决方案

拔掉硬盘

```bash
# 执行
sudo apt-get install exfat-fuse -y
```

插入硬盘，大功告成

## ftp

```bash
# 更新现有依赖包
sudo apt-get update
# 安装 vsftpd
sudo apt-get install vsftpd
# 修改配置文件
sudo nano /etc/vsftpd/vsftpd.conf
# local_root=/要共享的目录，默认为当前用户的 home 目录
# 重启服务
sudo service vsftpd restart
```
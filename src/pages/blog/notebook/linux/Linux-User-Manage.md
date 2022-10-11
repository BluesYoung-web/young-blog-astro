---
layout: "@/layouts/BlogPost.astro"
title: Linux 用户管理
description: Linux 用户管理
image: /img/linux.jpeg
date: 2022-01-02 16:24:05
---

[[toc]]

## 查看全部

```bash
[root@study ~]# ls -al
total 48
dr-xr-x---.  5    root     root    4096  May 29 16:08 .
dr-xr-xr-x. 17    root     root    4096  May  4 17:56 ..
-rw-------.  1    root     root    1816  May  4 17:57 anaconda-ks.cfg
-rw-------.  1    root     root     927  Jun  2 11:27 .bash_history
-rw-r--r--.  1    root     root      18  Dec 29  2013 .bash_logout
-rw-r--r--.  1    root     root     176  Dec 29  2013 .bash_profile
-rw-r--r--.  1    root     root     176  Dec 29  2013 .bashrc
drwxr-xr-x.  3    root     root      17  May  6 00:14 .config               
drwx------.  3    root     root      24  May  4 17:59 .dbus
-rw-r--r--.  1    root     root    1864  May  4 18:01 initial-setup-ks.cfg
[    1    ][  2 ][   3  ][  4 ][    5   ][    6     ] [       7          ]
[  权限   ][链接数][拥有者][群组][文件大小][ 修改日期 ] [      文件名        ]
```

### 权限含义

权限段共分为 10 位

第一位表示文件的类型：
  - `d` -> 目录
  - `-` -> 文件
  - `l` -> 链接文件
  - `b` -> 可随机存取设备
  - `c` -> 一次性读取设备

后九位，每三位为一组，为权限描述符：
  - `r` 可读
  - `w` 可写
  - `x` 可执行
  - `-` 无对应的权限

每组分别代表：
  - 所有者的权限
  - 群组的权限
  - 其他用户的权限(既不是所有者，也不属于群组)

## 用户管理

```bash
# 添加用户
sudo adduser 用户名
# 删除用户
sudo deluser 用户名
# 修改当前用户的密码
passwd
```

## 修改文件(目录)所属

```bash
sudo chown [-R 同时修改目录及其子目录(文件)] 目标用户名 文件(目录)名
sudo chown [-R 同时修改目录及其子目录(文件)] 目标用户名:目标用户组名 文件(目录)名
```

## 修改文件(目录)所属组

```bash
sudo chgrp 组名 文件(目录)名
```



## 修改文件(目录)权限

```bash
sudo chmod [-R] xyz 文件(目录)
sudo chmod u+x,g-x,o-x 文件(目录)
sudo chmod a+x 文件(目录)
sudo chmod u=rwx,g=rw,o=r 文件(目录)
```

`xyz`：
  - 分别代表**用户权限**、**组权限**以及**其他用户权限**
  - 取值范围均为 [0, 7], `r => 4, w => 2, x => 1`

`augo`：
  - `a` 代表所有(所有者 + 群组 + 其他用户)，**+-时的默认值**
  - `u` 代表所有者
  - `g` 代表所属群组
  - `o` 代表其他用户
  - `+- r | w | x` 代表增加移除对应的权限
  - `=` 直接修改为对应的权限
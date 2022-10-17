---
title: Linux Shell
description: Linux Shell
image: /img/linux.jpeg
date: 2022-04-07 09:00:00
---

[[toc]]

## 登录式 Shell 与非登录式 Shell

### 读取配置文件

**登录式：**
- `/etc/profile`
- `/etc/profile.d/*.sh`
- `~/.bash_profile`
- `~/.bashrc`
- `/etc/bashrc`

**非登录式：**
- `~/.bashrc`
- `/etc/bashrc`
- `/etc/profile.d/*.sh`

### 运行形式

**登录式：**
- 正常通过终端登录
- `su - username`
- `su -l username`

**非登录式：**
- `su username`
- 自动执行的 `shell` 脚本
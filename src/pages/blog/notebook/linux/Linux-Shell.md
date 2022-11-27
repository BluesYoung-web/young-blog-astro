---
title: Linux Shell
description: Linux Shell
image: /img/linux.jpeg
date: 2022-11-27 11:00:00
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

## 标准输入与参数

### 标准输入

指的是编程语言中类似于 `scanf | cin | readline` 之类的命令

接收外设输入的内容

### 参数

指的是函数的入参

也就是命令行中，**命令**加了空格之后的内容所组成的数组

```bash
where connect.sh # /home/fdl/bin/connect.sh

# 将标准输入重定向到 rm 命令，但是 rm 命令并不能接收标准输入，所以无效
where connect.sh | rm

# 获取结果，作为参数传递给 rm 命令，有效
rm $(where connect.sh)
```

> 如果一个命令可以阻塞终端，则它可以接收标准输入，否则不行

## 小技巧

```bash
# 让一个挂起的程序在终端结束之后可以继续运行

# 启动服务，监听端口，终端挂起，终端关闭之后会结束
node server.js
# 服务运行于后台，终端不会挂起
(node server.js &)

# 自动进行排列组合
echo {one,two,three}file
# onefile twofile threefile
echo {one,two,three}{1,2,3}
# one1 one2 one3 two1 two2 two3 three1 three2 three3

# 给 file 复制一个叫做 file.bak 的副本
cp /very/long/path/file{,.bak}
# 删除 file1.txt file3.txt file5.txt
rm file{1,3,5}.txt
# 将所有 .c 和 .cpp 为后缀的文件移入 src 文件夹
mv *.{c,cpp} src/


# 特殊命令 !$ 会替换成上一次命令最后的路径
/usr/bin/script.sh
# zsh: permission denied: /usr/bin/script.sh
chmod +x !$
# chmod +x /usr/bin/script.sh


# 特殊命令 !* 会替换成上一次命令输入的所有文件路径
# 创建了三个脚本文件
file script1.sh script2.sh script3.sh

# 给它们全部加上可执行权限
chmod +x !*
# chmod +x script1.sh script2.sh script3.sh


# 使用特殊命令 !!，可以自动替换成上一次使用的命令
apt install net-tools
# E: Could not open lock file - open (13: Permission denied)

sudo !!
# sudo apt install net-tools


# 特殊命令 $? 可以记录上一次命令的返回值
# 特殊命令 $$ 可以记录当前进程的 PID(唯一)


# 使用 yes 命令自动输入字符 y，进行确认
yes | sudo apt-get install xxx
```
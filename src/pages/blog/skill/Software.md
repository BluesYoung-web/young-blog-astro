---
title: 好用的软件
description: 好用的软件
date: 2021-12-29 14:47:08
---

[[toc]]

## 跨平台软件

### Tabby

一个高度可定制的开源终端软件

[下载](https://github.com/Eugeny/tabby/releases/)

### pad 扩展为电脑的副屏

[官网](https://www.spacedesk.net/)

[蓝奏云](https://pc.woozooo.com/mydisk.php)

[网页版-接收端](http://viewer.spacedesk.net/)

**电脑端需要修改对应的显示器属性，否则会看起来很模糊**

## Linux

### tree

以字符形式输出目录结构

```bash
tree
###
.
├── bin
│   ├── createNewPage.js
│   └── package.json
├── dist
├── index.html
├── LICENSE
├── node_modules
├── package.json
├── public
│   └── favicon.ico
├── README.md
├── src
│   ├── api
│   │   ├── _config.ts
│   │   └── user.ts
│   │
......
17 directories, 55 files
###
```

### ranger

基于终端的文件资源管理器

可以直接在命令行内浏览目录与预览文件

```bash
# 生成默认的配置
ranger --copy-config=all
# 编辑配置文件
nano ~/.config/ranger/rc.conf
```

### 钉钉

[官方 Linux 版本](https://alidocs.dingtalk.com/i/p/nb9XJlJ7QbxN8GyA/docs/nb9XJOPQ3K25LmyA)

### Shell Clash

[GitHub](https://github.com/juewuy/ShellClash/blob/master/README_CN.md)

```bash
# jsdelivrCDN源
export url='https://cdn.jsdelivr.net/gh/juewuy/ShellClash@master' && sh -c "$(curl -kfsSl $url/install.sh)" && source /etc/profile &> /dev/null
# 读取环境变量
source ~/.bashrc &> /dev/null
# 直接运行
clash
# 配置文件存放位置(非root用户)
# /home/young/.local/share/clash/config.yaml
```

### git

```bash
# 前置条件，安装 add-apt-repository
sudo apt-get install python-software-properties
sudo apt-get install software-properties-common
sudo apt-get update
# add-apt-repository 如果存在则可以跳过上面的安装步骤
sudo add-apt-repository ppa:git-core/ppa
sudo apt-get update
sudo apt-get install git
```

### ssh

```bash
# 安装服务器端程序
sudo apt-get install openssh-server
# 查看服务是否已经启动
ps -e | grep ssh
# 如果出现 sshd 就是已经启动了

# 启动 | 关闭 | 重启服务
sudo service ssh start | stop | restart
# 编辑配置文件
sudo nano /etc/ssh/sshd_config
```

### 铜豌豆常用软件源

```bash
# 添加软件源
sudo apt-add-repository 'deb https://apt.atzlinux.com/atzlinux buster main contrib non-free'
# 解决证书报错
wget -O public.key https://www.atzlinux.com/atzlinux/download/public.key
sudo apt-key add public.key
# 更新
sudo apt-get update
# 安装 钉钉
sudo apt-get install dingtalk-electron
```


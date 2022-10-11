---
layout: "@/layouts/BlogPost.astro"
title: Docker 内部安装 MariaDB
date: 2020-12-23 16:12:56
image: /img/raspberrypi.jpg
---

[[toc]]

## Docker 内部安装 mysql(MariaDB)

`MariaDB` 是由原本开发 `MySQL` 的一些原始开发者领导，他们担心 `Oracle` 收购 `MySQL` 后会有一些隐患

`MariaDB` 与 `MySQL` 保持着高度兼容性，并使用了一个新的存储引擎 `Aria`

```bash
# 下载镜像
docker pull jsurf/rpi-mariadb
# 创建容器
docker run -d --name mysql-test -e MYSQL_ROOT_PASSWORD=my-secret-pw -p 3306:3306 --rm jsurf/rpi-mariadb
# 进入命令行
docker exec -it mysql-test /bin/bash
# 连接数据库
mysql -u root -p
# 默认密码 my-secret-pw
# --------------------------------------
# 修改密码
use mysql;
update user set password=password('123456') where user='root';
update user set plugin='mysql_native_password' where user='root';
flush privileges;
exit
# 重启容器，使用新密码登录
mysql -u root -p
# 123456
```

## 配置MariaDB可远程连接(Docker 内部无需下列操作)

`MariaDB` 默认只监听了 `127.0.0.1` 这个 `IP` 地址，这个时候是无法从外部连接到树莓派上 `MariaDB`

先使用以下命令打开配置文件：

```bash
# docker 内部默认没有 nano，需要先安装
apt-get update
apt-get install nano
nano /etc/mysql/mariadb.conf.d/50-server.cnf
```

打开文件后有一段如下的内容:

```bash
# Instead of skip-networking the default is now to listen only on
# localhost which is more compatible and is not less secure.
bind-address            = 127.0.0.1
```

`bind-address` 表示只监听了 `127.0.0.1` 这个 `IP`，将这一行的前面加上 `#` 将这一行注释起来，这样 `MariaDB` 就监听了所有的 `IP`

此时从外部的电脑连接 `MariaDB` 会提示"xxx.xxx.xxx is not allowed to connect to this MariaDB Server"

同样使用上一步中的 `mysql` 命令连接到 `MariaDB`，输入如下命令：

```bash
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'password' WITH GRANT OPTION;
# --格式如下
GRANT ALL PRIVILEGES ON *.* TO 'user'@'remoteip' IDENTIFIED BY 'password' WITH GRANT OPTION;
# --更新权限
FLUSH PRIVILEGES;
```

至此，就可以从外部连接到树莓派上的 `MariaDB` 了
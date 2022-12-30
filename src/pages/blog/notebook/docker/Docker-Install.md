---
title: 安装 Docker
description: Linux 安装 Docker
date: 2020-12-23 15:48:58
image: /img/docker.svg
---

[[toc]]

## 安装 Docker

```bash
sudo apt-get update
sudo curl -sSL https://get.docker.com | sh
```

## 安装图形管理界面

```bash
#查看 Docker 版本
docker -v
sudo docker pull 仓库/镜像:版本（留空的话默认为 latest）
sudo docker run 加参数，用来创建并运行容器
#查看运行容器
sudo docker ps
#查看所有下载的镜像
sudo docker images
#进入容器终端
sudo docker exec -i -t ha /bin/bash
#实时查看10行的 ha 日志
sudo docker logs -f -t --tail 10 ha
#重启 systemctl 守护进程
sudo systemctl daemon-reload
#设置 Docker 开机启动
sudo systemctl enable docker
#开启 Docker 服务
sudo systemctl start docker
 
#下载 Docker 图形化界面 portainer
sudo docker pull portainer/portainer
#创建 portainer 数据存储容器
sudo docker volume create portainer_data
#运行 portainer
sudo docker run -d -p 9000:9000 --name portainer --restart always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer

```

## 解决普通用户每次都要输入 sudo 的问题

```bash
sudo groupadd docker
#添加docker用户组
sudo gpasswd -a $USER docker
#将登陆用户加入到docker用户组中
newgrp docker
#更新用户组
docker ps
#测试docker命令是否可以使用sudo正常使用
```
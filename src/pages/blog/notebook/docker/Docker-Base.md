---
title: Docker 基础操作
description: Docker 基础操作
date: 2020-12-23 16:05:41
image: /img/docker.jpg
---

[[toc]]

## 镜像

### 查看本地镜像

```bash
docker images
# REPOSITORY    		TAG    		IMAGE ID     CREATED      SIZE
# node          		latest 		338eedef62b1 2 weeks ago  766MB
# nginx         		latest 		d58dafbce171 3 weeks ago  102MB
# redis         		latest 		6afef9e2c5e4 4 weeks ago  76MB
# portainer/portainer   latest 		dbf28ba50432 4 months ago 62.5MB
# 仓库源				  标签/版本    镜像ID			创建时间	  大小
```

### 获取指定版本的镜像

```bash
docker pull node:12.8.1
# REPOSITORY node
# TAG 12.8.1
```

### 查找镜像

```bash
docker search node
# NAME   DESCRIPTION                STARS    OFFICIAL  	 AUTOMATED
# node   Node.js is a JavaScript…   9418     [OK]                
# 名称    描述						 点赞数    是否官方发布  自动构建
```

### 删除镜像

```bash
docker rmi node
```

## 容器

### 启动容器

<n-alert type="info">**`--privileged` 赋予容器真实的root权限 <br/> (某些特殊情况下需要配置，例如控制树莓派的 GPIO 端口)**</n-alert>

```bash
docker run -it --restart always  node /bin/bash
# -i: 交互式操作
# -t: 终端
# --restart: 自动重启策略
#            no(默认)
#            on-failure:3(意外退出自动重启，上限3)
#            always(总是)
#            unless-stopped(总是，不考虑在Docker守护进程启动时就已经停止了的容器)
# node: node 镜像
# /bin/bash：放在镜像名后的是命令，采用交互式 Shell

# exit 退出交互式 shell
```

### 后台运行容器

```bash
docker run -itd --name node007 node
# -d 不进入容器
# --name node007 指定容器名为 node007
```

### 进入后台运行中的容器

```bash
docker attach 容器id 或者 容器名
# 退出后会导致该容器停止，不推荐使用
docker exec -it 容器id 或者 容器名 /bin/bash
# 退出后不会导致容器停止，推荐使用
```

### 查看容器

```bash
docker ps
# -a 查看所有容器，不加查看正在运行的容器
# -l 查询最后一次创建的容器
```

### 启动一个已停止的容器

```bash
docker start 容器id 或者 容器名
docker restart 容器id 或者 容器名 # 效果同上
```

### 停止容器

```bash
docker stop 容器id 或者 容器名
```

### 删除不需要的容器

```bash
docker rm 容器id 或者 容器名
# 删除容器时，该容器必须为停止状态，否则会报错
```

### 导出容器与导入容器

```bash
docker export node007 > /home/pi/Downloads/快照名.tar
# 导出容器 node007 快照至 /home/pi/Downloads/快照名.tar
cat /home/pi/Downloads/快照名.tar | docker import - node009
# 或者
docker import /home/pi/Downloads/快照名.tar node009
# 导入快照至容器 node009
```

### 查看容器的端口情况

```bash
docker port 容器id 或者 容器名
```

### 查看容器日志

```bash
docker logs -f 容器id 或者 容器名
# -f 持续输出容器内的标准输出，不加则为直接查看现有的日志
```

### 查看容器进程

```bash
docker top 容器id 或者 容器名
```

### 查看容器底层信息

```bash
docker inspect 容器id 或者 容器名
```

```json
[
	{
		"Id": "faa1bd344585f20b99...",
		"Created": "2020-11-16T02:10:19.104765129Z",
		"Path": "/portainer",
		"Args": [],
		"...": "..."
	}
]
```

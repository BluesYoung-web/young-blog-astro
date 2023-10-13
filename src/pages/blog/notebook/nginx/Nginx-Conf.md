---
title: Nginx 配置文件
description: Nginx 配置文件
image: /img/nginx.jpg
date: 2021-09-27 16:00:00
---

[[toc]]

## 主体部分

配置文件从开始到 `events` 之前的内容

**影响 `nginx` 服务器整体的运⾏**

可配置内容：
  - 用户和用户组
  - 派生子进程数
  - 错误日志的位置与级别
  - `pid` 的位置
  - 子进程优先级
  - 进程对应的 `cpu`
  - 能够打开的进程描述符数
  - ...

```nginx
# 用户
user www-data;
# 工作线程数
worker_processes auto; 
# pid 位置(进程文件)
pid /run/nginx.pid;
# 导入启用的 模块
include /etc/nginx/modules-enabled/*.conf;
```

## `events`

**影响 `nginx` 服务器与用户网络的连接**

可配置内容：
  - 是否开启对多 `work process` 下的网络连接进行序列化
  - 是否允许同时接受多个网络连接
  - 选取何种事件驱动模型来处理连接请求
  - 每个 `work process` 可以同时支持的最大连接数

```nginx
events {
  # 单进程并发最大连接数
  worker_connections 768;
  # 启用同时接受多个网络连接
  # multi_accept on;
}
```

## `http`

### 主体部分

`http` 全局块

**文件引入**

`MIME-TYPE` 定义

**日志自定义**

**连接超时的时间**

单链接请求数上限

**负载均衡**

```nginx
http {
  ##
  # 基础配置
  ##

  # 启用高效文件传输模式
  sendfile on;
  tcp_nopush on;
  tcp_nodelay on;

  # 设置长连接超时时间，秒
  keepalive_timeout 65;
  types_hash_max_size 2048;
  # server_tokens off;

  # server_names_hash_bucket_size 64;
  # server_name_in_redirect off;
  
  # 导入 mime 文件类型
  include /etc/nginx/mime.types;
  # 设置默认的 mime 类型(直接下载)
  default_type application/octet-stream;

  ##
  # SSL 配置
  ##
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
  ssl_prefer_server_ciphers on;

  ##
  # 日志配置
  ##
  # 设置日志的格式
  log_format  main  '$http_user_agent $remote_addr - $remote_user [$time_local] "$request" '
                '$status $body_bytes_sent "$http_referer" '
                '"$http_user_agent" "$http_x_forwarded_for"';

  access_log /var/log/nginx/access.log;
  error_log /var/log/nginx/error.log;

  ##
  # Gzip 配置
  ##
  gzip on;

  # gzip_vary on;
  # gzip_proxied any;
  # gzip_comp_level 6;
  # gzip_buffers 16 8k;
  # gzip_http_version 1.1;
  # gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascrip$;
  # gzip_disable "MSIE [1-6]\."; #配置禁用gzip条件，支持正则。此处表示ie6及以下不启用gzip（因为ie低版本不支持）

  # 负载均衡
  upstream myserver {
    server 192.168.1.101:8080;
    server 192.168.1.101:8081;
    server 192.168.1.101:8082;
  }
  server {
    listen      8070;
    server_name _;
    location / {
      proxy_pass http://myserver;
    }
  }

  ##
  # 虚拟主机配置
  ##
  # 导入众多的子配置(server)
  include /etc/nginx/conf.d/*.conf;
  include /etc/nginx/sites-enabled/*;
}
```

### `server`

**每一个 `server` 块都相当于一个虚拟主机**

常用配置：
  - 监听端口
  - 主机域名
  - 自定义错误页面

```nginx
http {
  server {
    listen 80;
    server_name localhost;
    root /www/admin/localhost_80/wwwroot/;
    # 301重定向
    # rewrite ^(.*)$ $1 permanent;
    # 强制SSL
    # rewrite ^(.*)$  https://$host$1 permanent;
    # 错误页面
    error_page  404  /error/404.html;
  }
}
```

#### `location`

**用于匹配不同 `uri` 的请求**

匹配规则：
  - **`=` 精准匹配，必须完全一致才会执行**
  - `~` **区分大小写**的正则匹配
  - `~*` **不区分大小写**的正则匹配
  - `^~` 不使用正则表达式，完成以指定模式开头的匹配
  - `any str` 普通匹配
  - `@`定义一个只能被内部使用的配置

优先级 `= ` -> `^~` -> `~ | ~*` -> `any str`

[反向代理](./Nginx-Proxy)

```nginx
server {
  # VueRouter history 模式
  location / {
    root        /data/wwwroot/promoter/;
    try_files   $uri $uri/ /index.html;
    index       index.html;
  }

  # 权限控制(ip白名单)
  location / {
    alias html/aliastes/;
    allow 192.168.1.102;
    allow 192.168.1.103;
    deny all;
  }

  # 反向代理配置(跨域)
  location ^~ /api/ {
    # 设置请求头
    proxy_set_header    X-Real-IP $remote_addr;
    proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
    # 反向代理的地址
    proxy_pass          http://localhost:9501;

    # 服务器超时时间
    # proxy_connect_timeout 60;
    # 服务器发出 read 请求之后的超时时间
    # proxy_read_timeout 60;
    # 服务器发出 send 请求之后的超时时间
    # proxy_send_timeout 60;
    # 修改相应头之中的 Location 和 hash
    # proxy_redirect  xxx;

    # 启用服务器缓存，将请求内容缓存到本地，如果不手动删除则一直有效
    # proxy_store on;
    # proxy_store_access xx;
    # proxy_temp_path xx;
    # proxy_cache xx;
  }

  location ~ .*\.(gif|jpg|jpeg|png|bmp|swf|unity3d)$ {
    # 对于图片等静态资源的过期时间，设置为 1 天
    expires             1d;
  }

  location ~ .*\.(js|css)?$ {
    expires             1d;
  }
}
```

#### 内置变量

`$remote_addr` 客户端 ip

`$remote_user` 客户端用户名

`$time_local` 访问时区

`$request` 请求的 URI 及 HTTP 版本

`$status` 状态码

`$body_bytes_sent` 发送给客户端的文件主体内容的大小

`$http_referer` 请求 URL 地址

`$http_user_agent` 客户端浏览器信息

`$http_x_forwarded_for` 客户端 ip 地址列表(含中间代理)
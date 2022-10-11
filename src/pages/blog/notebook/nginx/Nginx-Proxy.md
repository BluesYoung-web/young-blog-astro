---
layout: "@/layouts/BlogPost.astro"
title: Nginx 反向代理
description: Nginx 反向代理
image: /img/nginx.jpg
date: 2021-09-27 18:00:00
---

[[toc]]

## 接口反向代理

<n-alert class="my-4" type="warning">**当 `location` 为正则表达式的时候 ，`proxy_pass` 的值不能以 `/` 结尾**</n-alert>

```nginx
server {
  listen 80;
  server_name: www.bluesyoung-web.com;
  # 前端请求 http://www.bluesyoung-web.com/api/admin
  # 后端接收 /api/admin
  location ^~ /api/admin {
    proxy_pass http://172.0.1.3:1443;
  }
  # 前端请求 http://www.bluesyoung-web.com/api/admin
  # 后端接收 /
  location /api/admin {
    proxy_pass http://172.0.1.3:1443;
  }
  # 前端请求 http://www.bluesyoung-web.com/api/admin
  # 后端接收 /test/api/admin
  location /api/admin {
    proxy_pass http://172.0.1.3:1443/test$request_uri;
  }
  # 前端请求 http://www.bluesyoung-web.com/api/admin
  # 后端接收 /young?api=admin
  location /api/ {
    rewrite /api/([^/]+) /yong?api=$1 break;
    # proxy_pass 理论上来说无效
    proxy_pass http://172.0.1.3:1443;
  }
}
```

## `WebSocket` 反向代理

```nginx
server {
  server_name www.bluesyoung-web.com;
  listen 80;
  location /wss {
    proxy_pass http://172.0.1.3:9527/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
  }
}
```
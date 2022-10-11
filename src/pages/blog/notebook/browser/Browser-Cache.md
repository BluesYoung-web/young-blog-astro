---
layout: "@/layouts/BlogPost.astro"
title: 前端缓存
description: 前端缓存
date: 2022-03-22 10:10:50
---

[[toc]]

## 按存储位置分类

**由上至下寻找，找到即返回**

### From Service Worker

**数据缓存位置 `Application -> Cache -> Cache Storage`**

**永久性存储，即便浏览器被关闭，缓存依然存在**

<n-alert class="my-4" type="warning">**只要是经过 Service Worker 的 fetch() 方法获取的资源，都会被标注为 from service worker**</n-alert>

### From Memory Cache

**直接存储到内存中的缓存，关闭标签页直接失效**

**几乎所有的网络请求资源都会被浏览器自动加入 memory cache**
- preloader，**浏览器的预加载扫描器，首先扫描整个文档，然后提前下载部分静态资源**
- preload，`<link rel="preload" />` **显示指定预加载资源**

<n-alert class="my-4" type="warning">**保证了同一页面的多个链接相同且类型相同的资源只会请求一次**</n-alert>

<n-alert class="my-4" type="warning">**在从 memory cache 获取缓存内容时，浏览器会忽视例如 max-age=0, no-cache 等头部配置，<span class="text-red-500">no-store 完全不会被缓存</span>**</n-alert>

### From Disk Cache

**存储在硬盘之上，持久存储，允许跨站点使用**

**严格按照 HTTP 头部信息中的字段来判断是否缓存对应的资源**

### 发出网络请求

根据 service worker 中的 handler 决定是否存入 cache storage

根据 HTTP 头部信息决定是否存入 disk cache

memory cache 保存一份资源的引用，以备下次使用

## HTTP 缓存

### 强缓存

如果**命中缓存**，服务器不会返回资源，**不会发送请求到服务器**

如果**未命中缓存**，则**请求真实服务器，响应之后写入缓存**

#### Expires

http/1.0 的字段，**GMT 格式的绝对过期时间**

**缺点：**
  - 绝对时间，如果客户端与服务器时间不一致，会导致缓存异常
  - 写法过于复杂，任何一个小细节不同都会导致设置无效

#### Cache-Control

http/1.1 新增的字段，**表示缓存资源的最大有效时间(相对时间)**

**常用值，不同字段之间以逗号分隔：**
- `max-age` 最大有效时间(秒)
- `must-revalidate` 如果超过了 `max-age` 设置的时间，浏览器必须向服务器发送请求，验证资源是否有效
- `no-cache` 启用协商缓存，每次都会发起 HTTP 请求，但是当缓存内容有效时会跳过响应体的下载，等效于 `max-age=0, must-revalidate`
- `no-store` **禁用缓存**
- `public` **所有的内容都可以被缓存(包括客户端和代理服务器、CDN 等)**
- `private` **默认值，仅客户端可以缓存**

<n-alert type="info">**优先级高于 Expires**</n-alert>

### 协商缓存

**会发送请求到服务器**，如果命中缓存，**服务器不会返回资源，只返回 304**

#### 按时间：

`Last-Modified` (值为最后更新时间，随服务器 `response` 返回)

`If-Modified-Since` (值为 `Last-Modified` 返回的时间，服务器通过比较两个时间来判断资源在两次请求期间是否修改)

**缺点：**
- **最大精度只到秒级，如果变化时间发生在秒以下则无法使用**
- **服务器动态生成的文件时间会动态变化，同样无效**
- 资源的内容并没有修改，只是时间变了，会降低缓存的效率

#### 按唯一标识：

`ETag` (资源内容的唯一标识，随服务器 `response` 返回)

`If-None-Match` (值为 `ETag` 返回的值，服务器通过比较请求头的值与当前资源的 `ETag` 是否一致来判断资源是否修改)

**缺点：** 虽然更加精确，但是计算 `ETag` 消耗的资源更大

<n-alert type="info">**优先级高于 Last-Modified**</n-alert>

## 缓存策略

### 不经常变化的资源

`Cache-Control: max-age=31536000` **直接强缓存一年**

### 经常变化的资源

`Cache-Control: no-cache` **每次都会询问服务器资源是否有效**

## 部署问题

先部署页面，再部署资源：
  - 新进入的用户访问的新页面，但是缓存了旧的资源，导致样式错乱
  - 除非手动清除缓存，否则在缓存过期之前一直是错误的

先部署资源：
  - 新进入的用户访问旧的页面，引用旧的资源
  - 有缓存的，使用本地缓存
  - 没有缓存的执行出错
  - 页面部署成功之后，重新访问即可恢复正常


## 浏览器快捷键

`Ctrl + F5 | R` 强制刷新，直接重服务器加载，跳过强缓存和协商缓存<br />(发送的请求头均带有 `Cache-Control: no-cache; Pragma: no-cache;`)


`F5` 跳过强缓存，检查协商缓存(`memory cache | disk cache`)

地址栏直接输入地址，检查 `disk cache`，无对应的缓存则直接进行网络请求
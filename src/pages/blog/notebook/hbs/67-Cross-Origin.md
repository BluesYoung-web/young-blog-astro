---
layout: "@/layouts/BlogPost.astro"
title: 67-跨域
image: /img/hbs.png
description: JavaScript 跨域
date: 2021-02-04 11:24:59
---

[[toc]]

## `CROS`

`Cross Origin Resource Sharing`

跨域(源)资源共享

使用自定义的 `HTTP` 头部允许浏览器和服务器相互了解，以确认请求或响应是否成功

对于简单的请求，而且请求体时 `text/plain` 类型，这样的请求会有一个额外的头部 `Origin: http://www.abc.com:8080`

如果服务器决定响应请求，那么应该返回对应的响应头
  - 只响应对应主机 `Access-Control-Allow-Origin: http://www.abc.com:8080`
  - 响应所有的请求 `Access-Control-Allow-Origin: *`

出于安全考虑，跨域的 `ajax` 对象：
  - 不能使用 `setRequestHeaders()` 设置自定义头部
  - 不能发送和接收 `cookie`
  - `getAllResponseHeaders()` 始终返回空字符串

### 预检请求

出现情况：
  - 允许使用自定义头部
  - 除了 `get | post` 之外的方法
  - 不同请求体内容类型

使用 `options` 方法并包含以下头部：
  - `Origin` 同简单请求
  - `Access-Control-Request-Method` 请求希望使用的方法
  - `Access-Control-Request-Headers` 要使用的逗号分隔的自定义头部列表(可选)

```http
GET /api/test HTTP/1.1
Origin: http://www.nczonline.net
Access-Control-Request-Method: POST
Access-Control-Request-Headers: NCZ, YOUNG
```

在这个请求发送后，服务器可以确定是否允许这种类型的请求

```http
HTTP/1.1 200 OK
Server: nginx
Access-Control-Allow-Origin: http://www.nczonline.net
Access-Control-Allow-Methods: POST, GET
Access-Control-Allow-Headers: NCZ, YOUNG
Access-Control-Max-Age: 1728000
```

### 凭据请求

默认情况下，跨域请求不提供凭据(`cookie | SSL`)

可以通过将 `withCredentials` 属性设置为 `true` 来表明请求会发送凭据

如果服务器允许带凭据的请求，则需加入 `Access-Control-Allow-Credentials: true`

## 图片 `ping`

在线广告跟踪浏览量的主要方式

可以与服务器进行简单的**单向**的跨域通信

请求数据提供查询字符串传递

响应可以是任意内容，但通常是位图图片或 204 响应

浏览器得不到任何数据，但可以通过监听 `load` 和 `error` 事件知道何时收到响应

## `JSONP`

利用 `script` 标签的跨域能力

将回调函数的名字作为参数通过请求链接传递

支持浏览器与服务器双向通信

不过安全性不太可靠，可能会被植入恶意代

## `Comet`

**短轮询**，浏览器**定时**向服务器**请求**数据，看是否存在数据更新

**长轮询**，浏览器向服务器发起请求，服务器**一直保持连接打开**，直到有数据可发送。发送完数据之后断开连接，紧接着客户端又向服务器发起请求

流式传输，只使用一个 `HTTP` 连接。服务器保持连接打开，周期性的向浏览器发送数据（输出-刷新缓存-等待-下一次输出）

## `SSE`

`Server-Sent Events`

服务器推送事件

`SSE API` 用于创建到服务器的单向链接

服务器可通过这个连接发送任意数量的数据

响应类型为 `text/event-stream`

支持短轮询，长轮询以及`HTTP`流

能在断开连接时自动确定何时重新连接

```js
// 默认情况下会保持与服务器的活动连接，自动断线重连
const source = new EventSource(url);
source.onreadystatechange = function(){
  // source.readyState 0-正连接到服务器，1-连接已打开，2-连接已关闭
};
source.onopen = function(){
  // 建立连接时触发
};
source.onmessage = function(event){
  // 从服务器接收到新事件时触发
  var data = event.data;
};
source.onerror = function(){
  // 无法建立连接时触发
};
// 强制断开连接且不再重新连接
source.close();
```

## 事件流

响应的格式为纯文本

每个数据项都带有前缀 `data:`

只有在包含 `data:` 的**数据行后面有空行时**才会触发 `message` 事件

多个连续的以 `data:` 开头的数据行将作为多段数据解析，以换行符分隔

通过 `id:` 前缀可给特定的事件指定一个关联的 `ID`

设置了 `ID` 之后，`Event-Source` 对象会跟踪上一次触发的事件，如果连接断开，会想服务器发送一个包含 `Last-Event-ID` 的请求头，以便服务器知道下一次触发那个事件流
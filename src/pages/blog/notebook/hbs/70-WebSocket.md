---
title: 70-WebSocket
image: /img/hbs.png
description: JavaScript WebSocket
date: 2021-02-06 09:17:37
---

[[toc]]

## 定义

通过一个长时连接实现浏览器与服务器的全双工通信

在创建 `WebSocket` 时，一个 `HTTP` 请求会发送到服务器以初始化连接

服务器响应后，连接使用 `HTTP` 的 `Upgrade` 头部从 `HTTP` 协议切换到 `WebSocket` 协议

使用 `WebSocket` 的好处：
  - 客户端和服务器之间可以发送非常少的数据，不会对 `HTTP` 造成任何负担
  - 非常适合带宽和延迟问题比较明显的移动应用

## 使用

```js
// 初始化，不受跨域限制
const socket = new WebSocket('ws://www.abc.com:8080');
socket.readyState;
/*
 * WebSocket.OPENING 0 连接正在建立
 * WebSocket.OPEN    1 连接已经建立
 * WebSocket.CLOSING 2 连接正在关闭
 * WebSocket.CLOSE   3 连接已经关闭
 */
socket.close(); // 关闭连接

let stringData = "Hello world!";
let arrayBufferData = Uint8Array.from(['f', 'o', 'o']);
let blobData = new Blob(['f', 'o', 'o']);
// 发送数据
socket.send(stringData);
socket.send(arrayBufferData.buffer);
socket.send(blobData);
// 监听收到消息的事件
// event.data 返回的数据也可能是 ArrayBuffer 或 Blob。
// 这由 WebSocket 对象的 binaryType 属性决定，该属性可能是"blob"或"arraybuffer"
socket.onmessage = ({ data }) => console.log(data);

// 连接建立成功时触发
socket.onopen = () => {};
// 连接发生错误时触发，连接无法存续
socket.onerror = () => {};
// 连接关闭时触发
socket.onclose = (event) => {
  event.wasClean; // 布尔值，表示连接是否干净地关闭
  event.code;     // 一个来自服务器的数值状态码
  event.reason;   // 一个字符串，包含服务器发来的消息
};
```

## 安全

在未授权系统可以访问某个资源时，可以将其视为跨站点请求伪造(`CSRF` `cross-site request forgery`)

未授权系统会按照处理请求的服务器的要求伪装自己

`ajax` 应用程序，无论大小，都会受到 `CSRF` 攻击的影响，包括无害的漏洞验证攻击和恶意的数据盗窃或数据破坏攻击

### 有效防护

要求通过 `SSL` 访问能够被 `ajax` 访问的资源

要求每个请求都发送一个按约定算法计算好的令牌(`token`)

### 无效防护

要求 `POST` 而非 `GET` 请求

使用来源 `URL` 验证来源

基于 `cookie` 验证
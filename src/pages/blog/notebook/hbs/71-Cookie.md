---
title: 71-Cookie
image: /img/hbs.png
description: JavaScript Cookie
date: 2021-02-06 10:33:11
---

[[toc]]

## 定义

**最初用于在客户端存储会话信息**

要求服务器在响应 `HTTP` 请求时，通过发送 `Set-Cookie` `HTTP` 头部包含会话信息

```http
HTTP/1.1 200 OK
Content-type: text/html
Set-Cookie: name=value
Other-header: other-header-value
```

这个 `HTTP` 响应会设置一个名为 `name`，值为 `value` 的 `cookie`

名和值在发送时都会经过 `URL` 编码

浏览器会存储这些会话信息，并在之后的每个请求中都会通过 `HTTP` 头部 `cookie` 再将它们发回服务器

```http
GET /index.js HTTP/1.1
Cookie: name=value
Other-header: other-header-value
```

## 限制

**与特定域绑定**

设置 `cookie` 后，它会与请求一起发送到创建它的域

不超过 300 个 `cookie`

每个 `cookie` 不超过 4096 字节(`4M`)

每个域不超过 20 个 `cookie`，81920 字节(`80M`)

### 不同浏览器的限制

最新版 `IE` 和 `Edge` 限制每个域不超过 50 个 `cookie`

最新版 `Firefox` 限制每个域不超过 150 个 `cookie`

最新版 `Opera` 限制每个域不超过 180 个 `cookie`

`Safari` 和 `Chrome` 对每个域的 `cookie` 数没有硬性限制

### 数量超限制

如果 `cookie` 总数超过了单个域的上限，浏览器就会删除之前设置的 `cookie`

`IE` 和 `Opera` 会按照最近最少使用的原则删除之前的 `cookie`

`Firefox` 好像会随机删除之前的 `cookie`

大多数浏览器对 `cookie` 的限制是不超过 `4096` 字节，上下可以有一个字节的误差

为跨浏览器兼容，最好保证 `cookie` 的大小不超过 `4095` 字节

这个大小限制适用于一个域的所有 `cookie`，而不是单个 `cookie`

## 构成

名称(`key`)：
  - 唯一标识
  - **不区分大小写，不过实践中最好区分一下**
  - 必须经过 `URL` 编码

值(`value`)：
  - 存储在 `cookie` 里面的字符串值
  - 必须经过 `URL` 编码

域(`domain`)：
  - `cookie` 有效的域
  - 发送到这个域的所有请求都会包含对应的 `cookie`
  - 这个域可能包含子域，也可能不包含，默认为设置 `cookie` 的域

路径(`path`)：
  - 请求 `URL` 中包含这个路径才会把 `cookie` 发送到服务器

过期时间(`expires`)：
  - 表示何时删除 `cookie` 的时间戳
  - 超过时间戳就不会发送到服务器
  - 默认情况下，浏览器会话结束后会删除所有 `cookie`
  - 主动设置过期时间 `Wdy, DD-Mon-YYYY HH:MM:SS GMT`

安全标志(`secure`)：
  - 设置之后，只在使用 `SSL` 安全连接的情况下才会把 `cookie` 发送到服务器
  - 唯一非键值对的设置

以上参数在 `Set-Cookie` 头部中**使用分号加空格隔开**

```http
HTTP/1.1 200 OK
Content-type: text/html
Set-Cookie: name=value; expires=Mon, 22-Jan-07 07:10:24 GMT; domain=.wrox.com; path=/; secure
Other-header: other-header-value 
```

## `JavaScript` 中的 `cookie`

只有一个 `document.cookie` 属性

可读写

所有的键值对都是 `URL` 编码的，因此必须使用 `decodeURIComponent()` 解码

可以通过 `document.cookie` 属性设置新的 `cookie` 字符串，**这个字符串在被解析后会添加到原有 `cookie` 中**

**设置 `cookie` 不会覆盖之前存在的任何 `cookie`，除非设置了已有的 `cookie`**

```js
class Cookie {
  static get(name) {
    const c_name = `${encodeURIComponent(name)}=`;
    const start = document.cookie.indexOf(c_name);
    let val = null;
    
    if (start > -1) {
      let end = document.cookie.indexOf(';', start);
      if (end === -1) {
        end = document.cookie.length;
      }
      val = decodeURIComponent(document.cookie.substring(start + c_name.length, end));
      return val;
    }
  }
  static set(name, value, expires, path, domain, secure) {
    let text = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    if (expires instanceof Date) {
      text += `; expires=${expires.toGMTString()}`;
    }
    if (path) {
      text += `; path=${path}`;
    }
    if (domain) {
      text += `; domain=${domain}`;
    }
    if (secure) {
      text += `; secure`;
    }
    document.cookie = text;
  }
  static unset(name, path, domain, secure) {
    Cookie.set(name, '', new Date(0), path, domain, secure);
  }
}
```

## 子 `cookie`

以单个键名对应一个数据块

```js
name=name1=value1&name2=value2&name3=value3&name4=value4&name5=value5
```

## 注意事项

`HTTP-only`：
  - 可以在浏览器设置，也可以在服务器设置
  - **只能在服务器上读取**

所有 `cookie` 都会作为请求头由浏览器发送给服务器，所以在 `cookie` 中保存大量信息可能会**影响特定域浏览器请求的性能**

**不要在 `cookie` 中存储重要或敏感的信息**
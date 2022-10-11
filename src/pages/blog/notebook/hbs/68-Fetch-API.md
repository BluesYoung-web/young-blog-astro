---
layout: "@/layouts/BlogPost.astro"
title: 68-FetchAPI
image: /img/hbs.png
description: JavaScript Fetch
date: 2021-02-04 14:48:14
---

[[toc]]

## 定义

能够执行 `XMLHttpRequest` 对象的所有任务

**更容易使用，接口也更加现代化**

能够在 `WebWorker` 中使用，必须异步

## 基本用法

### 发送请求

`fetch(url, reqObj)`

请求完成、资源可用时，期约会解决为一个 `Response` 对象

### 读取响应

最简单的方式就是取得纯文本的内容

`res.text()`，**返回一个期约，解决为取得资源的完整内容**

```js
fetch('bar.txt').then((res) => {
  res.text().then((data) => {
    console.log(data);
  });
});
// 等效
fetch('bar.txt')
  .then((res) => res.text())
  .then((data) => console.log(data));
```

### 处理状态码和请求失败

```js
fetch('/bar').then((response) => {
	console.log(response.status); // 200
	console.log(response.statusText); // OK
});
fetch('/does-not-exist').then((response) => {
	console.log(response.status); // 404
	console.log(response.statusText); // Not Found
}); 
fetch('/throw-server-error').then((response) => {
	console.log(response.status); // 500
	console.log(response.statusText); // Internal Server Error
}).catch((err) => {
   // 错误处理
	console.log(err);
});
```

### 自定义对象(`reqObj`)

**`.body`，指定使用请求体时，请求体的内容必须是以下之一：**
  - `Blob`
  - `BufferSource`
  - `FormData`
  - `URLSearchParams`
  - `ReadableStream`
  - `String`

**`.cache`，控制浏览器与 `HTTP` 缓存的交互**
- 要跟踪缓存的重定向，请求的 `redirect` 属性值必须是 `follow`，而且必须符合同源策略

- `default`
	- 返回命中的有效缓存，不发送请求
	- 命中无效(`stale`)缓存会发送条件式请求，如果响应已经改变，则更新缓存的值，然后返回缓存的值
	- 未命中缓存会发送请求，并缓存响应，然后返回响应

- `no-store`
	- 浏览器不检查缓存，直接发送请求
	- **不缓存响应，直接返回**

- `reload`
	- 浏览器不检查缓存，直接发送请求
	- **缓存响应，再返回**

- `no-cache`
	- 无论命中的缓存是否有效，都会发送条件式请求，如果响应已经改变，则更新缓存的值，然后返回缓存的值
	- 未命中缓存会发送请求，并缓存响应，然后返回响应

- `force-cache`
	- 无论命中的缓存是否有效都返回，不发送请求
	- 未命中缓存会发送请求，并缓存响应，然后返回响应

- `only-if-cached`
	- **只在请求模式为 `same-origin` 时使用缓存**
	- 无论命中的缓存是否有效都返回，不发送请求
	- 未命中缓存返回状态码为 504(网关超时)的响应

**`.credentials`**
- 指定在外发请求中如何包含 `cookie`
- `omit` 不发送 `cookie`
- `same-origin` 默认值，只在请求同源时发送 `cookie`
- `include` 无论是否同源都包含 `cookie`

**`.headers`**
- 指定请求头
- 必须是 `Headers` 对象实例或包含字符串格式键/值对的常规对象
- **默认值为不包含键/值对的 `Headers` 对象**

**`.integrity`**
- 用于强制子资源完整性
- 必须是包含子资源完整性标识符的字符串
- 默认为空字符串

**`.keepalive`**
- 用于指示浏览器允许请求存在时间超出页面生命周期
- 适合报告事件或分析，比如页面在 `fetch()` 请求后很快卸载
- **设置 `keepalive` 标志的 `fetch()` 请求可用于替代 `Navigator.sendBeacon()`**
- 必须是布尔值，默认为 `false`

**`.method`**
- 用于指定 `HTTP` 请求方法，默认 `get`
- `get` 请求指定的页面信息，并返回实体主体
- `head` 类型与 `get` 请求类似，不过返回的响应中没有具体的内容，用于获取报头
- `post` 向指定资源提交数据进行处理请求，数据被包含在请求体中
- `put` 从客户端向服务器传送的数据取代指定的文档内容
- `delete` 请求服务器删除指定的页面
- `connect` `HTTP/1.1` 协议中预留给能够将连接改为管道方式的代理服务器
- `options` 允许客户端查看服务器的性能
- `trace` 回显服务器收到的请求，主要用于测试或诊断

**`.mode`**
- 用于指定请求模式
- 这个模式决定来自跨域请求的响应是否有效，以及客户端可以读取多少响应
- 必须是以下字符串之一：
  - `cors` 允许遵守 `CORS` 协议的跨域请求
  - `no-cors` 允许不需要发送预检请求的跨域请求，响应类型是 `opaque`，意思是不能读取响应内容
  - `same-origin` 任何跨域请求都不允许发送
  - `navigate` 用于支持 `HTML` 导航，只在文档间导航时使用。基本用不到
- 在通过构造函数手动创建 `Request` 实例时，默认为 `cors`；否则，默认为 `no-cors`

**`.redirect`**
- 用于指定如何处理重定向响应（状态码为 301、302、303、307 或 308）
- 必须是下列字符串值之一：
  - `follow` 跟踪重定向请求，以最终非重定向 `URL` 的响应作为最终响应，**默认值**
  - `error` 重定向请求会抛出错误
  - `manual` 不跟踪重定向请求

**`.referrer`**
- 用于指定 `HTTP` 的 `Referrer` 头部的内容
- 必须是下列字符串之一：
  - `no-referrer` 以 `no-referrer` 作为值
  - `client/about:client` 以当前 `URL` 或 `no-referrer`（取决于来源策略 `referrerPolicy`）作为值
  - `<URL>` 以伪造 `URL` 作为值，伪造 `URL` 的源

**`.referrerPolicy`**
- 用于指定 `HTTP` 头部的 `Referrer` 头部
- 必须是下列字符串值之一：
  - `no-referrer` 请求中不包含 `Referrer` 头部
  - `no-referrer-when-downgrade` 对于从安全 `HTTPS` 上下文发送到 `HTTP URL` 的请求，不包含 `Referer` 头部，对于所有其他请求，将 `Referer` 设置为完整 `URL`，默认值
  - `origin` 对于所有请求，将 `Referrer` 设置为只包含源
  - `same-origin` 跨域不包含，同源包含
  - `strict-origin` 对于从安全 `HTTPS` 上下文发送到 `HTTP URL` 的请求，不包含 `Referer` 头部，对于所有其他请求，将 `Referer` 设置为只包含源
  - `origin-when-cross-origin` 跨域只包含源，同源完整 `URL`
  - `unsafe-url` 对于所有请求都设置为完整 `URL`

**`.signal`**
- **用于支持通过 `AbortController` 中断进行中的请求**
- 必须是 `AbortSignal` 的实例
- 默认为未关联控制器的 `AbortSignal` 实例

## 常见的 `Fetch` 请求模式

### 发送 `JSON` 数据

```js
const playload = JSON.stringify({ foo: 'bar' });
const hd = new Headers({ 'Content-Type': 'application/json' });
fetch('/get-json', {
  method: 'POST',
  body: playload,
  headers: hd
});
```

### 在请求体中发送参数

```js
// 请求体支持查询字符串
const body = 'foo=bar&baz=qux';
const hd = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
fetch('/api', {
  method: 'POST',
  body,
  headers: hd
});
```

### 发送文件

```js
const f_data = new FormData();
f_data.append('f', new File());
fetch('/upload', {
  method: 'POST',
  body: f_data
});
```

### 加载 `Blob` 文件

```js
const img = documet.querySelector('.img');
fetch('test.jpg')
  .then((res) => res.blob())
  .then((blob) => img.src = URL.createObjectURL(blob));
```

### 发送跨域请求

从不同的源请求资源，响应要包含 `CORS` 头部才能保证浏览器收到响应

没有这些头部，跨域请求会失败并抛出错误

```js
fetch('//cross-origin.com');
// TypeError: Failed to fetch
// No 'Access-Control-Allow-Origin' header is present on the requested resource
```

如果代码不需要访问响应，也可以发送 `no-cors` 请求

此时响应的 `type` 属性值为 `opaque`，因此网络请求与远程资源无法读取响应内容

这种方式适合发送探测请求或者将响应缓存起来供以后使用

```js
fetch('//cross-origin.com', { method: 'no-cors' })
  .then((response) => console.log(response.type));
// opaque
```

### 中断请求

```js
const abortController = new AbortController();
fetch('test.txt', {
  signal: abortController.signal
}).catch(() => console.log('aborted!'));
// 1s 之后中断请求
setTimeout(() => abortController.abort(), 1000);
```

---
layout: "@/layouts/BlogPost.astro"
title: 69-网络请求常用对象
image: /img/hbs.png
description: JavaScript 网络请求常用对象
date: 2021-02-05 09:31:18
---

[[toc]]

## 常用对象

`Headers`

`Request`

`Response`

## `Headers` 对象

所有外发请求和入站响应头部的容器

每个外发的 `Request` 实例都包含一个空的 `Headers` 实例，可以通过 `Request.prototype.headers` 访问

每个入站的 `Response` 实例也可以通过 `Response.prototype.headers`

```js
// 类似于 Map 对象
const h = new Headers();
// 设置/更新键
h.set('foo', 'bar');
// 检查键
h.has('foo');
// 获取值
h.get('foo'); // bar
// 删除值
h.delete('foo');
// ------独有特性------
// 可以使用对象初始化
// 可以使用 append 方法添加多个值
```

### 头部护卫

**并非所有的 `HTTP` 头部都可以被客户端修改**

不同的护卫设置会改变 `set/append/delete` 方法的默认行为

违反护卫限制会抛出 `TypeError`

| 护卫              | 使用情形                                                     | 限制                       |
| ----------------- | ------------------------------------------------------------ | -------------------------- |
| `none`            | 在通过构造函数创建 `Headers` 实例时激活                      | 无                         |
| `request`         | 在通过构造函数初始化 `Request` 对象，且 `mode` 值为非 `no-cors` 时激活 | 不允许修改禁止修改的头部   |
| `request-no-cors` | 在通过构造函数初始化 `Request` 对象，且 `mode` 值为 `no-cors` 时激活 | 不允许修改非简单头部       |
| `response`        | 在通过构造函数初始化 `Response` 对象时激活                   | 不允许修改禁止修改的响应头 |
| `immutable`       | 在通过 `error()` 或 `redirect()` 静态方法初始化 `Response` 对象时激活 | 不允许修改任何头部         |

## `Request` 对象

`new Request(url, configObj)`

### 创建

```js
// 用指定的初始值创建 Request 对象
console.log(new Request('https://foo.com', { method: 'POST' }));
// Request {
// bodyUsed: false
// cache: "default"
// credentials: "same-origin"
// destination: ""
// headers: Headers {}
// integrity: ""
// keepalive: false
// method: "POST"
// mode: "cors"
// redirect: "follow"
// referrer: "about:client"
// referrerPolicy: ""
// signal: AbortSignal {aborted: false, onabort: null}
// url: "https://foo.com/"
// }
```

### 克隆

```js
const r1 = new Request('http://foo.com');
// 将实例作为参数直接传人，可得到副本(不保证完全一样)
const r2 = new Request(r1); // r2.url = http://foo.com
// 如果同时传入配置对象，则会覆盖源对象中同名的值
const r2 = new Request(r1, { method: 'POST' });
// r1.method = 'GET', r2.method = 'POST'
// ----------------------------------------
let r1 = new Request('https://foo.com', { method: 'POST', body: 'foobar' });
let r2 = r1.clone();
console.log(r1.url); // https://foo.com/
console.log(r2.url); // https://foo.com/
console.log(r1.bodyUsed); // false
console.log(r2.bodyUsed); // false 
```

### `fetch` 中使用

可以传入已经创建好的 `Request` 实例来代替 `URL`

传入的配置对象可以覆盖请求对象的值

**请求体已经使用过**的 `Request` 对象不能用来发送请求，不包含请求体的不受限制

```js
let r = new Request('https://foo.com');
// 向 foo.com 发送 GET 请求
fetch(r);
// 向 foo.com 发送 POST 请求
fetch(r, { method: 'POST' });
// --------------------------
let r = new Request('https://foo.com', { method: 'POST', body: 'foobar' });
r.text();
fetch(r);
// TypeError: Cannot construct a Request with a Request object that has already been used
// ---------------------------
let r = new Request('https://foo.com', { method: 'POST', body: 'foobar' });
fetch(r); // 使用之后会将请求体标记为已使用
fetch(r);
// TypeError: Cannot construct a Request with a Request object that has already been used
// ---------------------------
let r = new Request('https://foo.com', { method: 'POST', body: 'foobar' });
// 3 个都会成功
fetch(r.clone());
fetch(r.clone());
fetch(r);
```

## `Response` 对象

### 创建

可以通过构造函数初始化 `Response` 对象且不需要参数

此时响应实例的属性均为默认值，因为它并不代表实际的 `HTTP` 响应

大多数情况下，产生 `Response` 对象的主要方式是调用 `fetch`，它返回一个最后会解决为 `Response` 对象的期约

```js
let r = new Response();
console.log(r);
// Response {
// body: (...)
// bodyUsed: false
// headers: Headers {}
// ok: true
// redirected: false
// status: 200
// statusText: "OK"
// type: "default"
// url: ""
// } 
// ------------------------------
fetch('https://foo.com').then((response) => console.log(response));
// Response {
// body: (...)
// bodyUsed: false
// headers: Headers {}
// ok: true
// redirected: false
// status: 200
// statusText: "OK"
// type: "basic"
// url: "https://foo.com/"
// } 
```

**`Response.redirect()`**，接收一个 `URL` 和一个重定向状态码(301,302,303,307,308)，返回重定向对象

**`Response.error()`**，用于产生表示网络错误的 `Response` 对象

### 读取响应状态信息

`Response` 对象包含一组**只读属性**：
  - `headers` 响应包含的 `Headers` 对象
  - `ok` 布尔值，表示 `HTTP` 状态码的含义，**200~299 为 `true`，其他为 `false`**
  - **`redirected` 布尔值，表示响应是否至少经过一次重定向**
  - `status` 整数，表示响应的 `HTTP` 状态码
  - `statusText` 字符串，包含对 `HTTP` 状态码的正式描述
  - `type`：
    - `basic` 表示标准的同源响应
    - `cors` 表示标准的跨域响应
    - `error` 表示响应对象是通过 `Response.error()` 创建的
    - `opaque` 表示 `no-cors` 的 `fetch` 返回的跨域响应
    - `opaqueredirect` 表示对 `redirect` 设置为 `manual` 的请求的响应
  - `url` 包含响应 `URL` 的字符串，**对于重定向响应，这是最终的 `URL`**

```js
fetch('//foo.com').then(console.log); // 200
// Response {
// body: (...)
// bodyUsed: false
// headers: Headers {}
// ok: true
// redirected: false
// status: 200
// statusText: "OK"
// type: "basic"
// url: "https://foo.com/"
// }
fetch('//foo.com/redirect-me').then(console.log); // 302
// Response {
// body: (...)
// bodyUsed: false
// headers: Headers {}
// ok: true
// redirected: true
// status: 200
// statusText: "OK"
// type: "basic"
// url: "https://foo.com/redirected-url/"
// }
fetch('//foo.com/does-not-exist').then(console.log); // 404
// Response {
// body: (...)
// bodyUsed: false
// headers: Headers {}
// ok: false
// redirected: true
// status: 404
// statusText: "Not Found"
// type: "basic"
// url: "https://foo.com/does-not-exist/"
// }
fetch('//foo.com/throws-error').then(console.log); // 500
// Response {
// body: (...)
// bodyUsed: false
// headers: Headers {}
// ok: false
// redirected: true
// status: 500
// statusText: "Internal Server Error"
// type: "basic"
// url: "https://foo.com/throws-error/"
// } 
```

### 克隆

克隆 `Response` 对象的主要方式是使用 `clone()` 方法

这个方法会创建一个一模一样的副本，不会覆盖任何值，不会将任何请求的请求体标记为已使用

有响应体的 `Response` 对象**只能读取一次**，不包含响应体的 `Response` 对象不受此限制

要多次读取包含响应体的同一个 `Response` 对象，**必须在第一次读取前(`text()|blob()|...`)调用 `clone()`**

```js
let r1 = new Response('foobar');
let r2 = r1.clone();
console.log(r1.bodyUsed); // false
console.log(r2.bodyUsed); // false
// ---------------------------
let r = new Response('foobar');
r.clone(); // 没有错误
r.text(); // 设置 bodyUsed 为 true
r.clone(); // TypeError:Failed to execute 'clone' on 'Response': Response body is already used
// 伪克隆
let r1 = new Response('foobar');
let r2 = new Response(r1.body);
console.log(r1.bodyUsed); // false
console.log(r2.bodyUsed); // false
r2.text().then(console.log); // foobar
r1.text().then(console.log); // TypeError: Failed to execute 'text' on 'Response': body stream is locked
```

## `Body` 混入

`Request` 和 `Response` 都使用了 `Fetch API` 的 `Body` 混入，以实现两者承担有效载荷的能力

这个混入两个类型提供了：
  - **只读**的 `body` 属性，实现为**可读流**
  - **只读**的 `bodyUsed` 布尔值，**表示 `body` 流是否已读**
  - `.text()`
  - `.json()`
  - `.formData()`
  - `.arrayBuffer()`
  - `.blob()`

### `text()`

返回期约，解决为将缓冲区转存得到的 `UTF-8` 格式字符串

```js
fetch('https://foo.com')
 .then((response) => response.text())
 .then(console.log);
// <!doctype html><html lang="en">
// <head>
// <meta charset="utf-8">
// ... 
// -------------------------------------
let request = new Request('https://foo.com', { method: 'POST', body: 'barbazqux' });
request.text().then(console.log);
// barbazqux
```

### `json()`

返回期约，解决为将缓冲区转存得到的 `JSON`

```js
fetch('https://foo.com/foo.json')
 .then((response) => response.json())
 .then(console.log);
// {"foo": "bar"}
// -------------------------
let request = new Request('https://foo.com', { method:'POST', body: JSON.stringify({ bar: 'baz' }) });
request.json().then(console.log);
// {bar: 'baz'} 
```

### `formData()`

浏览器可以将 `FormData` 对象序列化/反序列化为主体

```js
let myFormData = new FormData();
myFormData.append('foo', 'bar'); 
// 在通过 HTTP 传送时，WebKit 浏览器会将其序列化为下列内容
// ------WebKitFormBoundarydR9Q2kOzE6nbN7eR
// Content-Disposition: form-data; name="foo"
// bar
// ------WebKitFormBoundarydR9Q2kOzE6nbN7eR--
// -------------------------------
fetch('https://foo.com/form-data')
 .then((response) => response.formData())
 .then((formData) => console.log(formData.get('foo')); // bar
let myFormData = new FormData();
myFormData.append('foo', 'bar');
let request = new Request('https://foo.com', { method:'POST', body: myFormData });
request.formData().then((formData) => console.log(formData.get('foo'))); // bar
```

### `arrayBuffer()`

有时候可能需要**以原始二进制格式查看和修改主体**

此时可以使用 `Body.arrayBuffer()` 将主体内容转换为 `ArrayBuffer` 实例

返回期约，解决为将缓冲区转存得到的 `ArrayBuffer` 实例

```js
fetch('https://foo.com')
 .then((response) => response.arrayBuffer())
 .then(console.log);
// ArrayBuffer(...) {}
// --------------------------------
let request = new Request('https://foo.com', { method:'POST', body: 'abcdefg' });
// 以整数形式打印二进制编码的字符串
request.arrayBuffer().then((buf) => console.log(new Int8Array(buf)));
// Int8Array(7) [97, 98, 99, 100, 101, 102, 103] 
```

### `blob()`

有时候可能需要以原始二进制格式使用主体，不用查看和修改

返回期约，解决为将缓冲区转存得到的 `Blob` 实例

```js
fetch('https://foo.com')
 .then((response) => response.blob())
 .then(console.log);
// Blob(...) {size:..., type: "..."}

let request = new Request('https://foo.com', { method:'POST', body: 'abcdefg' });
request.blob().then(console.log);
// Blob(7) {size: 7, type: "text/plain;charset=utf-8"}
```

### 一次性流

因为 `Body` 混入是构建在可读流之上的，所以主体流**只能使用一次**

```js
fetch('https://foo.com').then((response) => response.blob().then(() => response.blob()));
// TypeError: Failed to execute 'blob' on 'Response': body stream is locked
let request = new Request('https://foo.com', { method: 'POST', body: 'foobar' });
request.blob().then(() => request.blob());
// TypeError: Failed to execute 'blob' on 'Request': body stream is locked 
```

即使实在读取流的过程中，以上所有的方法也会在被它们调用时给可读流**加锁**，以阻止其他读取器访问

**`req/res.bodyUsed` 表示可读流是否已经加锁，不一定已经完全读取**

```js
fetch('https://foo.com').then((response) => {
  response.blob(); // 第一次调用给流加锁
  response.blob(); // 第二次调用再次加锁会失败
});
// TypeError: Failed to execute 'blob' on 'Response': body stream is locked
let request = new Request('https://foo.com', { method: 'POST', body: 'foobar' });
request.blob(); // 第一次调用给流加锁
request.blob(); // 第二次调用再次加锁会失败
// TypeError: Failed to execute 'blob' on 'Request': body stream is locked
```

### 使用可读流主体

```js
fetch('https://fetch.spec.whatwg.org/')
 .then((response) => response.body)
 .then(async (body) => {
    let reader = body.getReader();
    while(true) {
      let { value, done } = await reader.read();
      if (done) { break; }
      console.log(value);
    }
});
// { value: Uint8Array{}, done: false }
// { value: Uint8Array{}, done: false }
// { value: Uint8Array{}, done: false }
// ... 
```

## `BeaconAPI`

为了把尽量多的页面信息传服务器，很分析工具需要在页面生命周期中尽量晚的时候向服务器发送遥测或分析数据

因此理想的情况下是通过浏览器的 `unload` 事件发送网络请求

但是 `unload` 事件对于浏览器意味着没有理由再发送任何结果未知的网络请求

在 `unload` 事件中**任何异步的请求都会被取消**

虽然可以使用同步的 `ajax` 请求强制发送，但是会影响用户体验

### `navigator.sendBeacon()`

接收一个 `URL` 和一个数据有效载荷参数，并会发送一个 `POST` 请求

并不是只能在页面生命周期末尾使用，而是**任何时候都可以使用**

调用之后，浏览器会把请求添加到一个内部的请求队列，浏览器会主动发送队列中的请求

**浏览器保证在原始页面已经关闭的情况下也会发送请求**

状态码、超时和其他网络原因造成的失败完全是不透明的，不能通过编程方式处理

信标（`beacon`）请求会携带调用 `sendBeacon()` 时所有相关的 `cookie`

```js
// 发送 POST 请求
// URL: 'https://example.com/analytics-reporting-url'
// 请求负载：'{foo: "bar"}'
navigator.sendBeacon('https://example.com/analytics-reporting-url', '{foo: "bar"}'); 
```
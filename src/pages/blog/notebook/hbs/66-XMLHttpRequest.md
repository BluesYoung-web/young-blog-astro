---
layout: "@/layouts/BlogPost.astro"
title: 66-XMLHttpRequest
image: /img/hbs.png
description: JavaScript XHR(AJAX)
date: 2021-02-03 16:23:53
---

[[toc]]

## `AJAX`

`Asynchronous JavaScript + XML`

2005年，由 Jesse James Garrett 提出

核心—— XMLHttpRequest 对象

**跨浏览器：**

```js
function createXHR(){
	if(typeof XMLHttpRequest != undefined){
		return new XMLHttpRequest();
	} else if(ActiveXObject != undefined) {
		// IE6及之前
		let versions = [
			"MSXML2.XMLHttp.6.0", 
			"MSXML2.XMLHttp.3.0", 
			"MSXML2.XMLHttp"
		];
		for(let item of versions){
			try{
				let xhr = new ActiveXObject(item);
				return xhr;
			} catch(e) {
				continue;
			}
		}
	} else {
		throw new Error('No XHR Object available.');
	}
}
```

### 使用

```js
// 1. 实例化请求对象
const ajax = new XMLHttpRequest();
// 2. 设置请求回调函数
ajax.onreadystatechange = () => {
  if(ajax.readyState === 4) {
    if((ajax.status >= 200 && ajax.status < 300) || ajax.status === 304) {
      console.log(ajax.responseText);
    } else {
      console.log(ajax.status);
    }
  }
};
ajax.ontimeout = () => console.log('超时的回调函数')
// 3. 设置请求方法及请求地址
ajax.open('get || post', 'url', isAsync = true);
// 4. 设置请求头
ajax.setRequestHeader(key, value);
ajax.timeout = 5000; // 设置超时时间，5s
// 5. 作为请求体发送数据，如果不传则必须为 null
ajax.send(reqBody);
// 6. 取消请求
ajax.abort();
```

### `ajax` 对象属性及方法

`responseText` 作为响应主体被返回的文本

`responseXML` 如果返回 `XML` 文档则为对应的值，否则为 `null`

`status` 响应的状态码

`statusText` 响应的状态码对应的文本

`readyState`：
  - 0 未初始化
  - 1 启动，已经调用 `open`，未调用 `send`
  - 2 发送，已经调用 `send`，未收到响应
  - 3 接收，已经接收到部分数据
  - 4 完成，已经接收到全部数据且客户端可用

`timeout` 超时设置，**毫秒**

`getResponseHeader(key)` 获取对应的响应头字段

`getAllResponseHeaders()` 获取所有的响应头字段

`overrideMimeType(mimeType)` 强制重写响应的 `MIME` 类型

## `HTTP` 头部

`Accept` 浏览器可以处理的内容

`Accept-Charset` 浏览器可以显示的字符集

`Accept-Encoding` 浏览器可以处理的压缩编码类型

`Accept-Language` 浏览器使用的语言

`Connection` 浏览器与服务器的连接类型

`Cookie` 页面中设置的 `Cookie`

`Host` 发送请求的页面所在的域

`Referer` 发送请求的页面的 `URI` ，*注意，这个字段在 `HTTP` 规范中就拼错了，所以考虑到兼容性也必须将错就错（正确的拼写应该是 `Referrer`）*

`User-Agent` 浏览器的用户代理字符串

## `get` 请求

`ajax.open('get', 'url?k1=v1&k2=v2')`

为了安全考虑以及一些特殊字符的处理，查询字符串需要 `encodeURIComponent()` 进行**编码**

## `post` 请求

`ajax.open('post', 'url')`

`ajax.setRequestHeader('Content-Type', 'application/x-www-formurlencoded')`

`ajax.send(formData)`

## 进度事件

`ajax.onloadstart` 在接受到响应的第一个字节时触发

`ajax.onprogress` 在接收响应期间反复触发

`ajax.onerror` 在请求出错时触发

`ajax.onabort` 在调用 `ajax.abort()` 时触发

`ajax.onload` 在成功接收完响应时触发

`ajax.onloadend` 在通信完成时，且在 `error | abort | load` 之后触发

### `load` 事件

响应接收完成之后立即触发

接收一个 `event` 对象，`event.target` 为 `XHR` 实例

### `progress` 事件

接收数据期间反复触发

接收一个 `event` 对象，`event.target` 为 `XHR` 实例

**`event.lengthComputable` 布尔值，表示进度信息是否可用**

**`event.position` 接收到的字节数**

**`event.totalSize` 响应的 `Content-Length` 头部定义的总字节数**

```js
let xhr = new XMLHttpRequest();
xhr.onload = function(event) {
 if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
	alert(xhr.responseText);
 } else {
	alert("Request was unsuccessful: " + xhr.status);
 }
};
xhr.onprogress = function(event) {
 let divStatus = document.getElementById("status");
 if (event.lengthComputable) {
	 	divStatus.innerHTML = "Received " + event.position + " of " + event.totalSize + " bytes";
 }
};
xhr.open("get", "altevents.php", true);
xhr.send(null); 
```
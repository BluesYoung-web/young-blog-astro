---
layout: "@/layouts/BlogPost.astro"
title: 72-WebStorage
image: /img/hbs.png
description: JavaScript WebStorage
date: 2021-02-06 14:40:35
---

[[toc]]

## IE用户数据

每个文档(`html`)最多 `128K`

每个域名最多 `1M`

域名限制同 `cookie`

不会过期，需要手动删除

```html
<div style="behavior:url(#default#userData)" id="dataStore"></div>
<script>
var dataStore = document.querySelector('#dataStore');
// 保存数据
dataStore.setAttribute("name", "bluesyoung");
// 将修改存储到数据空间
dataStore.save('nameInfo');
// 加载数据空间
dataStore.load('nameInfo');
// 获取存储的数据
dataStore.getAttribute('name');
// 删除存储的数据
dataStore.removeAttribute('name');
dataStore.save('nameInfo');
</script>
```

## `Storage`

基类

`sessionStorage | localStorage`

```js
// 实例属性及方法
length               // 返回保存数据项的个数
clear()              // 清空所有存储的数据
getItem(key)         // 读取
key(index)           // 返回对应位置的键值，0基
removeItem(key)      // 删除对应键值对
setItem(key, value)  // 存储
```

## `sessionStorage`

只存储会话数据，**关闭页签就会清空**

**不受页面刷新的影响，浏览器崩溃并重启后恢复**

**与服务器会话紧密相关，允许本地文件时不能使用**

存储写入时都使用了**同步阻塞**方式

基本上每个源 `5M`

## `localStorage`

客户端**持久**存储数据的机制

要访问同一个 `localStorage` 对象，页面必须来自同一个域（子域不可以）、在相同的端口上使用相同的协议

## 存储事件

```js
window.addEventListener('storage', ({ domain, key, newVal, oldVal }) => {
  domain; // 变化对应的域
  key;    // 变化相关的键
  newVal; // 被设置的新值，删除则为 null
  oldVal; // 键变化之前的值
});
```

## `IndexedDB`

浏览器中存储结构化数据的一个方案

用于替代目前已经废弃的 `Web SQL DataBase API`

设计几乎完全是异步的，需要添加 `onerror\onsuccess` 事件处理程序

在一个公共命名空间下的一组对象存储，`NoSQL` 风格

版本号会被转换为 `unsigned long long`，要使用整数

```js
let db, request, version = 1;
request = indexedDB.open("admin", version);
request.onerror = (event) => alert(`Failed to open: ${event.target.errorCode}`);
request.onsuccess = (event) => {
  db = event.target.result;
};
```

## 对象存储

`open()` 操作会创建一个新数据库，然后触发 `upgradeneeded` 事件

可以在这个事件处理程序中创建/更新数据库模式

```js
request.onupgradeneeded = (event) => {
	const db = event.target.result;
	// 如果存在则删除当前 objectStore。测试的时候可以这样做
	// 但这样会在每次执行事件处理程序时删除已有数据
	if (db.objectStoreNames.contains("users")) {
		db.deleteObjectStore("users");
	}
	db.createObjectStore("users", { keyPath: "username" });
}; 
```

## 事务

任何时候，想要读取或修改数据都要通过事务把所有修改操作组织起来

如果不指定参数，则数据库中所有的对象存储**只有读取权限**

```js
let transaction = db.transaction("users");
let transaction = db.transaction(["users", "anotherStore"]); 
/**
 * 访问模式：
 * readonly
 * readwrite
 * versionchange
 */
let transaction = db.transaction("users", "readwrite"); 

/**
 * add() 添加对象
 * put() 更新对象
 * delete() 删除对象
 */
const transaction = db.transaction("users");
const store = transaction.objectStore("users");
const request = store.get("007");
request.onerror = (event) => alert("Did not get the object!");
request.onsuccess = (event) => alert(event.target.result.firstName);
```

### 插入对象

```js
// users 是一个用户数据的数组
let request, requests = [];
for (let user of users) {
	request = store.add(user);
	request.onerror = () => {
	// 处理错误
	};
	request.onsuccess = () => {
	// 处理成功
	};
	requests.push(request);
} 
```

### 通过游标查询

```js
const transaction = db.transaction("users");
const store = transaction.objectStore("users");
// 创建游标
const request = store.openCursor();
request.onsuccess = (event) => {
 const cursor = event.target.result;
 let value, updateRequest;
 if (cursor) { // 永远要检查
   if (cursor.key == "foo") {
     value = cursor.value; // 取得当前对象
     value.password = "magic!"; // 更新密码
     updateRequest = cursor.update(value); // 请求保存更新后的对象
     updateRequest.onsuccess = () => {
     // 处理成功
     };
     updateRequest.onerror = () => {
     // 处理错误
     };
   }
 }
}; 
```

## 限制

**不能跨域**

`Firefox` 每个域 `50M`，移动版 `5M`

`Chrome` 每个域 `5M`

空间超限制会请求用户许可

`Firefox` 本地文件不能访问
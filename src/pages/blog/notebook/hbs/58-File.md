---
layout: "@/layouts/BlogPost.astro"
title: 58-File
image: /img/hbs.png
description: JavaScript 文件处理
date: 2021-01-28 14:54:23
---

[[toc]]

## `File API`

在表单文件输入字段的基础上，增加了直接访问文件信息的能力

`HTML5` 在 `DOM` 上为元素添加了 `files` 集合，包含一组 `File` 对象，表示被选中的文件

每个 `File` 对象都有一些只读属性：
  - `name` 本地系统中的文件名
  - `size` 以字节计的文件大小
  - `type` 包含文件 `MIME` 类型的字符串
  - `lastModifiedDate` 文件最后修改的事件字符串，**只有 `Chrome` 实现了**

## `FileReader`

`const rd = new FileReader()`

所有的实例方法都是异步的

事件列表：
  - `onabort`
  - `onerror`
  - `onload`
  - `onloadend`
  - `onloadstart`
  - `onprogress`

`rd.error.code`：
  - 1 - 未找到文件
  - 2 - 安全错误
  - 3 - 读取中断
  - 4 - 文件不可读
  - 5 - 编码错误

### `readAsText(file, encoding)`

从文件中读取纯文本并保存在 `result` 属性中

第二个参数表示编码，可选

### `readAsDataURL(file)`

读取文件并将内容的数据 `URI` 保存在 `result` 属性中

可用于 `base64` 编码

### `readAsBinaryString(file)`

读取文件并将每个字符的二进制数据保存在 `result` 属性中

### `readAsArrayBuffer(file)`

读取文件并将文件内容以 `ArrayBuffer` 形式保存在 `result` 属性中

## `FileReaderSync`

`FileReader` 的**同步版本，只在工作线程中可用**

```js
// worker.js
self.omessage = (messageEvent) => {
	const syncReader = new FileReaderSync();
	console.log(syncReader); // FileReaderSync {}
	// 读取文件时阻塞工作线程
	const result = syncReader.readAsDataUrl(messageEvent.data);
	// PDF 文件的示例响应
	console.log(result); // data:application/pdf;base64,JVBERi0xLjQK...
	// 把 URL 发回去
	self.postMessage(result);
}; 
```

## `Blob`

`File` 的超类，`blob = file.slice(startOffset, endOffset)`

`binary large object` 二进制大对象

对不可修改二进制数据的封装类型

包含字符串的数组、`ArrayBuffers`、`ArrayBufferViews`、`Blob` 都可以用来创建 `blob`

`blob.slice(startOffset, endOffset, contentType)`

可以使用 `FileReader` 从 `Blob` 中读取数据

**只读取部分文件可以极大的节省时间**

```js
console.log(new Blob(['foo']));
// Blob {size: 3, type: ""}
console.log(new Blob(['{"a": "b"}'], { type: 'application/json' }));
// {size: 10, type: "application/json"}
console.log(new Blob(['<p>Foo</p>', '<p>Bar</p>'], { type: 'text/html' }));
// {size: 20, type: "text/html"} 
```

## 对象 `URL` 与 `Blob`

`window.URL.createObjectURL(File | Blob)`

创建对象 `URL`，返回一个指向**内存中地址**的字符串，可以在 `DOM` 中直接使用

只要对象 `URL` 在使用中，就不能释放内存

如果想表明不在使用某个对象的 `URL`，`window.URL.revokeObjectURL(blobUrl)`

```js
window.URL.createObjectURL(f);
// "blob:null/1a16c573-c7d5-4d82-a88d-bc1293d4dff0"
```

## 读取拖放文件

```html
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	<title>测试</title>
	<style>
	.f {
		width: 500px;
		height: 500px;
		background-color: #efefef;
	}
	</style>
</head>
<body>
    <div class="f" id="f"></div>
    <script>
    let f = document.getElementById("f");
    function handleEvent(event) {
			event.preventDefault();
			// 放入
			if (event.type === 'drop') {
				console.log(event.dataTransfer.files);
			}
    }
    // 必须先阻止 dragenter 与 dragover 事件
    f.addEventListener('dragenter', handleEvent)
    f.addEventListener('dragover', handleEvent)
    f.addEventListener('drop', handleEvent)
    </script>
</body>
</html>
```
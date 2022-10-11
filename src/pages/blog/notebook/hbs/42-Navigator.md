---
layout: "@/layouts/BlogPost.astro"
title: 42-navigator对象
image: /img/hbs.png
description: JavaScript Navigator 对象
date: 2021-01-20 10:20:06
---

## 属性及方法

`activeVrDisplays` 返回数组，包含 `ispresenting` 属性为 `true` 的 `VRDisplay` 实例 

`appCodeName` 即使在非 Mozilla 浏览器中也会返回"Mozilla"

`appName` 返回浏览器全名

`appVersion` 返回浏览器版本，通常与实际版本不一致

`battery` 返回暴露 `Battery Status API` 的 `BatteryManager` 对象

`buildId` 浏览器构建编号

`connection` 返回暴露 `Network Information API` 的 `NetworkInformation` 对象

`cookieEnabled` **返回布尔值，表示是否启用了 `cookie`**

`credentials` 返回暴露 `Credentials Management API` 的 `CredentialsContainer` 对象

`deviceMemory` 返回单位为 `GB` 的设备内存容量(运存)

`doNotTrack` 返回用户的“不跟踪”（`do-not-track`）设置

`geolocation` 返回暴露 `Geolocation API` 的 `Geolocation` 对象

`getVRDisplays()` 返回数组，包含可用的每个 `VRDisplay` 实例

`getUserMedia()` 返回与可用媒体设备硬件关联的流

`hardwareConcurrency` 返回设备的处理器核心数量

`javaEnabled()` 返回布尔值，表示浏览器是否启用了 `Java`

`language` 返回浏览器的主语言

`languages` 返回浏览器偏好的语言数组

`locks` 返回暴露 `Web Locks API` 的 `LockManager` 对象

`mediaCapabilities` 返回暴露 `Media Capabilities API` 的 `MediaCapabilities` 对象

`mediaDevices` 返回可用的媒体设备

`maxTouchPoints` 返回设备触摸屏支持的最大触点数

`mimeTypes` 返回浏览器中注册的 MIME 类型数组

`onLine` 返回布尔值，表示浏览器是否联网

`oscpu` 返回浏览器运行设备的操作系统和（或）`CPU`

`permissions` 返回暴露 `Permissions API` 的 `Permissions` 对象

`platform` 返回浏览器运行的系统平台

`plugins` 返回浏览器安装的插件数组

`product` 返回产品名称（通常是"Gecko"）

`productSub` 返回产品的额外信息（通常是 Gecko 的版本）

`registerProtocolHandler()` 将一个网站注册为特定协议的处理程序

`requestMediaKeySystemAccess()` 返回一个期约，解决为 `MediaKeySystemAccess` 对象

`sendBeacon(url, data)` 异步传输一些小数据(post)

`serviceWorker` 返回用来与 `ServiceWorker` 实例交互的 `ServiceWorkerContainer`

`share()` 返回当前平台的原生共享机制

`storage` 返回暴露 `Storage API` 的 `StorageManager` 对象

`userAgent` 返回浏览器的用户代理字符串

`vendor` 返回浏览器的厂商名称

`vendorSub` 返回浏览器厂商的更多信息

`vibrate()` 触发设备振动

`webdriver` 返回浏览器当前是否被自动化程序控制


## 检测插件

`navigator.plugins`，返回类数组对象

每一项的属性：
  - `name`：插件名称
  - `description`：插件介绍
  - `filename`：插件的文件名
  - `length`：由当前插件处理的 MIME 类型数量
  - `MimeType`：
    - `descriptioon` 描述 MIME 类型
    - `enabledPlugin` 指向插件对象的指针
    - `suffixes` MIME 类型对应扩展名的逗号分隔的字符串
    - `type` 完整的 MIME 类型

```js
function hasPlugin(p_name) {
  for(const { name } of navigator.plugins) {
    if(name.toLowerCase().indexOf(p_name.toLowerCase()) > -1) {
    	return true;
  	}
  }
	return false;
}
```

## 注册处理程序

注册针对于特定协议的处理程序

`navigator.registerProtocolHandler("mailto", "http://www.somemailclient.com?cmd=%s", "Some Mail Client")`
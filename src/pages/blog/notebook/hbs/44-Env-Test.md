---
layout: "@/layouts/BlogPost.astro"
title: 44-能力检测
image: /img/hbs.png
description: JavaScript 能力(环境)检测
date: 2021-01-20 14:03:33
---

[[toc]]

## 功能检测

先判断要使用的功能函数是否存在

如果存在再执行后续操作，否则选择优雅降级

```js
function getElement(id) {
	if(document.getElementById) {
		return document.getElementById(id);
	} else if (document.all) {
		// < IE5
		return document.all[id];
	} else {
		throw new Error('无法获取元素节点');
	}
}
```

## 特性检测

```js
// 检测浏览器是否支持 Netscape 式的插件
let hasNSPlugins = !!(navigator.plugins && navigator.plugins.length);
// 检测浏览器是否具有 DOM Level 1 能力
let hasDOM1 = !!(document.getElementById && document.createElement && document.getElementsByTagName); 
```

## 浏览器检测

```js
class BrowserDetector {
	constructor() {
		// 测试条件编译
		// IE6~10
		this.isIE_6_10 = /*@cc_on!@*/false;
		// 测试documentMode
		// IE7~11
		this.isIE_7_11 = !!document.documentMode;
		// Edge20+
		this.isEdge_20_plus = !!window.StyleMedia;
		// Firefox
		this.isFirefox = typeof InstallTrigger !== 'undefined';
		// Chrome
		this.isChrome = !!window.chrome && !!window.chrome.app;
		// Safari3~9.1
		this.isSafari_3_9 = /constructor/i.test(window.Element);
		// Safari7+
		this.isSafari_7_plus = (({ pushNotification = {} } = {}) => {
			return pushNotification.toString() === '[object SafariRemoteNotification]';
		})(window.safari);
		// Opera20+
		this.isOpera_20_plus = !!window.opr && !!window.opr.addons;
	}
	isIE() {
		return this.isIE_6_10 || this.isIE_7_11;
	}
	isEdge() {
		return this.isEdge_20_plus && !this.isIE();
	}
	isFirefox() {
		return this.isFirefox;
	}
	isChrome() {
		return this.isChrome;
	}
	isSafari() {
		return this.isSafari_3_9 || this.isSafari_7_plus;
	}
	isOpera() {
		return this.isOpera_20_plus;
	}
}
```

<n-alert class="mt-5" title="能力检测最适合用于决定下一步该怎么做，而不一定能够作为辨识浏览器的标志" type="warning" />

<Step
	title="navigator.userAgent——历史回顾"
	:data="[
		'Mosaic/0.9',
		'Mozilla/Version [Language] (Platform; Encryption)',
		'Mozilla/Version (Platform; Encryption [; OS-or-CPU description])',
		`Mozilla/MozillaVersion (Platform; Encryption; OS-or-CPU; Language; PrereleaseVersion)Gecko/GeckoVersion ApplicationProduct/ApplicationProductVersion`,
		`Mozilla/5.0 (Platform; Encryption; OS-or-CPU; Language AppleWebKit/AppleWebKitVersion (KHTML, like Gecko) Safari/SafariVersion`,
		`Mozilla/5.0 (compatible; Konqueror/Version; OS-or-CPU)`,
		`Mozilla/5.0 (compatible; Konqueror/Version; OS-or-CPU) KHTML/KHTMLVersion (like Gecko)`,
		`Mozilla/5.0 (Platform; Encryption; OS-or-CPU; Language) AppleWebKit/AppleWebKitVersion (KHTML, like Gecko) Chrome/ChromeVersion Safari/SafariVersion`,
		`Opera/Version (OS-or-CPU; Encryption) [Language]`,
		`Mozilla/5.0 (Windows NT 5.1; U; en; rv:1.8.1) Gecko/20061208 Firefox/2.0.0 Opera 9.50`,
		`Opera/9.80 (OS-or-CPU; Encryption; Language) Presto/PrestoVersion Version/Version`
	]"
/>

## 设备平台检测

```js
function isWeChat(ua = navigator.userAgent) {
  const wechat = ua.match(/(MicroMessenger)\/([\d\.]+)/i);
  if(wechat) {
    return { version: wechat[2].replace(/_/g, '.') };
  } else {
    return false;
  }
}
function isAndriod(ua = navigator.userAgent) {
  const andriod = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
  if(andriod) {
    return {
      version: android[2],
      isBadAndroid: !(/Chrome\/\d/.test(ua.appVersion))
    };
  } else {
    return false;
  }
}
function isIOS(ua = navigator.userAgent) {
  const ios = ua.match(/(iPhone\sOS)\s([\d_]+)/) || ua.match(/(iPad).*OS\s([\d_]+)/);
  if(ios) {
    return { version: ios[2].replace(/_/g, '.') };
  } else {
    return false;
  }
}
```
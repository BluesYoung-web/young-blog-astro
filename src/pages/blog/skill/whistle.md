---
title: whistle 相关
description: whistle 相关的技巧
image: /img/whistle.jpeg
date: 2022-11-22 16:40:00
---

[[toc]]

## 安装

[浏览器代理切换插件 Proxy SwitchyOmega](https://chrome.google.com/webstore/detail/padekgcemlokbadohgkifijomclgjgif)

```bash
# 全局安装
npm i -g whistle
# 启动，默认端口 8899
w2 start
```

## JS 代码注入

```js
// test.js 要注入的 js 代码
;(() => {
  console.log('lalalallalalala');
})();
```

```bash
# 针对特定的域名，注入对应的 JS
domain-name.com jsPrepend://{test.js}
```

## 移动端抓包

手机与电脑在同一局域网内，设置 `WLAN` 代理

如果需要 `https` 抓包，则手机上还需要安装 `whistle` 的证书

## 请求替换(接口 Mock)

跨域响应头

```json
{
  "access-control-allow-origin":"*",
  "access-control-allow-headers":"*"
}
```

接口成功响应

```json
{
  "code": 0,
  "message": "成功"
}
```

[具体匹配规则](https://wproxy.org/whistle/pattern.html)


```bash
# 接口请求地址(不写协议则代理所有协议)    接口方法    响应头    替换接口的返回值
http://domain-name.com/aaa/bbb/ccc method://post resHeaders://{res-cors.json} tpl://{success.json}
```
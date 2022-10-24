---
title: OG
description: OG(开放图谱协议)
image: https://ogp.me/logo.png
date: 2021-10-31 16:55:52
---

[[toc]]

## 开放图谱协议

The Open Graph protocol

2010 年由 Facebook 提出的一种**网页元信息标记协议**

**使用 `<meta>` 标签来携带网页的核心信息，专为分享而生**

如果一个页面没有配置 og 信息，那么它在社交平台中的表现就只会是：
  - `<title>` 标签的内容作为**标题**，加上页面开始部分的 `<p>` 标签的内容作为**描述**
  - 或者只是一条没有任何表现的链接

### 基础配置

`og:url` 指定你想要共享的 URL 或者当前页面的 URL

`og:type` 对象的类型

`og:title` 分享的标题，通常和 `<head>` 标签的内容保持一致，不超过 35 个字符

`og:description` 分享内容的概述，不超过 65 个字符

`og:image` 分享链接的封面图地址

`og:site_name` 主体网站的全称

## 进阶内容

[官网](https://ogp.me/)

[掘金大神](https://juejin.cn/post/7023173942001008670)

## 对于简书 `<head>` 相关 `<meta>` 的分析

```html
<!-- og 协议相关的配置 -->
<meta property="og:url" content="https://www.jianshu.com/p/7d7ff2bdc358">
<meta property="og:type" content="article">
<meta property="og:title" content="最全open graph protocol（开放图谱协议） 介绍操作指南">
<meta property="og:description" content="1.什么是open graph protocol 2.open graph protocol 的重要性 3.如何设置open graph protocol 4.测试调试ope...">
<meta property="og:image" content="https://upload-images.jianshu.io/upload_images/5770069-4605ab6ebea06d6d.png">
<meta property="og:site_name" content="简书">
<!-- Facebook 专用优化 -->
<meta property="fb:app_id" content="865829053512461">
<!-- Twitter 自定义的内容，类似于 og 协议 -->
<meta name="twitter:card" content="summary">
<meta name="twitter:site" content="@jianshu.com">

<!-- 谷歌搜索 SEO -->
<meta property="wb:webmaster" content="294ec9de89e7fadb">
<!-- 接入 QQ 登录相关 -->
<meta property="qc:admins" content="104102651453316562112116375">
<meta property="qc:admins" content="11635613706305617">
<meta property="qc:admins" content="1163561616621163056375">
<!-- 搜索引擎验证相关 -->
<meta name="360-site-verification" content="604a14b53c6b871206001285921e81d8">
<meta name="google-site-verification" content="cV4-qkUJZR6gmFeajx_UyPe47GW9vY6cnCrYtCHYNh4">
<meta name="google-site-verification" content="HF7lfF8YEGs1qtCE-kPml8Z469e2RHhGajy6JPVy5XI">
<meta name="tencent-site-verification" content="da26ce22cfed7aba6a96d8409f9b53a6">
<meta name="apple-mobile-web-app-title" content="简书">
<!-- 应用内打开相关 -->
<meta property="al:ios:url" content="jianshu://notes/78678562">
<meta property="al:ios:app_store_id" content="888237539">
<meta property="al:ios:app_name" content="简书">
<meta property="al:android:url" content="jianshu://notes/78678562">
<meta property="al:android:package" content="com.jianshu.haruki">
<meta property="al:android:app_name" content="简书">
<!-- 爬虫(搜索引擎自动抓取)相关 -->
<meta name="robots" content="index,follow">
<meta name="googlebot" content="index,follow">
```
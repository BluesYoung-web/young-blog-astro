---
title: 浏览器从输入 URL 到页面渲染完成
description: 浏览器从输入 URL 到页面渲染完成
date: 2022-03-21 15:33:05
---

[[toc]]

## 中杯

浏览器根据请求的 URL 交给 DNS 域名解析，找到真实 IP，向服务器发起请求

服务器交给后台处理完成后返回数据

浏览器接收文件(HTML/JS/CSS)

浏览器对加载到的资源进行语法解析，建立相应的内部数据结构

载入解析到的资源文件，渲染页面

## 大杯

从浏览器接收 URL 到开启网络请求线程(展开为浏览器机制及进程与线程之间的关系)

开启网络请求线程到发出一个完整的 HTTP 请求(DNS,TCP/IP,五层模型)

服务器接收到请求到对应后台接收到请求(负载均衡，安全拦截，后台内部处理)

后台和前台的 HTTP 交互(HTTP 头部、响应码、报文结构、cookie、gzip)

HTTP 缓存(ETag，Cache-Control)

浏览器接收到 HTTP 数据包之后的解析流程
  - 解析 HTML
  - 词法分析，生成 DOM 树
  - 解析 css 生成 css 规则树
  - DOM + CSSOM 合并成 render 树
  - 布局、渲染
  - 复杂图层的合成
  - GPU 绘制
  - 外链资源处理
  - loaded、DOMLoaded

CSS 的可视化格式模型(元素渲染规则，BFC、IFC、FFC、GFC)

JS 引擎解析(解析，预处理，执行阶段生成执行上下文，V0，作用域，垃圾回收)

其他(跨域，web 安全，hybrid)

## 超大杯

### 概述

**浏览器进程**，负责梳理、响应用户交互(点击、滚动)

**网络进程**，负责处理数据的请求，提供下载功能

**渲染进程**，负责将获取到的 HTML、CSS、JS 处理成可以看见的、可以交互的页面

### 网络请求

浏览器地址栏输入 URL，判断是否为完整的 URL
  - 如果不是完整的 URL，则作为关键字，结合默认的搜索引擎拼接为对应的搜索 URL
  - 组装一个 HTTP(GET) 请求报文
    - encodeURI 对 URL 进行编码，**不编码 `=?&;/`**
    - encodeURIComponent 对参数部分进行编码，**所有字符全部编码**

<n-alert type="info">编码方法：<br/>**百分号编码**，使用**百分号+两位 16 进制数**来表示，16 进制数为对应字符的 UTF-8 编码，一个中文对应 3 个字节</n-alert>

完整的 URL 浏览器查看缓存
  - 未缓存，发起新的请求
  - 已缓存，检验是否足够新鲜
    - 足够新鲜直接提供给客户端(刷新，from memory cache；重开，from disk cache)
    - 不新鲜，与服务器进行验证
      - HTTP 1.0 Expires，表示缓存新鲜日期的绝对时间
      - HTTP 1.1 Cache-Control: max-age=值为秒的最大新鲜时间

浏览器解析 URL 获取协议、主机、端口、路径

浏览器获取主机 ip 地址
  - 浏览器 DNS 缓存
  - 本机 DNS 缓存
  - hosts 文件
  - 路由器缓存
  - ISP DNS 缓存
  - DNS 服务器递归查询(可能存在负载均衡导致每次 ip 不一样)

<n-alert type="info">DNS 预解析(**使用 UDP 协议解析**)：<br/>`<link rel="dns-prefetch" href="http://www.baidu.com" />`</n-alert>

打开一个 socket 与目标 ip 地址，端口建立 TCP 连接，三次握手：
  - client -> `SYN=1, Seq=X` -> server
  - server -> `SYN=1, ACK=X+1, Seq=Y` -> client，服务器为该连接分配资源
  - client -> `ACK=Y+1, Seq=Z` -> server，客户端为改连接分配资源

<n-alert type="warning">三次握手是为了**保证客户端存活**，**防止服务器收到失效的超时请求造成资源浪费(两次握手存在的隐患)**</n-alert>

#### TLS 握手

**非对称加密传递秘钥，使用秘钥对称加密最终的内容**
- client -> `random1 + 协议 + 加密方法` -> server
- server -> `数字证书 + random2` -> client
- client -> `校验数字证书 + 公钥加密(random3)` -> server
- server -> `私钥解密()->random3;`

**random1 + random2 + random3 => 对称加密秘钥**


TCP 连接建立后发送 HTTP 请求

服务器接收请求并解析，将请求转发到服务程序，如虚拟主机使用 HTTP Host 头部判断请求的服务程序

```http
# 请求行
POST /hello HTTP/1.1
# 请求头
User-Agent: curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3
Host: www.example.com
Accept-Language: en, mi

# 请求体
name=niannian
```

服务器检查 HTTP 请求头是否包含缓存验证信息，如果验证缓存新鲜，返回 304 等对应状态码

处理程序读取完整请求头并准备 HTTP 响应，可能需要查询数据库等操作

服务器将响应报文通过 TCP 连接发送回浏览器

浏览器接收 HTTP 响应，根据情况选择关闭 TCP 连接或保留重用

```http
# 响应行
HTTP/1.1 200 OK
# 响应头
Content-Type:application/json
Server:apache

# 响应体
{password:'123'}
```

四次挥手：
  - master -> `Fin=1, ACK=Z, Seq=X` -> slave，请求释放连接，**不再需要数据**
  - slave -> `ACK=X+1, Seq=Z` -> master，确认连接释放，**可能还有数据没有发送**
  - slave -> `Fin=1, ACK=X, Seq=Y` -> master，请求释放连接，**不再需要发送数据**
  - TIME_WAIT（等待 2MSL）
  - master -> `ACK=Y+1, Seq=X` -> slave，确认连接释放，**完全断开**

**为什么需要四次挥手？**
- **TCP 的数据传输是双向的，每个方向都需要一个请求和一个确认**

**为什么需要等待 2MSL？**
- **MSL 为一个数据包在网络中的最大生存时间**
- 第一个 MSL 是**保证对端能收到请求**
- 第二个 MSL 是**保证对端如果有数据包发出，能到达本端**

浏览器检查状态码是否为 1XX、3XX、4XX、5XX，与 2XX 的处理情况不同

如果资源可缓存，进行缓存

对响应进行解码(gzip)

根据 MIME 类型决定如何处理

假设为 HTML 文档，解析 HTML 文档

构建 DOM 树，下载资源
  - Tokenizing，根据 HTML 规范将字符流解析为标记
  - Lexing，词法分析将标记转换为对选哪个并定义属性和规则
  - DOM Construction，根据 HTML 标记将对象转换为 DOM 树
  - 解析过程遇到图片、样式表、js 文件，启动下载

构造 CSSOM 树
  - Tokenizing，字符流转换为标记流
  - Node，根据标记创建节点
  - CSSOM，根据节点创建 CSSOM 树
  - 根据 DOM 和 CSSOM 构建渲染树
    - 从 DOM 树的根节点遍历**所有可见节点**
    - 对每一个可见节点，找到恰当的 CSSOM 规则并应用
    - 发布可见节点的内容和计算样式

解析并执行 JS 脚本
  - DOM 解析完成之前 document.readyState === 'loading'
  - HTML 解析器遇到没有 async 和 defer 的 script 标签时
    - 将其添加到文档中，然后同步执行内部或外部脚本(暂停解析)
    - 此时可以使用 document.write() 把文本插入到输入流中
    - 同步脚本经常简单定义函数和注册事件处理程序
    - 可以遍历和操作 script 和他们之前的内容
  - 遇到 **async** 属性的 script 标签时
    - 开始下载脚本并继续解析 DOM
    - **脚本将在下载完成之后尽快执行(无序)**
    - 内部**禁止使用 document.write()**
    - 可以遍历和操作 script 和他们之前的内容

文档解析完成，document.readyState === 'interactive'

defer 脚本
  - 立即下载，**DOM解析完成之后，按照出现的顺序执行**
  - 能访问完整的 DOM
  - 内部**禁止使用 document.write()**

触发 document.onDOMContentLoaded 事件

文档完全解析完成，浏览器可能还在等待图片等内容的加载

所有的内容载入完成，所有的异步脚本完成载入和执行，document.readyState === 'complete'，触发 window.onload

显示页面(HTML 解析过程中逐步显示)

<n-alert type="warning">**CSS会阻塞HTML解析吗?**<br/>**通常不会，但是如果在执行 JS 的过程中修改了 style 就会**</n-alert>


#### 预加载扫描器

不论是同步加载 JS 还是异步加载 CSS、图片等，都要到HTML解析到这个标签才能开始，这似乎不是一种很好的方式

实际上，从 2008 年开始，浏览器开始逐步实现了预加载扫描器：**在拿到 HTML 文档的时候，先扫描整个文档，把 CSS、JS、图片和 web 字体等提前下载**

#### preload 与 prefetch

**都是只加载，不执行;如果服务器设置了 cache-control，则会缓存到磁盘，否则只会保存到内存中**

**preload**
- **以高优先级为当前页面加载资源**
- **as** 属性值表示优先级，**`style` 最高**，`script` 中低，其他值：`font/image/audio/video`

<n-alert type="warning">**必须在当前页面被使用，否则会报警告**</n-alert>

<n-alert type="warning">**加载字体时需要加上 crossorigin 属性，否则会重复加载**</n-alert>

```html
<link rel="preload" href="main.js" as="script">
<link rel="preload" href="font.woff" as="font" crossorigin>
```

**prefetch**
- 以低优先级为后面的页面加载未来需要的资源，**只会在空闲时加载**

<n-alert type="warning">**页面跳转，资源请求不会中断**</n-alert>

```html
<link rel="prefetch" href="news.js" as="script">
```

**通过 JS 设置**

```js
const res = document.createElement("link"); 
res.rel = "preload"; 
res.as = "style"; 
res.href = "css/mystyles.css"; 
document.head.appendChild(res); 
```

**通过 HTTP 响应头设置**

```http
Link: </uploads/images/pic.png>; rel=prefetch
```

#### 其他预先操作

**DNS 预解析**

```html
<link rel="dns-prefetch" href="//fonts.googleapis.com">
```

**预连接，预先进行 DNS 解析、TLS 协商、TCP 握手**

```html
<link href="https://cdn.domain.com" rel="preconnect" crossorigin>
```

**预渲染，获取下个页面所有的资源，空闲时渲染整个页面**

```html
<link rel="prerender" href="https://www.keycdn.com">
```
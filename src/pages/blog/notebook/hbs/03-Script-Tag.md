---
title: 03-script元素
date: 2020-12-28 15:57:52
image: /img/hbs.png
description: <script> 元素的由来
---

## \<script\> 元素的由来

将 `JavaScript` 引入网页，首先要解决它与网页的主导语言 `HTML` 的关系问题。在 `JavaScript` 早期， 网景公司的工作人员希望在将 `JavaScript` 引入 `HTML` 页面的同时，不会导致页面在其他浏览器中渲染出 问题。通过反复试错和讨论，他们最终做出了一些决定，并达成了向网页中引入通用脚本能力的共识。 当初他们的很多工作得到了保留，并且最终形成了 `HTML` 规范

**由网景公司创造**

最早实现于 `Netscape Navigator2`

### 元素属性

<script lang="ts" setup>
const tableHead = [
  { label: 'name', prop: 'name', width: 100 },
  { label: '是否必填', prop: 'need', width: 100 },
  { label: '含义', prop: 'des' }
];
const tableData = [
  {
    name: 'async',
    need: '可选',
    des: `立即开始下载脚本，不会阻塞页面，但是不保证执行的顺序`
  },
  {
    name: 'charset',
    need: '可选',
    des: `使用 src 属性指定的代码字符集，很少使用，大多数浏览器直接忽略`
  },
  {
    name: 'crossorigin',
    need: '可选',
    des: `配置相关请求的 CORS（跨源资源共享）设置。默认不使用 CORS。crossorigin=\"anonymous\" 配置文件请求不必设置凭据标志。crossorigin=\"use-credentials\" 设置凭据标志，意味着出站请求会包含凭据`
  },
  {
    name: 'defer',
    need: '可选',
    des: `表示脚本可以延迟到文档完全被解析和显示之后再执行。只对外部脚本文件有效。 在 IE7 及更早的版本中，对行内脚本也可以指定这个属性。虽然 HTML5 规范要求按顺序执行，但是实际情况并不理想`
  },
  {
    name: 'integrity',
    need: '可选',
    des: `允许比对接收到的资源和指定的加密签名以验证子资源完整性（SRI， Subresource Integrity）。如果接收到的资源的签名与这个属性指定的签名不匹配，则页面会报错， 脚本不会执行。这个属性可以用于确保内容分发网络（CDN，Content Delivery Network）不会提供恶意内容`
  },
  {
    name: 'src',
    need: '可选',
    des: `表示包含要执行的代码的外部文件`
  },
  {
    name: 'type',
    need: '可选',
    des: `代替 language，表示代码块中脚本语言的内容类型（也称 MIME 类型）。按照惯 例，这个值始终都是 text/javascript，尽管text/javascript 和 text/ecmascript 都已经废弃了。JavaScript 文件的 MIME 类型通常是 application/x-javascript，不过给 type 属性这个值有可能导致脚本被忽略。在非 IE 的浏览器中有效的其他值还有 application/javascript 和application/ecmascript。如果这个值是 module，则代码会被当成 ES6 模块，而且只有这时候代码中才能出现 import 和 export 关键字`
  }
];
</script>

<NTable :bordered="false" :single-line="false" striped>
  <thead>
    <tr>
      <th v-for="(item, index) in tableHead" :key="index + 'head'" :width="item.width ?? ''">
        {{ item.label }}
      </th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(item, index) in tableData" :key="index + 'dasdasd'">
      <td v-for="(it, idx) in tableHead" :key="idx + 'eret'" v-html="item[String(it.prop)]"></td>
    </tr>
  </tbody>
</NTable>


## 使用

直接包裹在`<script></script>`标签之中

使用 `src` 属性引入外部代码（不受浏览器同源策略的限制，可跨域）

如果**同时使用**以上两种方法，**外部代码会覆盖标签之中的代码**

使用 `DOM` 创建 `<script>` 元素（异步加载）

以这种方式获取的资源对浏览器预加载器是不可见的。这会严重影响它们在资源获取队列中的优先级。根据应用程序的工作方式以及怎么使用，这种方式可能会严重影响性能。要想让预加载器知道这些 动态请求文件的存在，可以在文档头部**显式声明**它们： `<link rel="preload" href="***.js">`

### 注意

代码之中**不能出现** `</sccript>`，无法避免时使用 `\` 转义，直接出现会导致浏览器报错

单标签可以在 `XHTML` 中使用，`HTML` 无效（`IE`不能正确处理）

浏览器不会检查外部文件的扩展名，但是服务器会根据文件扩展名来确定 `MIME` 类型，如果使用 `.js` 扩展名，一定要确保服务器能返回正确的 `MIME` 类型

不管包含的是什么代码，浏览器都会按照 `<script>` 在页面中出现的顺序依次解释执行，前提是它们没有使用 `async` 和 `defer` 属性（对于`XHTML` `async="async"`）

异步脚本不应该在加载期间修改 `DOM`

## 标签位置

最初所有的`<script>`标签都被放到`<head>`标签内部，会阻塞页面的渲染，不推荐

现代通常放到`<body>`页面内容之后

异步脚本（`async/defer`）

## `XHTML`

可扩展超文本标记语言

将`HTML`作为`XML`的应用重新包装的结果

必须指定 `<script type="text/jsvascript"></script>`

`<` 会被解释为标签的开始，而且后面不能有空格，需要以 `<` 代替或者将代码都包含到 `CDATA` 块中 `<![CDATA[ code... ]]>`，在不支持 `CDATA` 的浏览器中还需要使用 `//<![CDATA[` `code...` `//]]`

`XHTML` 模式会在页面的 MIME 类型被指定为 `application/xhtml+xml` 时触发。并不是所有浏览器都支持以这种方式送达的 `XHTML`

## 废弃的语法

自 1995 年 Netscape 2 发布以来，所有浏览器都将 JavaScript 作为默认的编程语言。type 属性使用一个 MIME 类型字符串来标识`<script>`>的内容，但 `MIME`类型并没有跨浏览器标准化。即使浏览器默认使用 `JavaScript`，在某些情况下某个无效或无法识别的 `MIME`类型也可能导致浏览器跳过（不执行）相关代码。因此，除非你使用 `XHTML` 或 `<script>` 标签要求或包含非 `JavaScript` 代码，**最佳做法是不指定 `type`属性**

```html
<!-- Netscape 与 Mosaic 针对不支持 script 元素的浏览器的 hack 写法 -->
<script><!--
function h() {
  console.log('hello, world');
}
//--></sccript>
```

## 行内代码(i)与外部文件(o)的对比

**外部文件的优点：**
  - 可维护性
  - 浏览器缓存
  - 标准适应性

## `<noscript>` 标签

优雅降级

内部可包含任意`HTML`元素

当浏览器不支持或禁用`JavaScript`时，显示其内部包裹的内容

正常情况下不会渲染
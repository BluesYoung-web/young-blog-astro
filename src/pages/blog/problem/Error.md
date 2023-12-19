---
title: 开发过程中的报错(异常)及其处理
description: 开发过程中的报错(异常)及其处理
date: 2020-12-23 16:30:33
---

[[toc]]

## SQL

### 自增ID无法从 0 开始

曲线救国

现将要插入的第一条数据的自增id设为 -1(`INSERT`)

然后再将第一条数据的自增ID**修改**为0(`UPDATE`)

```sql
-- ...
-- 强制从零开始
INSERT INTO `node` VALUES ('-1', '0', '根节点', '', '', '0', '0', null);
UPDATE `node` SET autoid = 0 WHERE autoid = -1;
-- 
INSERT INTO `node` VALUES ('1', '1', 'xxx', 'xxx', '', '-1', '1', '0');
-- ...
```


### 具有主从关系的表无法直接插入

先注释掉 `SQL` 文件中与主从表关联关系有关的语句

先将数据全部插入成功之后再去修改表结构

```sql
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `admin_name` varchar(255) NOT NULL,
  `phone_number` varchar(11) NOT NULL DEFAULT '',
  `passwd` varchar(255) NOT NULL,
  `metadataAutoid` int(11) DEFAULT NULL,
  PRIMARY KEY (`aid`),
  UNIQUE KEY `IDX_81a16d17d501cba9be802fd26b` (`admin_name`),
  UNIQUE KEY `REL_52f0a7932dddb6fdf30889c846` (`metadataAutoid`)
  -- ,
  -- 仅为阻止 sql 执行报错，实际存在
  -- CONSTRAINT `FK_52f0a7932dddb6fdf30889c846d` FOREIGN KEY (`metadataAutoid`) REFERENCES `user_meta_data` (`autoid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
```


## Nginx

### MIME 报错

<n-alert type="error">**Resource interpreted as Stylesheet but transferred with MIME type text/plain**</n-alert>

**情形一：**
- 在引入模块化开发的`js`文件时，必须声明类型为 `module`
- 这样，浏览器就会将这个文件认为是`ECMAScript`模块
- 一般情况下业界或者官方会将这种模块文件使用 `mjs `命名
- `Nginx `会根据`mime type`定义的对应关系来告诉浏览器如何处理服务器传给浏览器的这个文件，一般默认`default_type application/octet-stream;`会对未定义的文件设置为该类型

```html
<script type="module" src="/src/main.ts"></script>
```

```nginx
server {
  http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    types {
      application/x-javascript              mjs;
    }
  }
}
```

**情形二：**
- `vue3` 使用 `h5` 路由
- **打包时使用了相对路径`./`，将 `base` 的值修改为绝对路径就行了**

### `net::ERR_HTTP2_PROTOCOL_ERROR 200`

场景：后端接口使用 `nginx` 反向代理，一个数据导出接口，请求 `10W+` 的数据

**可能的原因：**
  - nginx 截断响应
  - 后端框架自行截断响应

**解决方案：**
  - 在 `nginx` 配置文件中加入 `proxy_max_temp_file_size 0;`，然后重载 `nginx`（原因一）
  - **分页并发请求，前端合成，更优**

### 代理无法访问端口

`[crit] 33274#33274: *34 connect() to 127.0.0.1:3000 failed (13: Permission denied) while connecting to upstream, client: 192.168.50.86, server: xxx.com, request: "GET / HTTP/1.0", upstream: "http://127.0.0.1:3000/", host: "***"`

**解决方案：**

```bash
# 允许 nginx 连接到其他端口
sudo setsebool -P httpd_can_network_connect 1
# 再不行，就将 user 修改为 root
sudo vim /etc/conf/nginx.conf
```

## TypeScript

### `.vue` 文件引入报错

新建类型说明文件 `shims-vue.d.ts`，内容如下：

```ts
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

### `.ts` 文件引入报错

```ts
// vite.config.ts 配置别名
import { resolve } from 'path';
export default defineConfig({
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  }
});
// tsconfig.json 配置
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

```ts
// 关闭报错
// @ts-nocheck       忽略当前文件
// @ts-expect-error        忽略下一行
```

### `*.d.ts` 导入 `import` 其他类型导致全局类型失效

当在一个 `*.d.ts` 文件中引入其他模块之后，**就会使 `ts` 类型系统将其视为一个模块**，导致其中的所有类型即使添加了 `declare` 关键字也不能直接全局使用

```ts
import { A } from 'module-a';
// 显示将其声明为全局类型
declare global {
  interface ExtA {
    data: A;
  }

  interface ExtA2 {
    xdata: A;
  }
};
```

### `error TS7056`

**`error TS7056: The inferred type of this node exceeds the maximum length the`**

突然报错，就挺突然的，莫名其妙

```ts
// 报错部分
const Builder = <T extends {}>(model: T) => ({
    withComment: (comment: string) => Builder({ ...model, comment }),
    withSpecialComment: () => Builder(model).withComment('Special comment'),
    withTrackingNumber: (tracking: number) => Builder({ ...model, tracking }),
    build: () => model })

const a = Builder({});
// a.withComment('test').build().tracking // OK - expected "Property 'tracking' does not exist on type '{ comment: string; }'""
console.log(a.withTrackingNumber(1234).withSpecialComment().build().tracking)

// 解决方案
type Builder<T> = {
    withComment: (comment: string) => Builder<T & { comment: string }>,
    withSpecialComment: () => Builder<T & { comment: string }>,
    withTrackingNumber: (tracking: number) => Builder<T & { tracking: number }>,
    build: () => T
};

const Builder: <T extends {}>(model: T) => Builder<T> = <T extends {}>(model: T) => ({
    withComment: (comment: string) => Builder({ ...model, comment }),
    withSpecialComment: () => Builder(model).withComment('Special comment'),
    withTrackingNumber: (tracking: number) => Builder({ ...model, tracking }),
    build: () => model });

const a = Builder({});
```

## vite

### 打包内存耗尽

**限制 `node` 可使用的内存**
  - `cross-env NODE_OPTIONS=--max_old_space_size=1024 vite build`

**调整配置文件**

```ts
export default {
  // ...
  build: {
    // 不生成源码映射文件
    sourcemap: false,
    // 不生成压缩报告
    brotliSize: false
  }
}
```

### momentjs 本地化无效

**表现：**
- `moment.duration(100, 's').humanize()`结果一直显示为英文，无论是否增加 `.locale('zh-cn')`
- 导入对应的语言包也没有任何效果(`import 'moment/locale/zh-cn'`)
- **node 环境下无需任何操作**

**原因：`vite` 不支持直接导入 `umd` 模块的源文件**[(issues)](https://github.com/vitejs/vite/issues/945)

```ts
import moment from 'moment'
import 'moment/dist/locale/zh-cn'
moment.duration(120, 's').humanize() // 两分钟
```

### SSG

**模块报错：**

```js
[vite-ssg] An internal error occurred.
[vite-ssg] Please report an issue, if none already exists: https://github.com/antfu/vite-ssg/issues
file:///home/young/young-project/vitesse/.vite-ssg-temp/main.mjs:24
import { NCard } from "naive-ui";
         ^^^^^
SyntaxError: Named export 'NCard' not found. The requested module 'naive-ui' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from 'naive-ui';
const { NCard } = pkg;

    at ModuleJob._instantiate (node:internal/modules/esm/module_job:124:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:181:5)
    at async Promise.all (index 0)
    at async ESMLoader.import (node:internal/modules/esm/loader:281:24)
    at async importModuleDynamicallyWrapper (node:internal/vm/module:437:15)
    at async build (/home/young/young-project/vitesse/node_modules/.pnpm/vite-ssg@0.17.6_0b7aeac23451430d7a0b62007ee02bfe/node_modules/vite-ssg/dist/node/cli.cjs:180:44)
    at async Object.handler (/home/young/young-project/vitesse/node_modules/.pnpm/vite-ssg@0.17.6_0b7aeac23451430d7a0b62007ee02bfe/node_modules/vite-ssg/dist/node/cli.cjs:294:3)
error Command failed with exit code 1.
```

**原因：** 主要是因为 `naive-ui` 没有提供对应的 `.mjs` 模块，**而 `vite-ssg` 默认为 `esm` 所需的 `.mjs` 模块**

**解决方法：修改 `vite.config.ts` 的配置即可[解决](https://github.com/antfu/vite-ssg/issues/150#issuecomment-997462153)**

```js
{
  ssgOptions: {
    format: 'cjs'
  }
}
```

**使用了浏览器端特有的属性或API，导致报错：**

- **解决方案一：**
  - 使用 `<client-only>` 标签将涉及浏览器专属操作的组件包裹起来
  - **会阻止对应的代码在编译时生成，不推荐使用**

```html
<template>
	<client-only>
    	<App />
    </client-only>
</template>
```

- **解决方案二：**
  - 使用对应的 **属性/API** 之前先进行是否为浏览器的判断
  - 虽然相对来说繁琐的一点，不过能更大程度上的做到接近真实使用的渲染
  - **推荐使用**

```html
<script lang="ts" setup>
// 只有在浏览器端才存在 window
import { isClient } from '@vueuse/core';

const { y } = useScroll(isClient ? window : null);
</script>
```

### 引入外部 js 文件无效

**必须加入 `type="module"`， 否则打包之后无法使用**

```html
<!-- 引入特效 -->
<script type="module" src="/src/assets/js/number-rain.js"></script>
```

### Vue3 移动端兼容

**表现：**
  - 微信内置浏览器可以正常打开
  - `vivo` 内置浏览器无法正常打开

**原因：**
  - 微信内置浏览器的内核 `Chrome/86.0.4240.99`
  - `vivo` 浏览器内核 `Chrome/62.0.3202.84`
  - 好巧不巧，**刚好 `Chrome62`不支持动态 import**
  - [caniuse-import](https://www.caniuse.com/?search=import)

**解决方案：修改配置文件**

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 不生成同名 polyfill 文件，打包速度翻倍
    // 如果出现兼容问题，可以删除此配置
    // legacy({ renderLegacyChunks: false })
    legacy()
  ]
})
```

## Vue

### 数据改变但是视图没有刷新

强制刷新 `@change="() => $forceUpdate()"`

### ref 属性导致响应丢失

**使用 CompositionAPI 写法的时候 `ref属性` 与 `表单对象form` 不能相同，否则会丢失响应**

```html
<template>
	<el-form ref="formRef" v-model="form"></el-form>
</template>
<script setup>
import { ref } from 'vue';
const formRef = ref(null);
const form = ref(null);
</script>
```

### 渲染函数 h

<n-alert class="my-4" type="warning">**Non-function value encountered for default slot.<br/> Prefer function slots for better performance**</n-alert>

```ts
// 直接将内容作为默认插槽的内容，会产生警告
h(ComponentA, { prop: value }, '我是内容')
// 以函数的方式放入，拥有更好的性能，警告消除
h(ComponentA, { prop: value }, {
  default: () => '我是内容'
})
```

## yarn

### 无法加载文件` C:\Users\01\AppData\Roaming\npm\yarn.ps1`

**管理员身份运行 `powershell`，执行 `set-ExecutionPolicy RemoteSigned`**

### 树莓派 There are no scenarios ; must have at least one

系统自身原本有一个 `yarn(cmdtest)`

需要先卸载原有的 `yarn`，然后重新安装即可

```bash
sudo apt-get remove cmdtest
sudo apt-get remove yarn

npm i -g yarn
```

## 字符串

### 从后端返回的字符串被转义了

`\u5929\u771F\u721B\u6F2B\u9AD8\u895F\u59EB`乍看之下并没有什么特别的地方

**但是实际的内容是`\\u5929\\u771F\\u721B\\u6F2B\\u9AD8\\u895F\\u59EB`**

所以各种字符串解密的方法都无法**直接**将其恢复为正常的字符串

```js
const str = '\\u5929\\u771F\\u721B\\u6F2B\\u9AD8\\u895F\\u59EB'
function decodeTransferredString(str) {
  str = JSON.stringify(str).split('\\')
  // 将字符串根据 \\ 分割
  // [""", "", "u5929", "", "u771F", "", "u721B", "", "u6F2B", "", "u9AD8", "", "u895F", "", "u59EB""]
  str = str.filter(item => item.match(/u/))
  // 筛选出包含 u 的
  // ["u5929", "u771F", "u721B", "u6F2B", "u9AD8", "u895F", "u59EB""]
  str = str.map(item => item.replace('u', '0x'))
  // 将 u 替换为 0x
  // ["0x5929", "0x771F", "0x721B", "0x6F2B", "0x9AD8", "0x895F", "0x59EB""]
  str[str.length - 1] = str[str.length - 1].slice(0, str[str.length - 1].length - 1)
  // 切割最后一个元素多余的字符串
  // ["0x5929", "0x771F", "0x721B", "0x6F2B", "0x9AD8", "0x895F", "0x59EB"]
  str = str.map(item => parseInt(item))
  // 将十六进制转换为十进制，不要这一步也可以
  return String.fromCharCode(...str)
  // 将其恢复为字符串
}
```

## jest

### "SyntaxError: Need to install with `app.use` function" when using vue-i18n plugin for Vue3


<n-alert class="mt-4" title="vue-i18n 测试用例报错" type="warning">不能像在 `.vue` 文件中一样**直接使用 `useI18n()`**</n-alert>

**正确使用：**

```ts
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import Footer from '../src/components/Footer.vue'

describe('Footer.vue', () => {
  it('should be interactive', async () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'zh-CN',
      messages,
    })
    const wrapper = mount(Footer, {
      global: {
        // 先在此处安装插件
        plugins: [i18n]
      }
    })
    expect(wrapper.findAll('a').length).toBe(2)

    const [gitee, refer] = wrapper.findAll('a')
    const giteeAttr = gitee.attributes()
    const referAttr = refer.attributes()
    expect(giteeAttr.target).toBe('_blank')
    // 然后在 vm 上调用对应的属性
    expect(giteeAttr.href).toBe(wrapper.vm.t('nav.gitee_addr'))

    expect(referAttr.target).toBe('_blank')
    expect(referAttr.href).toBe('https://github.com/antfu/vitesse')
  })
})
```

## 浏览器插件

### 在 contentScript 中对 window 对象做出的修改对于页面无效

<n-alert type="info">**二者的 window 是隔离的，但是 DOM 是共享的，可以通过插入 script 标签来实现代码注入**</n-alert>

```ts
const code = `
localStorage.setItem('young-plugin', '[12138, 9527]')
console.log("🚀 ~ file: App.vue ~ storageDemo", ${localStorage.length})
`
const src = window.URL.createObjectURL(
  new Blob([code], { type: 'text/javascript' })
)
const script = document.createElement('script')
script.src = src
document.body.appendChild(script)

const getData = () => {
  const res = localStorage.getItem('young-plugin')
  console.log('🚀 ~ file: App.vue ~ getData ~ res', res)
}
```

## 新兴 API

### `window.postMessage` 无法正常工作

<n-alert type="warning">**直接通过 window.open 返回对象调用 postMessage 可能会无法正常工作，建议子应用先给主应用发送消息，然后主应用通过消息事件内的源对象与子应用通信**</n-alert>


<n-alert type="warning">**postMessage 的第二个参数一定要填！！！，不知道填什么可以先填 `*`**</n-alert>

```ts
// 主窗口
window.open('子窗口的地址')
window.addEventListener('message', (e) => {
  (e.source as Window)?.postMessage(token, e.origin)
})

// 子窗口(被打开的窗口)
window.addEventListener('message', (e) => {
  console.log(e.data)
})
// 如果知道主窗口的地址，可以替换 * ，否则最好为 *
window.opener?.postMessage('消息传递的数据，可以是任意值', '*')
```

## Nuxt

### 使用 pnpm 安装

必须保证以下配置存在，否则无法正常使用

```sh
shamefully-hoist=true
strict-peer-dependencies=false
```

### `Hydration node mismatch`

**水合失败，绝大多数情况下就是因为代码编写不规范导致的<br/>(eg: `p` 标签内部放置了块级元素)**

## Linux

### Error: ENOSPC: System limit for number of file watchers reached

**监听的文件数量达到了系统上限**

```bash
sudo nano /etc/sysctl.conf
# 追加写入：
#         fs.inotify.max_user_watches=524288
# 保存

# 刷新配置
sudo sysctl -p
```


### DNS 错误

```bash
sudo vim /etc/resolv.conf
# 对其内容做出以下修改
# 注释掉现有的 nameserver
nameserver 内网的 dns 服务器地址
nameserver 8.8.8.8
nameserver 8.8.4.4

# 修改完毕，保存即可生效
```

### ubuntu 打开 chrome 时会提示密钥环

第一次打开的时候就会提示你设置一个秘密，**此时建议直接留空**，不然后续打开 chrome 就会一直让你输入密码，虽然相对安全，不过很烦

### ubuntu 实现盒盖不休眠

```bash
# 新建配置文件，目录不存在时请先新建对应的目录
sudo nano /etc/systemd/logind.conf.d/nocloselid.conf
# 内容如下：
[Login]
HandleLidSwitch=ignore
HandleLidSwitchExternalPower=ignore
```

> 如果关闭盖盖后仍然希望系统保持未锁定状态，可以按照以下步骤设置Ubuntu：
  打开"系统设置"应用程序。
  导航到"隐私"选项卡。
  在"屏幕锁定"部分，将"自动锁定屏幕"设置为"从不"或将切换关闭。

## 注意！！！

**`window.addEventListener('storage')` 无法监听同一页面的变化**

## IOS

### API

**不支持 `screen.orientation`**

**lit 组件套组件，在某些老旧机型上会出问题(仅第一次显示，后续无法显示)！！！**

### ios11/12 中的跨域请求状态码为 0，接口无法正常返回数据

在 `ios12` 中，`*` 通配符被禁用，导致 `options` 预检时发现是通配符 `*`，**禁止浏览器继续发送** `get/post` 请求，此时，请求结束，状态码为 `0`

**解决方案：** `Access-Control-Allow-Headers` 指明具体的值，不使用通配符

### 浏览器支付(支付宝/微信h5)

**Safari 不支持 iframe 唤端，但是第三方浏览器支持**

```ts
/**
 * 支付宝 h5 | 微信 h5
 */
export const pay_open = async (args: OrderArgs | OrderArgsSlave) => {
  let sub: Window
  const ua = navigator.userAgent
  const isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  const isDing = /DingTalk/img.test(ua)
  const isQuark = /Quark/img.test(ua)
  const isUc = /UCBrowser/img.test(ua)
  const isBaidu = /Baidu/img.test(ua)
  const isDouyin = /Bytedance/img.test(ua)

  if (!isUc && args.payMethod !== PayMethod.wechat_h5) {
    if (isiOS && !isDing && !isQuark && !isBaidu && !isDouyin) {
      // ios iframe 无法唤起，直接打开新窗口
      sub = window.open('', '_blank')
    }
    else {
      const pay_window = document.createElement('iframe')
      pay_window.setAttribute('hidden', 'hidden')
      pay_window.setAttribute('sandbox', 'allow-top-navigation allow-scripts')
      document.body.append(pay_window)
      sub = pay_window.contentWindow
    }
  }

  if (args.idType === 'platId') {
    const res = await apis.addOrder(args) as OrderResBase
    if (args.payMethod === PayMethod.wechat_h5) {
      // 微信 h5 直接 scheme 唤端
      const scheme = Array.isArray(res.url) ? res.url[0] : res.url
      location.href = scheme
    }
    else if (isUc) {
      // uc 浏览器过于恶心，会在页面插入广告代码
      await showTip('点击确认唤起支付')
      window.open(res.url)
    }
    else {
      sub.location.href = res.url
    }
    return res
  }
  else {
    const token = (args as OrderArgsSlave).token
    delete args.token
    const res = await apis.addOrder(args as OrderArgs, token) as OrderResBase
    if (args.payMethod === PayMethod.wechat_h5) {
      // 微信 h5 直接 scheme 唤端
      const scheme = Array.isArray(res.url) ? res.url[0] : res.url
      location.href = scheme
    }
    else if (isUc) {
      await showTip('点击确认唤起支付')
      window.open(res.url)
    }
    else {
      sub.location.href = res.url
    }
    return res
  }
}
```

## 微信支付

### 网页授权

**无法通过iframe进行网页授权，一般操作就是(微信浏览器环境)进入页面立即获取授权码**

### 微信的两种 js 支付

`WeixinJSBridge.invoke('getBrandWCPayRequest', ...)`，**仅为支付单独提供，无需额外验签！**

`wx.chooseWXPay`，**和其他接口保持统一，需要额外验签**

### h5 支付直接跳转的话，用户体验极差

1. [后端进行请求伪造，等到真实的唤端地址](https://blog.csdn.net/gtcfla_/article/details/100670937)
2. 前端直接 `location.href` 进行唤端支付

```js
// 正则参考
str.match(/weixin:\/\/wap\/pay\?prepayid%3D[^"]+/img)
```

## 微信登录

[微信网站应用](https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html)

1. 需要一个公众号及微信开放平台(微信内使用微信网页授权登录，微信外使用微信扫码登录)
2. 微信网页授权需要在**微信公众平台**(公众号后台)中配置授权域名(需要外网可访问域名进行文件校验)，此时使用**公众号的 appid**
3. 微信扫码登录需要在**微信开放平台**中配置回调域名(**无需协议及端口号，无需校验文件，可以配置内网域名**)

## Nuxt3

### 需要 `.html` 后缀路径的

将文件命名为 `[name].html.vue`，然后将 `index.vue` 直接重定向到 `index.html.vue`

### 一些打包报错

```ts
// 修改配置文件
{
  build: {
    transpile: ['报错的包名']
  }
}
// 使用 <ClientOnly> 标签外层包裹
```

### 水合(hydrition)警告

- 标签的嵌套需要合法，不然浏览器修正之后就会有警告

- `.server.vue` 与 `.client.vue` 编写的组件，最好保持唯一的根组件，否则也可能会有警告，而且警告的内容莫名其妙

## Canvas

### `Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported`

**画布中使用了跨域的图片，导致画布被污染，从而无法提取画布的数据**

需要后端支持图片跨域，并在加载图片时设置 `crossorigin="anonymous"`

**如果跨域的图片此前在别的地方使用过，则必须统一使用 `crossorigin="anonymous"`，否则由于资源缓存，图片将无法正常显示**

### 绘制的图片清晰度降低

**主要是因为设备的像素比，即虚拟像素与物理像素之间的差距**

```js
// 解决方案：
const dpr = window.devicePixelRatio || 1;
// 设置画布大小，可以影响绘制内容的质量
canvas.width = width * dpr;
canvas.height = height * dpr;
// 设置显示的大小，可以保证内容不溢出；相同的区域内绘制了像素密度增加，绘制的质量自然增加
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;
```

## unbuild (打包工具)

### 打包 Vue 的 tsx 时，编译结果为 React

**需要单独给 `esbuild` 传递特定的配置**

```ts
// build.config.ts
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: [
    {
      builder: 'mkdist',
      input: './src/',
      outDir: './dist',
      format: 'esm',
      // 明确告诉 esbuild 使用 Vue 的 tsx
      esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment',
        jsxImportSource: 'vue'
      },
    },
  ],
  externals: [
    'vue',
    '@vueuse/core',
    'element-plus',
    '@bluesyoung/utils',
    '@vue/shared',
    'sortablejs',
  ],
  declaration: true
});
```

## 浏览器

### https 与 http 混用

#### 简单粗暴（本地解决）

旧：<del>打开 `chrome://flags/`，搜索控制台报错的 `mixed content`，调整对应的配置然后重启浏览器即可</del>

新：点击网址部分的 🔒，调整网站设置/权限，将**不安全的内容**调整为**允许**，完成后根据提示刷新页面即可

#### 一劳永逸（原始资源同时支持两种协议的情况）

- 不指定协议，浏览器会自动选择（`//a.com/b.js`）

- 加入特定的头部，自动将 `http` 请求升级为 `https` 请求

```html
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```


## github

### ssh 突然推不了代码了

`ssh: connect to host github.com port 22: Resource temporarily unavailable`

**22 端口可能被防火墙屏蔽了，可以尝试连接 GitHub 的 443 端口**

```bash
$ vim ~/.ssh/config
# Add section below to it
Host github.com
  Hostname ssh.github.com
  Port 443

$ ssh -T git@github.com
Hi xxxxx! You've successfully authenticated, but GitHub does not
provide shell access.
```
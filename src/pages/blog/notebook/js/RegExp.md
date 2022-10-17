---
title: 正则表达式
description: 正则表达式
image: /img/regexp.jpg
date: 2021-10-24 17:09:58
---

[[toc]]

## 精髓

<n-alert type="error">**IPhone 不支持(2022-04-08)，直接白屏！！！**</n-alert>

### 非获取匹配

**匹配 pattern 但不获取匹配结果，不能被后续引用**

```js
/(?:pattern)/
/industr(?:y|ies)/ ==> /[industry|industries]/
```

### 非获取匹配，正向肯定预查

```js
/(?=pattern)/
reg = /Windows(?=95|98|NT|2000)/
'Windows2000'.match(reg)?.[0] === 'Windows'
'Windows10'.match(reg)?.[0] === undefined
```

### 非获取匹配，正向否定预查

```js
/(?!pattern)/
reg = /Windows(?!95|98|NT|2000)/
'Windows2000'.match(reg)?.[0] === undefined
'Windows10'.match(reg)?.[0] === 'Windows'
```

### 非获取匹配，反向肯定预查

```js
/(?<=pattern)/
reg = /(?<=95|98|NT|2000)Windows/
'95Windows'.match(reg)?.[0] === 'Windows'
'xpWindows'.match(reg)?.[0] === undefined
```

### 非获取匹配，反向否定预查

```js
/(?<!pattera)/
reg = /(?<!95|98|NT|2000)Windows/
'95Windows'.match(reg)?.[0] === undefined
'xpWindows'.match(reg)?.[0] === 'Windows'
```

## 应用

### 数字千分位分隔

只考虑整数，暂不考虑浮点数或以 0 开始的字符串

```js
// 从右向左，3位一隔
const formatCurrency = (str) => str.replace(/(?!^)(?=(\d{3})+$)/g, ',');
'1234567890' => '1,234,567,890'
```

### 手机号分隔

`3-4-4` 分隔

```js
// 思路同上，从右向左，4位一隔
const telSep = (tel) => tel.replace(/(?=(\d{4})+$)/g, '-');
// 3?4?4
const formatMobile = (mobile) => {
  return String(mobile).slice(0,11)
      // 在第 3 位后面加入 -
      .replace(/(?<=\d{3})\d+/, ($0) => '-' + $0)
      // 至少存在第 9 位的情况下，在第 8 位后面加入 -
      .replace(/(?<=[\d-]{8})\d{1,4}/, ($0) => '-' + $0);
}
```

### 验证密码的合法性

密码通常为 `6 ~ 12` 位

由**数字、大小写字母**组成

**必须至少包含两种字符**

```js
const isValidPass = (pass)
  => /((?=.*\d)((?=.*[a-z])|(?=.*[A-Z])))|(?=.*[a-z])(?=.*[A-Z])^[a-zA-Z\d]{6,12}$/.test(pass);
```

### 提取连续重复的字符

```js
const getRepeatCode = (str) => {
  const arr = new Set();
  // 1 个或多个字符，重复 1 次或多次
  const reg = /(.+)\1+/g;
  str.replace(reg, ($0, $1) => {
    $1 && arr.add($1);
  });
  return [...arr];
}
```

### 去除字符串首尾空格

```js
// 去除 开头或结尾 的空白字符
const trim  = (str) => str.replace(/^\s*|\s*$/g, '');
// 分组匹配，以中间 非空白字符内容 替换 原始字符串
const trim = (str) => str.replace(/^\s*(.*?)\s*$/g, '$1');
```

### html 转义

```js
const myEscape = (string) => {
  const escapeMaps = {
    '&': 'amp',
    '<': 'lt',
    '>': 'gt',
    '"': 'quot',
    "'": '#39'
  };
  // 这里和/[&<>"']/g的效果是一样的
  const escapeRegexp = new RegExp(`[${Object.keys(escapeMaps).join('')}]`, 'g');

  return string.replace(escapeRegexp, (match) => `&${escapeMaps[match]};`);
}
console.log(myEscape(`
  <div>
    <p>hello world</p>
  </div>
`));

/*
&lt;div&gt;
  &lt;p&gt;hello world&lt;/p&gt;
&lt;/div&gt;
*/
```

### html 反转义

```js
const myUnescape = (string) => {
  const unescapeMaps = {
    'amp': '&',
    'lt': '<',
    'gt': '>',
    'quot': '"',
    '#39': "'"
  };

  const unescapeRegexp = /&([^;]+);/g;

  return string.replace(unescapeRegexp, (match, unescapeKey) => {
    return unescapeMaps[ unescapeKey ] || match;
  });
}
console.log(myUnescape(`
  &lt;div&gt;
    &lt;p&gt;hello world&lt;/p&gt;
  &lt;/div&gt;
`));

/*
<div>
  <p>hello world</p>
</div>
*/
```

### 字符串转驼峰

```js
/*
1. foo Bar => fooBar
2. foo-bar---- => fooBar
3. foo_bar__ => fooBar
*/
// 匹配至少有一个 空白字符 | 下划线 | 中划线 之后的 第一个字母，并将其转换为大写
const camelCase = (str) => 
  str.replace(/[\s-_]+(.)?/g, ($0, $1) => $1 ? $1.toUpperCase() : '');
```

### 获取所有 img 标签的 src

必须为在线链接
  - `http://`
  - `https://`
  - `//`
  - `./`
  - `/`

```js
const getAllImgs = (htmlStr) => {
  // 分组匹配
  const reg = /<img[^>]+src="((https?:)?[(\/\/)|(\.?\/)][^"]+)"[^>]*?>/ig;
  const arr = new Set();
  htmlStr.replace(reg, ($0, $1) => {
    $1 && arr.add($1);
  });
  return [...arr].map((url) => {
    // 根据分类拼接为完整的 url
    if (url.startsWith('//')) {
      return location.protocol + url;
    } else if (url.startsWith('/')) {
      return location.origin + url;
    } else if (url.startsWith('./')) {
      return location.origin + location.pathname.match(/(\/.*?\/).*?/g)[0] + url;
    }
    return url;
  });
}
```

### 通过键名获取查询参数对应的值

参数名为第一个(`?` 后面)

参数名为最后一个(`&` 后面)

参数名在中间(`&` 之间 `&`)

暂不考虑一个参数有多个值的情况

```js
const getQueryValue = (name) => {
  const reg = new RegExp(`[?&]${name}=([^&]*)(?:&|$)`);
  const result = location.search.match(reg)?.[1];
  return result ? decodeURIComponent(result) : undefined;
}
```

### 匹配 24 小时时间格式

```js
// 小时
// 以 0 | 1 开头，第二位可以是任意数字
// 以 2 开头，第二位只能是 0 | 1 | 2 | 3

// 分钟
// 只有 0 合法
// 0 | 1 | 2 | 3 | 4 | 5 + 任意数字也合法
const isValid24Format = (time) => /^(?:(?:0?|1)\d|2[0-3]):(?:0?|[1-5])\d$/.test(time);
console.log(isValid24Format('01:14')); // true
console.log(isValid24Format('1:64')); // false
console.log(isValid24Format('1:1')); // true
console.log(isValid24Format('23:59')); // true
console.log(isValid24Format('23:66')); // false
```

### 匹配日期格式

`yyyy/mm/dd`

`yyyy.mm.dd`

`yyyy-mm-dd`

**不考虑闰月(`1~31`)，分隔符不得混用**

```js
// 年份可以为 4 位任意数字
// 分隔符可以是 - . / 其中之一，但是不能混合使用，所以使用反向引用限制
// 月份可以是 0 搭配 1~9 或者 1 搭配 0 ~ 2
// 日期可以是 0 搭配 1~9 或者 1 | 2 搭配任意数字 或者 3 搭配 0 | 1
const isValidDate = (date)
  => /^\d{4}([-\.\/])(?:0[1-9]|1[0-2])\1(?:0[1-9]|[12]\d|3[01])$/.test(date);
console.log(isValidDate('2021-08-22')); // true
console.log(isValidDate('2021/08/22')); // true
console.log(isValidDate('2021.08.22')); // true
console.log(isValidDate('2021.08/22')); // false
console.log(isValidDate('2021/08-22')); // false
```

### 匹配 16 进制颜色值

`#ffffff`

`#fff`

```js
const getColors = (str) => {
  const reg = /#(?:[\da-fA-F]{6}|[\da-fA-F]{3})/g;
  return str.match(reg);
}
```

### 检测是否为 `http | https` 协议

```js
const isValidHttp = (url) => /^https?:/.test(url);
```

### 检测中文

```js
const isValidZhCN = (str) => /^[\u4E00-\u9FA5]+$/.test(str);
```

### 匹配中国大陆的手机号

```js
const isCNTel = (tel)
  => /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[235-8]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|66\d{2})\d{6}$/.test(tel);
```

### 英文单词加前后空格

`\b` **单词的边界**
  - `\w`(**任何单词**) 与 `\W`(**任何非单词**) 之间
  - `^` 与 `\w` 之间
  - `\w` 与 `$` 之间

`\B` **非单词边界**
  - `\w` 与 `\w` 之间
  - `\W` 与 `\W` 之间
  - `^` 与 `\W` 之间
  - `\W` 与 `$` 之间

```js
const addBlank2En = (str) => str.replace(/\b/g, ' ');
```

### 字符串大小写反转

先匹配小写的，将其转为大写后与原字符比较
  - 相等，转为小写
  - 不等则转为大写

```js
const upLowChange = (str) => {
  return str.replace(/[a-z]/, ($0) => {
    const temp = $0.toUpperCase();
    return temp === $0 ? $0.toLowerCase() : temp;
  });
}
```

### 判断是否为合法的 windows 文件目录

磁盘符：`[a-zA-Z]:\\`

文件夹：`\dir | \dir\ | \\dir | \\dir\\`

文件名：`file.xxx`

```js
const isValidWindowsPath = (path) => {
  const reg = /^[a-zA-Z]:\\(?:[^\\:*<>|"?\r\n/]+\\?)*(?:(?:[^\\:*<>|"?\r\n/]+)\.\w+)?$/;
  return reg.test(path);
};
console.log(isValidWindowsPath('d:/a/b/c.js')); // false
console.log(isValidWindowsPath('d:\\a\b\c.js')); // true
console.log(isValidWindowsPath('d:\\a\\b')); // true
console.log(isValidWindowsPath('d:\\a\\b\\c.js')); // true
```

### 匹配 html 之中的 id 值

```js
const getAllIds = (htmlStr) => {
  // 匹配两个双引号直接的任意内容
  const reg = /id="([^"]*)"/g;
  const arr = [];
  htmlStr.replace(reg, ($0, $1) => {
    $1 && arr.push($1);
  });
  return arr;
}
```

### 提取 html 标签包含的文字

```js
const tagReplace = function(htmlText) {
  let reg = /<\/?.+?\/?>/g;
  return htmlText.replace(reg, '');
}
```

### 判断分数是否合法

[0, 150]

小数为 `.5`

```js
// 以 1~9 开头的分数只能是两位数，可能带 .5
// 以 10 | 11 | 12 | 13 | 14 开头可以跟一个任意的整数，可能带 .5
// 150 不可能带 .5
const isValidScore = (score)
  => /^(?:[1-9]?\d|1[0-4]\d|150(?!\.5))(?:\.5)?$/.test(score);
```

### 判断版本号是否合法

版本号的格式 `X.Y.Z`

每一个位置都至少为一个数字

```js
// `x.` * 2 + `x`
// `x` 代表一个或多个数字
const isValidVersion = (version) => /^(?:\d+\.){2}\d+$/.test(version);
```
---
layout: "@/layouts/BlogPost.astro"
title: 15-RegExp
image: /img/hbs.png
description: JavaScript 正则表达式
date: 2020-12-28 17:28:59
---

[[toc]]

## 概述

`ECMAScript` 通过 `RegExp` 类型支持正则表达式

```js
let expression = /pattern/flags;
```

## `flags`

`g`：全局模式，表示查找字符串的全部内容，而不是找到第一个匹配的内容就结束

`i`：不区分大小写，表示在查找匹配时忽略 `pattern` 和字符串的大小写

`m`：多行模式，表示查找到一行文本末尾时会继续查找

`y`：粘附模式，表示**只查找从 `lastIndex` 开始及之后的字符串**

`u`：`Unicode` 模式，**启用 `Unicode` 匹配**

`s`：`dotAll` 模式，**表示元字符 `.` 匹配任何字符（包括`\n` 或`\r`）**

## 元字符(模式中使用需要转义)

`( [ { . * ? ^ $ \ | } ] )`

`.` 表示**除换行符和结束符外任一字符**

`*` 表示其**前方一个字符出现 n 次扩展（n>=0）**

`+` 表示其**前方一个字符出现 n 次扩展（n>=1）**

`?` 表示其**前方一个字符出现 0 or 1 次扩展**

`|` 表示**左右任意一个**，`abc|def = abc or def`

`{m}` 表示其**前方一个字符出现 m 次扩展**

`{m,n}` 表示其**前方一个字符出现 m ~ n 次扩展**

`^` 匹配字符串开头

`$` 匹配字符串结尾

`()` 分组标记（子表达式）,`(abc) = abc, (abc|def) = abc or def`

`\f` 换页

`\r` 回车

`\t` 制表符

`\v` 垂直制表符

`\w` **数字、字母、下划线**

`\W` **除**数字、字母下划线之外

`\d` **数字**

`\D` **非**数字

`\s` **空白字符**

`\S` **非空白字符**

`\b` **单词边界**

`\B` **非单词边界**

`[]` 字符集，单个字符的**取值范围** `[abc] or [a-z]`

`[^]` 非字符集，对单个字符给出**排除范围**

## 实例属性

<script lang="ts" setup>
const tableHead1 = [
  { label: '属性名', prop: 'name' },
  { label: '类型', prop: 'type' },
  { label: '含义', prop: 'des' }
];
const tableData1 = [
  { name: '<strong>global</strong>', type: `Boolean`, des: `是否设置了 g 标记` },
  { name: '<strong>ignoreCase</strong>', type: `Boolean`, des: `是否设置了 i 标记` },
  { name: '<strong>unicode</strong>', type: `Boolean`, des: `是否设置了 u 标记` },
  { name: '<strong>sticky</strong>', type: `Boolean`, des: `是否设置了 y 标记` },
  { name: '<strong>lastIndex</strong>', type: `Number`, des: `源串下一次搜索开始的位置` },
  { name: '<strong>multiline</strong>', type: `Boolean`, des: `是否设置了 m 标记` },
  { name: '<strong>dotAll</strong>', type: `Boolean`, des: `是否设置了 s 标记` },
  { name: '<strong>source</strong>', type: `String`, des: `正则表达式的字面量字符串，没有开头和结尾的斜杠` },
  { name: '<strong>flags</strong>', type: `Boolean`, des: `正则表达式标记字符串` }
];

const tableHead2 = [
  { label: '全名', prop: 'name' },
  { label: '简写', prop: 'type' },
  { label: '含义', prop: 'des' }
];
const tableData2 = [
  { name: '<strong>input</strong>', type: `<strong>$_</strong>`, des: `最后搜索的字符串（非标准特性）` },
  { name: '<strong>lastMatch</strong>', type: `<strong>$&</strong>`, des: `最后匹配的文本` },
  { name: '<strong>lastParen</strong>', type: `<strong>$+</strong>`, des: `最后匹配的捕获组（非标准特性）` },
  { name: '<strong>leftContext</strong>', type: `<strong>$\`</strong>`, des: `input 字符串中出现在 lastMatch 前面的文本` },
  { name: '<strong>rightContext</strong>', type: `<strong>$'</strong>`, des: `input 字符串中出现在 lastMatch 后面的文本` },
  { name: '<strong>$1 ~ $9</strong>', type: `-`, des: `分别对应第 1~9 个捕获组的匹配项` },
];

const tableHead3 = [
  { label: '字符序列', prop: 'name' },
  { label: '替换文本', prop: 'des' }
];
const tableData3 = [
  { name: '<strong>$$</strong>', des: `$` },
  { name: '<strong>$&</strong>', des: `匹配整个模式的子字符串。与 RegExp.lastMatch 相同` },
  { name: '<strong>$\'</strong>', des: `匹配的子字符串之前的字符串。与 RegExp.rightContext 相同` },
  { name: '<strong>$\`</strong>', des: `匹配的子字符串之前的字符串。与 RegExp.leftContext 相同` },
  { name: '<strong>$n</strong>', des: `匹配第 n 个捕获组的字符串，其中 n 是 0~9。比如，$1 是匹配第一个捕获组的字符串，$2 是匹配第二个捕获组的字符串，以此类推。如果没有捕获组，则值为空字符串` },
  { name: '<strong>$nn</strong>', des: `匹配第 nn 个捕获组字符串，其中 nn 是 01~99。比如，$01 是匹配第一个捕获组的字符串，$02 是匹配第二个捕获组的字符串，以此类推。如果没有捕获组，则值为空字符串` }
];
</script>

<NTable :bordered="false" :single-line="false" striped>
  <thead>
    <tr>
      <th v-for="(item, index) in tableHead1" :key="index + 'head'" :width="item.width ?? ''">
        {{ item.label }}
      </th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(item, index) in tableData1" :key="index + 'dasdasd'">
      <td v-for="(it, idx) in tableHead1" :key="idx + 'eret'" v-html="item[String(it.prop)]"></td>
    </tr>
  </tbody>
</NTable>

## 实例化

```js
let pattern1 = /\[bc\]at/i; 
let pattern2 = new RegExp(/\[bc\]at/, "i");
let pattern3 = new RegExp("\\[bc\\]at", "i");

pattern1 <==> pattern2 <==> pattern3
```

## 实例方法(`RegExp.prototype.xxx`)

### `exec(str)`

**主要用于配合捕获组使用**

如果找到了匹配项，则返回包含第一个匹配信息的数组

如果没找到匹配项，则返回 `null`

如果模式**设置了全局标记**，则**每次调用** `exec()` 方法会**返回一个匹配的信息**

如果**没有设置全局标记**，则**无论对同一个字符串调用多少次** `exec()`，也**只会返回第一个匹配的信息**

如果模式**设置了粘附标记 `y`**，则每次调用 `exec()` 就**只会在 `lastIndex` 的位置上寻找匹配项，粘附标记覆盖全局标记**

返回的数组虽然是 `Array` 的实例，但包含两个额外的属性：`index` (匹配起始位置)和 `input`(源串)

在全局匹配模式下，每次调用 `exec()` 都会更新 `lastIndex` 值，以反映上次匹配的最后一个字符的索引


```js
let text = "mom and dad and baby";
let pattern = /mom( and dad( and baby)?)?/gi;
let matches = pattern.exec(text);
console.log(matches.index); // 0
console.log(matches.input); // "mom and dad and baby"
console.log(matches[0]); // "mom and dad and baby"
console.log(matches[1]); // " and dad and baby"
console.log(matches[2]); // " and baby" 
// 分组匹配
// 第一个匹配到的子表达式的值
RegExp.$1 === " and dad and baby"
// 第二个匹配到的子表达式的值
RegExp.$2 === " and baby"
// ...
RegExp.$9

// 反向引用
\1 <==> RegExp.$1
//匹配3个连续相同值
/(.)\1\1/g
//匹配abab的值
/(.)(.)\1\2/g
//匹配H5标签
/<(\w+).*\/\1>/g     // 只能识别双标签
/<(\w+).*\/(\1)?>/g  // 改进版

// ---------------------------------------------------------------
// g
// ---------------------------------------------------------------
let text = "cat, bat, sat, fat";
let pattern = /.at/;
let matches = pattern.exec(text);
console.log(matches.index); // 0
console.log(matches[0]); // cat
console.log(pattern.lastIndex); // 0
matches = pattern.exec(text);
console.log(matches.index); // 0
console.log(matches[0]); // cat
console.log(pattern.lastIndex); // 0 
////////////////////////////////////
let text = "cat, bat, sat, fat";
let pattern = /.at/g;
let matches = pattern.exec(text);
console.log(matches.index); // 0
console.log(matches[0]); // cat
console.log(pattern.lastIndex); // 3
matches = pattern.exec(text);
console.log(matches.index); // 5
console.log(matches[0]); // bat
console.log(pattern.lastIndex); // 8
matches = pattern.exec(text);
console.log(matches.index); // 10
console.log(matches[0]); // sat
console.log(pattern.lastIndex); // 13 

// ---------------------------------------------------------------
// y
// ---------------------------------------------------------------
let text = "cat, bat, sat, fat";
let pattern = /.at/y;
let matches = pattern.exec(text);
console.log(matches.index); // 0
console.log(matches[0]); // cat
console.log(pattern.lastIndex); // 3
// 以索引 3 对应的字符开头找不到匹配项，因此 exec()返回 null
// exec()没找到匹配项，于是将 lastIndex 设置为 0
matches = pattern.exec(text);
console.log(matches); // null
console.log(pattern.lastIndex); // 0
// 向前设置 lastIndex 可以让粘附的模式通过 exec()找到下一个匹配项：
pattern.lastIndex = 5;
matches = pattern.exec(text);
console.log(matches.index); // 5
console.log(matches[0]); // bat
console.log(pattern.lastIndex); // 8 
```

### `test(str)`

如果输入的文本与模式匹配，则参数返回 `true`，否则返回 `false`

## 继承自 Object 的方法

### `toString()`

返回正则表达式的字面量表达式

### `toLocaleString()`

返回正则表达式的字面量表达式

### `valueOf()`

**返回正则表达式本身**

## 静态属性

属性**适用于作用域中的所有正则表达式**

**会根据最后执行的正则表达式操作而变化**

<NTable :bordered="false" :single-line="false" striped>
  <thead>
    <tr>
      <th v-for="(item, index) in tableHead2" :key="index + 'head'" :width="item.width ?? ''">
        {{ item.label }}
      </th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(item, index) in tableData2" :key="index + 'dasdaxxxxxxxxxsd'">
      <td v-for="(it, idx) in tableHead2" :key="idx + 'eret'" v-html="item[String(it.prop)]"></td>
    </tr>
  </tbody>
</NTable>


```js
let text = "this has been a short summer";
let pattern = /(.)hort/g;
if (pattern.test(text)) {
 console.log(RegExp.input); // this has been a short summer
 console.log(RegExp.leftContext); // this has been a
 console.log(RegExp.rightContext); // summer
 console.log(RegExp.lastMatch); // short
 console.log(RegExp.lastParen); // s
} 

/*
 * 注意：Opera 不支持简写属性名
 * IE 不支持多行匹配
 */
if (pattern.test(text)) {
 console.log(RegExp.$_);    // this has been a short summer
 console.log(RegExp["$`"]); // this has been a
 console.log(RegExp["$'"]); // summer
 console.log(RegExp["$&"]); // short
 console.log(RegExp["$+"]); // s
} 
```

**`RegExp` 构造函数的所有属性(静态属性)都没有任何 `Web` 标准出处，因此不推荐在生产环境中使用它们**

## 字符串中与正则表达式有关的方法

### `str.search(reg)`

检测母串中是否含有满足正则表达式的子串，有则返回位置(索引)，没有则返回-1

### `str.match(reg)`

检测母串中是否含有满足正则表达式的子串，有则返回该子串的数组，没有则返回`null`

等同于 `reg.exec(str)`

### `str.replace(reg,'***')`

替换匹配到的子串

第二个参数是字符串的情况下，有几个特殊的字符序列，可以用来插入正则表达式操作的值

<NTable :bordered="false" :single-line="false" striped>
  <thead>
    <tr>
      <th v-for="(item, index) in tableHead3" :key="index + 'head'" :width="item.width ?? ''">
        {{ item.label }}
      </th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(item, index) in tableData3" :key="index + 'dasssssssssssssdasd'">
      <td v-for="(it, idx) in tableHead3" :key="idx + 'eret'" v-html="item[String(it.prop)]"></td>
    </tr>
  </tbody>
</NTable>

```js
let text = "cat, bat, sat, fat";
result = text.replace(/(.at)/g, "word ($1)");
console.log(result); // word (cat), word (bat), word (sat), word (fat) 
//////////////////////////////////////////////////////////////////////////
function htmlEscape(text) {
 return text.replace(/[<>"&]/g, function(match, pos, originalText) {
   switch(match) {
     case "<":
       return "&lt;";
     case ">":
       return "&gt;";
     case "&":
       return "&amp;";
     case "\"":
       return "&quot;";
   }
 });
}
console.log(htmlEscape("<p class=\"greeting\">Hello world!</p>"));
// "&lt;p class=&quot;greeting&quot;&gt;Hello world!</p>"
```

### `str.split(/\s+/)`

将正则表达式(一个或多个空格)匹配到的子串分隔，**返回分隔后的数组**

## 局限性

`\A` 和 `\Z` 锚（分别匹配字符串的开始和末尾）

联合及交叉类

原子组 

`x`（忽略空格）匹配模式 

条件式匹配

正则表达式注释
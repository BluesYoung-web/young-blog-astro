---
title: 14-Date
image: /img/hbs.png
description: JavaScript Date 类
date: 2020-12-28 17:27:33
---

[[toc]]


## 时间戳

将日期保存为自协调世界时（`UTC`，`Universal Time Coordinated`）时间 1970 年 1 月 1 日午夜（零时）至今所经过的**毫秒数**

可以精确表示 1970 年 1 月 1 日之前及之后 285 616 年的日期

## `new Date(any)`

不传任何参数，返回保存当前日期和时间的对象(`Fri Nov 20 2020 14:03:10 GMT+0800 (中国标准时间)`)

要基于其他日期和时间创建日期对象，必须传入其**毫秒**表示(**时间戳**)

如果传入字符串，则会在后台自动调用 `Date.parse()`

如果传入数值，则会在后台自动调用 `Date.UTC()`，**此时创建的为本地时间，不会有 8 小时的时间差**

## `Date.parse(str)`

接收一个表示日期的字符串参数，尝试将其转换为对应的时间戳(13位)

支持的日期格式：
  - “月/日/年”，如 `"5/23/2019"`
  - “月名 日, 年”，如 `"May 23, 2019"`
  - “周几 月名 日 年 时:分:秒 时区”，如 `"Tue May 23 2019 00:00:00 GMT+0800"`
  - ISO 8601 扩展格式 `“YYYY-MM-DDTHH:mm:ss.sssZ”`，如 `2019-05-23T00:00:00`（只适用于 兼容 `ES5` 的实现）

**如果传入的字符串不是上述的格式，则该方法会返回 `NaN`**

## `Date.UTC(year, month - 1, day, h, m, s, ms)`

返回对应日期的时间戳，年月必传，日默认1，其余默认0

北京时间为东八区，会在 `UTC `时间的基础上 +8 小时

## `Date.now()`

返回当前时间戳

## 继承自对象的方法(`Object.prototype.xxx`)

### `toLocaleString()`

返回与浏览器运行的本地环境一致的日期和时间

格式中通常包含针对时间的上午/下午，但不包括时区信息

例如：`"2020/11/20 下午3:19:00"`

### `toString()`

通常返回带时区信息的时间，时间格式也是 24 小时制

例如：`"Fri Nov 20 2020 15:20:40 GMT+0800 (中国标准时间)"`

### `valueOf()`

返回时间戳

## 格式化方法(继承自 `Date.prototype.xxx`)

### `toDateString()`

显示日期中的周几、月、日、年（格式特定于实现）

`"Fri Nov 20 2020"`

### `toTimeString()`

显示日期中的时、分、秒和时区（格式特定于实现）

`"15:26:47 GMT+0800 (中国标准时间)"`

### `toLocaleDateString()`

显示日期中的周几、月、日、年（格式特定于实现和地区）

`"2020/11/20"`

### `toLocaleTimeString()`

显示日期中的时、分、秒（格式特定于实现和地区）

`"下午3:28:44"`

### `toUTCString()`

显示完整的 `UTC `日期（格式特定于实现）

`"Fri, 20 Nov 2020 07:29:39 GMT"`

### `toGMTString()`

结果同 `UTC`

仅作为向后兼容，不推荐使用

### `toISOString()/toJSON()`

显示 `ISO `标准的日期

`"2020-11-20T07:33:55.983Z"`

## 日期/时间组件方法

<script lang="ts" setup>
const tableHead1 = [
  { label: '方法', prop: 'method' },
  { label: '说明', prop: 'des' },
];
const tableData1 = [
  { method: '<strong>getTime()</strong>', des: `返回毫秒数同 <strong>valueOf()</strong>` },
  { method: '<strong>setTime()</strong>', des: `以毫秒数设置日期，全部改变` },
  { method: '<strong>getFullYear()</strong>', des: `获取 4 位数年份` },
  { method: '<strong>getUTCFullYear()</strong>', des: `获取 <strong>UTC</strong> 4 位数年份` },
  { method: '<strong>setFullYear()</strong>', des: `设置 4 位年份` },
  { method: '<strong>setUTCFullYear()</strong>', des: `设置 <strong>UTC</strong> 4 位年份` },
  { method: '<strong>getMonth()</strong>', des: `获取月份，0 开始` },
  { method: '<strong>getUTCMonth()</strong>', des: `---` },
  { method: '<strong>setMonth()</strong>', des: `---` },
  { method: '<strong>setUTCMonth()</strong>', des: `---` },
  { method: '<strong>getDate()</strong>', des: `获取天数` },
  { method: '<strong>getUTCDate()</strong>', des: `---` },
  { method: '<strong>setDate()</strong>', des: `---` },
  { method: '<strong>setUTCDate()</strong>', des: `---` },
  { method: '<strong>getDay()</strong>', des: `获取星期几，0 星期天` },
  { method: '<strong>getHours()</strong>', des: `获取小时数 0` },
  { method: '<strong>getUTCHours()</strong>', des: `---` },
  { method: '<strong>setHours()</strong>', des: `---` },
  { method: '<strong>setUTCHours()</strong>', des: `---` },
  { method: '<strong>getMinutes()</strong>', des: `---` },
  { method: '<strong>getUTCMinutes()</strong>', des: `---` },
  { method: '<strong>setMinutes()</strong>', des: `---` },
  { method: '<strong>setUTCMinutes()</strong>', des: `---` },
  { method: '<strong>getSeconds()</strong>', des: `---` },
  { method: '<strong>setSeconds()</strong>', des: `---` },
  { method: '<strong>setUTCSeconds()</strong>', des: `---` },
  { method: '<strong>getMilliseconds()</strong>', des: `---` },
  { method: '<strong>getUTCMilliseconds()</strong>', des: `---` },
  { method: '<strong>setMilliseconds()</strong>', des: `---` },
  { method: '<strong>setUTCMilliseconds()</strong>', des: `---` },
  { method: '<strong>getTimezoneOffset()</strong>', des: `返回本地时间与 UTC 时间相差的分钟数` },
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

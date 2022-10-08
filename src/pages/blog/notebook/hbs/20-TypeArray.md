---
title: 20-定型数组
image: /img/hbs.png
description: JavaScript 定型数组
date: 2021-01-04 14:15:08
---

[[toc]]

## 概述

`ECMAScript` 为了提升向原生库传输数据的效率而新增的结构

实质上是**一种包含特殊数值类型的数组**

<Step
  title="历史"
  class="mt-8"
  :data="[
    'WebGL早期版本 JavaScript 数组与原生数组之间不匹配，出现性能问题',
    'Mozilla 为解决这个问题而实现了 CanvasFloatArray',
    '最终，CanvasFloatArray 变成了 Float32Array，也就是今天定型数组中可用的第一个“类型”'
  ]"
/>


## `ArrayBuffer`

`Float32Array` 实际上是一种“**视图**”，可以允许 `JavaScript` 运行时访问一块名为 `ArrayBuffer` 的预分配内存

`ArrayBuffer` 是**所有定型数组及视图引用的基本单位**

`ArrayBuffer` **一经创建就不能再调整大小**。不过，可以使用 `slice()` 复制其全部或部分到一个新实例中

```js
const buf = new ArrayBuffer(16); // 在内存中分配 16 字节(128 位)
console.log(buf.byteLength);     // 16
const buf2 = buf1.slice(4, 12);
alert(buf2.byteLength);          // 8 
```

### 与 `c++` 的 `malloc` 函数对比

`malloc`：
  - 分配失败，返回 `null` 指针 
  - 内存大小只受可寻址系统内存限制
  - 不会初始化实际的地址
  - 需要手动回收

`ArrayBuffer`：
  - 分配失败，抛出错误
  - 内存大小不能超过`Number.MAX_SAFE_INTEGER`（2<sup>53</sup> - 1）
  - 初始化，将所有二进制位初始化为 0
  - 自动回收

## `DataView`

允许读写 `ArrayBuffer` 的视图

专为文件 `I/O` 与网络 `I/O` 设计

**支持对缓冲数据的高度控制，但是性能也较差**

对内容没有任何预设，也不能迭代

**必须在对已有的 `ArrayBuffer` 读取或写入时才能创建 `DataView` 实例**

这个实例可以使用全部或部分 `ArrayBuffer`，且维护着对该缓冲实例的引用，以及视图在缓冲中开始的位置

```js
const buf = new ArrayBuffer(16);
// DataView 默认使用整个 ArrayBuffer
const fullDataView = new DataView(buf);
alert(fullDataView.byteOffset); // 0
alert(fullDataView.byteLength); // 16
alert(fullDataView.buffer === buf); // true
// 构造函数接收一个可选的字节偏移量和字节长度
// byteOffset=0 表示视图从缓冲起点开始
// byteLength=8 限制视图为前 8 个字节
const firstHalfDataView = new DataView(buf, 0, 8);
alert(firstHalfDataView.byteOffset); // 0
alert(firstHalfDataView.byteLength); // 8
alert(firstHalfDataView.buffer === buf); // true
// 如果不指定，则 DataView 会使用剩余的缓冲
// byteOffset=8 表示视图从缓冲的第 9 个字节开始
// byteLength 未指定，默认为剩余缓冲
const secondHalfDataView = new DataView(buf, 8);
alert(secondHalfDataView.byteOffset); // 8 
alert(secondHalfDataView.byteLength); // 8
alert(secondHalfDataView.buffer === buf); // true 
```

### `ElementType`

<script lang="ts" setup>
const tableHead1 = [
  { label: 'ElementType', prop: 'type' },
  { label: 'byteLength', prop: 'len' },
  { label: 'des', prop: 'des' },
  { label: 'c', prop: 'c' },
  { label: 'range', prop: 'range' },
];
const tableData1 = [
  { type: '<strong>Int8</strong>', len: `1`, des: `8 位有符号整数`, c: `<strong>signed char</strong>`, range: `[-128, 127]` },
  { type: '<strong>Uint8</strong>', len: `1`, des: `8 位无符号整数`, c: `<strong>unsigned char</strong>`, range: `[0, 255]` },
  { type: '<strong>Int16</strong>', len: `2`, des: `16 位有符号整数`, c: `<strong>short</strong>`, range: `[-32769, 32767]` },
  { type: '<strong>Uint16</strong>', len: `2`, des: `16 位无符号整数`, c: `<strong>unsigned short</strong>`, range: `[0, 65535]` },
  { type: '<strong>Int32</strong>', len: `4`, des: `32 位有符号整数`, c: `<strong>int</strong>`, range: `[-2147483648, 2147483647]` },
  { type: '<strong>Uint32</strong>', len: `4`, des: `32 位无符号整数`, c: `<strong>unsigned int</strong>`, range: `[0, 4294967295]` },
  { type: '<strong>Float32</strong>', len: `4`, des: `32 位 IEEE-754 浮点数`, c: `<strong>float</strong>`, range: `[-3.4e+38, 3.4e+38]` },
  { type: '<strong>Float64</strong>', len: `8`, des: `64 位 IEEE-754 浮点数`, c: `<strong>double</strong>`, range: `[-1.7e+308, 1.7e+308]` },
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

### `字节序(大小端)`

`DataView` 默认大端，所有 `API` 可选参数传入 `true` 变为小端

**大端字节序，也叫“网络字节序”，从左到右存储/读取**

**小端字节序，从右到左存储/读取**

```js
// 在内存中分配两个字节并声明一个 DataView
const buf = new ArrayBuffer(2);
const view = new DataView(buf);
// 填充缓冲，让第一位和最后一位都是 1
view.setUint8(0, 0x80); // 设置最左边的位等于 1
view.setUint8(1, 0x01); // 设置最右边的位等于 1
// 缓冲内容（为方便阅读，人为加了空格）
// 0x8 0x0 0x0 0x1
// 1000 0000 0000 0001
// 按大端字节序读取 Uint16
// 0x80 是高字节，0x01 是低字节
// 0x8001 = 2^15 + 2^0 = 32768 + 1 = 32769
alert(view.getUint16(0)); // 32769
// 按小端字节序读取 Uint16
// 0x01 是高字节，0x80 是低字节
// 0x0180 = 2^8 + 2^7 = 256 + 128 = 384
alert(view.getUint16(0, true)); // 384
// 按大端字节序写入 Uint16
view.setUint16(0, 0x0004);
// 缓冲内容（为方便阅读，人为加了空格）
// 0x0 0x0 0x0 0x4
// 0000 0000 0000 0100
alert(view.getUint8(0)); // 0
alert(view.getUint8(1)); // 4
// 按小端字节序写入 Uint16
view.setUint16(0, 0x0002, true);
// 缓冲内容（为方便阅读，人为加了空格）
// 0x0 0x2 0x0 0x0
// 0000 0010 0000 0000
alert(view.getUint8(0)); // 2
alert(view.getUint8(1)); // 0
```

### 边界情况

读取或写入超出缓冲区范围的值都会报错

写入时会尽最大努力把一个值转换为适当的类型，后备值为 0，如果无法转换则报错(自动调用对应的 `parse`)

## 定型数组

另一种形式的 `ArrayBuffer` 视图

特定于一种 `ElementType` 且遵循系统原生字节序

提供了适用面更广的 `API` 和更高的性能

**为了提高与 `WebGL` 等原生库交换二进制数据的效率而设计，速度极快**

### 创建方式

读取已有的缓冲

使用自有缓冲

填充可迭代结构

填充基于任意类型的定型数组

`<ElementType>.from()`

`<ElementType>.of()`

### 与普通数组相同属性及方法

`[]`

`copyWithin()`

`entries()`

`every()`

`fill()`

`filter()`

`find()`

`findIndex()`

`forEach()`

`indexOf()`

`join()`

`keys()`

`lastIndexOf()`

`length`

`map()`

`reduce()`

`reduceRight()`

`reverse()`

`slice()`

`some()`

`sort()`

`toLocaleString()`

`toString()`

`values()`

`for-of`

`...`

`concat()`

`pop()`

`shift()`

`splice()`

`unshift()`

### 新增方法

`set()` 从提供的数组或定型数组中把值复制到当前定型数组中指定的索引位置

`subarray()` 基于从原始定型数组中复制的值返回一个新定型数组

```js
// 创建长度为 8 的 int16 数组
const container = new Int16Array(8);
// 把定型数组复制为前 4 个值
// 偏移量默认为索引 0
container.set(Int8Array.of(1, 2, 3, 4));
console.log(container); // [1,2,3,4,0,0,0,0]
// 把普通数组复制为后 4 个值
// 偏移量 4 表示从索引 4 开始插入
container.set([5,6,7,8], 4);
console.log(container); // [1,2,3,4,5,6,7,8]
// 溢出会抛出错误
container.set([5,6,7,8], 7);
// RangeError 

/////////////////////////////////////////////

const source = Int16Array.of(2, 4, 6, 8);
// 把整个数组复制为一个同类型的新数组
const fullCopy = source.subarray();
console.log(fullCopy); // [2, 4, 6, 8]
// 从索引 2 开始复制数组
const halfCopy = source.subarray(2);
console.log(halfCopy); // [6, 8]
// 从索引 1 开始复制到索引 3
const partialCopy = source.subarray(1, 3);
console.log(partialCopy); // [4, 6] 
```


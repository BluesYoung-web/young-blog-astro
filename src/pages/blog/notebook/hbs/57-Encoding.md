---
title: 57-编解码
image: /img/hbs.png
description: JavaScript 编解码
date: 2021-01-28 13:43:47
---

[[toc]]

## 文本编码

将字符串转换为定型数组二进制格式的方法

`const encoder = new TextEncoder()`

### 批量编码

`encoder.encode(str)`
  - 接收一个字符串，并以 `Uint8Array` 格式返回每个字符的 `UTF-8` 编码

`encoder.encodeInto(str, targetArr)`
  - 接收一个字符串和目标 `Uint8Array`，返回一个包含 `read` 和 `written` 属性的字典
  - **如果定型数组的空间不够，编码就会提前终止**，返回的字典会体现这个结果

```js
const textEncoder = new TextEncoder();
const decodedText = 'foo';
const encodedText = textEncoder.encode(decodedText);
// f 的 UTF-8 编码是 0x66（即十进制 102）
// o 的 UTF-8 编码是 0x6F（即二进制 111）
console.log(encodedText); // Uint8Array(3) [102, 111, 111]
// ----------------------------------------------
const textEncoder = new TextEncoder();
const fooArr = new Uint8Array(3);
const barArr = new Uint8Array(2);
const fooResult = textEncoder.encodeInto('foo', fooArr);
const barResult = textEncoder.encodeInto('bar', barArr);
console.log(fooArr); // Uint8Array(3) [102, 111, 111]
console.log(fooResult); // { read: 3, written: 3 }
console.log(barArr); // Uint8Array(2) [98, 97]
console.log(barResult); // { read: 2, written: 2 }
```
<n-alert type="warning">文本编码会始终使用 `UTF-8` 格式，而且必须写入 `Unit8Array` 实例。**使用其他类型数组会导致 `encodeInto()` 抛出错误**</n-alert>


### 流编码

`const streamEncoder = new TextEncoderStream()`

```js
async function* chars() {
  const decodeText = 'foo';
  for(const char of decodeText) {
    yield await new Promise((resolve) => setTimeout(resolve, 1000, char));
  }
}
const decodeTextStream = new ReadableStream({
  async start(controller) {
    for await(const chunk of chars()) {
      controller.enqueue(chunk);
    }
    controller.close();
  }
});
const encodedTextStream = decodeTextStream.pipeThrough(new TextEncoderStream());
const rs = encodedTextStream.getReader();
(async function() {
  while(true) {
    const { done, value } = await rs.read();
    if(done) {
      break;
    } else {
      console.log(value);
    }
  }
})();
// Uint8Array[102]
// Uint8Array[111]
// Uint8Array[111] 
```

## 文本解码

`const decoder = new TextDecoder()`

将定型数组转换为字符串

### 批量解码

`deocder.decode(typeArray)`

接收一个定型数组，返回解码后的字符串

解码器不关心传入的是哪种定型数组，它只会专心解码整个二进制表示

```js
const decoder = new TextDecoder();
// f 的 UTF-8 编码是 0x66（即十进制 102）
// o 的 UTF-8 编码是 0x6F（即二进制 111）
const encodedText8 = Uint8Array.of(102, 111, 111);
const decodedText80 = decoder.decode(encodedText8);
console.log(decodedText80); // foo 
// --------------------------
const encodedText32 = Uint32Array.of(102, 111, 111);
const decodedText81 = decoder.decode(encodedText32);
console.log(decodedText81); // "f o o " 
// 与 TextEncoder 不同，TextDecoder 可以兼容很多字符编码
const decoder16 = new TextDecoder('utf-16');
const encodedText16 = Uint16Array.of(102, 111, 111);
const decodeText16 = decoder16.decode(encodedText16);
console.log(decodeText16); // foo
```

### 流解码

`TextDecoderStream`

```js
async function* chars() {
  // 每个块必须是一个定型数组
  const encodeText = [102, 111, 111].map((x) => Uint8Array.of(x));
  for(const char of encodeText) {
    yield await new Promise((resolve) => setTimeout(resolve, 1000, char));
  }
}
const encodeTextStream = new ReadableStream({
  async start(controller) {
    for await(const chunk of chars()) {
      controller.enqueue(chunk);
    }
    controller.close();
  }
});
const decodedTextStream = encodeTextStream.pipeThrough(new TextDecoderStream());
const rs = decodedTextStream.getReader();
(async function() {
  while(true) {
    const { done, value } = await rs.read();
    if(done) {
      break;
    } else {
      console.log(value);
    }
  }
})();
// f
// o
// o
```


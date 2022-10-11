---
layout: "@/layouts/BlogPost.astro"
title: 63-WebCryptographyAPI
image: /img/hbs.png
description: JavaScript 加解密
date: 2021-02-02 17:38:33
---

[[toc]]

## 定义

一套密码学工具：
  - 生成、使用和应用加密秘钥对
  - 加密和解密消息
  - 可靠地生成随机数

规范了 `JavaScript` 如何以安全和符合惯例的方式实现加密

## 生成随机数

### `Math.random()`

伪随机数生成器(`PRNG`)，主要用于快速计算出看起来随机的值

对一个内部状态应用了固定的算法

每次调用，这个内部状态都会被修改，而结果会被转换为一个新的随机值

由于算法本身是固定的，其输入只是之前的状态，因此**随机数顺序也是确定的**

### `CSPRNG`

密码学安全伪随机数生成器

额外增加一个熵作为输入

**虽然生成的值很难预测，但是计算速度明显比常规的 `PRNG` 慢很多**

```js
const array = new Uint8Array(1);
for (let i=0; i<5; ++i) {
	console.log(crypto.getRandomValues(array));
}
// Uint8Array [41]
// Uint8Array [250]
// Uint8Array [51]
// Uint8Array [129]
// Uint8Array [35] 
```

## `SubtleCrypto `对象

`window.crypto.subtle`

所有密码学的操作都在原始二进制数据上执行，涉及 `ArrayBuffer | ArrayBufferView`

由于字符串时密码学操作的重要引用场景，因此 `TextEncoder | TextDecoder` 也会经常使用

**只能在安全的上下文(https)中使用**，不安全的上下文为 `undefined`

### `.digest(type, msg)`

生成密码学摘要

`type`：
  - `SHA-1` 架构类似于 `md5` ，接收任意大小的输入，生成160位消息散列，**容易碰撞，不安全**
  - `SHA-2` 构建于相同耐碰撞单向压缩函数之上的一套散列函数，安全：
    - `SHA-256` 生成256位消息散列
    - `SHA-384` 生成384位消息散列
    - `SHA-512` 生成512位消息散列

```js
(async function() {
 const textEncoder = new TextEncoder();
 const message = textEncoder.encode('foo');
 const messageDigest = await crypto.subtle.digest('SHA-256', message);
 const hexDigest = Array.from(new Uint8Array(messageDigest))
 .map((x) => x.toString(16).padStart(2, '0'))
 .join('');
 console.log(hexDigest);
})();
// 2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae 
```

### `CryptoKey `与算法

`CryptoKey` 类支持多种加密算法，允许控制密钥抽取和使用

**`RSA`**
- 公钥密码系统
- 使用两个大素数获得一对公钥和私钥
- 可用于签名/验证或加密/解密消息

**`RSASSA-PKSC1-v1_5`**
- `RSA` 的一个应用
- `SSA` 表示算法支持签名生成和验证操作
- `PKCS1` 表示算法展示出的 `RSA` 密钥必需的数学特性
- 用于使用私钥给消息签名，允许使用公钥验证签名
- 相同的消息和秘钥每次都会生成相同的签名

**`RSA-PSS`**
- `RSA` 的一个应用
- `PSS` 表示生成签名时会加盐以得到随机签名
- 相同的消息和秘钥每次都会生成**不同的**签名

**`RSA-OAPE`**
- `RSA` 的一个应用
- 用于使用公钥加密消息，私钥解密消息
- `OAEP` 表示算法利用了 `Feistel` 网络在加密前处理未加密的消息
- 主要将确定性 `RSA` 加密模式转换为概率性加密模式

**`ECC`**
- 公钥密码系统
- 使用一个素数和一个椭圆曲线获得一对公钥和私钥，可用于签名/验证消息
- 密钥比 `RSA` 密钥短，操作比 `RSA` 快

**`ECDSA`**
- `ECC` 的一个应用
- 用于签名和验证消息

**`ECDH`**
- `ECC` 的密钥生成和密钥协商应用
- 允许两方通过公开通信渠道建立共享的机密

**`AES`**
- 对称秘钥密码系统(**对称加密**)
- 使用派生自置换组合网络的分组密码加密和解密数据
- 模式：
  - `AES-CTR` 计数器模式
  - `AES-CBC` 密码分组链模式
  - `AES-GCM` 伽罗瓦/计数器模式
  - `AES-KW` 秘钥包装模式

**`HMAC`**
- 用于生成消息认证码的算法
- 用于验证通过不可信网络接收的消息没有被修改过

**`KDF`**
- 可以使用散列函数从主密钥获得一个或多个密钥的算法
- 能够生成不同长度的密钥，也能把密钥转换为不同格式

**`HKDF`**
- 密钥推导函数，与高熵输入（如已有密钥） 一起使用

**`PBKDF2`**
- 密钥推导函数，与低熵输入（如密钥，字符串）一起使用

### 生成 `CryptoKey`

`.generateKey()`

可以生成随机 `CryptoKey`

返回一个期约，解决为一个或多个 `CryptoKey` 实例

```js
/**
 * 支持 AES-CTR 算法
 * 密钥长度 128 位
 * 不能从 CryptoKey 对象中提取
 * 可以跟 encrypt()和 decrypt()方法一起使用
 */
(async function() {
 const params = {
 name: 'AES-CTR',
 length: 128
 };
 const keyUsages = ['encrypt', 'decrypt'];
 const key = await crypto.subtle.generateKey(params, false, keyUsages);
 console.log(key);
 // CryptoKey {type: "secret", extractable: true, algorithm: {...}, usages: Array(2)}
})();
```

### 导入和导出秘钥

如果秘钥是可提取的，那么就可以使用 `exportKey()` 导出秘钥

使用 `importKey()` 可以导入秘钥

```js
(async function() {
	const params = {
		name: 'AES-CTR',
		length: 128
	};
	const keyUsages = ['encrypt', 'decrypt'];
	const keyFormat = 'raw';
	const isExtractable = true; 
	const key = await crypto.subtle.generateKey(params, true, keyUsages);
	const rawKey = await crypto.subtle.exportKey('raw', key);
	console.log(new Uint8Array(rawKey));
	// Uint8Array[93, 122, 66, 135, 144, 182, 119, 196, 234, 73, 84, 7, 139, 43, 238, 110]
	const importedKey = await crypto.subtle.importKey(keyFormat, rawKey, params.name, isExtractable, keyUsages);
	console.log(importedKey);
	// CryptoKey {type: "secret", extractable: true, algorithm: {...}, usages: Array(2)} 
})();
```

### 从主秘钥派生秘钥

```js
(async function() {
	const ellipticCurve = 'P-256';
	const algoIdentifier = 'ECDH';
	const derivedKeySize = 128;
	const params = {
		name: algoIdentifier,
		namedCurve: ellipticCurve
	};
	const keyUsages = ['deriveBits'];
	const keyPairA = await crypto.subtle.generateKey(params, true, keyUsages);
	const keyPairB = await crypto.subtle.generateKey(params, true, keyUsages);
	// 从 A 的公钥和 B 的私钥派生密钥位
	const derivedBitsAB = await crypto.subtle.deriveBits(
	Object.assign({ public: keyPairA.publicKey }, params),
	keyPairB.privateKey,
	derivedKeySize);
	// 从 B 的公钥和 A 的私钥派生密钥位
	const derivedBitsBA = await crypto.subtle.deriveBits(
	Object.assign({ public: keyPairB.publicKey }, params),
	keyPairA.privateKey,
	derivedKeySize);
	const arrayAB = new Uint32Array(derivedBitsAB);
	const arrayBA = new Uint32Array(derivedBitsBA);
	// 确保密钥数组相等
	console.log(
	arrayAB.length === arrayBA.length &&
	arrayAB.every((val, i) => val === arrayBA[i])); // true
})(); 
```

### 使用非对称秘钥签名和验证消息

```js
(async function() {
	const keyParams = {
		name: 'ECDSA',
		namedCurve: 'P-256'
	};
	const keyUsages = ['sign', 'verify'];
	const {publicKey, privateKey} = await crypto.subtle.generateKey(keyParams, true,
	keyUsages);
	const message = (new TextEncoder()).encode('I am Satoshi Nakamoto');
	const signParams = {
		name: 'ECDSA',
		hash: 'SHA-256'
	};
	const signature = await crypto.subtle.sign(signParams, privateKey, message);
	const verified = await crypto.subtle.verify(signParams, publicKey, signature,
	message);
	console.log(verified); // true
})(); 
```

### 使用对称秘钥加密和解密

```js
(async function() {
	const algoIdentifier = 'AES-CBC';
	const keyParams = {
		name: algoIdentifier,
		length: 256
	};
	const keyUsages = ['encrypt', 'decrypt'];
	const key = await crypto.subtle.generateKey(keyParams, true, keyUsages);
	const originalPlaintext = (new TextEncoder()).encode('I am Satoshi Nakamoto');
	const encryptDecryptParams = {
		name: algoIdentifier,
		iv: crypto.getRandomValues(new Uint8Array(16))
	};
	const ciphertext = await crypto.subtle.encrypt(encryptDecryptParams, key, originalPlaintext); 
	console.log(ciphertext);
	// ArrayBuffer(32) {}
	const decryptedPlaintext = await crypto.subtle.decrypt(encryptDecryptParams, key, ciphertext);
	console.log((new TextDecoder()).decode(decryptedPlaintext));
	// I am Satoshi Nakamoto
})();
```

### 包装和解包秘钥

```js
(async function() {
	const keyFormat = 'raw';
	const extractable = true;
	const wrappingKeyAlgoIdentifier = 'AES-KW';
	const wrappingKeyUsages = ['wrapKey', 'unwrapKey'];
	const wrappingKeyParams = {
		name: wrappingKeyAlgoIdentifier,
		length: 256
	};
	const keyAlgoIdentifier = 'AES-GCM';
	const keyUsages = ['encrypt'];
	const keyParams = {
		name: keyAlgoIdentifier,
		length: 256
	};
	const wrappingKey = await crypto.subtle.generateKey(wrappingKeyParams, extractable,
	wrappingKeyUsages);
	console.log(wrappingKey);
	// CryptoKey {type: "secret", extractable: true, algorithm: {...}, usages: Array(2)}
	const key = await crypto.subtle.generateKey(keyParams, extractable, keyUsages);
	console.log(key);
	// CryptoKey {type: "secret", extractable: true, algorithm: {...}, usages: Array(1)}
	const wrappedKey = await crypto.subtle.wrapKey(keyFormat, key, wrappingKey,
	wrappingKeyAlgoIdentifier);
	console.log(wrappedKey);
	// ArrayBuffer(40) {}
	const unwrappedKey = await crypto.subtle.unwrapKey(keyFormat, wrappedKey,
	wrappingKey, wrappingKeyParams, keyParams, extractable, keyUsages);
	console.log(unwrappedKey);
	// CryptoKey {type: "secret", extractable: true, algorithm: {...}, usages: Array(1)}
})();
```
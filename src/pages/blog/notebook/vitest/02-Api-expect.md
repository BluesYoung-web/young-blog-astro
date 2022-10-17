---
title: vitest -> expect
description: vitest -> expect
image: /img/vitest.svg
date: 2022-05-09 10:30:00
---

[[toc]]

## 概述

默认使用 `chai` 进行断言，同时基于 `chai` 实现了兼容 `jest` 的断言语句

### `.not`

否定断言

## 值相关

### `.toBe(v)`

断言是否相等(`===`)

### `.toBeCloseTo(floatNum, n)`

断言**浮点数的前 n 位**是否相等

### `.toBeDefined()`

断言值是否不等于 undefined

### `.toBeUndefined()`

断言值是否等于 undefined

### `.toBeNull()`

断言值是否等于 null

### `.toBeNaN()`

断言值是否等于 NaN

### `.toBeTruthy()`

断言值是否为真(**自动转换为布尔值**)

<n-alert type="info">JavaScript 中除了 `false` ，`0` ，`''` ，`null` ，`undefined` 和 `NaN`，其他一切都是为真</n-alert>

### `.toBeFalsy()`

断言值是否为假(**自动转换为布尔值**)

### `.toBeTypeOf(type_str)`

断言是否为某个类型(`typeof`)

### `.toBeInstanceOf(type)`

断言是否为某个类型(`instanceof`)

### `.toBeGreaterThan(num)`

断言是否大于某个数

### `.toBeGreaterThanOrEqual(num)`

断言是否大于等于某个数

### `.toBeLessThan(num)`

断言是否小于某个数

### `.toBeLessThanOrEqual(num)`

断言是否小于等于某个数

### `.toEqual(v)`

**递归比较是否为同样的值或同样的结构**

### `.toStrictEqual(v)`

**会检查属性值为 undefined 的键，会检查数组的稀疏性**

### `.toContain(v)`

检查值是否存在于数组之中，也可以检查字符串的子串关系

### `.toContainEqual(v)`

对每个元素进行 `toEqual` 比较

### `.toHaveLength(n)`

断言一个对象是否拥有 `length` 属性，并且该属性的值为 `n`

### `.toHaveProperty(key[, equalValue])`

断言一个对象是否有对应键名的属性，可选参数为对属性值的 `toEqual` 比较

### `.toMatch(str)`

断言字符串是否匹配指定的正则或者字符串(`String.prototype.match`)

### `.toMatchObject(obj)`

**断言对象是否匹配指定的对象属性的子集**

### `.toThrowError(str)`

**断言函数在调用时是否抛出错误**

```ts
function getFruitStock(type) {
  if (type === 'pineapples') {
    throw new Error('Pineapples is not good for people with diabetes');
  }
  // 可以做一些其他的事情
}

it('throws on pineapples', () => {
  // 测试错误消息是否在某处显示 "diabetes" ：这些是等效的
  expect(
    () => getFruitStock('pineapples')
  ).toThrowError(/diabetes/);
  
  expect(
    () => getFruitStock('pineapples')
  ).toThrowError('diabetes');

  // 测试确切的错误信息
  expect(() => getFruitStock('pineapples')).toThrowError(
    /^Pineapples is not good for people with diabetes$/,
  );
});
```

## 快照相关

### `.toMatchSnapshot()`

**自动将要断言的值存储为快照，键盘按 `u` 手动更新或者运行时参数 `-u` 自动更新**

### `.toMatchInlineSnapshot()`

**我自认为在造轮子时最好用的一点**

<n-alert type="info">**自动将要断言的值的快照字符串填充到括号内**</n-alert>

### `.toThrowErrorMatchingSnapshot()`

同 `toMatchSnapshot`，不过快照的值为抛出的值

### `.toThrowErrorMatchingInlineSnapshot()`

同 `toMatchInlineSnapshot`，不过快照的值为抛出的值

## 函数相关

### `.toHaveBeenCalled()`

**断言一个函数是否被调用过，需要给 `expect` 传递一个监听函数**

```ts
import { it, expect, vi } from 'vitest';

const market = {
  buy(subject: string, amount: number) {
    // ...
  },
};

it('spy function', () => {
  const buySpy = vi.spyOn(market, 'buy');

  expect(buySpy).not.toHaveBeenCalled();

  market.buy('apples', 10);

  expect(buySpy).toHaveBeenCalled();
});
```

### `.toHaveBeenCalledTimes(num)`

**断言一个函数是否被调用了 num 次**

```ts
expect(buySpy).toHaveBeenCalledTimes(1);
```

### `.toHaveBeenCalledWith(...args)`

断言一个函数是否被调用过，**并且传递了指定的参数**

```ts
expect(buySpy).toHaveBeenCalledWith('apples', 10);
```

### `.toHaveBeenLastCalledWith(...args)`

断言一个函数在**最后一次被调用时是否传递了指定的参数**

### `.toHaveBeenNthCalledWith(n, ...args)`

断言一个函数在**第 n 次被调用时是否传递了指定的参数**

### `.toHaveReturned()`

断言一个函数是否至少被成功调用了一次(**未抛出错误**)

### `.toHaveReturnedTimes(n)`

断言一个函数是否被成功调用了 `n` 次(**未抛出错误**)

### `.toHaveReturnedWith(v)`

断言一个函数是否至少一次成功的返回了对应的值

```ts
it('spy function returns a product', () => {
  const sell = vi.fn((product: string) => {
    return { product };
  });

  sell('apples');

  expect(sell).toHaveReturnedWith({ product: 'apples' });
});
```

### `.toHaveLastReturnedWith(v)`

断言一个函数在**最后一次被调用时是否返回了给定的值**

### `.toHaveNthReturnedWith(n, v)`

断言一个函数在**第 n 次被调用时是否返回了给定的值**

## 其他

### `.toSatisfy((v) => boolean)`

断言一个值是否满足某种条件

### `.resolves`

**断言一个 Promise 成功时的结果**，Promise 拒绝直接失败

```ts
it('buyApples returns new stock id', async () => {
  // toEqual 现在返回一个 Promise ，所以我们必须等待它
  await expect(buyApples()).resolves.toEqual({ id: 1 });
});
```

### `.rejects`

**断言一个 Promise 失败时的结果**，Promise 成功直接失败

```ts
it('buyApples returns new stock id', async () => {
  // toEqual 现在返回一个 Promise ，所以我们必须等待它
  await expect(buyApples()).rejects.toThrow('no id');
});
```

### `.assertions(n)`

**在测试结束之后验证在测试期间调用了多少次断言**

**常用于检测异步代码是否被调用了**

```ts
async function doAsync(...cbs) {
  await Promise.all(
    cbs.map((cb, index) => cb({ index }))
  );
}

test('all assertions are called', async () => {
  expect.assertions(2);
  function callback1(data) {
    expect(data).toBeTruthy();
  }
  function callback2(data) {
    expect(data).toBeTruthy();
  }

  await doAsync(callback1, callback2);
});
```

### `.hasAssertions()`

在测试结束之后验证在测试期间**是否至少调用一次断言**

## 扩展

### `.addSnapshotSerializer(plugin)`

[添加一个**自定义的快照序列化函数**](https://cn.vitest.dev/guide/snapshot-serializer.html)

### `.extend(matchers)`

[**使用自定义匹配器扩展默认匹配器**](https://cn.vitest.dev/api/#expect-extend)
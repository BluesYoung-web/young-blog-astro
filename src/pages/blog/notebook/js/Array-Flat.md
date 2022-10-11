---
layout: "@/layouts/BlogPost.astro"
title: 多维数组拍平
description: 多维数组拍平
date: 2022-03-18 10:19:58
---

[[toc]]

## 定义

**实现一个 flat 方法，接收参数 array 和 depth（不传默认为 1）**

**按 depth 层级拍平数组**

## 1.0 递归 + 辅助函数

```js
const flatHelper = (arr, dep, res) => {
  for (const item of arr) {
    // 需要深度拍平且该元素为数组
    if (dep > 0 && Array.isArray(item)) {
      res.push(...flat(item, dep - 1));
    } else {
      // 普通元素或者无需深度拍平
      res.push(item);
    }
  }
};
const flat = (arr, dep = 1) => {
  const res = [];
  flatHelper(arr, dep, res);
  return res;
};
const arr = [1, 2, [3, 4, [5, 6, [7, 8]]]];
console.log(flat(arr)); // [1, 2, 3, 4, [5, 6, [7, 8]]];
console.log(flat(arr, 2)); // [1, 2, 3, 4, 5, 6, [7, 8]];
console.log(flat(arr, 3)); // [1, 2, 3, 4, 5, 6, 7, 8];
```

## 2.0 循环

```js
const flat = (arr, dep = 1) => {
  let count = 0;
  let res;
  while(count < dep) {
    res = [];
    for (const item of arr) {
      if (Array.isArray(item)) {
        res.push(...item);
      } else {
        res.push(item);
      }
    }
    count++;
    arr = res.slice();
  }
  return res;
};
const arr = [1, 2, [3, 4, [5, 6, [7, 8]]]];
console.log(flat(arr)); // [1, 2, 3, 4, [5, 6, [7, 8]]];
console.log(flat(arr, 2)); // [1, 2, 3, 4, 5, 6, [7, 8]];
console.log(flat(arr, 3)); // [1, 2, 3, 4, 5, 6, 7, 8];
```

## 3.0 reduce

```js
const flat = (arr, dep = 1) => {
  return arr.reduce((pre, curr) => {
    if (dep > 0 && Array.isArray(curr)) {
      pre = [
        ...pre,
        ...flat(curr, dep - 1)
      ];
    } else {
      pre.push(curr);
    }
    return pre;
  }, []);
};
const arr = [1, 2, [3, 4, [5, 6, [7, 8]]]];
console.log(flat(arr)); // [1, 2, 3, 4, [5, 6, [7, 8]]];
console.log(flat(arr, 2)); // [1, 2, 3, 4, 5, 6, [7, 8]];
console.log(flat(arr, 3)); // [1, 2, 3, 4, 5, 6, 7, 8];
```

## 4.0 reduce + concat

```js
const flat = (arr, dep = 1) => {
  return dep > 0
    ? arr.reduce((pre, curr) => {
      return pre.concat(
        Array.isArray(curr)
          ? flat(curr, dep - 1)
          : curr
      );
    }, [])
    : arr.slice()
};
const arr = [1, 2, [3, 4, [5, 6, [7, 8]]]];
console.log(flat(arr)); // [1, 2, 3, 4, [5, 6, [7, 8]]];
console.log(flat(arr, 2)); // [1, 2, 3, 4, 5, 6, [7, 8]];
console.log(flat(arr, 3)); // [1, 2, 3, 4, 5, 6, 7, 8];
```
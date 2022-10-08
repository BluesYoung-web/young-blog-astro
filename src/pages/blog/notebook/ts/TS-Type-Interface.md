---
title: type 与 interface 之间的区别与联系
description: type 与 interface 之间的区别与联系
image: /img/ts.jpeg
date: 2022-03-15 14:56:28
---

[[toc]]

## 基本定义

### type

**类型别名，可以用来表示基本类型、对象类型、联合类型、元组、交集等**

### interface

**接口，命名数据结构的另一种方式，仅限于对象类型**

## 联系

### 都可以用来描述对象或者函数

```ts
type Point = {
  x: number;
  y: number;
};
type SetPoint = (x: number, y: number) => void;
//////////////////////////
interface Point {
  x: number;
  y: number;
}
interface SetPoint {
  (x: number, y: number): void;
}
```

### 都可以被继承

```ts
interface Person {
  name: string
};
interface Student extends Person { stuNo: number };
//////////////////////////
type Person = {
  name: string;
};
interface Student extends Person { stuNo: number };
//////////////////////////
type Person = {
  name: string;
};
type Student = Person & { stuNo: number };
//////////////////////////
interface Person {
  name: string;
}
type Student = Person & { stuNo: number }
```

### 都可以被实现(`implements`)

<n-alert class="my-4" type="error">**type 联合类型无法实现**</n-alert>

```ts
interface ICat{
  setName(name:string): void;
};
class Cat implements ICat{
  setName(name:string):void{
    // todo
  }
};
// type 
type ICat = {
  setName(name:string): void;
};
class Cat implements ICat{
  setName(name:string):void{
    // todo
  }
};
/////////////////////////////////////////////////////////////////////////////////////
type Person = { name: string; } | { setName(name:string): void };

// 无法对联合类型Person进行实现
// error: 
// A class can only implement an object type
// or intersection of object types with statically known members.
// 一个类只能实现对象类型或者拥有已知数量的静态成员的交叉对象类型
class Student implements Person {
  name= "张三";
  setName(name:string):void{
    // todo
  }
}
```

## 区别

**type 可以但 interface 不能：**
  - 声明基础类型
  - 声明联合类型
  - 声明元组类型

**interface 可以但 type 不能：**
  - **多次声明会自动进行声明合并**

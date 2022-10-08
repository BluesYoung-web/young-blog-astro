---
title: TypeScript 操作符(工具类)
description: TypeScript 操作符(工具类)
image: /img/ts.jpeg
date: 2022-03-15 17:00:28
---

[[toc]]

## `typeof`

可以用来获取一个变量的声明或者对象的类型

```typescript
interface People {
  name: string;
  age: number;
}
const person: People = { name: '张三疯', age: 108 };
type P = typeof person; // People

const toArray = (n: number) => [n];
type Fn = typeof toArray; // (x: number) => number[]
```

## `keyof`

获取一个对象中的所有 `key` 值所组成的**联合类型**

```typescript
interface People {
  name: string;
  age: number;
};
type k1 = keyof People; // 'name' | 'age'
type k2 = keyof People[]; // "length" | "toString" | "pop" | "push" | "concat" | "join"
type k3 = keyof { [x: string]: People }; // string | number
```

## `in`

**遍历联合类型(枚举类型)**

```typescript
type Keys = "a" | "b" | "c";
type Obj =  {
  [p in Keys]: any;
} ;
// {
// 	a: any;
// 	b: any;
//	c: any;
// }
enum K {
  'aaa',
  'bbb',
  'ccc'
};
type O = {
  [p in K]: any;
};
// {
// 	0: any;
// 	1: any;
//	2: any;
// }
```

## <span style="color: red;">`infer`</span>

可以用来**声明一个类型变量并对其进行使用**

通常用来**反解传入的类型**

```typescript
//返回数组的第一项
type Head<T extends Array<any>> =  
  T extends [head : infer H, ...rest : any[]]
    ? H
    : never;

// 测试用例
type H0 = Head<[]>; // never
type H1 = Head<[1]>; // 1
type H2 = Head<[3, 2]>; // 3

// 反解函数参数
type Fn<A extends any[]> = (...args: A) => any;
type FnArgs<T> = T extends Fn<infer A> ? A : any;

// 测试用例
function strFn (name: string, test: number) {}
type StrFn = FnArgs<typeof strFn>; // [string, number]
```

## `extends`

**添加泛型约束**

```typescript
interface MustLength {
  length: number;
};
// 限制所传入的参数必须含有 length 属性
function mustTakeLength<T extends MustLength>(arg: T): T {
  console.log(arg.length);
  return arg;
}
mustTakeLength(3); // Error, number doesn't have a .length property
loggingIdentity({length: 10, value: 3}); //10


type User = {
  id: number;
  kind: string;
};
function makeCustomer<T extends User>(u: T): T {
  // Error（TS 编译器版本：v4.4.2）
  // Type '{ id: number; kind: string; }' is not assignable to type 'T'.
  // '{ id: number; kind: string; }' is assignable to the constraint of type 'T', 
  // but 'T' could be instantiated with a different subtype of constraint 'User'.

  // 返回的类型不能保证和传入的类型完全一致，可能存在属性丢失
  // 加入 `...u`，将剩余参数原样返回即可

  // 报错
  return {
    id: u.id,
    kind: 'customer'
  };

  // 正确
  return {
    ...u,
    kind: 'customer'
  }
}
```

## `Partial`

**拥有内置实现**

将所传入的类型里面的属性全部变成**可选**

```typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};
interface User {
	name:string;
 	age:number;
 	department:string;
}
type optional = Partial<User>
/*
type optional = {
  name?: string;
  age?: number;
  department?: string;
}
*/
```

## `Required`

**拥有内置实现**

将所传入的类型里面的属性全部变成**必选**

```typescript
type Required<T> = {
    [P in keyof T]-?: T[P];
};
interface User {
    name:string;
  	age:number;
  	department?:string;
}
type req = Required<User>;
/*
type req = {
    name: string;
    age: number;
    department: string;
}
*/
```

## `Readonly`

**拥有内置实现**
将所传入的类型里面的属性全部变为**只读**

```typescript
type Readonly<T> = {
	readonly [P in keyof T]: T[P];
};
```

## `Record`

**拥有内置实现**

**遍历所传入的第一个类型，将其值转换为所传入的第二个类型**

```typescript
type Record<K extends keyof any, T> = {
	[P in K]: T;
};
type petsGroup = 'dog' | 'cat' | 'fish';
interface IPetInfo {
	name:string,
	age:number,
};
type IPets = Record<petsGroup, IPetInfo>;
const animalsInfo:IPets = {
	dog: { name:'dogName', age:2 },
	cat: { name:'catName', age:3 },
	fish: { name: 'fishName', age: 3 }
}
```

## `Pick`

**拥有内置实现**

取出个类型中的**属性**，得到新的**类型**，主要用于接口

```typescript
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
interface Todo {
  title: string;
  description: string;
  completed: boolean;
};

type TodoPreview = Pick<Todo, "title" | "completed">;
const todo: TodoPreview = {
  title: "Clean room",
  completed: false
};
```

## `Exclude`

**拥有内置实现**

**取差集**

去除某个类型的部分**属性**，主要用于联合类型

```typescript
type Exclude<T, U> = T extends U ? never : T;
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">; // "c"
type T2 = Exclude<string | number | (() => void), Function>; // string | number
```

## `Omit`

**拥有内置实现**

去除某个属性后的**类型**，主要用于接口

```typescript
// 删除对应的属性
type Omit<T, K extends string | number | symbol> =
	{ [P in Exclude<keyof T, K>]: T[P]; }

// 等效
type Omit<T, K extends string | number | symbol> =
	Pick<T, Exclude<keyof T, K>>;


interface Todo {
  title: string;
  description: string;
  completed: boolean;
};
type TodoPreview = Omit<Todo, "description">;
type TodoPreview2 = Omit2<Todo, "description">;


const todo: TodoPreview = {
  title: "Clean room",
  completed: false
};
const todo2: TodoPreview2 = {
	description: '233'
};
```

## `Extract`

**拥有内置实现**

**取交集**

**效果与 `Exclude` 相反，从联合类型中提取子类型**

```typescript
type Extract<T, U> = T extends U ? T : never;
type T0 = Extract<"a" | "b" | "c" | "f", "a" | "f">; // "a" | "f"
type T1 = Extract<string | number | (() => void), Function>; // () =>void
```

## `NonNullable`

过滤联合类型中的 `null | undefined` 类型

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;
type T0 = NonNullable<string | number | undefined>; // string | number
type T1 = NonNullable<string[] | null | undefined>; // string[]
```

## `ReturnType`

**拥有内置实现**

**获取函数的返回类型**

```typescript
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

const fn = (n: number) => [n];
type p = ReturnType<typeof fn>; // number[]

type T0 = ReturnType<() => string>; // string
type T1 = ReturnType<(s: string) => void>; // void
type T2 = ReturnType<<T>() => T>; // unknown
type T3 = ReturnType<<T extends U, U extends number[]>() => T>; // number[]
type T4 = ReturnType<any>; // any
type T5 = ReturnType<never>; // never
type T6 = ReturnType<string>; // Error
type T7 = ReturnType<Function>; // Error                    
```

## `InstanceType`

**拥有内置实现**

获取构造函数类型的实例类型

```typescript
type InstanceType<T extends abstract new (...args: any) => any> =
	T extends abstract new (...args: any) => infer R ? R : any;

class C {
  x = 0;
  y = 0;
}

type T0 = InstanceType<typeof C>; // C
type T1 = InstanceType<any>; // any
type T2 = InstanceType<never>; // never
type T3 = InstanceType<string>; // Error
type T4 = InstanceType<Function>; // Error
```

## `ThisType`

**拥有内置实现**

指定上下文对象的类型

使用 `ThisType<T>` 时，**必须确保 `--noImplicitThis` 标志设置为 true**

```typescript
interface ThisType<T> {};

interface Person {
	name: string;
	age: number;
};

const obj: ThisType<Person> = {
  dosth() {
    this.name; // string
  }
}
```

## `Parameters`

**拥有内置实现**

**获取函数参数类型所对应的元组类型**

```typescript
type Parameters<T extends (...args: any) => any> =
	T extends (...args: infer P) => any ? P : never;

type A = Parameters<() =>void>; // []
type B = Parameters<typeof Array.isArray>; // [any]
type C = Parameters<typeof parseInt>; // [string, (number | undefined)?]
type D = Parameters<typeof Math.max>; // number[]
```

## `ConstructorParameters`

**拥有内置实现**

获取类的**构造函数**的参数类型所对应的元组

```typescript
type ConstructorParameters<T extends abstract new (...args: any) => any> =
	T extends abstract new (...args: infer P) => any ? P : never;

// [(string | undefined)?]
type A = ConstructorParameters<ErrorConstructor>;
// string[]
type B = ConstructorParameters<FunctionConstructor>;
// [string | RegExp, (string | undefined)?]
type C = ConstructorParameters<RegExpConstructor>;
```

## `DeepKeyOf`

**接受一个对象类型，返回其键名(多层嵌套)所组成的联合类型**

```ts
type DeepKeyOf<T> =
// 确保 T 为对象类型
T extends Record<string, any>
  ? {
      [k in keyof T]: k extends string // 确保键名为 string 类型
                        ? k | `${k}.${DeepKeyOf<T[k]>}` // k | k.a | k.a.b | k.a.c | ...
                        : never
    }[keyof T]; // 取得每一项键名对应的键值
  : never;

interface Stu {
  name: string;
  age: number;
  nest: {
    a: {
      b: number;
    }
  }
}
type des = DeepKeyOf<Stu>;
// "name" | "age" | "nest" | "nest.a" | "nest.a.b"
```
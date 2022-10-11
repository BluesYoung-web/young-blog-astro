---
layout: "@/layouts/BlogPost.astro"
title: TypeScript 常见练习题
description: TypeScript 常见练习题
image: /img/ts.jepg
date: 2021-09-22 15:20:12
---

[[toc]]

## 第一题：代码为何报错

`extends` 只多不少

```typescript
type User = {
  id: number;
  kind: string;
};

function makeCustomer<T extends User>(u: T): T {
  // Error（TS 编译器版本：v4.4.2）
  // Type '{ id: number; kind: string; }' is not assignable to type 'T'.
  // '{ id: number; kind: string; }' is assignable to the constraint of type 'T', 
  // but 'T' could be instantiated with a different subtype of constraint 'User'.
  return {
    id: u.id,
    kind: 'customer'
  }

  // 正解
  return {
    ...u,
    kind: 'customer'
  }
}
```

## 第二题：自动错误提示

**函数重载**

```typescript
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: number, b: string): string;
function add(a: string, b: number): string;
function add(a: number | string, b: number | string): number | string {
	if (typeof a === 'string' || typeof b === 'string') {
		return a.toString() + b.toString()
	}
	return a + b;
}
add(1, 2);
add(1, '2');
add('11', 2);
add('sudo', 'su');
```

## 第三题：实现 `SetOptional` 工具类

```typescript
type Foo = {
	a: number;
	b?: string;
	c: boolean;
};
// 枚举所有类型
type Simplify<T> = {
  [P in keyof T]: T[P]
};
// 设置可选属性
type SetOptional<T, K extends keyof T> = 
  Simplify<
    // 将要设置为可选类型的结构取出并设置为可选
    Partial<Pick<T, K>>
    // 取并集
    &
    // 排除需要设置为可选属性的结构，其余的保持不变
    Pick<T, Exclude<keyof T, K>>
  >;

// 测试用例
type SomeOptional = SetOptional<Foo, 'a'>;
// type SomeOptional = {
// 	a?: number; // 该属性已变成可选的
// 	b?: string; // 保持不变
// 	c: boolean; // 保持不变
// }

// 设置必选属性
type setRequired<T, K extends keyof T> = 
Simplify<
    // 将要设置为可选类型的结构取出并设置为必选
    Required<Pick<T, K>>
    // 取并集
    &
    // 排除需要设置为可选属性的结构，其余的保持不变
    Pick<T, Exclude<keyof T, K>>
  >;
```

## 第四题：筛选特定类型的属性值

`as`

```typescript
interface Example {
  a: string;
  b: string | number;
  c: () => void;
  d: {};
}

type ConditionalPick<T, K> = {
  // 当 属性值 为 K 的子集时，保留改属性，否则去除
  [P in keyof T as (T[P] extends K ? P : never)]: T[P]
};

// 测试用例：
type StringKeysOnly = ConditionalPick<Example, string | number>;
//=> {a: string; b: string | number}

```

## 第五题：为已有函数类型增加指定类型的参数

`Parameters + ReturnType`

`infer`

```typescript
// Parameters + ReturnType 实现
type AppendArgument<F extends (...args: any) => any, A> =
	(x: A, ...args: Parameters<F>) => ReturnType<F>;

// infer 实现
type AppendArgument<F, A> =
  F extends (...args: infer Args) => infer Return ? (x: A, ...args: Args) => Return : never;

type Fn = (a: number, b: string) => number
type FinalF = AppendArgument<Fn, boolean> 
// (x: boolean, a: number, b: string) => number
```

## 第六题：数组(元组)扁平化

```typescript
// 二维数组(元组)扁平化
type NaiveFlat<T extends any[]> = {
  // 如果值为数组(元组)，则使用数组(元组)内部的值，否则直接使用该值
  [P in keyof T]: T[P] extends any[] ? T[P][number] : T[P];
}[number];

type NaiveResult = NaiveFlat<[['a'], ['b', 'c'], ['d'], 'e']>
// 'a' | 'b' | 'c' | 'd' | 'e'

// n 维数组(元组)扁平化
type DeepFlat<T extends any[]> = {
  [P in keyof T]: T[P] extends any[] ? DeepFlat<T[P]> : T[P]
}[number];
type DeepResult = DeepFlat<[['a'], ['b', 'c'], [['d']], [[[['e']]]]]>;
// 'a' | 'b' | 'c' | 'd' | 'e'
```

## 第七题：严格类型(不一致直接报错)

```typescript
// 只能为空对象
type EmptyObj = {
  // type PropertyKey = string | number | symbol
  [k in PropertyKey]: never;
}
// 测试用例
const shouldPass: EmptyObject = {}; // 可以正常赋值
const shouldFail: EmptyObject = { // 将出现编译错误
  prop: "TS"
};

// 限定函数参数必须严格为某种类型
type SomeType =  {
 	prop: string
};

type Exclusive<T1, T2 extends T1> = {
  // 除了之前传入类型的属性，其余全部为 never
  [K in keyof T2]: K extends keyof T1 ? T2[K] : never 
};

// 更改以下函数的类型定义，让它的参数只允许严格SomeType类型的值
function takeSomeTypeOnly<T extends SomeType>(x: Exclusive<SomeType, T>) { return x };

// 测试用例：
const x = { prop: 'a' };
takeSomeTypeOnly(x); // 可以正常调用

const y = { prop: 'a', addditionalProp: 'x' };
takeSomeTypeOnly(y); // 将出现编译错误
```

## 第八题：确保数组(元组)非空

```typescript
// 保证首位元素不为空
type NotEmpty<T> = T[] & { 0: T };
// 目测更好理解
type NotEmpty<T> = [T, ...T[]];

const arr: NotEmpty<string> = [''];
```

## 第九题：使用指定分隔符拼接字符串数组(元组)

```typescript
type JoinStrArray<Arr extends string[], Separator extends string> = 
  Arr extends [infer A, ...infer B]
  ? `${A extends string ? A : ''}${B extends [string, ...string[]] ? `${Separator}${JoinStrArray<B, Separator>}`: ''}`
  : '';

type Names = ["Sem", "Lolo", "Kaquko"];
type NamesComma = JoinStrArray<Names, ",">; // "Sem,Lolo,Kaquko"
type NamesSpace = JoinStrArray<Names, " ">; // "Sem Lolo Kaquko"
type NamesStars = JoinStrArray<Names, "⭐️">; // "Sem⭐️Lolo⭐️Kaquko"
```

## 第十题：对于字符串字面量类型进行去空格处理

```typescript
type TrimLeft<V extends string> = V extends ` ${infer R}` ? TrimLeft<R> : V;
type TrimRight<V extends string> = V extends `${infer R} ` ? TrimRight<R> : V;

type Trim<V extends string> = TrimLeft<TrimRight<V>>;

// 测试用例
type T0 = Trim<' semlinker '>
// 'semlinker'
```

## 第十一题：比较两个类型是否相等

```typescript
type IsEqual<A, B> = 
  A extends B
    ? (
        B extends A
        ? true
        : false
      )
    : false;

// 测试用例
type E0 = IsEqual<1, 2>; // false
type E1 = IsEqual<{ a: 1 }, { a: 1 }>; // true
type E2 = IsEqual<[1], []>; // false
type E3 = IsEqual<{ a: 1, b: 2 }, { a: 1 }>; // false
type E4 = IsEqual<{ a: 1 }, { a: 1, b: 2 }>; // false
```

## 第十二题：获取数组(元组)第一个元素的类型

```typescript
// 使用数组(元组)长度属性进行判断
type Head<T extends any[]> = T['length'] extends 0 ? never : T[0];
// 使用 infer 反引用进行判断
type Head<T extends any[]> = T extends [infer H, ...infer R] ? H : never;

type H0 = Head<[]> // never
type H1 = Head<[1]> // 1
type H2 = Head<[3, 2]> // 3
type H3 = Head<["a", "b", "c"]> // "a"
type H4 = Head<[undefined, "b", "c"]> // undefined
type H5 = Head<[null, "b", "c"]> // null
```

## 第十三题：获取数组(元组)除第一个元素之外的剩余元素

```typescript
type Tail<T extends any[]> = T extends [infer H, ...infer R] ? R : [];

type H0 = Tail<[]> // []
type H1 = Tail<[1]> // []
type H2 = Tail<[3, 2]> // [2]
type H3 = Tail<["a", "b", "c"]> // ["b", "c"]
type H4 = Tail<[undefined, "b", "c"]> // ["b", "c"]
type H5 = Tail<[null, "b", "c"]> // ["b", "c"]
```

## 第十四题：实现 `Unshift`

```typescript
// 直接使用扩展运算符
type Unshift<T extends any[], E> = [E, ...T];
// 使用 infer
type Unshift<T extends any[], E> = T extends [infer Arr] ? [E, ...Arr] : [E]

// 测试用例
type Arr0 = Unshift<[], 1>; // [1]
type Arr1 = Unshift<[1, 2, 3], 0>; // [0, 1, 2, 3]
```

## 第十五题：实现 `Shift`

```typescript
type Shift<T extends any[]> = T extends [infer F, ...infer R] ? R : [];

type Arr0 = Shift<[1, 2, 3]>; // [2, 3]
type Arr1 = Shift<[string,number,boolean]>; // [number, boolean]
```

## 第十六题：实现 `Push`

```typescript
// 直接使用扩展运算符
type Push<T extends any[], E> = [...T, E];
// 使用 infer
type Push<T extends any[], E> = T extends [...infer Arr] ? [...Arr, E] : [E]

// 测试用例
type Arr0 = Push<[], 1>; // [1]
type Arr1 = Push<[1, 2, 3], 0>; // [1, 2, 3, 0]
```

## 第十七题：实现 `Includes`

```typescript
type IsEqual<A, B> = A extends B ? (B extends A ? true: false): false;

type Includes<T extends any[], E> = 
  // 使用 infer 解构
  T extends [first: infer F, ...args: infer R]
    // 判断是否相等，不相等则递归调用直至最后一个元素
    ? IsEqual<F, E> extends true
      ? true : Includes<R, E>
    : false;

type I0 = Includes<[], 1>; // false
type I1 = Includes<[2, 2, 3, 1], 2>; // true
type I2 = Includes<[2, 3, 3, 1], 1>; // true
```

## 第十八题：联合类型转交叉类型

```typescript
/**
 * 将联合类型转为对应的交叉函数类型
 * @template U 联合类型
 */
type UnionToInterFunction<U> =
  (
    U extends any
      ? (k: () => U) => void
      : never
  ) extends 
  (
    k: infer I,
  ) => void
    ? I
    : never;

/**
 * 获取联合类型中的最后一个类型
 * @template U 联合类型
 */
type GetUnionLast<U> =
  UnionToInterFunction<U> extends { (): infer A } ? A : never;

/**
 * 在元组类型中前置插入一个新的类型（元素）；
 * @template Tuple 元组类型
 * @template E 新的类型
 */
type Prepend<Tuple extends any[], E> = [E, ...Tuple];

/**
 * 联合类型转元组类型；
 * @template Union 联合类型
 * @template T 初始元组类型
 * @template Last 传入联合类型中的最后一个类型（元素），自动生成，内部使用
 */
type UnionToTuple<Union, T extends any[] = [], Last = GetUnionLast<Union>> = {
  0: T;
  1: UnionToTuple<Exclude<Union, Last>, Prepend<T, Last>>;
}[[Union] extends [never] ? 0 : 1];

type TupleToIntersection<T extends any[]> = T extends [infer F, ...infer U]
  ? U extends []
    ? F
    : F & TupleToIntersection<U>
  : never;
// @ts-ignore 堆栈深度过高
type UnionToIntersection<U> = TupleToIntersection<UnionToTuple<U>>;

// 测试用例
type U0 = UnionToIntersection<string | number>; // never
type U1 = UnionToIntersection<{ name: string } | { age: number }>; // { name: string; } & { age: number; }
```

## 第十九题：获取对象类型中所有的可选属性

```typescript
type OptionalKeys<T> = NonNullable<{
  [key in keyof T]: undefined extends T[key] ? key : never;
}[keyof T]>;

type Person = {
  id: string;
  name?: string;
  age: number;
  from?: string;
  speak?: string;
};
type Keys = OptionalKeys<Person> // "name" | "from" | "speak"
```

## 第二十题：实现函数类型柯里化处理

```typescript
type FirstAsArray<T extends any[]> = 
  T extends [...infer A, infer B, infer C] 
    ? A extends []
      ? T extends [...infer A, infer B] ? A : never
      : T extends [...infer A, infer B] ? FirstAsArray<A> : never
    : T;

type Curry<
  F extends (...args: any[]) => any,
  P extends any[] = Parameters<F>,
  R = ReturnType<F> 
> = P extends [infer A, infer B, ...infer C]
  ? P extends [infer A, ...infer B]
    ? Curry<F, FirstAsArray<P>, Curry<F, B, R>>
    : never
  : (...args: P) => R;

type F0 = Curry<() => Date>; // () => Date
type F1 = Curry<(a: number) => Date>; // (a: number) => Date
type F2 = Curry<(a: number, b: string) => Date>; // (a: number) => (b: string) => Date
type F3 = Curry<(a: number, b: string, c: boolean) => Date> // (a: number) => (b: string) => (c: boolean) => Date
```

## 第二十一题：实现 `Merge`

```typescript
type Merge<F1, F2> = {
  [K in keyof (F1 & F2)]:
    K extends keyof F2
      ? F2[K]
      : K extends keyof F1
        ? F1[K]
        : never;
}

type Foo = { 
  a: number;
  b: string;
};

type Bar = {
  b: number;
  c: boolean;
};

type T1 = Merge<Foo, Bar>; // { a: number, b: number, c: boolean }
type T2 = Merge<Bar, Foo>; // { a: number, b: string, c: boolean }
```

## 第二十二题：实现至少包含一个给定的属性

```typescript
type Responder = {
  text?: () => string;
  json?: () => string;
  secure?: boolean;
};

type RequireAtLeastOne<
  ObjectType,
  KeysType extends keyof ObjectType = keyof ObjectType,
> = KeysType extends unknown ? ObjectType & {[K in KeysType]-?: ObjectType[K]}: never;

type T0 = RequireAtLeastOne<Responder, 'text' | 'json'>;
// (Responder & { text: () => string }) | (Responder & { json: () => string })
// 表示当前类型至少包含 'text' 或 'json' 键
const responder: RequireAtLeastOne<Responder, 'text' | 'json'> = {
  json: () => '{"message": "ok"}',
  secure: true
};

// @ts-expect-error 因为没有'text'和'json'中的任何一个，报错
const responder2: RequireAtLeastOne<Responder, 'text' | 'json'> = {
  secure: true
};
```

## 第二十三题：移除索引签名

```typescript
// 移除属性值为 number | string 的值
type RemoveIndexSignature<T> = {
  [
    k in keyof T as (
      string extends k
        ? never
        : number extends k
          ? never
          : k
    )
  ]: T[k];
};

interface Foo {
  [key: string]: any;
  [key: number]: any;
  bar(): void;
}

type T0 = RemoveIndexSignature<Foo>; //{ bar: () => void; }
```

## 第二十四题：移除对象类型上部分属性的 `readonly` 修饰符

```typescript
type Mutable<T, Keys extends keyof T = keyof T> = {
  // 默认去除全部属性的 readonly 修饰符
  -readonly [k in Keys]: T[k];
}
&
// 其余属性保持不变
Pick<T, Exclude<keyof T, Keys>>;

type Foo = {
  readonly a: number;
  readonly b: string;
  readonly c: boolean;
};

type T0 = Mutable<Foo, 'a'>;
const mutableFoo: T0 = { a: 1, b: '2', c: true };

mutableFoo.a = 3; // OK
mutableFoo.b = '6'; // Cannot assign to 'b' because it is a read-only property.
```

## 第二十五题：判断是否为联合类型

```typescript
type IsUnion<T, U = T> = T extends U ? ([U] extends [T] ? false : true) : never;

type I0 = IsUnion<string | number | { a: number }>; // true
type I1 = IsUnion<string | never>; // false
type I2 = IsUnion<string | unknown>; // false
```

## 第二十六题：判断是否为 `never`

```typescript
type IsNever<T> = [T] extends [never] ? true : false;

type II0 = IsNever<never> // true
type II1 = IsNever<never | string> // false
type II2 = IsNever<null> // false
type II3 = IsNever<{}> // false
type II4 = IsNever<[]> // false
type II5 = IsNever<[] | never> // false
```

## 第二十七题：数组(元组)反转

```typescript
// 获取数组(元组)首元素
type Head<T extends any[]> = T extends [infer H, ...infer R] ? H : never;
// 获取数组(元组)除首元素之外的数组(元组)
type Tail<T extends any[]> = T extends [infer H, ...infer R] ? R : [];
// 头部入栈
type Unshift<T extends any[], E> = [E, ...T];

type Reverse<
  T extends Array<any>,
  R extends Array<any> = []
> = 
  // 获取首元素
  Head<T> extends never
  // 递归结束，返回翻转后的目标数组(元组)
  ? R
  // 不为 never 则递归将源数组(元组)里面的元素转移到目标数组(元组)
  : Reverse<Tail<T>, Unshift<R, Head<T>>>;

type R0 = Reverse<[]>; // []
type R1 = Reverse<[1, 2, 3]>; // [3, 2, 1]
```

## 第二十八题：字符串分割

```typescript
type Item = "semlinker,lolo,kakuqo,lalala";

type Split<
  S extends string,
  Delimiter extends string,
> = S extends `${infer First}${Delimiter}${infer Rest}` ? [First, ...Split<Rest, Delimiter>] : [S];

type ElementType = Split<Item, ",">; // ["semlinker", "lolo", "kakuqo", "lalala"]
```

## 第二十九题：属性访问转数组(元组)

```typescript
// 字符串转元组
type Str2Tuple<S extends string> =
  // 尝试使用 `[]` 分割
  S extends `${infer First}[${infer Second}]`
    ? [First, Second]
    : [S];

type ToPath<S extends string> =
  // 首先以 `.` 分割
  S extends `${infer A}.${infer R}`
    ? [...Str2Tuple<A>, ...ToPath<R>]
    : [S];

type T1 = ToPath<"foo.bar.baz">; //=> ['foo', 'bar', 'baz']
type T2 = ToPath<"foo[0].bar.baz">; //=> ['foo', '0', 'bar', 'baz']
```

## 第三十题：链式调用进行类型扩展，实现动态类型推导

```typescript
declare const config: Chainable;

type Simplify<T> = {
  [P in keyof T]: T[P]
};

type Chainable<T = {}> = {
  // S extends string can make S is Template Literal Types
  option<V, S extends string>(key: S, value: V): Chainable<T & {
    // use Key Remapping in Mapped Types generate {  S: V } type  
    // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#key-remapping-in-mapped-types
    [P in keyof {
      S: S,
    } as `${S}`]: V
  }>
  get(): Simplify<T>
}

const result = config
  .option('age', 7)
  .option('name', 'lolo')
  .option('address', { value: 'XiaMen' })
  .get();

type ResultType = typeof result;
```

## 第三十一题：实现一个 `Repeat` 方法

```typescript
type Push<T extends any[], V> =  [...T, V];

type Repeat<
  T,
  C extends number,
  R extends Array<any> = []
> = 
  // 返回数组的长度等于给定值，结束递归
  R['length'] extends C ? R : Repeat<T, C, Push<R, T>>;

type R01 = Repeat<0, 0>; // []
type R11 = Repeat<1, 1>; // [1]
type R21 = Repeat<number, 2>; // [number, number]
type R22 = Repeat<string, 5>; // [string, string, string, string, string]
```

## 第三十二题：实现一个 `RepeatString` 方法

```typescript
type Push<T extends any[], V> =  [...T, V];

type RepeatString<
  T extends string,
  C extends number,
  R extends string = '',
  A extends any[] = [],
> =
  // 利用数组的长度来控制递归的次数
  A['length'] extends C
  ? R
  : (RepeatString<T, C, `${R}${T}`, Push<A, T>>);

type S01 = RepeatString<"a", 0>; // ''
type S11 = RepeatString<"a", 2>; // 'aa'
type S21 = RepeatString<"ab", 3>; // 'ababab'
type S22 = RepeatString<"abc", 3>; // 'abcabcabc'
```

## 第三十三题：数字字符串转数字

```typescript
type ToNumber<
  T extends string,
  S extends any[] = [],
  L extends number = S['length']
> = 
  `${L}` extends T ? L : ToNumber<T, [...S, 1]>

//  用例，数值过大时会导致递归次数过多从而报错
type T0 = ToNumber<"0">; // 0
type T1 = ToNumber<"10">; // 10
type T2 = ToNumber<"20">; // 20
```

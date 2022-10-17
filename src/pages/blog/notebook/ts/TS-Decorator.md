---
title: TypeScript 装饰器
description: TypeScript 装饰器
image: /img/ts.jepg
date: 2021-10-13 11:57:40
---

[[toc]]

## 先决条件

<n-alert type="info" title="配置文件启用：">**`experimentalDecorators` 与 `emitDecoratorMetadata`**</n-alert>

## 类的装饰器

接受**类自身的引用**作为返回函数的参数

```typescript
function decTest(params: any): ClassDecorator {
  console.log(params);
  return (target) => {
    // @ts-ignore
    console.log(target === Test); // true
    target.prototype.young = 'aloha';
  }
}
@decTest(111)
class Test {
  private name: string;
  private age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  say() {
    console.log(`${this.name} ${this.age}`);
  }
}

const t = new Test('张三疯', 10);
t.say(); // 张三疯 10
// @ts-ignore
console.log(t.young); // 'aloha'
```

## 方法的装饰器

接受**类的原型对象，属性名，属性描述符**作为返回函数的参数

```typescript
function decTest(params: any): MethodDecorator {
  console.log(params);
  return (target, name, descriptor) => {
    console.log(target); //Test: {} 
    console.log(name); // "say" 
    console.log(descriptor);
    /* 方法的属性描述符
    {
      "writable": true,
      "enumerable": false,
      "configurable": true
    } 
    */
    console.log(descriptor.value);
    /* 方法的引用，可当做函数直接调用
    say() {
      console.log(`${this.name} ${this.age}`);
    }
    descriptor.value?.call({name: '111', age: '222'}); // "111 222"
    */
    // 将原本不可枚举的方法修改为可枚举
    // 如果不执行此步骤，后面枚举属性的时候不会出现 say
    descriptor.enumerable = true;
  }
}
class Test {
  private name: string;
  private age: number;
  public readonly job: string = 'web';
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  @decTest(111)
  say() {
    console.log(`${this.name} ${this.age}`);
  }
}
const t = new Test('张三疯', 10);
for (let i in t) {
  console.log(i);
}
// job name age say
```

## 属性的装饰器

接受**类的原型对象，属性名**作为返回函数的参数

**目前没有方法能在定义原型对象成员的同时去创建对应属性的描述符**

```typescript
function decTest(params: any): PropertyDecorator {
  console.log(params);
  return (target, propertyName) => {
    console.log(target); // Test: {} 
    console.log(propertyName); // "job"
  }
}
class Test {
  private name: string;
  private age: number;
  @decTest(111)
  public readonly job: string = 'web';
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  say() {
    console.log(`${this.name} ${this.age}`);
  }
}

const t = new Test('张三疯', 10);
```

## 参数装饰器

接受**类的原型对象，方法名，参数在当前签名中的索引**作为返回函数的参数

**可以通过修改 `target.constructor.prototype` 来影响后续操作**

```typescript
function paramDeco(params?: any): ParameterDecorator {
  return (target, propertyKey, index) => {
    console.log(target); // B: {} B: {"fromParamDeco": "Foo"}
    console.log(propertyKey); // "someMethod" "someMethod"
    console.log(index); // 1 0
    target.constructor.prototype.fromParamDeco = 'Foo';
  };
}
class B {
  someMethod(
    @paramDeco()
    param1: unknown,

    @paramDeco()
    param2: unknown
  ) {
    console.log(`${param1}  ${param2}`); // "A B"
  }
}
new B().someMethod('A', 'B');
// @ts-ignore
console.log(B.prototype.fromParamDeco); // Foo
```

## 装饰器执行顺序

**实例成员**
  - 属性装饰器
  - 方法装饰器
  - 参数装饰器

**静态成员**
  - 属性装饰器
  - 方法装饰器
  - 参数装饰器

**类**
  - 类装饰器(上下下上)
  - 构造函数(**不能用方法装饰器**)的**参数装饰器**(左右右左)

```typescript
function cla(name: string): ClassDecorator {
  console.log(name + " in");
  return () => {
    console.log(name +" out");
  }
}
function foo(name: string): MethodDecorator {
  console.log(name + " in");
  return () => {
    console.log(name +" out");
  }
}
function pro(name: string): PropertyDecorator {
  console.log(name + " in");
  return () => {
    console.log(name +" out");
  }
}
function par(name: string): ParameterDecorator {
  console.log(name + " in");
  return () => {
    console.log(name +" out");
  }
}

@cla('aaa')
@cla('bbb')
class A {
  @pro('pro0')
  name: string = '';

  @pro('static0')
  static version = '1.0.0';

  constructor(@par('cons_a') a: unknown){}

  @foo('fo0')
  method(
    @par('pa')
    a: unknown,

    @par('pb')
    b: unknown
  ) {}
}
/*
  [LOG]: "pro0 in" 
  [LOG]: "pro0 out" 
  [LOG]: "fo0 in" 
  [LOG]: "pa in" 
  [LOG]: "pb in" 
  [LOG]: "pb out" 
  [LOG]: "pa out" 
  [LOG]: "fo0 out" 
  [LOG]: "static0 in" 
  [LOG]: "static0 out" 
  [LOG]: "aaa in" 
  [LOG]: "bbb in" 
  [LOG]: "cons_a in" 
  [LOG]: "cons_a out" 
  [LOG]: "bbb out" 
  [LOG]: "aaa out" 
*/
```

## `Reflect.metadata`

`ES7` 的一个提案，主要用于**在声明的时候添加和读取元数据**

`yarn add reflect-metadata`(**reflect-metadata 对 Reflect 对象进行了扩展**)

`tsconfig.json` 启用 `emitDecoratorMetadata`

**为类或之类的属性添加了元数据之后，构造函数的原型会具有`[[Metadata]]` 属性**
  - 该属性内部包含一个 Map 结构
  - **键为属性值，值为元数据键值对**

### 内置元数据键

`design:type` **获取属性类型**

`design:paramtypes` **获取参数类型**

`design:returntype` **获取返回值类型**

**具体表现:**
  - 给**类**添加装饰器时，只会自动添加 `design:paramtypes` 的元数据，含义为其**构造函数的形式参数类型数组**
  - 给**属性**添加装饰器时，只会自动添加 `design:type` 的元数据，含义为**该属性的类型**
  - 给**方法**添加装饰器时，会自动添加上面三种保留的元数据，含义为**该方法的类型，该方法的形式参数类型数组，该方法的返回值**

### 直接作为装饰器使用

```typescript
@Reflect.metadata('inClass', 'A') // 作为类的装饰器，将元数据添加到类上
class Test {
  @Reflect.metadata('inMethod', 'B') // 作为方法的装饰器，在类的原型对象上添加元数据
  public hello(): string {
    return 'hello world';
  }
}
// 从类上取出之前存入的元数据，需要同时传入 键名和对应的类
console.log(Reflect.getMetadata('inClass', Test)); // 'A' 
// 从原型对象上取出元数据，需要同时传入 键名，类的实例对象以及方法名
console.log(Reflect.getMetadata('inMethod', new Test(), 'hello')); // 'B'
```

### 用于自定义 `metadataKey` 的存取

```typescript
import 'reflect-metadata';

@Reflect.metadata('className', 'T')
class Test {
  @Reflect.metadata('prop', 'young')
  public age: number;
  constructor(public name: string){}

  @Reflect.metadata('method', 'aloha')
  sayName(name: string, age: number): string {
    return this.name;
  }
}
const test = new Test('张三疯');
/**
 * 装饰器应用到类上，自动注入内置类型 design:paramtypes
 */
console.log(Reflect.getMetadata('className', Test)); // T
console.log(Reflect.getMetadata('design:paramtypes', Test), '\n'); // [[Function: String]] ===> [string]
/**
 * 装饰器应用到属性上，自动注入内置类型 design:type
 * 存储位置位于原型对象上！！！
 * Reflect.getMetadata('prop', test, 'age') === Reflect.getMetadata('prop', Test.prototype, 'age')
 */
console.log(Reflect.getMetadata('prop', test, 'age')); // young
console.log(Reflect.getMetadata('prop', Test.prototype, 'age')); // young
console.log(Reflect.getMetadata('design:type', test, 'age'), '\n'); // [Function: Number] ===> number
/**
 * 装饰器应用到方法上，自动注入全部三种内置类型
 */
console.log(Reflect.getMetadata('method', test, 'sayName')); // aloha
console.log(Reflect.getMetadata('design:type', test, 'sayName')); // [Function: Function] ===> Function
console.log(Reflect.getMetadata('design:paramtypes', test, 'sayName')); // [[Function: String], [Function: Number]] ===> [string, number]
// 必须完全写出才能读取，无法自动推导 ！！！
console.log(Reflect.getMetadata('design:returntype', test, 'sayName')); // [Function: String] ===> string
/**
 * 获取 Test 类上的元数据的键名数组
 */
console.log(Reflect.getMetadataKeys(Test)); // ['design:paramtypes', 'className']
console.log(Reflect.getMetadataKeys(test, 'sayName')); // ['design:returntype', 'design:paramtypes', 'design:type', 'method']
console.log(Reflect.getMetadataKeys(test, 'age')); // ['design:type', 'prop']

class Son extends Test {}
// 获取原型链上所有的键名，包括继承自 Test 的
console.log(Reflect.getMetadataKeys(Son)); // ['design:paramtypes', 'className']
// 获取自身的所有的键名
console.log(Reflect.getOwnMetadataKeys(Son)); // []
// 获取自身(包括原型链)上的元数据
console.log(Reflect.getMetadata('className', Son)); // T
// 获取自身的元数据
console.log(Reflect.getOwnMetadata('className', Son)); // undefined
// 判断对应元数据的键名是否存在，自身(包括原型链)上的元数据
console.log(Reflect.hasMetadata('className', Son)); // true
// 判断对应元数据的键名是否存在，自身的元数据
console.log(Reflect.hasOwnMetadata('className', Son)); // false

/**
 * 删除元数据
 */
console.log(Reflect.deleteMetadata('className', Test)); // true
console.log(Reflect.hasMetadata('className', Test)); // false
console.log(Reflect.getMetadata('className', Test)); // undefined

function classDecorator(): ClassDecorator {
  return target => {
    // 在类上定义元数据，key 为 `classMetaData`，value 为 `a`
    Reflect.defineMetadata('classMetaData', 'a', target);
  };
}
function methodDecorator(): MethodDecorator {
  return (target, key, descriptor) => {
    // 在类的原型属性 'someMethod' 上定义元数据，key 为 `methodMetaData`，value 为 `b`
    Reflect.defineMetadata('methodMetaData', 'b', target, key);
  };
}
@classDecorator()
class SomeClass {
  @methodDecorator()
  someMethod() {}
}
Reflect.getMetadata('classMetaData', SomeClass); // 'a'
Reflect.getMetadata('methodMetaData', new SomeClass(), 'someMethod'); // 'b'
```

## 扩展

### IoC

`Inversion of Control` 控制反转

**一种设计松耦合的优良系统的思想**

### DI

`Dependency Injection` 依赖注入

**控制反转最常见的实现方式**

目的：
  - 提升组件重用率
  - 为系统搭建一个灵活、可扩展的平台
  - 只需要通过简单的配置，而无需任何代码就可指定目标需要的资源，完成自身的业务逻辑，而不需要关心具体的资源来自何处，由谁实现

### 简单对比

```typescript
/**
 * 反转之前
 */
export default class Body { };
export default class Chassis { };
export default class Engine {
  start() {
    console.log("引擎发动了");
  }
}

import Engine from './engine';
import Chassis from './chassis';
import Body from './body';

export default class Car {
  engine: Engine;
  chassis: Chassis;
  body: Body;

  constructor() {
    this.engine = new Engine();
    this.body = new Body();
    this.chassis = new Chassis();
  }

  run() {
    this.engine.start();
  }
}
const car = new Car();
car.run(); // 引擎发动了
/**
 * 反转之后
 */
export default class Car {
  constructor(
    private engine: Engine,
    private body: Body,
    private chassis: Chassis
  ) {}

  run() {
    this.engine.start();
  }
}

const engine = new NewEngine();
const body = new Body();
const chassis = new Chassis();

const newCar = new Car(engine, body, chassis);
newCar.run(); // 引擎发动了
```

### 具体应用(装饰器生成路由表)

```typescript
/*
 * @Author: zhangyang
 * @Date: 2021-10-14 11:45:51
 * @LastEditTime: 2021-10-14 15:51:21
 * @Description: 
 */
import 'reflect-metadata';

const METHOD_METADATA = 'method';
const PATH_METADATA = 'path';

const Controller = (path: string): ClassDecorator => {
  return target => {
    Reflect.defineMetadata(PATH_METADATA, path, target);
  }
}

const createMappingDecorator = (method: string) => (path: string): MethodDecorator => {
  return (target, key, descriptor) => {
    Reflect.defineMetadata(METHOD_METADATA, {
      path,
      method,
      fn: descriptor.value
    }, target, key);
  }
}

const Get = createMappingDecorator('GET');
const Post = createMappingDecorator('POST');

function mapRoute(instance: Object) {

  const prototype = Object.getPrototypeOf(instance);
  // 筛选出类的 methodName
  const methodNames = Object.getOwnPropertyNames(prototype).filter((item) => item !== 'constructor' && prototype[item] instanceof Function);
  
  return methodNames.map(methodName => Reflect.getMetadata(METHOD_METADATA, instance, methodName));
};

@Controller('/test')
class SomeClass {
  @Get('/a')
  someGetMethod() {
    console.log('hello world');
  }

  @Post('/b')
  somePostMethod() {}

  a: number;
}

console.log(Reflect.getMetadata(PATH_METADATA, SomeClass)); // '/test'

const routes = mapRoute(new SomeClass())
console.log(routes);
/*
[
  { path: '/a', method: 'GET', fn: [Function (anonymous)] },
  { path: '/b', method: 'POST', fn: [Function (anonymous)] }
]
*/
routes[0].fn(); // 'hello world'
```


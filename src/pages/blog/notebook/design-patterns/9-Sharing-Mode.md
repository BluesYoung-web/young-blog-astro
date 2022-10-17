---
title: 9-享元模式
description: 9-享元模式
date: 2022-04-04 10:42:00
image: /img/design-mode.jpeg
---

[[toc]]

## 定义

**用于性能优化的模式**

摒弃了在每个对象中保存所有数据的方式，通过共享多个对象的相同状态，可以在有限的内存中载入更多的对象

**内部状态：**
- 储存于对象内部
- 可以被一些对象共享
- 独立于具体场景，通常不会变化

**外部状态：**
- 取决于具体的场景，并随着场景而变化
- 不能被共享

<n-alert type="info">**可以将所有内部状态相同的对象指定为一个共享对象，而将外部状态剥离并存储在外部**</n-alert>

## 适用场景

程序必须使用大量对象，但是没有足够的内存容量

## 优缺点

**优点：**
- 如果程序中有很多相似的对象，可以节约大量的内存

**缺点：**
- 可能需要牺牲执行速度来换取内存
- 代码复杂度增加

## 实现

```ts
/**
 * 享元类 
 */
class Flyweight<T extends any = any, R extends any = any> {
  private sharedState: T;

  constructor(sharedState: T) {
    this.sharedState = sharedState;
  }

  public operation(uniqueState: R) {
    const s = JSON.stringify(this.sharedState);
    const u = JSON.stringify(uniqueState);
    console.log(`Flyweight: Displaying shared (${s}) and unique (${u}) state.`);
  }
}

/**
 * 工厂类，对享元对象进行管理
 */
class FlyweightFactory {
  private flyweights: Record<string, Flyweight> = {};

  constructor(initialFlyweights: string[][]) {
    for (const state of initialFlyweights) {
      this.flyweights[this.getKey(state)] = new Flyweight(state);
    }
  }

  /**
   * 计算享元状态的键名
   */
  private getKey(state: string[]) {
    return state.join('_');
  }

  /**
   * 有则复用，无则新建
   */
  public getFlyweight(sharedState: string[]) {
    const key = this.getKey(sharedState);

    if (!(key in this.flyweights)) {
      console.log('FlyweightFactory: Can\'t find a flyweight, creating new one.');
      this.flyweights[key] = new Flyweight(sharedState);
    } else {
      console.log('FlyweightFactory: Reusing existing flyweight.');
    }
    return this.flyweights[key];
  }

  public listFlyweights() {
    const count = Object.keys(this.flyweights).length;
    console.log(`\nFlyweightFactory: I have ${count} flyweights:`);
    for (const key in this.flyweights) {
      console.log(key);
    }
  }
}

/**
* 初始化享元工厂
*/
const factory = new FlyweightFactory([
  ['Chevrolet', 'Camaro2018', 'pink'],
  ['Mercedes Benz', 'C300', 'black'],
  ['Mercedes Benz', 'C500', 'red'],
  ['BMW', 'M5', 'red'],
  ['BMW', 'X6', 'white'],
]);
factory.listFlyweights();

function addCarToPoliceDatabase(
  ff: FlyweightFactory,
  plates: string,
  owner: string,
  brand: string,
  model: string,
  color: string
) {
  console.log('\nClient: Adding a car to database.');
  const flyweight = ff.getFlyweight([brand, model, color]);
  flyweight.operation([plates, owner]);
}
// 存在对应的车型，直接复用
addCarToPoliceDatabase(factory, 'CL234IR', 'James Doe', 'BMW', 'M5', 'red');
// 不存在对应的车型，添加
addCarToPoliceDatabase(factory, 'CL234IR', 'James Doe', 'BMW', 'X1', 'red');

factory.listFlyweights();
```
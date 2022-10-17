---
title: 4-迭代器模式
description: 4-迭代器模式
date: 2022-04-04 09:30:00
image: /img/design-mode.jpeg
---

[[toc]]

## 定义

提供一种**顺序访问一个聚合对象中各个元素的方法，无需暴露该对象的内部表示**

将迭代的过程从业务逻辑中分离出来

## 分类

### 内部迭代器

只需要初始调用，后续自动完成

太过于死板

### 外部迭代器

需要显示调用 `next()` 方法

灵活多变，适用性更广

## 适用场景

当集合背后为复杂的数据结构，且希望对客户端隐藏其复杂性

出于使用便利和安全性的考量

减少程序中重复的便利代码

希望同样的代码能够遍历不同的，甚至是无法预知的数据结构

## 优缺点

**优点：**
- 遵循单一职责，开闭原则
- 可以并行遍历同一集合，因为**每个迭代器都包含其自身的遍历状态**
- 可以暂停遍历，需要的时候再继续

**缺点：**
- 如果只是对简单的集合进行交互，可能会矫枉过正
- 对于某些特殊的集合，使用迭代器可能比直接遍历效更低

## 实现

```ts
/**
 * 迭代器接口
 */
interface Iterator<T> {
  /**
   * 当前元素
   */
  current(): T;
  /**
   * 下一个元素
   */
  next(): T;
  /**
   * 当前元素的键名
   */
  key(): number;
  /**
   * 检验是否合法
   */
  valid(): boolean;
  /**
   * 重新遍历
   */
  rewind(): void;
}
/**
 * 拥有迭代器的集合
 */
interface Aggregator {
  getItems(): string[];
  getCount(): number;
  addItem(item: string): void;
  getIterator(): Iterator<string>;
  getReverseIterator(): Iterator<string>;
}
/**
 * 阿拉伯数字迭代器
 */
class AlphabeticalOrderIterator implements Iterator<string> {
  private collection: WordsCollection;
  /**
   * 存储当前位置
   */
  private position: number = 0;
  /**
   * 遍历顺序
   */
  private reverse: boolean = false;
  constructor(collection: WordsCollection, reverse: boolean = false) {
    this.collection = collection;
    this.reverse = reverse;
    if (reverse) {
      this.position = collection.getCount() - 1;
    }
  }
  public rewind() {
    this.position = this.reverse ? (this.collection.getCount() - 1) : 0;
  }
  public current(): string {
    return this.collection.getItems()[this.position];
  }
  public key(): number {
    return this.position;
  }
  public next(): any {
    const item = this.collection.getItems()[this.position];
    this.position += this.reverse ? -1 : 1;
    return item;
  }
  public valid(): boolean {
    return this.reverse ? (this.position >= 0) : (this.position < this.collection.getCount());
  }
}
/**
 * 集合
 */
class WordsCollection implements Aggregator {
  private items: string[] = [];
  public getItems(): string[] {
    return this.items;
  }
  public getCount(): number {
    return this.items.length;
  }
  public addItem(item: string): void {
    this.items.push(item);
  }
  public getIterator(): Iterator<string> {
    return new AlphabeticalOrderIterator(this);
  }
  public getReverseIterator(): Iterator<string> {
    return new AlphabeticalOrderIterator(this, true);
  }
}
/**
 * 客户端
 */
const collection = new WordsCollection();
collection.addItem('张三丰');
collection.addItem('张翠山');
collection.addItem('张无忌');
const iterator = collection.getIterator();
console.log('顺序遍历:');
while (iterator.valid()) {
  console.log(iterator.next());
}
console.log('');
console.log('逆序遍历:');
const reverseIterator = collection.getReverseIterator();
while (reverseIterator.valid()) {
  console.log(reverseIterator.next());
}
```
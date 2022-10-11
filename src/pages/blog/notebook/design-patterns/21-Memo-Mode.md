---
layout: "@/layouts/BlogPost.astro"
title: 21-备忘录模式
description: 21-备忘录模式
date: 2022-04-04 19:20:00
image: /img/design-mode.jpeg
---

[[toc]]

## 定义

**允许在不暴露对象细节的情况下保存和恢复对象之前的状态**

## 适用场景

需要创建对象状态快照来恢复之前的状态

直接访问对象成员变量，获取器或设置器将导致封装被突破

## 优缺点

**优点：**
- 可以在不破坏封装的情况下创建对象状态的快照
- 可以通过让负责人维护原发器状态历史记录来简化原发器代码

**缺点：**
- 如果客户端过于频繁的创建备忘录，程序将消耗大量的内存
- 负责人必须完整跟踪原发器的生命周期，这样才能销毁启用的备忘录
- **绝大部分动态编程语言不能确保备忘录中的状态不被修改**

## 实现

```ts
/**
 * 原始
 */
class Originator {
  /**
   * 快照
   */
  private state: string;
  constructor(state: string) {
    this.state = state;
    console.log(`初始快照: ${state}`);
  }
  /**
   * 一顿操作
   */
  public doSomething() {
    console.log('此处执行了一些重要操作...');
    this.state = this.generateRandomString(30);
    console.log(`快照变更: ${this.state}`);
  }
  /**
   * 生成随机字符串
   * @param length 字符串的长度
   */
  private generateRandomString(length: number = 10) {
    const charSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return new Array(length)
      .fill(1)
      .map(() => charSet.charAt(Math.floor(Math.random() * charSet.length)))
      .join('');
  }
  /**
   * 保存快照
   */
  public save() {
    return new ConcreteMemento(this.state);
  }
  /**
   * 回滚
   */
  public restore(memento: Memento) {
    this.state = memento.getState();
    console.log(`状态已变更: ${this.state}`);
  }
}
/**
 * 快照
 */
interface Memento {
  getState(): string;
  getName(): string;
  getDate(): string;
}
/**
 * 快照实现
 */
class ConcreteMemento implements Memento {
  private state: string;
  private date: string;
  constructor(state: string) {
    this.state = state;
    this.date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  }
  /**
   * 获取快照详细内容
   */
  public getState() {
    return this.state;
  }
  /**
   * 获取快照记录信息
   */
  public getName() {
    return `${this.date} / (${this.state.slice(0, 9)}...)`;
  }
  /**
   * 获取快照记录时间
   */
  public getDate() {
    return this.date;
  }
}
/**
 * 历史记录
 */
class Caretaker {
  private mementos: Memento[] = [];
  private originator: Originator;
  constructor(originator: Originator) {
    this.originator = originator;
  }
  /**
   * 保存快照
   */
  public backup() {
    console.log('\n保存快照');
    this.mementos.push(this.originator.save());
  }
  /**
   * 回滚
   */
  public undo() {
    const memento = this.mementos.pop();
    if (memento) {
        console.log(`回滚: ${memento.getName()}`);
        this.originator.restore(memento);
    }
    
  }
  /**
   * 查看快照历史记录
   */
  public showHistory() {
    console.log('历史快照:');
    for (const memento of this.mementos) {
      console.log(memento.getName());
    }
  }
}
/**
 * 客户端
 */
const originator = new Originator('Super-duper-super-puper-super.');
const caretaker = new Caretaker(originator);
caretaker.backup();
originator.doSomething();
caretaker.backup();
originator.doSomething();
caretaker.backup();
originator.doSomething();
console.log('');
caretaker.showHistory();
console.log('\n回滚吧牛宝宝');
caretaker.undo();
console.log('\n再滚一次');
caretaker.undo();
/*
[LOG]: "初始快照: Super-duper-super-puper-super." 
[LOG]: "
保存快照" 
[LOG]: "此处执行了一些重要操作..." 
[LOG]: "快照变更: bcHoJNJHOwaHotPZHrxuZEKMjYwpWv" 
[LOG]: "
保存快照" 
[LOG]: "此处执行了一些重要操作..." 
[LOG]: "快照变更: nzGuXdAfOwEnEvIpKulrrkHUDbZMIH" 
[LOG]: "
保存快照" 
[LOG]: "此处执行了一些重要操作..." 
[LOG]: "快照变更: stHNUiHkmAQoNphsNSyLfkkLGHAOuT" 
[LOG]: "" 
[LOG]: "历史快照:" 
[LOG]: "2022-04-04 19:29:58 / (Super-dup...)" 
[LOG]: "2022-04-04 19:29:58 / (bcHoJNJHO...)" 
[LOG]: "2022-04-04 19:29:58 / (nzGuXdAfO...)" 
[LOG]: "
回滚吧牛宝宝" 
[LOG]: "回滚: 2022-04-04 19:29:58 / (nzGuXdAfO...)" 
[LOG]: "状态已变更: nzGuXdAfOwEnEvIpKulrrkHUDbZMIH" 
[LOG]: "
再滚一次" 
[LOG]: "回滚: 2022-04-04 19:29:58 / (bcHoJNJHO...)" 
[LOG]: "状态已变更: bcHoJNJHOwaHotPZHrxuZEKMjYwpWv" 
*/
```
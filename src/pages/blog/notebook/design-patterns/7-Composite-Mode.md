---
title: 7-组合模式
description: 7-组合模式
date: 2022-04-04 10:10:00
image: /img/design-mode.jpeg
---

[[toc]]

## 定义

**将对象组合成树形结构，并能像使用普通对象一样使用它们**

以递归的方式处理对象树中的所有项目

## 适用场景

需要实现**树状对象结构(扫描文件夹)**

希望客户端使用相同的方式处理简单元素和复杂元素

## 优缺点

**优点：**
- 遵循开闭原则
- 可以利用多态和递归机制更方便地使用复杂的数据结构

**缺点：**
- 对于功能差异较大的类，提供公共接口或许比较困难

## 实现

```ts
/**
 * 包含基本操作和复杂操作的基本组件
 */
abstract class Component {
  protected parent: Component;
  public setParent(parent: Component) {
    this.parent = parent;
  }
  public getParent(): Component {
    return this.parent;
  }
  /**
   * 子组件管理
   */
  public add(component: Component) { }
  public remove(component: Component) { }
  /**
   * 让客户端判断是否允许使用子组件
   */
  public isComposite() {
    return false;
  }
  /**
   * 默认操作
   */
  public abstract operation(): string;
}
/**
 * 简单子组件
 */
class Leaf extends Component {
  public operation() {
    return '我是简单子组件产生的操作';
  }
}
/**
 * 复杂子组件
 */
class Composite extends Component {
  protected children: Component[] = [];
  /**
   * 复制子组件可以拥有自己的子组件
   */
  public add(component: Component) {
    this.children.push(component);
    component.setParent(this);
  }
  public remove(component: Component) {
    const componentIndex = this.children.indexOf(component);
    this.children.splice(componentIndex, 1);
    component.setParent(null);
  }
  public isComposite() {
    return true;
  }
  /**
   * 分别调用每一个子组件的方法之后汇总
   */
  public operation() {
    const results = [];
    for (const child of this.children) {
      results.push(child.operation());
    }
    return `汇总：(${results.join('+')})`;
  }
}
/**
 * 客户端
 */
function clientCode(component: Component) {
  // ...
  console.log(`客户端调用结果: ${component.operation()}`);
  // ...
}
const simple = new Leaf();
console.log('客户端使用简单子组件：');
clientCode(simple);
console.log('\n');
/**
客户端使用简单子组件：
客户端调用结果: 我是简单子组件产生的操作
客户端使用复杂子组件
客户端调用结果: 
  汇总：(
    汇总：(
      我是简单子组件产生的操作
      +
      我是简单子组件产生的操作
    )
    +
    汇总：(我是简单子组件产生的操作)
  )
 */
// --------------------------------------------
const tree = new Composite();
const branch1 = new Composite();
branch1.add(new Leaf());
branch1.add(new Leaf());
const branch2 = new Composite();
branch2.add(new Leaf());
tree.add(branch1);
tree.add(branch2);
console.log('客户端使用复杂子组件');
clientCode(tree);
console.log('\n');
// ------------------------------------------------------
function clientCode2(component1: Component, component2: Component) {
  if (component1.isComposite()) {
    component1.add(component2);
  }
  console.log(`统筹处理结果: ${component1.operation()}`);
  // ...
}
console.log('我不管组件的类型');
clientCode2(tree, simple);
/**
我不管组件的类型
统筹处理结果: 
  汇总：(
    汇总：(
      我是简单子组件产生的操作
      +
      我是简单子组件产生的操作
    )
    +
    汇总：(我是简单子组件产生的操作)
    +
    我是简单子组件产生的操作
  )
*/
```
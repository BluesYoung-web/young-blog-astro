---
layout: "@/layouts/BlogPost.astro"
title: 22-访问者模式
description: 22-访问者模式
date: 2022-04-04 19:35:00
image: /img/design-mode.jpeg
---

[[toc]]

## 定义

**能将算法与其作用的对象隔离开来**

将新行为放入一个名为访问者的独立类中，而不是试图将其整合到已有类中

## 适用场景

对一个复杂对象结构(对象树)中的所有元素执行某些操作

清理辅助行为的业务逻辑

某个行为仅在类层次结构中的一些类中有意义，而在其他类中确没有意义

## 优缺点

**优点：**
- 符合单一职责、开闭原则
- 访问者在与各种对象交互时，可以收集一些有用的信息

**缺点：**
- 每次在元素层次结构中添加或移除一个类时，你都要更新所有的访问者
- 在访问者同某个元素进行交互时，它们可能没有访问元素私有成员变量和方法的权限

## 实现

```ts
/**
 * 组件接口
 */
interface Component {
  accept(visitor: Visitor): void;
}
/**
 * 组件A实现
 */
class ConcreteComponentA implements Component {
  /**
   * 接受访问者
   */
  public accept(visitor: Visitor) {
    visitor.visitConcreteComponentA(this);
  }
  /**
   * 执行组件A的方法
   */
  public exclusiveMethodOfConcreteComponentA() {
    return 'A';
  }
}
/**
 * 组件B实现
 */
class ConcreteComponentB implements Component {
  public accept(visitor: Visitor) {
    visitor.visitConcreteComponentB(this);
  }
  public specialMethodOfConcreteComponentB() {
    return 'B';
  }
}
/**
 * 访问者接口
 */
interface Visitor {
  visitConcreteComponentA(element: ConcreteComponentA): void;
  visitConcreteComponentB(element: ConcreteComponentB): void;
}
/**
 * 访问者1实现
 */
class ConcreteVisitor1 implements Visitor {
  public visitConcreteComponentA(element: ConcreteComponentA) {
    console.log(`${element.exclusiveMethodOfConcreteComponentA()} + 访问者1`);
  }
  public visitConcreteComponentB(element: ConcreteComponentB) {
    console.log(`${element.specialMethodOfConcreteComponentB()} + 访问者1`);
  }
}
/**
 * 访问者2实现
 */
class ConcreteVisitor2 implements Visitor {
  public visitConcreteComponentA(element: ConcreteComponentA) {
    console.log(`${element.exclusiveMethodOfConcreteComponentA()} + 访问者2`);
  }
  public visitConcreteComponentB(element: ConcreteComponentB) {
    console.log(`${element.specialMethodOfConcreteComponentB()} + 访问者2`);
  }
}
/**
 * 客户端
 */
function clientCode(components: Component[], visitor: Visitor) {
  for (const component of components) {
    component.accept(visitor);
  }
}
const components = [
  new ConcreteComponentA(),
  new ConcreteComponentB(),
];
console.log('使用访问者1:');
const visitor1 = new ConcreteVisitor1();
clientCode(components, visitor1);
console.log('');
console.log('使用访问者2:');
const visitor2 = new ConcreteVisitor2();
clientCode(components, visitor2);
/*
[LOG]: "使用访问者1:" 
[LOG]: "A + 访问者1" 
[LOG]: "B + 访问者1" 
[LOG]: "" 
[LOG]: "使用访问者2:" 
[LOG]: "A + 访问者2" 
[LOG]: "B + 访问者2" 
*/
```
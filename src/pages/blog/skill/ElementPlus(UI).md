---
title: ElementUI 相关
description: ElementUI 相关
date: 2022-03-07 11:42:25
---

[[toc]]

## 打包后提示字体文件丢失

实际上并没有丢失，只是莫名其妙多了一层 `_assets`

**罪魁祸首->配置文件中设置的`base: './'`**，将其改为绝对路径之后就好了

*目前 Element-Plus 的正式版已经使用 svg 图标替代字体图标*

## Dialog 组件显示异常

多层 Dialog 组件嵌套的情况下可能会出现层级混乱

**解决方法，内部 Dialog 增加以下属性：**
  - `:append-to-body="true"` 弹出层插入 body
  - `:modal-append-to-body="false"` 遮罩层插入父级

## 表格组件错位

页面处于 `keep-alive` 缓存组件之中

不同标签页切换的时候，表格组件可能会出现样式错位的 bug

此时按照常理来说应该要重新渲染，但是普通的生命周期钩子不会触发

`activated` —— 进入页面时触发(`keep-alive`)

**表格组件暴露的 `doLayout` 方法可以重新渲染**

```js
activited() {
  this.$nextTick(() => {
    this.$refs.table.doLayout()
  })
}
```

## 模拟点击事件

> **使用 Element UI 编写的组件，无法直接通过获取元素 + `.click()` 触发点击事件**

<script setup>
const data = [
  `.click() 直接触发——失败`,
  `document.createEvent() 专业模拟——失败`,
  `<strong>阅读 Element UI 的单元测试源码——成功</strong>`
];
</script>

<Step
  title="尝试历程"
  :data="data"
/>

### 源代码

```js
// https://github.com/ElemeFE/element/blob/dev/test/unit/util.js
/**
 * 触发一个事件
 * mouseenter, mouseleave, mouseover, keyup, change, click 等
 * @param  {Element} elm
 * @param  {String} name
 * @param  {*} opts
 */
const triggerEvent = function(elm, name, ...opts) {
  let eventName;

  if (/^mouse|click/.test(name)) {
    eventName = 'MouseEvents';
  } else if (/^key/.test(name)) {
    eventName = 'KeyboardEvent';
  } else {
    eventName = 'HTMLEvents';
  }
  const evt = document.createEvent(eventName);

  evt.initEvent(name, ...opts);
  elm.dispatchEvent
    ? elm.dispatchEvent(evt)
    : elm.fireEvent('on' + name, evt);

  return elm;
};

/**
 * 触发 “mouseup” 和 “mousedown” 事件
 * @param {Element} elm
 * @param {*} opts
 */
const triggerClick = function(elm, ...opts) {
  triggerEvent(elm, 'mousedown', ...opts);
  triggerEvent(elm, 'mouseup', ...opts);

  return elm;
};

let btnDecrease = document.querySelector('.el-input-number__decrease');
// https://github.com/ElemeFE/element/blob/dev/test/unit/specs/input-number.spec.js#L128
// 触发点击事件，需要下面两个方法连续执行！！！
// 点击元素
triggerEvent(btnDecrease, 'mousedown');
// 点击事件冒泡到 document
triggerClick(document, 'mouseup');
```
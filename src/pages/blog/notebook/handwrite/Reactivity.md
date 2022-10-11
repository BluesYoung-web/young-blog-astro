---
layout: "@/layouts/BlogPost.astro"
title: 手写响应式
description: 手写响应式
image: /img/writing-hand.svg
date: 2021-03-11 14:53:22
---

[[toc]]

## 手写响应式

实现类似于 `Vue3` 的 `ref` `reactive`  `watchEffect`

**读取值时收集依赖，修改值之后触发依赖**

```js
/*
 * 原理：
 * ref: Object.defineProperty(obj, prop, getter | setter)
 * reactive: Proxy
 */
let currentEffect;
class Dep {
  constructor(val) {
    /**
     * 存储依赖
     */
    this.effects = new Set();
    this._val = val;
  }
  /**
   * 收集依赖(订阅)
   */
  gatherEffect() {
    currentEffect && this.effects.add(currentEffect);
  }
  /**
   * 触发依赖(发布)
   */
  emitEffect() {
    this.effects.forEach((fn) => fn());
  }

  get value() {
    // 依赖收集
    this.gatherEffect();
    return this._val;
  }
  set value(v) {
    this._val = v;
    // 触发依赖内容的更新
    this.emitEffect();
  }
}

function watchEffect(fn) {
  if (fn instanceof Function) {
    currentEffect = fn;
    fn();
    currentEffect = null;
  } else {
    throw new TypeError('fn must be a function');
  }
}

function ref(v = null) {
  return new Dep(v);
}

/**
 * 存储所有对象及其对应的依赖
 */
const targetMaps = new Map();
function getCurrentTarget(target, property) {
  let effectsMap = targetMaps.get(target);
  if (!effectsMap) {
    effectsMap = new Map();
    targetMaps.set(target, effectsMap);
  }
  let effect = effectsMap.get(property);
  if (!effect) {
    effect = new Dep();
    effectsMap.set(property, effect);
  }
  return effect;
}

function reactive(obj = {}) {
  return new Proxy(obj, {
    get(target, property) {
      const effect = getCurrentTarget(target, property);
      effect.gatherEffect();
      return Reflect.get(target, property);
    },
    set(target, property, value) {
      const result = Reflect.set(target, property, value);
      const effect = getCurrentTarget(target, property);
      effect.emitEffect();
      return result;
    }
  });
}

export {
  ref,
  reactive,
  watchEffect
}
```

## 使用示例

`setup` 函数内部**创建响应式数据**

`render` 函数**生成对应的 `DOM` 元素**

`createApp` 函数**收集依赖，挂载应用**

```js
import { watchEffect } from './reactivity.js';
// 模拟 createApp
export const createApp = (rootComponent) => {
  return {
    mount(query) {
      const ctx = rootComponent.setup();
      let fragment;
      const root = document.querySelector(query);

      watchEffect(() => {
        root.innerHTML = '';
        fragment = rootComponent.render(ctx);
        root.appendChild(fragment);
      });
    }
  }
}
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div id="app"></div>
  <script type="module">
    import { ref, reactive } from './reactivity.js';
    import { createApp } from './vue.js'
    const App = {
      render(ctx) {
        const div = document.createElement('div');
        div.innerText = ctx.state.count;
        return div;
      },
      setup() {
        let state = reactive({ count: 0 });
        // 创建 每秒钟加一的响应式数据
        setInterval(() => state.count++, 1000)
        return { state };
      }
    }
    createApp(App).mount('#app');
  </script>
</body>
</html>
```
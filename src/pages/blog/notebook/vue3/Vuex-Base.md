---
title: Vuex—01.核心概念
description: Vuex—01.核心概念
image: /img/vue.jpeg
date: 2021-07-20 09:13:07
---

[[toc]]

## State

状态树的状态**全局唯一**

### mapState 辅助函数

```js
import { mapState } from 'vuex';
const { count, dbCount } = mapState({
  count: (state) => state.count, // 效果同 count: 'count' 或者 mapState(['count'])
  dbCount: (state) => state.count * 2
});
// count => store.state.count
```

## Getter

直接获取

参数 `(state, getters, rootState, rootGetters)` 

相当于 store 的**计算属性**

```js
import { createStore } from 'vuex';
const store = createStore({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    	doneTodos: (state, _getters) => state.todos.filter(todo => todo.done),
    	getById: (state) => (id) => state.todos.find((item) => item.id === id)
    }
  }
});
// store.getters.doneTodos
// store.getters.getById(1) 每次都会调用，不会缓存结果
```

### mapGetters 辅助函数

```js
import { mapGetters } form 'vuex';
const { doneTodos, getById } = mapGetters(['doneTodos', 'getById']);
// mapGetters({ done: doneTodos, getItem: getById })
```

## Mutation

触发状态更新的函数，**必须为同步**

参数 `(state, payload)`

```js
import { createStore } from 'vuex';
const store = createStore({
  state: {
    count: 1
  },
  mutations: {
    add: (state, args) => {
      state.count += args.num;
    }
  }
});
store.commit('add', { num: 1 });
// store.commit({ type: 'add', num: 1 });
```

### mapMutations 辅助函数

```js
import { mapMutations } from 'vuex';
const { add } = mapMutations(['add']);
// mapMutations({ addNum: 'add' })
```

## Action

执行**异步操作**，**提交 mutation**

```js
import { createStore } from 'vuex';
const store = createStore({
  state: {
    count: 1
  },
  mutations: {
    add: (state, args) => {
      state.count += args.num;
    }
  },
  actions: {
    addAsync: async (context, args) => {
      await sleep(args.time);
      context.commit('add', args);
    }
  }
});
// const { commit, dispatch, state, rootState } = context;
// 3 秒之后再执行 add 操作
store.dispatch('add', { time: 3000, num: 1 });
```

### mapActions 辅助函数

```js
import { mapActions } from 'vuex';
const { addAsync } = mapActions(['addAsync']);
// mapActions({ add: addAsync })
```

## Module

模块化分割

`namespaced: true` 启用命名空间，默认关闭
  - 默认情况下，模块内部的 action、 mutation、getter 会注册到**全局**
  - 开启之后会根据模块注册的路径自动调整命名

[模块全局注册](https://next.vuex.vuejs.org/zh/guide/modules.html#%E5%9C%A8%E5%B8%A6%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4%E7%9A%84%E6%A8%A1%E5%9D%97%E5%86%85%E8%AE%BF%E9%97%AE%E5%85%A8%E5%B1%80%E5%86%85%E5%AE%B9%EF%BC%88global-assets%EF%BC%89)
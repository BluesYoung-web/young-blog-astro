---
title: Vue Router 相关
description: Vue Router 相关
date: 2021-07-23 20:03:07
---

[[toc]]

## 特定规则的一系列路径全部匹配为一个页面

### 前端


```ts
// router.ts
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [{
		path: '/:pathMatch(.*)*',
		component: PageComponent
  }],
});
// `vite.config.ts`
export default {
	base: '/basePath'
};
```

### nginx

```nginx
location ^~/basePath {
	alias 打包之后的前端文件路径;
	index index.html;
	try_files $uri $uri/ /basePath/index.html;
}
```

### 实现效果

匹配路径：
  - `/basePath`
  - `/basePath/9527`
  - `/basePath/9527/12138/***/`
  - `/basePath12138`


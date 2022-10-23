---
title: 实现 LRU 算法
description: 实现 LRU (最近最少使用)算法
date: 2022-03-23 09:49:58
---

[[toc]]

## TDD

<details>
  <summary class="cursor-pointer">
    <div class="inline-flex">
      <div class="i-vscode-icons-file-type-testts mr-1"></div>
      <div>测试代码</div>
    </div>
  </summary>

```ts
import { it, describe, expect } from 'vitest';
import { LRU } from '../LRU';

describe('LRU', () => {
  it('初始化', () => {
    const lru = new LRU();
    expect(lru).toBeDefined();
    expect(lru.maxLength).toBe(3);
    expect(lru.get).toBeInstanceOf(Function);
    expect(lru.put).toBeInstanceOf(Function);
    expect(lru.all).toBeInstanceOf(Function);
    expect(lru.clear).toBeInstanceOf(Function);
  });

  it('基础使用：不存在新增，存在覆盖', () => {
    const lru = new LRU();
    expect(lru.get(1)).toBeUndefined();
    lru.put(1, 1);
    expect(lru.get(1)).toBe(1);
    lru.put(1, 3);
    expect(lru.get(1)).toBe(3);
  });

  it('依次存入，直至溢出', () => {
    const lru = new LRU(5);
    expect(lru.maxLength).toBe(5);
    lru.put(1, 1);
    lru.put(2, 2);
    lru.put(3, 3);
    lru.put(4, 4);
    lru.put(5, 5);
    expect(lru.all().size).toBe(5);
    expect([...lru.all().entries()]).toEqual([
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5]
    ]);

    lru.put(6, 6);
    expect([...lru.all().entries()]).toEqual([
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5],
      [6, 6]
    ]);
  });

  it('删除', () => {
    const lru = new LRU();
    lru.put(1, 1);
    expect(lru.get(1)).toBe(1);
    expect(lru.delete(1)).toBe(true);
    expect(lru.delete(1)).toBe(false);
    expect(lru.get(1)).toBeUndefined();

    lru.put(1, 1);
    lru.put(2, 2);
    lru.put(3, 3);
    lru.put(4, 4);
    lru.put(5, 5);
    expect(lru.all().size).toBe(3);
    expect([...lru.all().entries()]).toEqual([
      [3, 3],
      [4, 4],
      [5, 5]
    ]);

    lru.clear();
    expect(lru.all().size).toBe(0);
  });

  it('加权删除', () => {
    const lru = new LRU();
    lru.put(1, 1);
    lru.put(2, 2);
    lru.put(3, 3);

    lru.get(1);
    lru.put(4, 4);
    expect([...lru.all().entries()]).toEqual([
      [1, 1],
      [3, 3],
      [4, 4]
    ]);

    lru.get(3);
    lru.put(5, 5);
    expect([...lru.all().entries()]).toEqual([
      [1, 1],
      [3, 3],
      [5, 5]
    ]);
  });
});
```
  
</details>

## 具体实现

```ts
export class LRU {
  private pool = new Map();
  private keyMap = new Map<any, number>();
  /**
   * 初始化
   * @param maxLength 默认最大容积为 3
   */
  constructor(public maxLength = 3) {}

  getUnUsedKey() {
    // 过滤已经删除的(权值为 0)
    const entries = [...this.keyMap.entries()].filter((item) => item[1]);
    // 按权值升序排序
    entries.sort((a, b) => a[1] - b[1]);
    // 返回权值最低的键
    return entries[0][0];
  }

  put(key: any, value: any) {
    if (this.pool.size >= this.maxLength) {
      const key = this.getUnUsedKey();
      this.keyMap.set(key, 0);
      this.pool.delete(key);
    }
    const priority = this.keyMap.get(key);
    if (priority) {
      this.keyMap.set(key, priority + 1);
    } else {
      this.keyMap.set(key, 1);
    }
    this.pool.set(key, value);
  }

  get(key: any) {
    const priority = this.keyMap.get(key);
    if (priority) {
      this.keyMap.set(key, priority + 1);
    }
    return this.pool.get(key);
  }

  all() {
    return this.pool;
  }

  delete(key: any) {
    this.keyMap.set(key, 0);
    return this.pool.delete(key);
  }

  clear() {
    this.keyMap.clear();
    this.pool.clear();
  }
}
```
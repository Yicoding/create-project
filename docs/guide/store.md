---
title: 全局状态管理
order: 5
toc: content
group:
  title: 基础
  order: 3
nav:
  title: 指南
  order: 1
---

# 全局状态管理

推荐一款好用的全局状态管理库 [zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)

可参考：

> [谈谈复杂应用的状态管理（上）：为什么是 Zustand](https://juejin.cn/post/7177216308843380797)
>
> [谈谈复杂应用的状态管理（下）：基于 Zustand 的渐进式状态管理实践](https://juejin.cn/post/7182462103297458236)

## 编写 store 文件

```ts | pure
import { create } from 'zustand';

/**
 * 字段
 */
type State = {
  bears: number;
};

/**
 * 方法
 */
type Action = {
  increase: () => void;
  increaseAsync: () => Promise<void>;
};

export type BearState = State & Action;

const stateField = {
  bears: 0,
};

export const useBearStore = create<BearState>()((set, get) => ({
  ...stateField,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
  increaseAsync: async () => {
    set({
      bears: get().bears + 1,
    });
  },
}));

export const { setState } = useBearStore;
```

## 使用 store

```ts | pure
import React from 'react';
import { Button } from 'antd';
import { useBearStore } from '@/store';
import type { BearState } from '@/store';
import './index.less';

const HomeOne = () => {
  const { bears, increase } = useBearStore((state: BearState) => state);
  return (
    <div className="home-one-root">
      {bears} around here...
      <Button onClick={increase}>one up</Button>
    </div>
  );
};

export default HomeOne;
```

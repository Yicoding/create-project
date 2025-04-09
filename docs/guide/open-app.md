---
title: 唤端
order: 3
toc: content
group:
  title: 移动端特有
  order: 4
nav:
  title: 指南
  order: 1
---

# 唤端

统一使用 `landing-open-app` 模块的 [LandingOpenApp](https://yicoding.github.io/landing-open-app) 组件进行站外唤端

## 安装依赖

```bash
yarn add landing-open-app
```

## 使用

```tsx | pure
import React, { useEffect, useState } from 'react';
import { LandingOpenApp } from 'landing-open-app';

export default () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 微信sdk加载成功后触发
    setReady(true);
  }, []);

  return (
    <LandingOpenApp ready={ready}>
      <button>打开App</button>
    </LandingOpenApp>
  );
};
```

[参考文档](https://yicoding.github.io/landing-open-app)
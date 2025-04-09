---
title: Mock 数据
order: 4
toc: content
group:
  title: 基础
  order: 3
nav:
  title: 指南
  order: 1
---

# Mock 数据

前后端分离开发的过程中，刚开始前端和后端就要约定好接口，然后分别进行开发。

在这时候，前端需要模拟接口的请求和响应，以求达到保真开发的目的。而且在调试一些问题时，可以伪造边界数据进行验证。

## 开启 mock

```ts | pure
import { defineConfig } from 'vite';
import { viteMockServe } from 'vite-plugin-mock';

export default defineConfig(() => {
  return {
    plugins: [
      viteMockServe({
        // default
        mockPath: 'mock',
      }),
    ],
  };
});
```

## 加载 mock 文件

利用 ES2020 中引入的一个新功能，动态导入多个模块

```ts | pure
/**
 * 使用Vite的import.meta.glob API
 * 注意：
 * 1. 在TypeScript中，import.meta.glob在运行时可用，但在类型检查时会被识别为不存在
 * 2. 因此，需要使用类型断言来处理
 */
// 使用Vite提供的import.meta.glob API
interface ViteImportMeta extends ImportMeta {
  glob: (pattern: string) => Record<string, () => Promise<any>>;
}

// 使用类型检查和断言
const isViteMeta = (meta: any): meta is ViteImportMeta =>
  typeof meta.glob === 'function';

// 使用类型断言处理导入
const viteImportMeta = isViteMeta(import.meta) ? import.meta : null;
const globModules = viteImportMeta
  ? (viteImportMeta as ViteImportMeta).glob('./**/*.ts')
  : {};

const modules = Object.values(globModules);

export default modules;


```

## mock 文件格式

多个相同前缀的接口可以放在同一个文件内

```ts | pure
// 返回数组，同一个类型的接口可以放在同一个文件中
export default [
  {
    "method": "GET",
    "url": "(.*)/user/info",
    "name": "获取用户信息",
    "response": {
      "code": 0,
      "msg": "success",
      "data": {
        "userId": 1281512111,
        "login": true
      }
    }
  },
];

```

### 支持文件嵌套

```bash
├── mock                        # mock目录
│   ├── webapi                  # mock文件目录
│   │   ├── user.ts
│   ├── index                   # mock数据入口文件
```

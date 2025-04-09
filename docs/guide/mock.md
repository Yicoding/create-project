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
let modules = [];
if (import.meta && import.meta?.glob) {
  modules = import.meta?.glob('./**/*.ts');
}

export default modules.map((o) => o.default);
```

## mock 文件格式

### 导出多个接口

多个相同前缀的接口可以放在同一个文件内

```ts | pure
// 返回数组，同一个类型的接口可以放在同一个文件中
export default [
  {
    url: '/user/login',
    method: 'get',
    response: ({ query }) => {
      return {
        ret: 0,
        msg: 'success',
        data: 'ok',
      };
    },
  },
  {
    url: '/user/info',
    method: 'post',
    timeout: 2000,
    response: {
      ret: 0,
      msg: 'success',
      data: {
        name: 'vben',
      },
    },
  },
];
```

### 导出单个接口

```ts | pure
export default {
  url: '/api/text',
  method: 'post',
  rawResponse: async (req, res) => {
    let reqbody = '';
    await new Promise((resolve) => {
      req.on('data', (chunk) => {
        reqbody += chunk;
      });
      req.on('end', () => resolve(undefined));
    });
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 200;
    res.end(`hello, ${reqbody}`);
  },
};
```

### 支持文件嵌套

```bash
├── mock                        # mock目录
│   ├── webapi                  # mock文件目录
│   ├── ├── api                 # mock文件目录
│   ├── ├── ├── text.ts
│   │   ├── login.ts
│   ├── index                   # mock数据入口文件
```

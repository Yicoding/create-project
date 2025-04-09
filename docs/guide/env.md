---
title: 环境变量
order: 1
toc: content
group:
  title: 配置
  order: 2
nav:
  title: 指南
  order: 1
---

# 环境变量

## .env 文件

```bash
.env                            # 公共配置
.env.development                # 本地开发环境配置文件
.env.mock                       # 本地mock环境配置文件
.env.test                       # 测试环境配置文件
.env.production                 # 正式环境配置文件
```

## 默认环境变量

### VITE_REACT_APP_NAME

当前项目的 `package name`

### VITE_BASE_ROUTE_NAME

线上路由的 `basename`，例如：部署的项目统一放在 `/gatekeeper/项目名` 下

### MODE（编译环境）

| 编译环境    | 含义         |
| :---------- | :----------- |
| development | 本地开发环境 |
| mock        | mock 环境    |
| test        | 测试环境     |
| production  | 正式环境     |

### VITE_STATIC_ORIGIN（云效静态资源前缀）

| 编译环境    | 对应的值                            |
| :---------- | :---------------------------------- |
| development | 本地开发环境无需配置                |
| mock        | mock 环境无需配置                   |
| test        | `https://static2.test.xxx.com` |
| production  | `https://s1.xxcdn.com`              |

### VITE_PUBLIC_URL

静态资源存放地址：`$VITE_STATIC_ORIGIN/yx/$npm_package_name/dist`

### VITE_ORIGIN（接口请求域名）

可根据具体项目进行配置，也可配置多个

| 编译环境    | 对应的值                                   |
| :---------- | :----------------------------------------- |
| development | `/proxy_url`：本地开发可能需要配置跨域 |
| mock        | mock 环境无需配置                          |
| test        | `https://m.test.xxx.com`  |
| production  | `https://m.xxx.com`                  |

## 定义环境变量 ts 类型

`vite-env.d.ts` 文件

```ts | pure
/// <reference types="vite/client" />

/**
 * 编译环境
 */
declare type BuildEnv = 'development' | 'mock' | 'test' | 'production';

/**
 * 多编译环境变量约束
 */
declare type MultiEnv<T = string> = Record<BuildEnv, T>;

interface ImportMetaEnv {
  /** 云效basename */
  readonly VITE_BASE_ROUTE_NAME: string;
  /** 静态资源 url */
  readonly VITE_PUBLIC_URL: string;
  /** 接口请求域名 */
  readonly VITE_ORIGIN: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## 注入环境变量

使用 `--mode` 注入对应的文件

```js
"scripts": {
  "dev": "vite --mode development"
},
```

直接注入环境变量：

```js
"scripts": {
  "build-analyze": "VITE_BUILD_ANALYZER=true yarn build-prod"
},
```

## 使用环境变量

### 在 vite 配置中使用

使用 vite 导出的 `loadEnv` 函数来加载指定的 `.env` 文件。

```js
export default defineConfig(({ mode, command }: ConfigEnv) => {
  const {
    VITE_PUBLIC_URL = '/',
    VITE_BUILD_ANALYZER
  } = loadEnv(mode, process.cwd());
});
```

### 在代码中使用

```js
const { MODE } = import.meta.env;
```

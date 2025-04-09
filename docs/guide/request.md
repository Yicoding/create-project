---
title: 接口请求
order: 2
toc: content
group:
  title: 基础
  order: 3
nav:
  title: 指南
  order: 1
---

# 接口请求

## 创建实例

```ts | pure
// 接口请求超时时长，可根据需要自行修改
const AXIOS_TIME_OUT = 50 * 1000;

const service: AxiosInstance = axios.create({
  // 如果整个项目的请求域名只有一个，可以设置统一的baseURL
  // baseURL: "",
  timeout: AXIOS_TIME_OUT,
});
```

## 请求拦截

```ts | pure
// 全局请求加时间戳防止缓存
service.interceptors.request.use((config) => {
  // 设置超时时长
  config.timeout = AXIOS_TIME_OUT;
  if (config.method && config.method.toUpperCase() === 'GET') {
    config.params = {
      _ts: Date.now() + `00${getRandomInt(0, 100)}`.slice(-3),
      ...config.params,
    };
  }
  return config;
});
```

## 响应拦截

```ts | pure
service.interceptors.response.use(
  (response: AxiosResponse<ResponseConstructor>) => {
    const { ret, data, msg } = response.data;
    if (ret === 0) {
      // 返回的是response.data.data(可根据项目场景自行修改)
      return data;
    }
    return Promise.reject(msg);
  },
  (error: AxiosError) => {
    return Promise.reject(error.response);
  },
);
```

## 封装 axios

由于响应拦截时，返回的是 response.data.data，因此需要用 ts 改写响应类型防止 axios 的 ts 类型报错

```ts | pure
/* 导出封装的请求方法 */
export const http = {
  // Promise<T>: 告诉ts响应的类型
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config);
  },

  post<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return service.post(url, data, config);
  },

  put<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return service.put(url, data, config);
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config);
  },
};
```

## 配置 api 列表

```ts | pure
import { http } from '@/services/request';

const { VITE_ORIGIN } = import.meta.env;

export function queryUrl() {
  return http.get(`${VITE_ORIGIN}/query/url`);
}
```

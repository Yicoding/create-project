---
title: 路由配置
order: 1
toc: content
group:
  title: 基础
  order: 3
nav:
  title: 指南
  order: 1
---

# 路由配置

## 配置项

```ts | pure
/*
 * react-router-dom 官方文档
 * https://reactrouter.com/en/main
 */
import Suspenselazy from '@/components/Suspenselazy';
import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom';


const Index = Suspenselazy(
  () => import(/* webpackChunkName: "index" */ '@/pages/Index')
);
const Home = Suspenselazy(
  () => import(/* webpackChunkName: "home" */ '@/pages/Home')
);

const Detail = Suspenselazy(
  () => import(/* webpackChunkName: "detail" */ '@/pages/Home/Detail')
);

const Empty = Suspenselazy(
  () => import(/* webpackChunkName: "empty" */ '@/pages/Empty')
);

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="index" /> // 重定向
  },
  {
    path: 'index',
    element: Index
  },
  {
    path: 'home',
    element: Home
  },
  {
    path: 'home/detail',
    element: Detail
  },
  // 未匹配到页面
  {
    path: '*',
    element: Empty
  }
];

const { MODE, VITE_BASE_ROUTE_NAME } = import.meta.env;

const localMode = ['mock', 'development'];

const router = createBrowserRouter(routes, {
  // 区分本地和线上
  basename: localMode.includes(MODE) ? '/' : VITE_BASE_ROUTE_NAME
});

export default router;
```

:::info{title=注意事项}
需要根据项目自行更改 basename
:::

## 使用

```tsx | pure
import router from '@/router';
import { RouterProvider } from 'react-router-dom';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

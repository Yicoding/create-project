---
title: vite配置
order: 2
toc: content
group:
  title: 配置
  order: 2
nav:
  title: 指南
  order: 1
---

# vite 配置

项目根目录下 `vite.config.ts`文件，详细配置可参考 [vite 官方文档](https://cn.vitejs.dev/)

## 路径别名

```js
{
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      src: resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  }
}
```

同时 `tsconfig.json` 文件也需要进行配置

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"],
      "src/*": ["src/*"],
      "@assets": ["src/assets"]
    }
  }
}
```

## 配置代理

```js
proxy: {
  '/proxy_url': {
    target: 'https://m.test.xxx.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/proxy_url/, '')
  }
}
```

## 使用 mock

```js
import { viteMockServe } from 'vite-plugin-mock';

export default defineConfig({
  plugins: [
    viteMockServe({
      // default
      mockPath: 'mock',
    }),
  ],
});
```

## 构建产物分析

```js
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      // 打包完成后自动打开浏览器，显示产物体积报告
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
```

## 语法降级与 Polyfill

```js
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    legacy({
      // 设置目标浏览器，browserslist 配置语法
      targets: ['ie >= 11'],
    }),
  ],
});
```

## 使用 PostCSS

```js
import autoprefixer from 'autoprefixer';

export default defineConfig({
  css: {
    // 进行 PostCSS 配置
    postcss: {
      plugins: [autoprefixer()],
    },
  },
});
```

## 完整配置

```ts | pure
import { defineConfig, loadEnv } from 'vite';
import type { ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import autoprefixer from 'autoprefixer';
import { visualizer } from 'rollup-plugin-visualizer';
import { viteMockServe } from 'vite-plugin-mock';
import { manualChunksPlugin } from 'vite-plugin-webpackchunkname';
import checker from 'vite-plugin-checker';
import { moveScriptsToBody } from './plugins/moveScriptsToBody';

// 引入 path 包注意两点:
// 1. 为避免类型报错，你需要通过 `pnpm i @types/node -D` 安装类型
// 2. tsconfig.node.json 中设置 `allowSyntheticDefaultImports: true`，以允许下面的 default 导入方式
import { resolve } from 'path';

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig(({ mode, command }: ConfigEnv): any => {
  const {
    VITE_PUBLIC_URL = '/',
    VITE_BUILD_ANALYZER
  } = loadEnv(mode, process.cwd());

  return {
    // 静态资源路径
    base: command === 'build' ? VITE_PUBLIC_URL : '/',
    resolve: {
      // 设置路径别名
      alias: {
        '@': resolve(__dirname, 'src'),
        src: resolve(__dirname, 'src'),
        '@assets': resolve(__dirname, 'src/assets')
      }
    },
    css: {
      // 进行 PostCSS 配置
      postcss: {
        plugins: [autoprefixer()]
      }
    },
    // 本地开发配置
    server: {
      host: true,
      // host: 'dev.test.xxx.com',
      port: 8080,
      open: true,
      // 配置代理，处理本地开发跨域问题
      proxy: {
        '/proxy_url': {
          target: 'https://m.test.xxx.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy_url/, '')
        }
      }
    },
    // 构建配置
    build: {
      // 生成sourcemap文件
      sourcemap: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          // 生产环境删除console.log
          pure_funcs: mode === 'production' ? ['console.log'] : []
        }
      },
    },
    plugins: [
      checker({
        typescript: true
      }),
      react({
        jsxImportSource: "@emotion/react",
      }),
      // 打包后的产物自定义命名
      manualChunksPlugin(),
      // 语法降级与Polyfill
      legacy({
        // 设置目标浏览器，browserslist 配置语法
        targets: [
          'iOS >= 9',
          'Android >= 4.4',
          'last 2 versions',
          '> 0.2%',
          'not dead'
        ],
      }),
      // 自定义插件，将脚本移动到body底部
      moveScriptsToBody(),
      // mock服务
      mode === 'mock' &&
      viteMockServe({
        // default
        mockPath: 'mock'
      }),
      // 构建产物分析
      VITE_BUILD_ANALYZER &&
      visualizer({
        // 打包完成后自动打开浏览器，显示产物体积报告
        open: true,
        gzipSize: true,
        brotliSize: true
      }),
    ]
  };
});
```

---
title: 目录结构
order: 2
toc: content
group:
  title: 初始化
  order: 1
nav:
  title: 指南
  order: 1
---

# 目录结构

创建后的项目目录结构如下：

<Tree>
  <ul>
    <li>
      mock
      <small>数据mock目录</small>
    </li>
    <li>
      src
      <ul>
        <li>
          components
          <small>组件</small>
          <ul>
            <li>
              Suspenselazy.tsx
              <small>路由懒加载组件</small>
            </li>
          </ul>
        </li>
        <li>
          router
          <ul>
            <li>
              index.tsx
              <small>路由配置</small>
            </li>
          </ul>
        </li>
        <li>
          services
          <ul>
            <li>
              index.tsx
              <small>接口请求api</small>
            </li>
            <li>
              request.ts
              <small>axios封装</small>
            </li>
            <li>
              types.ts
              <small>ts类型定义</small>
            </li>
          </ul>
        </li>
        <li>
          store
          <small>全局状态管理</small>
          <ul>
            <li>
              index.tsx
              <small>store实例</small>
            </li>
          </ul>
        </li>
        <li>
          utils
          <small>工具库目录</small>
          <ul>
            <li>
              env.ts
              <small>环境</small>
            </li>
            <li>
              tools.ts
              <small>公共方法</small>
            </li>
          </ul>
        </li>
        <li>
          pages
          <small>页面存放目录</small>
        </li>
        <li>
          App.init.ts
          <small>Sentry + Apm</small>
        </li>
        <li>
          App.tsx
          <small>react入口文件</small>
        </li>
        <li>
          main.tsx
          <small>项目入口文件</small>
        </li>
        <li>
          vite-env.d.ts
          <small>vite类型声明</small>
        </li>
      </ul>
    </li>
    <li>
      .commitlintrc.cjs
      <small>CommitLint配置文件</small>
    </li>
    <li>
      .env
      <small>公共环境配置文件</small>
    </li>
    <li>
      .env.development
      <small>本地环境配置文件</small>
    </li>
    <li>
      .env.mock
      <small>本地mock环境配置文件</small>
    </li>
    <li>
      .env.production
      <small>正式环境配置文件</small>
    </li>
    <li>
      .env.test
      <small>测试环境配置文件</small>
    </li>
    <li>
      .eslintrc.cjs
      <small>eslint规则配置文件</small>
    </li>
    <li>
      .eslintignore
      <small>eslint忽略文件配置</small>
    </li>
    <li> .gitignore</li>
    <li>
      .nvmrc
      <small>项目nvm默认设置</small>
    </li>
    <li>
      .prettierignore
      <small>prettier忽略文件配置</small>
    </li>
    <li>
      .prettierrc
      <small>prettier规则配置文件</small>
    </li>
    <li> eslint.config.js</li>
    <li> index.html</li>
    <li> package.json</li>
    <li> README.md</li>
    <li>
      tsconfig.json
      <small>ts配置文件</small>
    </li>
    <li>
      tsconfig.node.json
      <small>node 环境的 TypeScript 配置文件</small>
    </li>
    <li>
      vite.config.ts
      <small>vite配置文件</small>
    </li>
  </ul>
</Tree>

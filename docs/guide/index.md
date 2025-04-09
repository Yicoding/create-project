---
title: 快速上手
order: 1
toc: content
group:
  title: 初始化
  order: 1
nav:
  title: 指南
  order: 1
---

# 快速上手

## 环境准备

确保正确安装 [Node.js](https://nodejs.org/en) 且版本为 `18+` or `20+`。（注意：云效发布的 node 版本也需要选择 `18+` or `20+`）

```bash
$ node -v
v18.13.0
```

![](images/node-version.png)

## 脚手架

```bash
# 进入需要创建项目的目录
# 脚手架创建项目，选择你需要的模板
$ npx -p @enode/create-project create-project

# 输入项目名称
$ ? 请输入项目英文名称（小写字母或数字、中划线连接）： vite-mobile

$ ? 请选择一个模式： (Use arrow keys)
$ ❯ mobile   # 移动端模版
$   pc       # pc端模版

# 创建完成后安装依赖
$ yarn
```

![](images/create.png)

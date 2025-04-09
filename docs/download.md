---
title: 下载模版
order: 1
toc: content
nav:
  title: 下载模版
  order: 2
---

# 下载模版

百分百还原 template 内容，0 改写，极大的降低了心智负担，规避了 create-react-app 下载模版的痛点

下载模版：

```bash
npx -p @xmly/create-project create-project download [模板名称]
```

`or`

支持输入项目名称：

```bash
npx -p @xmly/create-project create-project download [模板名称] [项目名称]
```

支持下载模版后替换内容：

```bash
npx -p @xmly/create-project create-project download [模板名称] -r [旧内容] [新内容]
```

## 要求的模版目录文件

下载的 template 模版内容必须存在以下目录和文件

<Tree>
  <ul>
    <li>
      template
      <small>模板的文件目录</small>
      <ul>
        <li>gitignore <small>注意：gitignore文件没有句号</small></li>
        <li> ... <small>其他文件</small></li>
      </ul>
    </li>
    <li>package.json</li>
    <li>README.md <small>可选</small></li>
    <li>template.json</li>
  </ul>
</Tree>

## 使用 create-react-app (CRA)下载 cra-template 模板

```bash
yarn create react-app [项目名称] --template [模版名称]
```

:::warning{title=问题}
使用 create-react-app (CRA)下载 cra-template 模板时，会改写 `tsconfig.json` 中的配置，导致不符合预期，例如：

会删除 `tsconfig.json` 中的路径别名配置
:::

:::warning{title=下载缓慢}
下载模版时，同时会安装模版中的所有依赖，导致等待时间较长。安装完成后，才能看到项目的完整目录
:::

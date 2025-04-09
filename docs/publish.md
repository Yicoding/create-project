---
title: 发布模版
order: 1
toc: content
demo:
  tocDepth: 4
nav:
  title: 发布模版
  order: 3
---

# 发布模版

可基于现有项目快速生成模版，项目复用不再成为难事

## 命令

`先进入项目目录，再执行以下命令：`

```bash
npx -p @xmly/create-project create-project publish
```

执行命令后会自动将模版发布到内网 npm 中（前提是设置了喜马 xnpm 源）


执行命令后，会在当前项目创建 `dist-publish` 目录用于发布模版

## 目录结构

<Tree>
  <ul>
    <li>
    dist-publish <small>模板的发布目录</small>
      <ul>
        <li>
          template <small>模板的文件目录</small>
          <ul>
            <li>gitignore <small>注意：gitignore文件没有句号</small></li>
            <li> ... <small>其他文件</small></li>
          </ul>
        </li>
        <li>package.json</li>
        <li>README.md</li>
        <li>template.json</li>
      </ul> 
    </li>
  </ul> 
</Tree>




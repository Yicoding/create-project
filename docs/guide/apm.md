---
title: 配置云效参数
order: 7
toc: content
group:
  title: 基础
  order: 3
nav:
  title: 指南
  order: 1
---

# 配置云效参数

云效发布时，需要配置 `Sentry` 和 `apm`

## 配置 Sentry

```ts | pure
import * as Sentry from '@sentry/react';
import { name as projectName, version } from '../package.json';
const { MODE } = import.meta.env;

// Sentry Project ☞ Client Keys DSN
// https://websentry.ximalaya.com/settings/xmly/projects/
// 一般在创建云效应用时，会看到自动创建 Sentry Project，可以看到 Client Keys DSN（否则，从上方链接去查找，若未创建可手动创建）
const CLIENT_KEY = '';

/**
 * Sentry
 *  - test/production 均上报，方便提早发现问题。
 *  - Sentry React: https://docs.sentry.io/platforms/javascript/guides/react/
 */
Sentry.init({
  dsn: CLIENT_KEY, // Client Keys DSN
  environment: MODE, // 区分上报环境
  sampleRate: 0.1,
  release: `${projectName}@${version}`,
});
```

## 配置 apm

```ts | pure
import { apm } from '@xmly/xmrep';
import { name as projectName } from '../package.json';

// Sentry Project ☞ Client Keys DSN
// https://websentry.ximalaya.com/settings/xmly/projects/
// 一般在创建云效应用时，会看到自动创建 Sentry Project，可以看到 Client Keys DSN（否则，从上方链接去查找，若未创建可手动创建）
const CLIENT_KEY = '';

/**
 * APM 性能监控
 *  - https://thoughts.ximalaya.com/workspaces/5d679697f30f8700018aa32f/docs/5eddded3f4c0000001da3558
 */
apm.init({
  name: projectName, // 云效项目名（通常应当与项目名称相同，如不一致，需修改）
});
```

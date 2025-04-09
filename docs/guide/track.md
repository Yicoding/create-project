---
title: 埋点
order: 6
toc: content
group:
  title: 基础
  order: 3
nav:
  title: 指南
  order: 1
---

# 埋点

## 初始化埋点

在 `src/App.init.ts` 文件中初始化埋点方法

```ts | pure
import { apm, start, ubt } from '@xmly/xmrep';
import sniffing from '@xmly/sniffing-sdk';
import { trackerMap } from '@/utils/xlog';

// 初始化埋点，请替换为正确的businessId
sniffing.init(trackerMap, {
  autoExpo: true,
  xmrep: {
    start,
    ubt, // 注意@xmly/xmrep版本2.4.2以上
    params: {
      b: 'xxx' // 其中bid为初始代码中的b
    }
  }
});
```

## 编写埋点

在 `src/utils/xlog.ts` 文件中

```ts | pure
import { ubt } from '@xmly/xmrep';

const xmRequestId = Math.random().toString().slice(-8);

// 常规埋点
const xLog = {
  homePageShow: () => {
    ubt.pageView(0, 'xxx', {
      currPage: 'xxx',
      xmRequestId
    });
  },
};

// 控件曝光（出现在视口内）
export const trackerMap = {
  // 埋点id
  'xxx': () => {
    ubt.event(0, 'slipPage', {
      currPage: 'xxx',
      xmRequestId
      // ...其他埋点信息
    });
  },
};

export default xLog;
```

## 使用埋点

### 控件曝光埋点

```html
<div data-ubt-expo="3332" data-ubt-params={JSON.stringify({id: 'xxx'})}>  
  曝光埋点3332
</div>
```

### 常规埋点

```tsx | pure
import xLog from '@/utils/xlog';

useEffect(() => {
  xLog.homePageShow();
}, [])
```
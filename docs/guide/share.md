---
title: 分享
order: 2
toc: content
group:
  title: 移动端特有
  order: 4
nav:
  title: 指南
  order: 1
---

# 分享

在 `src/utils/share` 目录中，提供了站内外分享调用方法

## 调用分享方法

```ts
function wechatShare(params: ShareParams): void {
  window?.wx?.updateAppMessageShareData?.(params);
  window?.wx?.updateTimelineShareData?.(params);
}

export function share(params: ShareParams) {
  const { title, link, callBack, isClick = true } = params;
  // 站内
  if (platformType === 'iting') {
    hybridShell('util.share', {
      ...params,
      channel: ['weixin', 'weixinGroup', 'qq', 'tSina', 'url'],
      params: {
        // 埋点参数
        shareTemplate: '103',
        ubt_currPage: title,
        ubt_contentType: '',
        ubt_contentId: '',
        ubt_url: link
      },
      success() {
        callBack?.();
      }
    });
  } else {
    platformType === 'wechat' && wechatShare(params);
    // 如果是click触发
    if (isClick) {
      // 创建一个新的 div 元素
      const portalContainer: HTMLDivElement = document.createElement('div');
      // 将这个新创建的 div 添加到 body 中
      document.body.appendChild(portalContainer);

      const root: Root = createRoot(portalContainer);

      const exit = (): void => {
        root.unmount();
        portalContainer.remove();
      };
      root.render(
        <div className={s.root}>
          <div className={s.mask} onClick={exit} />
          {platformType === 'wechat' ||
            platformType === 'weibo' ||
            platformType === 'qq' ? (
            <div onClick={exit} className={s.guidanceBox}>
              <img
                src={guideImg}
                alt="点击右上角去分享"
                onClick={exit}
              />
              <div>点击右上角分享给好友</div>
            </div>
          ) : (
            <div className={s.panel}>
              <img
                onClick={exit}
                className={s.close}
                src="https://imagev2.xmcdn.com/group48/M01/E3/64/wKgKlVt82uKyOwAXAAABk5iKH2k391.png!op_type=9&strip=1&quality=0&unlimited=1"
              />
              <div className={s.title}>即刻分享</div>
              <button
                className={s.link}
                onClick={(): void => {
                  exit();
                  window.setTimeout(() => {
                    copy({ text: params.link });
                  }, 100);
                }}
              >
                <i className={s.icon} />
              </button>
              <div className={s.text}>复制链接</div>
            </div>
          )}
        </div>
      );
    }
  }
}
```

## 设置右上角分享

```ts
export function setShareMenu({
  canShare,
  params,
}: {
  canShare: boolean;
  params?: ShareParams
}) {
  // 不可分享
  if (!canShare) {
    // 站内
    if (platformType === 'iting') {
      // 清除右上角按钮
      return hybridShell('nav.setMenu', {
        items: []
      });
    }
    // 微信
    if (platformType === 'wechat') {
      // 隐藏所有非基础按钮
      window.wx.hideAllNonBaseMenuItem();
    }
  } else {
    // 设置右上角分享
    if (params) {
      if (platformType === 'iting') {
        return hybridShell('nav.setMenu', {
          items: [{ id: '1', icon: 'share', text: '分享' }],
          success(): void {
            share(params)
          },
        });
      }
      if (platformType === 'wechat') {
        share(Object.assign(params, {
          isClick: false
        }))
      }
    }
  }
}
```

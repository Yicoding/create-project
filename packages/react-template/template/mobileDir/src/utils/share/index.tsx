import { createRoot, Root } from 'react-dom/client';

import { platformType } from '@/utils/tools';
import { hybridShell } from '@/utils/hybrid';
import { copy } from '@/utils/copy';
import type { ShareParams } from '@/utils/types'

import guideImg from '@/assets/images/guide.png'

import s from './style.module.less'

function wechatShare(params: ShareParams): void {
  window?.wx?.updateAppMessageShareData?.(params);
  window?.wx?.updateTimelineShareData?.(params);
}

// 分享弹窗
export function share(params: ShareParams) {
  const { callBack, isClick = true } = params;
  // 站内
  if (platformType === 'xxxxx') {
    hybridShell('xxx.share', {
      ...params,
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
                src="https://imagev2.xxcdn.com/group48/M01/E3/64/wKgKlVt82uKyOwAXAAABk5iKH2k391.png!op_type=9&strip=1&quality=0&unlimited=1"
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

/** 设置右上角分享 */
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
    if (platformType === 'xxxxx') {
      // 清除右上角按钮
      hybridShell('xxx.setMenu', {
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
      if (platformType === 'xxxxx') {
        return hybridShell('xxx.setMenu', {
          items: [{ icon: 'share', text: '分享' }],
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

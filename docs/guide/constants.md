---
title: 常用变量
order: 4
toc: content
group:
  title: 移动端特有
  order: 4
nav:
  title: 指南
  order: 1
---

# 常用变量

在 `src/utils/constants` 文件中

```ts
import { isProd } from '@/utils/env';
import { UserInfo } from '@/utils/types';

const env = isProd ? '.' : '.test.';

/**喜马jssdk */
export const XIMA_JSSDK_SCRIPT = '//s1.xmcdn.com/yx/jssdk/1.1.1/build/ly.js';
// xima-jssdk-appid
// 需自行申请（申请地址：https://ops.ximalaya.com/gatekeeper/lego/page/5fd730ffefec5c41c33f59fe/5fd73182132c4ec5392fe16e）
export const XIMA_JSSDK_APPID = 'xxx';
// xima-sdk-api列表
export const XIMA_JSSDK_APIS = [
  'account.getUserInfo',
  'account.login',
  'util.openUrl',
  'util.share',
  'nav.setMenu',
];
/**喜马sdk */

/** 微信jssdk */
export const WECHAT_JSSDK_SCRIPT = '//res.wx.qq.com/open/js/jweixin-1.6.0.js';
export const WECHAT_JSSDK_APIS = [
  'updateAppMessageShareData',
  'updateTimelineShareData',
  'hideAllNonBaseMenuItem'
];
export const WECHAT_OPENTAGLIST = ['wx-open-launch-app'];
// 站外唤端CID(需自行申请)
export const CID = 'xxx';
// 微信开放标签appid
export const appid = 'wxb9371ecb5f0f05b1';
/** 微信jssdk */

/** 用户信息相关 */
const userExtraInfo = {
  nickName: '',
  imgUrl:
    'https://imagev2.xmcdn.com/group63/M06/94/66/wKgMcl0lkjvDyDg-AAAAdAw-8b8622.png!op_type=9&strip=1&quality=0&unlimited=1'
}

// 未调用登录接口前的默认用户信息
export const defaultUserInfo: UserInfo = {
  ...userExtraInfo,
  // -1（未发送请求）；0（请求返回未登录）；> 0（请求返回已登录）
  uid: -1,
  isLogin: false,
};

// 未登录用户信息
export const UNLOGIN_USER = {
  ...userExtraInfo,
  // -1（未发送请求）；0（请求返回未登录）；> 0（请求返回已登录）
  uid: 0,
  isLogin: false
};
/** 用户信息相关 */

// 主站域名
export const M_ORIGIN = `https://m${env}ximalaya.com`;
// h5登录页域名
export const PASSPORT_ORIGIN = `https://passport${env}ximalaya.com`;


// 接口失败提示语
export const FAIL_MESSAGE = '你们太热情了';
```
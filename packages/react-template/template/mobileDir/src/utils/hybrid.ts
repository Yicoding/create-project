import { UserInfo } from '@/utils/types';
import { platformType } from '@/utils/tools'
import {
  XIMA_JSSDK_APPID,
  XXX_JSSDK_APIS,
  UNLOGIN_USER,
  XXX_JSSDK_SCRIPT,
  WECHAT_JSSDK_SCRIPT,
  WECHAT_JSSDK_APIS,
  WECHAT_OPENTAGLIST,
  PASSPORT_ORIGIN
} from '@/utils/constants';
import { loadScript } from '@/utils/tools';
import { queryUserInfo, queryWechatJssdk } from '@/services';

// 封装native方法
export const hybridShell = (
  api: string,
  config?: {
    [key: string]: any;
  }
): any => {
  if (window?.xxx?.invokeApp) {
    window.xxx.invokeApp(api, {
      ...(config || {})
    });
  }
};

// 加载jssdk
export const loadJsSdk = async () => {
  // 站内
  if (platformType === 'xxxxx') {
    await loadScript(XXX_JSSDK_SCRIPT);
  } else if (platformType === 'wechat') {
    // 微信
    await loadScript(WECHAT_JSSDK_SCRIPT);
  }
};

// 注册微信sdk
export const registerWechatSdk = async () => {
  if (platformType === 'wechat') {
    // 微信
    const data = await queryWechatJssdk();
    const signature = {
      ...data,
      jsApiList: WECHAT_JSSDK_APIS,
      openTagList: WECHAT_OPENTAGLIST
    };
    window.wx.config(signature);
  }
};

// 注册jssdk
export const registerSdk = async () => {
  await loadJsSdk();
  // 站内
  if (platformType === 'xxxxx') {
    window?.xxx?.config({
      appId: XIMA_JSSDK_APPID,
      apiList: XXX_JSSDK_APIS
    });
  } else if (platformType === 'wechat') {
    // 微信
    await registerWechatSdk();
  }
};

// 微信sdk-ready
export const waitWechatReady = async (cb: () => void) => {
  await registerWechatSdk();
  window?.wx?.ready(() => cb?.());
}
// sdk-ready
export const waitSdkReady = () =>
  new Promise(async (resolve) => {
    await registerSdk();
    if (platformType === 'xxxxx') {
      window?.xxx?.ready(() => resolve(true));
    } else if (platformType === 'wechat') {
      window?.wx?.ready(() => resolve(true));
    } else {
      // 其他浏览器环境跳过
      resolve(true);
    }
  });

/** 登录 */
export function login() {
  // 站内
  if (platformType === 'xxxxx') {
    // 登录完成后，页面会reload
    hybridShell('xxx.login');
  } else {
    window.location.href = `${PASSPORT_ORIGIN}/xxx/login?fromUri=${encodeURIComponent(window.location.href)}`;
  }
}

type ResolveUserInfo = (value?: UserInfo) => void;

// 客户端获取用户信息
const nativeUserInfo = () =>
  new Promise((resolve: ResolveUserInfo) => {
    hybridShell('xxx.getUserInfo', {
      success({ uid, isLogin, nickName, imgUrl }: UserInfo): void {
        if (isLogin) {
          resolve({
            uid,
            isLogin,
            nickName,
            imgUrl
          });
        } else {
          resolve(UNLOGIN_USER);
        }
      },
      fail() {
        resolve(UNLOGIN_USER);
      }
    });
  });

/** 获取用户信息 */
export const getUserInfo = () => {
  return new Promise((resolve: ResolveUserInfo) => {
    if (platformType === 'xxxxx') {
      // 站内
      Promise.all([nativeUserInfo(), queryUserInfo()]).then(
        ([value1, value2]) => {
          resolve(Object.assign({}, value2, value1));
        }
      );
    } else {
      // 站外
      queryUserInfo()
        .then((data) => resolve(data))
        .catch(() => resolve(UNLOGIN_USER));
    }
  });
};

import { UserInfo } from '@/utils/types';
import { platformType } from '@/utils/tools'
import {
  XIMA_JSSDK_APPID,
  XIMA_JSSDK_APIS,
  UNLOGIN_USER,
  XIMA_JSSDK_SCRIPT,
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
  if (window?.ly?.invokeApp) {
    window.ly.invokeApp(api, {
      ...(config || {})
    });
  }
};

// 加载jssdk
export const loadJsSdk = async () => {
  // 站内
  if (platformType === 'iting') {
    await loadScript(XIMA_JSSDK_SCRIPT);
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
  if (platformType === 'iting') {
    window?.ly?.config({
      appId: XIMA_JSSDK_APPID,
      apiList: XIMA_JSSDK_APIS
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
    if (platformType === 'iting') {
      window?.ly?.ready(() => resolve(true));
    } else if (platformType === 'wechat') {
      window?.wx?.ready(() => resolve(true));
    } else {
      // 其他浏览器环境跳过
      resolve(true);
    }
  });

// 站内新开webview
export function openNewWebview(url: string) {
  hybridShell('util.openUrl', { url });
}

/** 登录 */
export function login() {
  // 站内
  if (platformType === 'iting') {
    // 登录完成后，页面会reload
    hybridShell('account.login', {
      halfScreen: false,
      control: false
    });
  } else {
    window.location.href = `${PASSPORT_ORIGIN}/page/m/login?fromUri=${encodeURIComponent(window.location.href)}`;
  }
}

type ResolveUserInfo = (value?: UserInfo) => void;

// 客户端获取用户信息
const nativeUserInfo = () =>
  new Promise((resolve: ResolveUserInfo) => {
    hybridShell('account.getUserInfo', {
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
    if (platformType === 'iting') {
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

---
title: sdk
order: 1
toc: content
group:
  title: 移动端特有
  order: 4
nav:
  title: 指南
  order: 1
---

# sdk

在 `src/utils/hybrid.ts` 文件中，提供了 sdk方法，用于调用客户端能力

## 封装native方法

```ts
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
```

## 加载jssdk

```ts
export const loadJsSdk = async () => {
  // 站内
  if (platformType === 'iting') {
    await loadScript(XXX_JSSDK_SCRIPT);
  } else if (platformType === 'wechat') {
    // 微信
    await loadScript(WECHAT_JSSDK_SCRIPT);
  }
};
```

## 注册微信sdk

```ts
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
```

## 注册xxx-jssdk

```ts
export const registerSdk = async () => {
  await loadJsSdk();
  // 站内
  if (platformType === 'iting') {
    window?.xxx?.config({
      appId: XIMA_JSSDK_APPID,
      apiList: XXX_JSSDK_APIS
    });
  } else if (platformType === 'wechat') {
    // 微信
    await registerWechatSdk();
  }
};
```

## 微信sdk-ready

```ts
export const waitWechatReady = async (cb: () => void) => {
  await registerWechatSdk();
  window?.wx?.ready(() => cb?.());
}
```

## xxx-sdk-ready

```ts
export const waitSdkReady = () =>
  new Promise(async (resolve) => {
    await registerSdk();
    if (platformType === 'iting') {
      window?.xxx?.ready(() => resolve(true));
    } else if (platformType === 'wechat') {
      window?.wx?.ready(() => resolve(true));
    } else {
      // 其他浏览器环境跳过
      resolve(true);
    }
  });
```

## 站内新开webview

```ts
export function openNewWebview(url: string) {
  hybridShell('util.openUrl', { url });
}
```

## 登录

```ts
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
```

## 获取用户信息

```ts


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
```
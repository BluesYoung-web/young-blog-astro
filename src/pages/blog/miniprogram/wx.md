---
title: 微信小程序相关
description: uni-app + 微信小程序
date: 2023-03-05 16:00:00
image: /img/miniprogram-wx.jpeg
---

[[toc]]

## 需要注意的点

### 配置文件

**`project.config.json` 会覆盖 `manifest.json` ！！！**

```json
// project.config.json
{
  "setting": {
    // 用于关闭开发环境下微信小程序的报错
    "ignoreDevUnusedFiles": false
  },
  // 如果小程序需要获取定位信息，则提前配置下面的内容
  "requiredPrivateInfos": [
    "getLocation"
  ],
  "permission": {
    "scope.userLocation": {
      "desc": "此处填写获取定位信息时的提示信息"
    }
  },
}
```

### 通用工具方法

```ts
/**
 * 授权定位
 * 可以监听全局事件，进行对应的处理：
 *    sure_location 通过点击微信官方提示完成定位
 *    enable_location 通过弹窗打开小程序设置，返回完成定位
 */
export const authLocation = async () =>
  new Promise<UniApp.GetLocationSuccess>(async (resolve, reject) => {
    const locate = () =>
      new Promise<UniApp.GetLocationSuccess>((_resolve, _reject) => {
        uni.getLocation({
          type: 'gcj02',
          success: (res) => {
            _resolve(res);
          },
          fail: () => {
            _reject();
          },
        });
      });

    uni.getSetting({
      success: async (conf) => {
        if (conf.authSetting['scope.userLocation']) {
          // 同意过定位授权
          const position = await locate();
          uni.$emit('sure_location');
          resolve(position);
        } else {
          try {
            const position = await locate();
            uni.$emit('sure_location');
            resolve(position);
          } catch (error) {
            showModal({
              title: '获取位置时发生异常，您可点击小程序右上角-设置-允许获取位置',
              confirmText: '去设置',
            })
              .then(() => {
                uni.openSetting({
                  success: async (e) => {
                    if (e.authSetting['scope.userLocation']) {
                      const position = await locate();
                      resolve(position);
                      uni.$emit('enable_location');
                    }
                  },
                });
              })
              .catch(() => null);
          }
        }
      },
    });
  });

/**
 * 获取微信授权码
 */
export const getWxCode = async () =>
  new Promise<string>((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: (res) => {
        if (res.errMsg === 'login:ok') {
          resolve(res.code);
        } else {
          reject('wechat auth fail');
        }
      },
      fail: () => {
        reject('wechat auth fail');
      },
    });
  });

/**
 * 显示弹窗
 * ! 全局一次只展示一个弹窗，其他的往后排
 */
let hasModel = false;
const sleep = (n) => new Promise((resolve) => setTimeout(() => resolve(true), 1e3 * n));
export const showModal = async (options: UniApp.ShowModalOptions) => {
  const { title = '提示', showCancel = true } = options;
  // 循环等待，确保全局只弹出一个弹窗
  while (hasModel) {
    await sleep(0.5);
  }
  return new Promise((resolve, reject) => {
    hasModel = true;
    uni.showModal({
      title,
      showCancel,
      success(res) {
        if (res.confirm) {
          resolve(res);
        } else if (res.cancel) {
          reject(res);
        }
      },
      fail(err) {
        reject(err);
      },
      complete: (res) => {
        options?.complete?.(res);
        hasModel = false;
      },
      ...options,
    });
  });
};

/**
 * 打电话
 */
export const callMobile = async (phoneNumber: string) => {
  await showModal({
    title: '拨打电话',
    content: phoneNumber,
    confirmText: '呼叫',
  });
  uni.makePhoneCall({ phoneNumber });
};
```
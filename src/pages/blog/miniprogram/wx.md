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

/**
 * 获取本机支持的生物认证信息
 */
export const getAuthInfo = async () => {
  return new Promise<UniApp.CheckIsSupportSoterAuthenticationRes['supportMode'] | false>(
    (resolve) => {
      uni.checkIsSupportSoterAuthentication({
        success(res) {
          resolve(res.supportMode);
        },
        fail(err) {
          console.log('🚀 ~ file: auth.ts:234 ~ fail ~ err:', err);
          resolve(false);
        },
      });
    },
  );
};

/**
 * 检查本机是否录入过指纹
 */
export const checkFingerPrint = async () => {
  return new Promise<boolean>((resolve) => {
    uni.checkIsSoterEnrolledInDevice({
      checkAuthMode: 'fingerPrint',
      success: () => resolve(true),
      fail: () => resolve(false),
    });
  });
};

/**
 * 指纹认证
 */
export const fingerPrintAuth = async (signStr: string, authContent = '请验证本机指纹') => {
  return new Promise<boolean>(async (resolve) => {
    const authMethods = await getAuthInfo();
    if (authMethods && authMethods.includes('fingerPrint')) {
      uni.checkIsSupportSoterAuthentication({
        async success(res) {
          if (res.supportMode.includes('fingerPrint') && (await checkFingerPrint())) {
            uni.startSoterAuthentication({
              requestAuthModes: ['fingerPrint'],
              challenge: signStr,
              authContent,
              success(res) {
                console.log('success', res);
                resolve(true);
              },
              fail(err) {
                console.log('fail', err);
                resolve(false);
              },
            });
          } else {
            resolve(false);
          }
        },
        fail(err) {
          console.log('fail', err);
          resolve(false);
        },
      });
    } else {
      resolve(false);
    }
  });
};
```

## 特殊标签

```html
<!-- 退出小程序 -->
<navigator open-type="exit" target="miniProgram">
  <button class="login-button w418rpx h88rpx text-32rpx leading-88rpx text-center">退出小程序</button>
</navigator>

<!-- 获取手机号 -->
<!-- e.target.errMsg === "getPhoneNumber:ok" -->
<!-- e.target.code 交给后端去获取手机号 -->
<button open-type="getPhoneNumber" class="write-button  px-20rpx py-8rpx"
@getphonenumber="getTel">点击获取手机号</button>

<!-- 获取昵称 -->
<!-- 自带微信的敏感词过滤功能 -->
<input class="uni-input w-[calc(100%-190rpx)] relative" v-model="form!.nick" type="nickname" placeholder="请输入昵称" :maxlength="15" />


<!-- 获取头像 -->
<!-- e.detail.avatarUrl 为头像的临时路径，需要上传至服务器 -->
<button open-type="chooseAvatar" @chooseavatar="chooseAvatar" class="!p-0 !m-0 bg-white relative">
  <image :src="form!.avatar" class="w-80rpx h-80rpx rounded-full" />
  <view class="absolute left-0 top-0 w-full h-full rounded-full overflow-hidden">
    <view class="w-full h-30rpx mt-50rpx lh-30rpx w-80rpx bg-black text-center opacity-50">
      <image src="https://zimg.zchd.top/pigtown/editwhite@3x.png" class="w-24rpx h-24rpx opacity-100" />
    </view>
  </view>
</button>
```

## 插件

[基于 uni-app 的快速海报生成工具 l-painter](https://ext.dcloud.net.cn/plugin?id=2389)

[手写签名 tnuiv3p-tn-sign-board](https://vue3.tuniaokj.com/zh-CN/third-component/tn-sign-board.html)

```html
<script lang="ts" setup>
import TnSignBoard from 'tnuiv3p-tn-sign-board/index.vue';
import type { TnSignBoardInstance } from 'tnuiv3p-tn-sign-board';

const signBoardRef = ref<TnSignBoardInstance>();

const emit = defineEmits<{
  (e: 'finish', v: string): void;
}>();

const popup = ref<Popup>();

// 保存签名
const saveSign = async () => {
  const path = await signBoardRef.value!.save(true);
  emit('finish', path);
  console.log("🚀 ~ file: young-sign-board.vue:19 ~ saveSign ~ path:", path);
  clearSign();
  popup.value?.close();
  showSign.value = false;
};

// 清空签名，重新签名
const clearSign = () => {
  signBoardRef.value?.clear();
};
const showSign = ref(false);
const start = () => {
  popup.value?.open();
  showSign.value = true;
};

defineExpose({
  start
});
</script>

<template>
  <uni-popup ref="popup" type="dialog" @touchmove.stop.prevent="" :is-mask-click="false">
    <view v-if="showSign" class="content">
      <view class="demo">
        <TnSignBoard ref="signBoardRef" />
      </view>
      <view class="rotate-90 flex flex-col justify-center items-center pl-40rpx">
        <button class="mb-20rpx" @click="saveSign">保存</button>
        <button @click="clearSign">重新签名</button>
      </view>
    </view>
  </uni-popup>
</template>

<style lang="scss">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30rpx;

  width: 100vw;
  height: 100vh;

  background: #fff;

  .demo {
    position: relative;
    width: 100%;
    height: 72vh;
    border: 1rpx dashed #ccc;
  }

  .save-wrapper {
    position: relative;
    border: 1rpx solid var(--tn-color-gray-disabled);
    height: 360rpx;
  }
}
</style>
```
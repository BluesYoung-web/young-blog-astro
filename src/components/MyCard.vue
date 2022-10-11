<!--
 * @Author: zhangyang
 * @Date: 2022-10-07 18:31:30
 * @LastEditTime: 2022-10-11 09:09:22
 * @Description: 
 * @Description: 个人卡片
-->
<script lang="ts" setup>
import 'uno.css';
import { NConfigProvider, darkTheme, lightTheme, NCard, NImage } from 'naive-ui';
import { NAV, INTRO } from '@/config';
import { theme as th } from '@/utils/useTheme';
import { computed } from 'vue';

const theme = computed(() => th.value === 'dark' ? darkTheme : lightTheme);

const sendMail = () => {
  const a = document.createElement('a');
  a.href = NAV.mail_addr;
  a.click();
};
</script>

<template>
  <div class="main">
    <NConfigProvider :theme="theme">
      <NCard hoverable>
        <div class="container">
          <NImage src="/img/lufei_siwangningshi.jpg" :width="120" class="img" />
          <p class="title">
            {{ INTRO.author }}
          </p>
          <p class="intro">
            {{ INTRO.say }}
          </p>
          <div class="btn" :title="NAV.mail_addr" @click="sendMail">
            <div class="i-mdi-light-email mr-1" />
            <div>{{ NAV.mail }}</div>
          </div>
        </div>
      </NCard>
    </NConfigProvider>
  </div>
</template>

<style lang="scss" scoped>
.main {
  @apply w-80;
  .container {
    @apply flex flex-col justify-center items-center;

    .img {
      will-change: transform;
      @apply rounded-full transform hover:rotate-360 transition duration-1000;
    }

    .title {
      @apply text-lg font-bold my-1;
    }

    .intro {
      @apply text-sm font-thin;
    }

    .btn {
      @apply flex justify-center items-center w-7/8 mt-4 px-4 py-1 rounded inline-block bg-sky-600 text-white cursor-pointer hover:bg-sky-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50;
    }
  }
}
</style>
  
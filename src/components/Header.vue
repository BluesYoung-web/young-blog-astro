<!--
 * @Author: zhangyang
 * @Date: 2022-10-05 16:10:16
 * @LastEditTime: 2022-10-17 16:03:32
 * @Description: 头部导航栏组件
-->
<script lang="ts" setup>
import 'uno.css';
import { ref, watchEffect, toRefs } from 'vue';
import { isClient, useScroll } from '@vueuse/core';
import { NAV } from '@/config';
// import DarkToggle from './DarkToggle.vue';

const { directions, y } = useScroll(isClient ? window : null);
const { top, bottom } = toRefs(directions);

const isScrollUp = ref(false);

watchEffect(() => {
  if (top.value) {
    isScrollUp.value = true;
  } else if (bottom.value || y.value === 0) {
    isScrollUp.value = false;
  }
});

const searchEvent = () => new CustomEvent('young:trigger-search');

const searchDoc = () => {
  document.body.dispatchEvent(searchEvent());
};
</script>

<template>
  <nav class="nav" :class="{ 'up': isScrollUp }">
    <div class="left">
      <a href="/">{{ NAV.title }}</a>
    </div>
    <div class="right">
      <a class="item" title="搜索" @click="searchDoc">
        <div class="i-bi-search" />
        <span>搜索</span>
      </a>

      <a class="item" href="/blogs/1" :title="NAV.doc">
        <div class="i-ic-round-menu-book" />
        <span>{{ NAV.doc }}</span>
      </a>
      <a class="item" href="/about" :title="NAV.love">
        <div class="text-sm i-noto-heart-suit" />
        <span>{{ NAV.love }}</span>
      </a>
      <a class="item" target="_blank" :title="NAV.gitee" :href="NAV.gitee_addr">
        <div class="i-simple-icons-gitee text-sm" />
        <span>{{ NAV.gitee }}</span>
      </a>
      <a class="item" target="_blank" :title="NAV.github" :href="NAV.github_addr">
        <div class="i-ci-github" />
        <span>{{ NAV.github }}</span>
      </a>
      <!-- <DarkToggle class="item" /> -->
    </div>
  </nav>
</template>

<style lang="scss">
.up {
  position: fixed !important;
  @apply bg-white opacity-90 top-0 @light:text-gray-900 dark:bg-gray-500 @dark:text-purple-500;
}
.nav {
  @apply flex w-full font-bold text-sm lg:text-lg py-5 px-8 absolute z-1 transition duration-100 ease-linear;

  .left {
    @apply w-3/5;
  }
  .right {
    @apply w-2/5 flex justify-end text-base font-normal;
    .item {
      @apply flex justify-center items-center ml-3 lg:ml-5 hover:cursor-pointer;
      span {
        @apply hidden lg:inline-block lg:text-base;
      }
    }
  }
}
</style>
  
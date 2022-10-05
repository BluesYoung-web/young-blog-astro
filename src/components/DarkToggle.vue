<!--
 * @Author: zhangyang
 * @Date: 2022-10-05 16:32:00
 * @LastEditTime: 2022-10-05 16:33:03
 * @Description: 
-->
<script setup lang="ts">
import { useColorMode } from '@vueuse/core';

const color = useColorMode();

function toggleDark() {
  color.value = color.value === 'dark' ? 'light' : 'dark';
};
</script>

<template>
  <button class="!outline-none" @click="toggleDark">
    <div class="dark:i-carbon-moon i-carbon-sun" />
  </button>
</template>
  
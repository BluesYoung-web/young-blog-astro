<!--
 * @Author: zhangyang
 * @Date: 2022-10-05 16:32:00
 * @LastEditTime: 2022-10-08 08:48:55
 * @Description: 
-->
<script setup lang="ts">
import { theme } from '../utils/useTheme';

function toggleDark() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
};
</script>

<template>
  <button class="!outline-none" @click="toggleDark">
    <div class="dark:i-carbon-moon i-carbon-sun" />
  </button>
</template>
  
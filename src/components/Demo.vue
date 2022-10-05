<!--
 * @Author: zhangyang
 * @Date: 2022-09-04 17:44:12
 * @LastEditTime: 2022-10-05 10:09:23
 * @Description: 
-->
<script lang="ts" setup>
import { ref } from 'vue';

const hello = ref('hello world from vue demo');
// (async () => {
//   const res = await (await fetch('/apis/hello')).json();
//   hello.value = res.msg;
// })()
</script>

<template>
  <div>
    {{ hello }}
  </div>
</template>
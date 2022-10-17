<!--
 * @Author: zhangyang
 * @Date: 2022-10-17 11:27:59
 * @LastEditTime: 2022-10-17 12:24:22
 * @Description: 
-->
<script lang="ts" setup>
import 'uno.css';
import { NDialog } from 'naive-ui';
import MyDoc from '@/components/MyDoc.vue';
import type { DocTree } from '@/utils/generateDocTree';

type Props = {
  total: number;
  tree: DocTree[];
};
defineProps<Props>();

const hideSearchEvent = () => new CustomEvent('young:hide-search');

const hide = () => {
  document.body.dispatchEvent(hideSearchEvent());
};
</script>
<template>
  <div id="search-popup" class="search hidden">
    <NDialog
      title="文章搜索"
      mask-closable
      type="info"
      class="w-100vw h-100vh"
      @close="hide"
    >
      <MyDoc :total="total" :tree="tree" />
    </NDialog>
  </div>
</template>

<style lang="scss">
.search {
  @apply fixed left-0 top-0 z-999;
}
</style>
<!--
 * @Author: zhangyang
 * @Date: 2022-10-17 11:27:59
 * @LastEditTime: 2022-10-18 09:58:47
 * @Description: 
-->
<script lang="ts" setup>
import 'uno.css';
import { NDialog } from 'naive-ui';
import MyDoc from '@/components/MyDoc.vue';
import type { DocItem, DocTree } from '@/utils/generateDocTree';

type Props = {
  total: number;
  tree: DocTree[];
  list: DocItem[];
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
      class="popup"
      @close="hide"
    >
      <MyDoc :total="total" :tree="tree" :list="list" />
    </NDialog>
  </div>
</template>

<style lang="scss">
.search {
  @apply fixed left-0 top-0 w-100vw h-100vh z-999;
  background-color: rgba(0, 0, 0, .4);
  .popup {
    @apply w-full h-full xl:w-1/3 xl:h-full;
  }
}
</style>
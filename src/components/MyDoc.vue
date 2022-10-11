<!--
 * @Author: zhangyang
 * @Date: 2022-10-07 18:53:34
 * @LastEditTime: 2022-10-11 09:08:29
 * @Description: 文章目录
-->
<script lang="ts" setup>
import 'uno.css';
import { NConfigProvider, darkTheme, lightTheme, NCard, NSpace, NInput, NTree } from 'naive-ui';
import { INTRO } from '@/config';
import { theme as th } from '@/utils/useTheme';
import { computed, ref } from 'vue';
import type { DocTree } from '@/utils/generateDocTree';

type Props = {
  total: number;
  tree: DocTree[];
};
defineProps<Props>();

const theme = computed(() => th.value === 'dark' ? darkTheme : lightTheme);

const pattern = ref('');
const jump = (_: any, [v, ...__]: DocTree[]) => {
  if (v.path) {
    location.href = v.path;
  }
};
</script>

<template>
  <div class="main">
    <NConfigProvider :theme="theme">
      <NCard hoverable>
        <div class="container">
          <p class="title">
            {{ `${INTRO.doc_toc}(${total ?? 0})` }}
          </p>
          <div class="data">
            <NSpace vertical :size="12" class="w-80">
              <NInput v-model:value="pattern" :placeholder="INTRO.search" />
              <NTree
                :pattern="pattern"
                :data="tree || []"
                block-line
                class="max-h-120 overflow-auto"
                @update-selected-keys="jump"
              />
            </NSpace>
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

    .title {
      @apply text-lg font-bold my-1;
    }

    .data {
      @apply flex justify-around w-full my-4;
    }
  }
}
</style>
  
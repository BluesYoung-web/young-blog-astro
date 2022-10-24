<!--
 * @Author: zhangyang
 * @Date: 2022-10-10 08:28:17
 * @LastEditTime: 2022-10-24 09:23:10
 * @Description: 文章列表
-->
<script lang="ts" setup>
import 'uno.css';
import { NConfigProvider, darkTheme, lightTheme, NCard, NImage } from 'naive-ui';
import { theme as th } from '@/utils/useTheme';
import { computed } from 'vue';
import type { DocItem } from '@/utils/generateDocTree';

defineProps<{
  list: DocItem[];
}>();

const theme = computed(() => th.value === 'dark' ? darkTheme : lightTheme);

const jump = (url: string) => {
  location.href = url;
};
</script>

<template>
  <div class="list">
    <NConfigProvider :theme="theme">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="item"
      >
        <NCard
          class="my-4 rounded"
          :title="item.frontmatter.title"
          hoverable
          @click="jump(item.url)"
        >
          <template #cover>
            <div class="flex justify-center">
              <NImage
                :src="item.frontmatter.image ?? '/img/default.jpg'"
                fallback-src="/img/default.jpg"
                object-fit="fill"
                @click.prevent="null"
              />
            </div>
          </template>
          {{ item.frontmatter.description }}
          <template #action>
            <time>{{ item.frontmatter.date.replace('T', ' ').replace('.000Z', '') }}</time>
          </template>
        </NCard>
      </div>
    </NConfigProvider>
  </div>
</template>

<style lang="scss" scoped>
@media (min-width: 1280px) {
  .list {
    width: max(800px, 33vw) !important;
  }
} 
.list {
  @apply w-full mx-auto;
  

  .item {
    @apply not-first:mt-10 hover:cursor-pointer;
  }
}
</style>

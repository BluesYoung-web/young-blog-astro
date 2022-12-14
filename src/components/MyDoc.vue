<!--
 * @Author: zhangyang
 * @Date: 2022-10-07 18:53:34
 * @LastEditTime: 2022-10-24 08:21:59
 * @Description: 文章目录
-->
<script lang="ts" setup>
import 'uno.css';
import { NConfigProvider, darkTheme, lightTheme, NCard, NSpace, NSelect, NTree } from 'naive-ui';
import { INTRO } from '@/config';
import { theme as th } from '@/utils/useTheme';
import { computed, ref } from 'vue';
import type { DocItem, DocTree } from '@/utils/generateDocTree';

type Props = {
  total: number;
  tree: DocTree[];
  list: DocItem[];
};
const props = defineProps<Props>();

const theme = computed(() => th.value === 'dark' ? darkTheme : lightTheme);

const pattern = ref('');
const jump = (_: any, [v, ...__]: DocTree[]) => {
  if (v.path) {
    location.href = v.path;
  }
};

const options = ref<DocItem[]>([]);

const handleSearch = (query: string) => {
  if (!query.length) {
    options.value = [];
  } else {
    options.value = props.list.filter((d) => d.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  }
};

const searchJump = (url: string) => {
  if (url) {
    location.href = url;    
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
              <NTree
                :data="tree || []"
                block-line
                class="max-h-72vh overflow-auto"
                @update-selected-keys="jump"
              />
              <NSelect
                v-model:value="pattern"
                :placeholder="INTRO.search"
                :options="options"
                filterable
                remote
                clearable
                @search="handleSearch"
                @update-value="searchJump"
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
  @apply w-full;
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
  
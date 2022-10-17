/*
 * @Author: zhangyang
 * @Date: 2022-10-05 15:51:07
 * @LastEditTime: 2022-10-17 12:11:44
 * @Description: 回到顶部
 */
import { defineComponent, h } from 'vue';
import { isClient, useScroll, useMediaQuery } from '@vueuse/core';

export default defineComponent({
  props: {
    show: { type: Number, default: 720 },
  },
  setup(props) {
    const isLargeScreen = useMediaQuery('(min-width: 1024px)');

    const scorll = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };
    const { y } = useScroll(isClient ? window : null);

    const searchEvent = () => new CustomEvent('young:trigger-search');

    const searchDoc = () => {
      document.body.dispatchEvent(searchEvent());
    };
    return () => h(
      <>
        {
          y.value > props.show
            ? <div
                class="fixed z-100 right-2 bottom-2 lg:right-10 lg:bottom-10 text-2xl text-gray-400 dark:text-purple-500 hover:cursor-pointer flex flex-col"
              >
                {
                  !isLargeScreen.value && <div
                    class="i-bi-search mb-2"
                    title="搜索"
                    onClick={() => searchDoc()}
                  />
                }
                <div
                  class="i-bi-arrow-up-circle"
                  title="回到顶部"
                  onClick={() => scorll()}  
                />
              </div>
            : !isLargeScreen.value && <div
                class="fixed z-100 right-2 bottom-2 lg:right-10 lg:bottom-10 text-2xl text-gray-400 dark:text-purple-500 hover:cursor-pointer flex flex-col"
              >
                <div
                  class="i-bi-search mb-2"
                  title="搜索"
                  onClick={() => searchDoc()}
                />
              </div>
        }
      </>
    );
  }
});

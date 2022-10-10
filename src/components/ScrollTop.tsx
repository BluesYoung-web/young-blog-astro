/*
 * @Author: zhangyang
 * @Date: 2022-10-05 15:51:07
 * @LastEditTime: 2022-10-10 08:51:30
 * @Description: 回到顶部
 */
import { defineComponent, h } from 'vue';
import { useScroll } from '@vueuse/core';

export default defineComponent({
  props: {
    show: { type: Number, default: 720 },
  },
  setup(props) {
    const scorll = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };
    const { y } = useScroll(window);

    return () => h(
      <>
        {
          y.value > props.show
            ? <div
                class="fixed z-100 right-2 bottom-2 lg:right-10 lg:bottom-10 text-2xl text-gray-400 dark:text-purple-500 hover:cursor-pointer"
                title="回到顶部"
                onClick={() => scorll()}
              >
                <div class="i-bi-arrow-up-circle" />
              </div>
            : null
        }
      </>
    );
  }
});

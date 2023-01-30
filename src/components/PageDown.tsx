/*
 * @Author: zhangyang
 * @Date: 2022-10-05 14:56:31
 * @LastEditTime: 2022-10-05 16:04:25
 * @Description:
 */
import { defineComponent, h } from 'vue';
export default defineComponent({
  setup() {
    const scorll = () => {
      const { offsetTop } = document.querySelector('#main-content') as HTMLElement;
      window.scrollTo({
        top: offsetTop || 0,
        behavior: 'smooth',
      });
    };
    return () =>
      h(
        <div class="absolute bottom-2 w-full text-center z-1 font-bold text-4xl">
          <div
            class="i-ri-arrow-down-s-line hover:cursor-pointer m-auto animate-wobble animate-ease-in-out"
            style={{
              animationIterationCount: 'infinite',
            }}
            onClick={() => scorll()}
          />
        </div>,
      );
  },
});

/*
 * @Author: zhangyang
 * @Date: 2022-10-05 15:13:05
 * @LastEditTime: 2022-10-11 09:07:30
 * @Description: 一言
 */
import { defineComponent, h, ref } from 'vue';
import { ONE_SAY } from '@/config';
import { useClipboard } from '@vueuse/core';
interface OneSay {
  commit_from: string;
  created_at: string;
  creator: string;
  creator_uid: number;
  from: string | null;
  from_who: string | null;
  hitokoto: string;
  id: number;
  length: number;
  reviewer: number;
  type: string;
  uuid: string;
}

export default defineComponent({
  setup() {
    const sayObj = ref<OneSay>();

    const refresh = async () => {
      sayObj.value = await (await fetch(ONE_SAY.refresh)).json();
    };
    const { copy, isSupported } = useClipboard();
    const copyContent = async () => {
      if (isSupported) {
        await copy(sayObj.value?.hitokoto ?? '');
      }
    };
    const goDetail = () => {
      const a = document.createElement('a');
      a.setAttribute('target', '_blank');
      a.setAttribute('href', `${ONE_SAY.detail}${sayObj.value?.uuid}`);
      a.click();
    };
    const eventDiapatcher = (e: MouseEvent) => {
      switch (e.button) {
        case 0:
          refresh();
          break;
        case 1:
          copyContent();
          break;
        case 2:
          goDetail();
          break;
        default:
          refresh();
          break;
      }
    };

    refresh();
    return () =>
      h(
        <div
          class="text-xl lg:text-2xl text-center hover:cursor-pointer"
          title="左键刷新，中键复制，右键跳转详情"
          onClick={eventDiapatcher}
          onAuxclick={eventDiapatcher}
          onContextmenu={(e: { preventDefault: () => any }) => e.preventDefault()}
        >
          <p>{sayObj.value?.hitokoto ?? ''}</p>
          <p>
            <span style={{ display: sayObj.value ? 'inline' : 'none' }}>出自：</span>
            {`
              ${sayObj.value?.from ?? ''}
              ${sayObj.value?.from_who ? ` —— ${sayObj.value?.from_who}` : ''}
            `}
          </p>
        </div>,
      );
  },
});

/*
 * @Author: zhangyang
 * @Date: 2022-10-05 15:37:57
 * @LastEditTime: 2022-10-17 09:12:37
 * @Description: 音乐播放器
 */
import { defineComponent, h } from 'vue';
import { MUSIC } from '@/config';
import 'uno.css';
import './style/music.css';
import 'aplayer/dist/APlayer.min.css';
import APlayer from 'aplayer';

export default defineComponent({
  setup() {
    return () => h(<div id="young-player" class="text-gray-800"></div>);
  },
  async mounted() {
    const init = async () => {
      const res = await fetch(
        `${MUSIC.api}?server=${MUSIC.server}&type=${MUSIC.type}&id=${MUSIC.id}&r=${Math.random()}`,
      );
      const conf = await res.json();
      const mountTarget = document.querySelector('#young-player');
      mountTarget &&
        new APlayer({
          container: mountTarget,
          fixed: true,
          mini: true,
          audio: conf,
          lrcType: 3,
        });
    };
    await init();
  },
});

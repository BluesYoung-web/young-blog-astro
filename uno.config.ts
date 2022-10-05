/*
 * @Author: zhangyang
 * @Date: 2022-10-05 10:26:38
 * @LastEditTime: 2022-10-05 10:29:53
 * @Description: 
 */
import {
  defineConfig,
  presetIcons,
  presetUno,
  transformerDirectives,
} from 'unocss';

export default defineConfig({
  transformers: [
    transformerDirectives(),
  ],
  presets: [
    presetUno(),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
});

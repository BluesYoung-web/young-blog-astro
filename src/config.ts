/*
 * @Author: zhangyang
 * @Date: 2022-09-04 09:46:18
 * @LastEditTime: 2022-10-25 10:06:36
 * @Description: 
 */
export const SITE_TITLE = '小黑博客';
export const SITE_DESCRIPTION = '沉迷代码，无法自拔！';

export const ONE_SAY = {
  refresh: 'https://v1.hitokoto.cn/',
  detail: 'https://hitokoto.cn?uuid='
};

export const MUSIC = {
  api: 'https://api.i-meto.com/meting/api',
  // # 目前为播放清单的 id，可以为 歌曲id、清单id、专辑id、搜索关键词
  id: '3231649721',
  // # 歌曲服务器 netease, tencent, kugou, xiami, baidu
  server: 'netease',
  // # id 类型 song, playlist, album, search, artist
  type: 'playlist',
};

export const NAV = {
  title: '小黑博客',
  doc: '文章',
  love: '关于',
  gitee: 'Gitee',
  github: 'GitHub',
  gitee_addr: 'https://gitee.com/BluesYoung-web',
  github_addr: 'https://github.com/BluesYoung-web',
  mail: '邮箱联系',
  mail_addr: 'mailto:bluesyoung_web@163.com',
};

export const INTRO = {
  author: 'BluesYoung-web',
  say: '沉迷代码，无法自拔',
  doc_toc: '文章目录',
  search: '搜索',
};

export const OPEN_SOURCE_PROJECT = [
  {
    title: '@bluesyoung/rpc',
    des: '基于 postMessage + MessageChannel 实现的远程调用库，拥有良好的类型提示，实际应用于来游戏官网',
    href: 'https://gitee.com/BluesYoung-web/young/tree/master/packages/rpc'
  },
  {
    title: '@bluesyoung/wechat-auth',
    des: '用于获取微信登录授权码，微信内公众号网页授权，微信外扫码登录网页应用，实际应用于来游戏官网',
    href: 'https://gitee.com/BluesYoung-web/young/tree/master/packages/wechat-auth'
  },
  {
    title: '@bluesyoung/unplugin-json-conf',
    des: '基于 unplugin 编写的 vite 插件，能在代码中以虚拟模块的形式导入环境变量指定路径的 json 文件，实际应用于加载部分静态生成网站的配置',
    href: 'https://gitee.com/BluesYoung-web/young/tree/master/packages/unplugin-json-conf'
  },
  {
    title: '@bluesyoung/call-app',
    des: '基于 scheme 封装的唤端操作，实际应用于部分游戏落地页的唤端',
    href: 'https://gitee.com/BluesYoung-web/young/tree/master/packages/call-app'
  },
  {
    title: '@bluesyoung/beginner-guid',
    des: '基于 Lit + CSS: clip-path 实现的极简的新手引导组件库，实际应用于部分后台页面的操作引导',
    href: 'https://gitee.com/BluesYoung-web/young/tree/master/packages/beginner-guid'
  },
  {
    title: 'spider-playwright',
    des: '基于 playwright 实现的一系列爬虫，暂时用于爬取防沉迷政策相关的节假日信息',
    href: 'https://gitee.com/BluesYoung-web/spider-playwright'
  },
  {
    title: 'web-ext-bytedance-spider',
    des: '基于 Antfu 的 vitesse-webext 开发的浏览器插件，实际应用于自动爬取抖音开放平台数据，并转换为特定格式的 Excel 导出',
    href: 'https://gitee.com/BluesYoung-web/web-ext-bytedance-spider'
  },
  {
    title: 'admin-vue3-element3-vite2',
    des: '基于Vue3，Element Plus，TypeScript的后台管理系统，在此基础上已派生出多个后台管理系统',
    href: 'https://gitee.com/BluesYoung-web/admin-vue3-element3-vite2'
  },
  {
    title: 'young-naive-admin-restful',
    des: 'modern-server-egg 配套的后台管理系统模板，在此基础上已派生出多个后台管理系统',
    href: 'https://gitee.com/BluesYoung-web/young-naive-admin-restful'
  },
  {
    title: 'modern-server-egg',
    des: '基于 modernjs 开发的 egg 风格的 node 服务端程序，young-naive-admin-restful 配套后端程序',
    href: 'https://gitee.com/BluesYoung-web/modern-server-egg'
  },
  {
    title: 'young-naive-admin',
    des: '基于 Naive UI 开发的后台管理系统',
    href: 'https://gitee.com/BluesYoung-web/young-naive-admin'
  },
  {
    title: 'admin-server',
    des: '后台管理系统(admin-vue3-element3-vite2/young-naive-admin)配套后端程序',
    href: 'https://gitee.com/BluesYoung-web/admin-server'
  },
  {
    title: 'blog-astro',
    des: '基于 Astro + Vue3 实现的个人博客(本站)，对于 Astro 的初次尝试',
    href: 'https://gitee.com/BluesYoung-web/blog-astro'
  },
  {
    title: 'blog-nuxt3',
    des: '基于 nuxt3 + @nuxt/content 实现的个人博客，对于 Nuxt3 的初次尝试',
    href: 'https://gitee.com/BluesYoung-web/blog-nuxt3'
  },
  {
    title: 'blog-vitessg',
    des: '初步探索 vitessg 静态网站生成方案，基于 vitessg 实现的个人博客',
    href: 'https://gitee.com/BluesYoung-web/blog-vitessg'
  },
  {
    title: 'young-live-app',
    des: '基于 electron + vue3 + nplayer + hls.js 实现的 PC 端电视直播软件，对 electron 应用的一次尝试',
    href: 'https://gitee.com/BluesYoung-web/young-live-app'
  },
  {
    title: 'young-chat',
    des: '基于 uni-app 的一个简洁的社交聊天 APP',
    href: 'https://gitee.com/BluesYoung-web/young-chat'
  },
  {
    title: 'young-chat-server',
    des: 'young-chat 配套后端程序',
    href: 'https://gitee.com/BluesYoung-web/young-chat-server'
  }
];
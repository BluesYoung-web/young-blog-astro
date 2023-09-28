---
title: kodi 相关
description: kodi 相关
date: 2023-09-25 17:00:00
image: /img/kodi.svg
---

[[toc]]


## 汉化

- 确保语言为默认的 English，字体最好也切回默认的
- 字体切换为 Arial
- 切换中文

## 常用插件

- PVR IPTV Simple Client
- [哆啦搜索](/resources/plugin.video.duolasousuo-1.6.0.zip)
- [影视大全](/resources/plugin.video.ysdqg.zip)
- [bilibili插件](/resources/plugin.video.bili-master.zip)
- [网易云](/resources/resources/plugin.audio.music163-1.5.11-python3.zip)

## 倍速播放

- 设置 -> 播放器 -> 视频 -> 开启同步回访显示(此时支持 `0.8x - 1.5x` 的倍数播放)

- 在配置目录（`C:\Users\{用户名}\AppData\Roaming\Kodi\userdata`）下新建一个 `advancedsettings.xml` 文件，参考 [Kodi Wiki](https://kodi.wiki/view/Advancedsettings.xml#Audio.2Fvideo_playback_settings) 配置下面内容，可以最高加到 2 倍速

```xml
<advancedsettings version="1.0">
	<video>
    <maxtempo>2.1</maxtempo>
  </video>
</advancedsettings>
```
---
layout: "@/layouts/BlogPost.astro"
title: 59-媒体元素
image: /img/hbs.png
description: JavaScript 媒体元素
date: 2021-01-28 17:17:39
---

[[toc]]

## 媒体元素

```html
<!-- 嵌入视频 -->
<video src="conference.mpg" id="myVideo">Video player not available.</video>
<!-- 嵌入音频 -->
<audio src="song.mp3" id="myAudio">Audio player not available.</audio> 
<!-- 嵌入视频 -->
<video id="myVideo">
 <source src="conference.webm" type="video/webm; codecs='vp8, vorbis'">
 <source src="conference.ogv" type="video/ogg; codecs='theora, vorbis'">
 <source src="conference.mpg">
 Video player not available.
</video>
<!-- 嵌入音频 -->
<audio id="myAudio">
 <source src="song.ogg" type="audio/ogg">
 <source src="song.mp3" type="audio/mpeg">
 Audio player not available.
</audio> 
```

## audio 与 video 的公有属性

| prop                    | type      | des                                                          |
| :---------------------- | :-------- | :----------------------------------------------------------- |
| **autoplay**            | boolean   | **获取或设置自动播放的标志**                                 |
| buffered                | timerange | 已下载的缓冲的时间范围的对象                                 |
| bufferedBytes           | byterange | 已下载的缓冲的字节范围的对象                                 |
| bufferingRate           | int       | 下载过程中每秒钟平均接收到的位数                             |
| bufferingThrottled      | boolean   | 浏览器是否对缓冲进行了节流                                   |
| **controls**            | boolean   | **获取或设置控件是否显示的标志**                             |
| currentLoop             | int       | 媒体文件已经循环的次数                                       |
| currentSrc              | string    | 当前播放的媒体文件的url                                      |
| currentTime             | float     | 已经播放的秒数                                               |
| **defaultPlaybackRate** | float     | **获取或设置默认播放速率，只能开发者修改**                   |
| **duration**            | float     | **媒体总时间秒数**                                           |
| ended                   | boolean   | 是否播放完成                                                 |
| **loop**                | boolean   | **获取或设置是否循环播放的标志**                             |
| **muted**               | boolean   | **获取或设置是否静音的标志**                                 |
| networkState            | int       | 网络连接状态；0空，1加载中，2正在加载元数据，3已经加载了第一帧，4加载完成 |
| **paused**              | boolean   | **是否暂停**                                                 |
| **playbackRate**        | float     | **获取或设置当前的播放速率，用户可修改**                     |
| played                  | timerange | 到目前为止已经播放的时间范围                                 |
| readyState              | int       | 是否就绪；0数据不可用，1可显示当前帧，2可开始播放，3可从头到尾播放 |
| seekable                | timerange | 可搜索的时间范围                                             |
| seeking                 | boolean   | 是否正在调整播放进度                                         |
| **src**                 | string    | **媒体文件的来源，任意时刻可重写**                           |
| **start**               | float     | **获取或设置文件开始播放的秒数**                             |
| totalBytes              | int       | 当前资源所需的总字节数                                       |
| videoHeight             | int       | 返回**视频**的高度                                           |
| videoWidth              | int       | 返回视频的宽度                                               |
| **volume**              | float     | **获取或设置当前的音量[0.0, 1.0]**                           |
| **srcObject**              | MediaStream     | **实验性功能，可用于 webrtc**                           |

## 事件

| 事件                | 触发                                           |
| :------------------ | :--------------------------------------------- |
| abort               | 下载中断                                       |
| canplay             | 可以播放了，readyState = 2                     |
| canplaythrough      | 可从头到尾播放（全部缓冲完成），readyState = 3 |
| canshowcurrentframe | 当前帧已加载，readyState = 1                   |
| dataunavailable     | 因没有数据而不能播放，readyState = 0           |
| durationchange      | duration的值改变                               |
| emptied             | 网络连接关闭                                   |
| empty               | 发生了错误，阻止媒体下载                       |
| **ended**           | **播放结束，进度走完停止**                     |
| error               | 下载期间发生网络错误                           |
| **pause**           | **播放暂停**                                   |
| **play**            | **媒体已接收到指令，开始播放**                 |
| **playing**         | **媒体已经开始播放**                           |
| **progress**        | **正在下载**                                   |
| **ratechange**      | **播放速度改变**                               |
| seeked              | 进度调整结束                                   |
| seeking             | 正在调整进度                                   |
| stalled             | 浏览器尝试下载，但未接收到数据                 |
| timeupdate          | 进度被意外更新                                 |
| volumechange        | 音量改变                                       |
| waiting             | 由于缓冲不够导致的暂停                         |

## 自定义媒体播放器

```html
<div class="mediaplayer">
  <div class="video">
  <video id="player" src="movie.mov" poster="mymovie.jpg" width="300" height="200">
  Video player not available.
  </video>
  </div>
  <div class="controls">
  <input type="button" value="Play" id="video-btn">
  <span id="curtime">0</span>/<span id="duration">0</span>
  </div>
</div> 
<script>
// 取得元素的引用
let player = document.getElementById("player"),
  btn = document.getElementById("video-btn"),
  curtime = document.getElementById("curtime"),
  duration = document.getElementById("duration");
// 更新时长
duration.innerHTML = player.duration;
// 为按钮添加事件处理程序
btn.addEventListener( "click", (event) => {
 if (player.paused) {
  player.play();
  btn.value = "Pause";
 } else {
  player.pause();
  btn.value = "Play";
 }
});
// 周期性更新当前时间
setInterval(() => {
  curtime.innerHTML = player.currentTime;
}, 250); 
</script>
```

## 检测编解码器是否支持

- `new Audio().canPlayType(MIMEStr)`
- 返回 `probably | maybe | ''`，前两个都是真值，空字符串为假值
- 在同时提供 `MIME` 类型和编解码器的情况下，返回值的可能性会提高
- `audio.canPlayType("audio/ogg; codecs=\"vorbis\"")`

## 音频类型

```js
const audio = new Audio('src');
audio.addEventListener('canplaythrough', (e) => {
  // 目前浏览器会阻止非用户自愿的播放(用户与界面进行交互之前)
  audio.play();
})
```


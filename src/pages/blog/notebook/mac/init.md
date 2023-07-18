---
title: Mac 环境搭建/常用软件
description: Mac 环境搭建/常用软件
date: 2023-07-16 15:15:00
image: /img/algorithm.webp
---

[[toc]]

## HomeBrew

[官网](https://brew.sh/index_zh-cn)

> 亲测，还是直接使用代理 + 官网提供的脚本最靠谱

```bash
# 安装：
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"

# 卸载
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/HomebrewUninstall.sh)"
```

[知乎教程链接](https://zhuanlan.zhihu.com/p/372576355)

## <del>iterm2 & zsh & ohmyzsh</del>

<del>[iterm2](https://iterm2.com/index.html)</del>

## warp

**看起来更厉害，还自带 AI**

[官网](https://www.warp.dev/)

## 其他小工具

[截图-snipaste](https://www.snipaste.com)

[状态监控](https://bjango.com/mac/istatmenus/)

腾讯柠檬-TencentLemon

重复文件扫描-Gemini

电池健康控制-AlDente

## 掘金文章

https://juejin.cn/post/7217820487203618876#heading-12

https://juejin.cn/post/7134638634874961957

https://juejin.cn/post/7236687156068286521

https://juejin.cn/post/7235177983311740989


## 报错处理

### zsh: bad CPU type in executable: /usr/local/bin/git

> 系统自带的 git 和新安装的 git 版本不兼容, 需要卸载

```bash
# 查看当前 git 的安装路径
where git
# /usr/bin/git
# /usr/local/bin/git

# 查看当前正在使用的 git
which git
# /usr/local/bin/git
# 就是这个 git 造成的报错，使用下面的命令卸载就好了
sh /usr/local/git/uninstall.sh
```
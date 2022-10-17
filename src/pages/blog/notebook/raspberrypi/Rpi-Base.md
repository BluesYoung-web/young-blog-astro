---
title: 树莓派基础操作
image: /img/raspberrypi.jpg
date: 2021-07-24 20:28:43
---

[[toc]]

## 恢复 TF 卡实际容量

**树莓派初始看到的内存大小为 8G(TF 卡实际容量大于等于 8G)**

```bash
sudo raspi-config
# -> Advanced Options
# -> Expand Filesystem
# 保存，重启
sudo reboot

# 查看存储情况
df -h
```

## 换源

第一步：

```bash
sudo vi /etc/apt/sources.list
# 首先使用井号注释掉官方源
# 然后在后面追加以下内容(清华源)
deb http://mirrors.tuna.tsinghua.edu.cn/raspbian/raspbian/ buster main contrib non-free rpi
deb-src http://mirrors.tuna.tsinghua.edu.cn/raspbian/raspbian/ buster main contrib non-free rpi
```

第二步：

```bash
sudo vi /etc/apt/sources.list.d/raspi.list
# 注释原有内容，追加以下内容
deb http://mirrors.tuna.tsinghua.edu.cn/raspbian/raspbian/ buster main contrib non-free rpi
deb-src http://mirrors.tuna.tsinghua.edu.cn/raspbian/raspbian/ buster main contrib non-free rpi
```

## 连接 4K 显示器

### 配置调整

```bash
sudo raspi-config
# -> Display Options
# -> Resolution
# -> 选择4k对应的分辨率(3840*2160,60Hz)
# 保存，重启
```

### 直接使用菜单调整

```bash
# 菜单
# -> 首选项
# -> 显示器设置
# -> 调整解析度与刷新频率

# 保存即可
```

### 没有显示器设置

```bash
# 菜单
# -> 首选项
# -> Main Menu Editor
# -> 选中首选项
# -> 勾选右侧显示器设置

# 保存即可
```

### 没有 Main Menu Editor

```bash
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install alacarte
```

## 保持 mac 地址不变

```bash
sudo nano /etc/NetworkManager/conf.d/100-disable-wifi-mac-randomization.conf
```

修改内容如下：

```ini
[connection]
wifi.mac-address-randomization=1

[device]
wifi.scan-rand-mac-address=no
```
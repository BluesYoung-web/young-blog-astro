---
title: Linux 相关
description: Linux 相关的技巧
date: 2022-03-19 14:41:47
---

[[toc]]

## U 盘格式化

使用命令恢复被 Etcher 制作的启动盘(**被分成了十几个分区，并且无法被 Windows 识别**)

```bash
# 查看设备
sudo fdisk -l
# 确定 U 盘的挂载位置，通常是 /dev/sdb*

# 卸载
sudo umount /dev/sdb*

# 格式化
sudo mkfs.vfat /dev/sdb -I

# 执行完成，U 盘空间已经完全恢复了
```
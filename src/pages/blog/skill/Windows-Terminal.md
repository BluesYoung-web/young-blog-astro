---
title: WindowsTerminal-powershell 美化
date: 2021-11-14 14:11:05
---

[[toc]]

## 使用 `oh-my-posh`

### 前期准备(防止乱码)

下载并安装对应的[字体](https://github.com/romkatv/powerlevel10k#manual-font-installation)

在使用的地方使用 `MesloLGS NF` 字体

### 以管理员身份运行 powershell

```bash
# 修改运行策略
Set-ExecutionPolicy Bypass
# 安装 oh-my-posh
Install-Module oh-my-posh -Scope CurrentUser
# 安装 git 提示插件
Install-Module posh-git -Scope CurrentUser

# 启动编辑power shell配置文件的引擎
if (!(Test-Path -Path $PROFILE )) { New-Item -Type File -Path $PROFILE -Force }
# 使用记事本打开配置文件
notepad $PROFILE

# 在记事本中输入以下内容并保存
## 导入模块
Import-Module posh-git
Import-Module oh-my-posh
## 设置主题
Set-PoshPrompt -Theme iterm2

# 查看所有主题
Get-PoshThemes
# 切换主题
Set-PoshPrompt -Theme 主题名称
```
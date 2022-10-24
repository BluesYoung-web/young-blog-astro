---
title: 自动切换对应的node版本
description: 自动切换对应的node版本
date: 2021-12-21 11:07:41
---

[[toc]]

## 需求

不同项目使用不同的 node 版本

切换项目目录时自动切换项目对应的 node 版本

## 前期操作

[安装 nvm](../skill/Software#shell-clash)

在项目根目录新建配置文件 `.nvmrc`，内容为对应的 node 版本，例如 `16.13.1`

## 核心操作 —— `nvm` 与 `cd` 相关联

### `bash`

重载 `cd` 命令

编辑 `~/.bashrc`，新增内容如下：

```bash
# 加载 nvm 命令，如存在请忽略
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# 自动切换 node 版本(重载 cd 命令，根据目录下的.nvmrc 自动(安装)切换)
cdnvm() {
  command cd "$@";
  nvm_path=$(nvm_find_up .nvmrc | tr -d '\n')
  # 如果项目目录下不存在对应的 .nvmrc 配置文件，则使用默认的版本
  if [[ ! $nvm_path = *[^[:space:]]* ]]; then
		declare default_version;
		######
		#default_version=$(nvm version default);
		# 如果没有设置默认的 node 版本，则将最新版作为默认的 node 版本
		#if [[ $default_version == "N/A" ]]; then
		#    nvm alias default node;
		#    default_version=$(nvm version default);
		#fi
		######
		default_version="12.18.1";
		# 如果不存在配置文件并且当前版本不等于默认的版本，则切换为默认的 node 版本
		if [[ $(nvm current) != "$default_version" ]]; then
			# echo "使用默认的 node 版本： $default_version";
			nvm use "$default_version";
		fi
  # 如果存在配置文件则使用配置文件中的 node 版本
  elif [[ -s $nvm_path/.nvmrc && -r $nvm_path/.nvmrc ]]; then
		declare nvm_version
		# 取出配置文件中的 node 版本
		nvm_version=$(<"$nvm_path"/.nvmrc)
		declare locally_resolved_nvm_version
		# 检测对应的 node 版本是否安装
		locally_resolved_nvm_version=$(nvm ls --no-colors "$nvm_version" | tail -1 | tr -d '\->*' | tr -d '[:space:]')
		if [[ "$locally_resolved_nvm_version" == "N/A" ]]; then
			# echo "未安装，安装并使用: $nvm_version";
			nvm install "$nvm_version";
			# 全局安 yarn
			npm i -g yarn;
		elif [[ $(nvm current) != "$locally_resolved_nvm_version" ]]; then
			# echo "已安装，直接使用: $nvm_version";
			nvm use "$nvm_version";
		fi
  fi
}
alias cd='cdnvm'
cd "$PWD"
```

### zsh

注册钩子函数

编辑 `~/.zshrc`

```bash
# place this after nvm initialization!
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

## shell 脚本中使用

```bash
#! /bin/bash

# 启用 alias !!!，shell 脚本中默认是禁用 alias 的
shopt -s expand_aliases
# 重载 cd 命令  node 
source ~/.bashrc
```

---
title: vscode 相关
date: 2021-12-22 17:12:42
---

[[toc]]

## 远程开发

打开 VSCode 插件市场

搜索并安装 `Remote Development`

**创建非对称秘钥(存在可跳过)**`ssh-keygen -t rsa -C "xxx@xxx.com"`

将公钥放到远程服务器对应用户的 `~/.ssh/` 目录下，取一个特定的名称

将公钥内容追加写入远程服务器的校验文件中 `cat 公钥名称.pub >> authorized_keys` **免密登录的关键所在**

点击插件的设置按钮，回车(打开当前用户的配置文件)，编辑并保存

```ini
# 主机标识符，随便填(每一个 Host 块即为一个主机)
Host remote_pi
	# 主机 ip	
    HostName 192.168.31.226
    # 使用的用户名
    User pi
    # 本机私钥的存储位置
    IdentityFile '~/.ssh/id_rsa'
    # ssh 保活请求时间间隔
    ServerAliveInterval 60
```



### 异常

查看 `/etc/ssh/sshd_config` 以下内容是否被注释

如果注释了需要取消注释并重启 `service ssh restart`

```ini
RSAAuthentication yes
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
```
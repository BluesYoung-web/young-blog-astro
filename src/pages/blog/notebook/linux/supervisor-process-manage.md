---
title: Supervisor 进程管理
description: Linux 使用 Supervisor 进行进程管理
image: /img/supervisor.webp
date: 2022-11-06 15:52:00
---

[[toc]]

## 安装

```bash
sudo apt-get install supervisor
```

## 配置

### `/etc/supervisord.conf`

```ini
[unix_http_server]
file=/var/run/supervisor.sock               ; UNIX socket 文件, supervisorctl 会使用
chmod=0700                                  ; socket 文件的 mode, 默认是 0700

[inet_http_server]                          ; 通过web来管理 supervisor. (supervisor-cesi 需要开启 http 管理来调用 RPC 接口管理 supervisor)
port=*:9999
username=test
password=test

[supervisord]
logfile=/tmp/log/supervisor/supervisord.log ; 日志文件, 默认是 /supervisord.log
pidfile=/var/run/supervisord.pid
logfile_maxbytes=50MB                       ; 日志文件大小, 超出会 rotate, 默认 50MB
logfile_backup=10                           ; 日志文件保留备份数量默认 10
loglevel=info                               ; 日志级别, 默认 info, 其它: debug,warn,trace
pidfile=/var/run/supervisord.pid            ; pid 文件
nodaemon=false                              ; 是否在前台启动, 默认是 false, 即以 daemon 的方式启动
minfds=65535                                ; 可以打开的文件描述符的最小值, 默认 1024
minprocs=65535                              ; 可以打开的进程数的最小值, 默认 200

[rpcinterface:supervisor]
supervisor.rpcinterface_factory = supervisor.rpcinterface:make_main_rpcinterface

[supervisorctl]                            ; 通过 supervisorctl 远程管理. (supervisorctl -s http://<ip>:<port> -c <conf> status 会用上)
serverurl=unix:///var/run/supervisor.sock
;serverurl=http://192.168.0.85:9002
;username=test
;password=test

[include]                                   ; 包含其他的配置文件
files = /etc/supervisor.conf.d/*.conf       ; 可以是 *.conf 或 *.ini
```

### `/etc/supervisor.conf.d/test.conf`

```ini
[program:test]                                
directory=/data/code/test_app       
priority=80
command=/root/.nvm/versions/node/v16.17.0/bin/node /data/code/test_app/boot.mjs                                                                                                                                                         
killasgroup=true                              
stopasgroup=true                              
user=root
autostart=true                                
startsecs = 5
autorestart=true                              
startretries = 5                              
redirect_stderr = true                        
stdout_logfile_maxbytes = 0                   
stdout_logfile_backups = 0                    
stdout_logfile=/data/logs/sup_%(program_name)s.log
```

### demo description

```ini
;[program:cat]             ;冒号后的cat为服务名称，也可以是prometheus、node_exporter等
;command=/bin/cat   ;服务启动的命令
;process_name=%(program_name)s  ;一个使用Python字符串的表达式，用来描述进程名称(字符串)，默认设置
;numprocs=1   ;默认为1，如果>1，则process_name表达式必须包含%(process_num)s，或包含process_num的任何其他有效Python字符串表达式
;directory=/tmp      ;应用目录，可不设置
;umask=022            ;掩码，按默认设置
;priority=999           ;优先级越高，表示最先关闭，最晚启动，默认为999
;autostart=true       ;是否自启动
;autorestart=unexpected  ;当进程处于运行状态时，如果该进程退出，则是否应自动重新启动该进程。如果设置为false，则不会自动重新启动进程。如果设置为unexpected，当程序退出时，退出代码不是与此进程配置相关联的退出代码之一（请参阅退出代码），则将重新启动进程。如果设置为true，则进程在退出时将无条件重新启动，而不考虑其退出代码
;startsecs=10  ;服务启动后需要保持运行多少秒才认为启动成功，如10秒仍处理运行状态则表示启动成功。
;startretries=3   ;尝试启动次数
;exitcodes=0    ;退出代码，默认为0，该值设置会影响到autorestart
;stopsignal=TERM   ;停止信号，可以是TERM, HUP, INT, QUIT, KILL, USR1, or USR2
;stopwaitsecs=10    ;停止时等待多少秒
;stopasgroup=false                   ;向进程组发送停止信号，这止进程
;killasgroup=false                      ;向进程组发送SIGKILL终止进程
;user=chrism                              ;启动用户
;redirect_stderr=false                 ;标准错误输出是否重定向，若设置为true，则表示将错误输出重定向到标准出日志文件中
;stdout_logfile=/a/path              ;标准输出日志文件路径
;stdout_logfile_maxbytes=1MB  ;单个日志文件大小，超出将滚动
;stdout_logfile_backups=10       ;保留日志个数
;stderr_logfile=/a/path              ;标准错误输出日志文件位置，redirect_stderr=false才有效
;stderr_logfile_maxbytes=1MB  ;标准错误输出单个日志文件大小，超出将滚动，redirect_stderr=false才有效
;stderr_logfile_backups=10       ;保留标准错误输出日志文件个数，超出删除，edirect_stderr=false才有效
```
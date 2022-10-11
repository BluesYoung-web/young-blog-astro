---
layout: "@/layouts/BlogPost.astro"
title: 树莓派使用 GPIO 引脚控制继电器
description: 树莓派使用 GPIO 引脚控制继电器
image: /img/raspberrypi.jpg
date: 2021-11-20 16:54:36
---

[[toc]]

## 目标

编写 `python` 程序，控制树莓派 `GPIO` 引脚输出高低电平

树莓派 `GPIO` 控制光耦隔离继电器

继电器控制发光二极管

## 2路光耦继电器

### 输入端

`DC+` ：接电源正极（电压按继电器要求，有 `5V` `9V` `12V` 和 `24V` 选择，目前直连树莓派的引脚 `5v`）

`DC-` ：接电源负极，电源接好之后，板载电源指示灯亮起

`IN1` ：1 路信号触发端，可以设置高或低电平控制继电器吸合，连接 `GPIO21`

`IN2` ：2 路信号触发端，可以设置高或低电平控制继电器吸合，暂未使用

**切换跳线帽可以控制高低电平触发**

### 输出端

`COM1` ：1 路继电器公用接口，连接 `led` 供电电源正极，飞线连接 `led` 正极引脚(长脚)

`NO1` ：1 路继电器常开接口，继电器吸合前悬空，吸合后与 `COM1` 短接；飞线连接 `led` 负极引脚

`NC1` ：1 路继电器常闭接口，继电器吸合前与 `COM1` 短接，吸合后悬空，暂未使用

`COM2` ：2 路继电器公用接口，暂未使用

`NO2` ： 2 路继电器常开接口，继电器吸合前悬空，吸合后与 `COM2` 短接，暂未使用

`NC2` ： 2 路继电器常闭接口，继电器吸合前与 `COM2` 短接，吸合后悬空，暂未使用

**继电器通电时会有开关吸合的声音产生，并且对应的指示灯亮起**

## 树莓派 GPIO 引脚

```bash
# 终端运行，获取当前所有 gpio 的状态
gpio readall
```

```bash
+-----+-----+---------+------+---+---Pi 4B--+---+------+---------+-----+-----+
| BCM | wPi |   Name  | Mode | V | Physical | V | Mode | Name    | wPi | BCM |
+-----+-----+---------+------+---+----++----+---+------+---------+-----+-----+
|     |     |    3.3v |      |   |  1 || 2  |   |      | 5v      |     |     |
|   2 |   8 |   SDA.1 |   IN | 1 |  3 || 4  |   |      | 5v      |     |     |
|   3 |   9 |   SCL.1 |   IN | 1 |  5 || 6  |   |      | 0v      |     |     |
|   4 |   7 | GPIO. 7 |   IN | 1 |  7 || 8  | 1 | IN   | TxD     | 15  | 14  |
|     |     |      0v |      |   |  9 || 10 | 1 | IN   | RxD     | 16  | 15  |
|  17 |   0 | GPIO. 0 |   IN | 0 | 11 || 12 | 0 | IN   | GPIO. 1 | 1   | 18  |
|  27 |   2 | GPIO. 2 |   IN | 0 | 13 || 14 |   |      | 0v      |     |     |
|  22 |   3 | GPIO. 3 |   IN | 0 | 15 || 16 | 0 | IN   | GPIO. 4 | 4   | 23  |
|     |     |    3.3v |      |   | 17 || 18 | 0 | IN   | GPIO. 5 | 5   | 24  |
|  10 |  12 |    MOSI |   IN | 0 | 19 || 20 |   |      | 0v      |     |     |
|   9 |  13 |    MISO |   IN | 0 | 21 || 22 | 0 | IN   | GPIO. 6 | 6   | 25  |
|  11 |  14 |    SCLK |   IN | 0 | 23 || 24 | 1 | IN   | CE0     | 10  | 8   |
|     |     |      0v |      |   | 25 || 26 | 1 | IN   | CE1     | 11  | 7   |
|   0 |  30 |   SDA.0 |   IN | 1 | 27 || 28 | 1 | IN   | SCL.0   | 31  | 1   |
|   5 |  21 | GPIO.21 |   IN | 1 | 29 || 30 |   |      | 0v      |     |     |
|   6 |  22 | GPIO.22 |   IN | 1 | 31 || 32 | 0 | IN   | GPIO.26 | 26  | 12  |
|  13 |  23 | GPIO.23 |   IN | 0 | 33 || 34 |   |      | 0v      |     |     |
|  19 |  24 | GPIO.24 |   IN | 0 | 35 || 36 | 0 | IN   | GPIO.27 | 27  | 16  |
|  26 |  25 | GPIO.25 |   IN | 0 | 37 || 38 | 0 | IN   | GPIO.28 | 28  | 20  |
|     |     |      0v |      |   | 39 || 40 | 0 | IN   | GPIO.29 | 29  | 21  |
+-----+-----+---------+------+---+----++----+---+------+---------+-----+-----+
| BCM | wPi |   Name  | Mode | V | Physical | V | Mode | Name    | wPi | BCM |
+-----+-----+---------+------+---+---Pi 4B--+---+------+---------+-----+-----+
```

## Python 程序

### 流水灯

```python
#!/usr/bin/python3
# -*- coding: utf-8 -*-
# 循环版
import time
import RPi.GPIO as GPIO

# 忽略占用警告
GPIO.setwarnings(False)
# 博通的 CPU
GPIO.setmode(GPIO.BCM)
# 设置 GPIO21 为输出引脚,控制继电器
GPIO.setup(21, GPIO.OUT)

# 开启继电器
def open_led():
	# print('open')
	GPIO.output(21, GPIO.HIGH)
    
# 关闭继电器
def close_led():
	# print('close')
	GPIO.output(21, GPIO.LOW)
    
try:
	while 1:
		open_led()
		time.sleep(1)
		close_led()
		time.sleep(1)
except KeyboardInterrupt:
	# 循环被 ctrl + c 打断之后,清理现场
	GPIO.cleanup()%  
```

```python
#!/usr/bin/python3
# -*- coding: utf-8 -*-
# pwm 版
import time
import RPi.GPIO as GPIO

# 忽略占用警告
GPIO.setwarnings(False)
# 博通的 CPU
GPIO.setmode(GPIO.BCM)
# 设置 GPIO21 为输出引脚,控制继电器
GPIO.setup(21, GPIO.OUT)
# GPIO21, 刷新频率为 0.5Hz = 1 / 0.5 = 2s
p = GPIO.PWM(21, 0.5)
# 占空比为 50/100 = 1/2
# 亮 1s 暗 1s
p.start(50)

input('按任意键停止......')
p.stop()
GPIO.cleanup()
```

### 呼吸灯

```python
#!/usr/bin/python3
# -*- coding: utf-8 -*-
import time
import RPi.GPIO as GPIO

# 忽略占用警告
GPIO.setwarnings(False)
# 博通的 CPU
GPIO.setmode(GPIO.BCM)
# 设置 GPIO21 为输出引脚,控制继电器
GPIO.setup(21, GPIO.OUT)

# GPIO21, 刷新频率为 50Hz = 1 / 50 = 0.02s
p = GPIO.PWM(21, 50)
# 初始占空比为 0
p.start(0)
# 修改刷新频率，freq 为设置的新频率，单位为 Hz
# p.ChangeFrequency(freq)
try:
	while 1:
		for dc in range(0, 101, 5):
			# 每 0.1 秒，占空比增加 5%，逐渐变亮
			p.ChangeDutyCycle(dc)
			time.sleep(0.1)
		for dc in range(100, -1, -5):
			# 每 0.1 秒，占空比减少 5%，逐渐变暗
			p.ChangeDutyCycle(dc)
			time.sleep(0.1)
            
except KeyboardInterrupt:
	pass
p.stop()
GPIO.cleanup()
```

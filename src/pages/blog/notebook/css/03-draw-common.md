---
title: CSS3-03绘制常见图形
date: 2020-12-24 14:27:46
image: /img/css.jpg
description: 绘制常见图形
---

[[toc]]

<style lang="scss" scoped>
* {
	padding: 0;
	margin: 0;
}
.msg {
	display: block;
	.main {
		padding: 1vh;
		clear: both;
	}
	.main p {
		background-color: #99f;
		max-width: 10vw;
		padding: 2vh;
		border-radius: 20px;
	}
	.main::before {
		content: '';
		width: 0;
		height: 0;
		float: left;
		position: relative;
		top: 3vh;
		left: -1vh;
		border-right: 1vh solid #99f;
		border-left: 0;
		border-top: 1vh solid transparent;
		border-bottom: 1vh solid transparent;
	}

	.right {
		-webkit-transform: scaleX(-1);
				-ms-transform: scaleX(-1);
						transform: scaleX(-1);
	}
	.right::before {
		border-right-color: aquamarine;
	}
	.right p {
		background-color: aquamarine;
		color: #aaa;
		-webkit-transform: scaleX(-1);
				-ms-transform: scaleX(-1);
						transform: scaleX(-1);
	}  
}

.ling {
	width: 10vh;
  height: 10vh;
  margin: 5vh auto;
  background-color: blueviolet;
  -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
          transform: rotate(45deg);
}

.ping {
	width: 10vh;
  height: 10vh;
  margin: 5vh auto;
  background-color: blueviolet;
  -webkit-transform: skew(-30deg);
      -ms-transform: skew(-30deg);
          transform: skew(-30deg);
}

@-webkit-keyframes heart-b {
	0% {
		-webkit-transform: scale(0.9) rotate(45deg);
						transform: scale(0.9) rotate(45deg);
	}
	25% {
		-webkit-transform: scale(1.1) rotate(45deg);
						transform: scale(1.1) rotate(45deg);
	}
	50% {
		-webkit-transform: scale(1.3) rotate(45deg);
						transform: scale(1.3) rotate(45deg);
	}
	75% {
		-webkit-transform: scale(1.1) rotate(45deg);
						transform: scale(1.1) rotate(45deg);
	}
}
@keyframes heart-b {
	0% {
		-webkit-transform: scale(1.0) rotate(45deg);
						transform: scale(1.0) rotate(45deg);
	}
	25% {
		-webkit-transform: scale(1.2) rotate(45deg);
						transform: scale(1.2) rotate(45deg);
	}
	50% {
		-webkit-transform: scale(1.15) rotate(45deg);
						transform: scale(1.15) rotate(45deg);
	}
	75% {
		-webkit-transform: scale(1.1) rotate(45deg);
						transform: scale(1.1) rotate(45deg);
	}
}
.heart {
	width: 200px;
	height: 200px;
	margin: 200px auto;
	background: red;
	-webkit-animation: heart-b 1s infinite;
					animation: heart-b 1s infinite;
	-webkit-transform: rotate(45deg);
			-ms-transform: rotate(45deg);
					transform: rotate(45deg);
	position: relative;

}

.heart::before, .heart::after {
	content: '';
	width: 200px;
	height: 200px;
	border-radius: 50%;
	background-color: red;
	position: absolute;
}

.heart::before {
	-webkit-transform: translate(-50%, 0);
			-ms-transform: translate(-50%, 0);
					transform: translate(-50%, 0);
}
.heart::after {
	-webkit-transform: translate(0, -50%);
			-ms-transform: translate(0, -50%);
					transform: translate(0, -50%);
}

.egg {
  width: 126px;
  height: 180px;
  background-color: #fa3;
  margin: 120px auto;
  /* x轴 y轴 */
  border-top-left-radius: 50% 60%;
  border-top-right-radius: 50% 60%;
  border-bottom-left-radius: 50% 40%;
  border-bottom-right-radius: 50% 40%;
}

.bg {
	background-color: #aaa;
	padding: 2vh;
}

.taiji {
  width: 300px;
  height: 300px;
  margin: 2vh auto;
  border-radius: 50%;
  background-color: #fff;
  border-left: 150px solid #000;
  position: relative;
}

.taiji::before {
  content: '';
  position: absolute;
  top: 0;
  width: 0;
  height: 0;
  padding: 25px;
  border-radius: 50%;
  border: 50px solid #000;
  background-color: #fff;
  -webkit-transform: translate(-50%, 0);
      -ms-transform: translate(-50%, 0);
          transform: translate(-50%, 0)
}

.taiji::after {
  content: '';
  position: absolute;
  bottom: 0;
  width: 0;
  height: 0;
  padding: 25px;
  border-radius: 50%;
  border: 50px solid #fff;
  background-color: #000;
  -webkit-transform: translate(-50%, 0);
      -ms-transform: translate(-50%, 0);
          transform: translate(-50%, 0);
}
</style>


## 消息气泡

<div class="msg">
	<div class="main">
		<p>这是一条消息</p>
	</div>
	<div class="main right">
		<p>这是另一条消息</p>
	</div>
</div>



```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>测试</title>
  <style>
  * {
      padding: 0;
      margin: 0;
    }
    .main {
      padding: 1vh;
      clear: both;
    }
    .main p {
      background-color: #99f;
      max-width: 10vw;
      padding: 2vh;
      border-radius: 20px;
      float: left;
    }
    .main::before {
      content: '';
      width: 0;
      height: 0;
      float: left;
      position: relative;
      top: 3vh;
			left: -1vh;
      border-right: 1vh solid #99f;
      border-left: 0;
      border-top: 1vh solid transparent;
      border-bottom: 1vh solid transparent;
    }

    .right {
      -webkit-transform: scaleX(-1);
          -ms-transform: scaleX(-1);
              transform: scaleX(-1);
    }
    .right::before {
      border-right-color: aquamarine;
    }
    .right p {
      background-color: aquamarine;
      color: #aaa;
      -webkit-transform: scaleX(-1);
          -ms-transform: scaleX(-1);
              transform: scaleX(-1);
    }  
  </style>
</head>
<body>
  <div class="main">
    <p>这是一条消息</p>
  </div>
  <div class="main right">
    <p>这是另一条消息</p>
  </div>
</body>
</html>
```

## 菱形

<div class="ling"></div>

```css
* {
  padding: 0;
  margin: 0;
}
.main {
  width: 10vh;
  height: 5vh;
  margin: 5vh auto;
  background-color: blueviolet;
  -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
          transform: rotate(45deg);
}
```

## 平行四边形

<div class="ping"></div>

```css
* {
  padding: 0;
  margin: 0;
}
.main {
  width: 10vh;
  height: 10vh;
  margin: 5vh auto;
  background-color: blueviolet;
  -webkit-transform: skew(-30deg);
      -ms-transform: skew(-30deg);
          transform: skew(-30deg);
}
```

## 心形

<div class="heart"></div>


```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>测试</title>
  <style>
  	* {
      padding: 0;
      margin: 0;
    }
    @-webkit-keyframes heart-b {
      0% {
        -webkit-transform: scale(0.9) rotate(45deg);
                transform: scale(0.9) rotate(45deg);
      }
      25% {
        -webkit-transform: scale(1.1) rotate(45deg);
                transform: scale(1.1) rotate(45deg);
      }
      50% {
        -webkit-transform: scale(1.3) rotate(45deg);
                transform: scale(1.3) rotate(45deg);
      }
      75% {
        -webkit-transform: scale(1.1) rotate(45deg);
                transform: scale(1.1) rotate(45deg);
      }
    }
    @keyframes heart-b {
      0% {
        -webkit-transform: scale(1.0) rotate(45deg);
                transform: scale(1.0) rotate(45deg);
      }
      25% {
        -webkit-transform: scale(1.2) rotate(45deg);
                transform: scale(1.2) rotate(45deg);
      }
      50% {
        -webkit-transform: scale(1.15) rotate(45deg);
                transform: scale(1.15) rotate(45deg);
      }
      75% {
        -webkit-transform: scale(1.1) rotate(45deg);
                transform: scale(1.1) rotate(45deg);
      }
    }
    .heart {
      width: 200px;
      height: 200px;
      margin: 200px auto;
      background: red;
      -webkit-animation: heart-b 1s infinite;
              animation: heart-b 1s infinite;
      -webkit-transform: rotate(45deg);
          -ms-transform: rotate(45deg);
              transform: rotate(45deg);
      position: relative;

    }

    .heart::before, .heart::after {
      content: '';
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background-color: red;
      position: absolute;
    }

    .heart::before {
      -webkit-transform: translate(-50%, 0);
          -ms-transform: translate(-50%, 0);
              transform: translate(-50%, 0);
    }
    .heart::after {
      -webkit-transform: translate(0, -50%);
          -ms-transform: translate(0, -50%);
              transform: translate(0, -50%);
    }
  </style>
</head>
<body>
  <div class="heart"></div>
</body>
</html>
```

## 鸡蛋

<div class="egg"></div>

```css
.egg {
  width: 126px;
  height: 180px;
  background-color: #fa3;
  margin: 120px auto;
  /* x轴 y轴 */
  border-top-left-radius: 50% 60%;
  border-top-right-radius: 50% 60%;
  border-bottom-left-radius: 50% 40%;
  border-bottom-right-radius: 50% 40%;
}
```

## 太极图

<div class="bg">
	<div class="taiji"></div>
</div>

```css
* {
  padding: 0;
  margin: 0;
}
body {
  background-color: #aaa;
}

.taiji {
  width: 300px;
  height: 300px;
  margin: 2vh auto;
  border-radius: 50%;
  background-color: #fff;
  border-left: 150px solid #000;
  position: relative;
}

.taiji::before {
  content: '';
  position: absolute;
  top: 0;
  width: 0;
  height: 0;
  padding: 25px;
  border-radius: 50%;
  border: 50px solid #000;
  background-color: #fff;
  -webkit-transform: translate(-50%, 0);
      -ms-transform: translate(-50%, 0);
          transform: translate(-50%, 0)
}

.taiji::after {
  content: '';
  position: absolute;
  bottom: 0;
  width: 0;
  height: 0;
  padding: 25px;
  border-radius: 50%;
  border: 50px solid #fff;
  background-color: #000;
  -webkit-transform: translate(-50%, 0);
      -ms-transform: translate(-50%, 0);
          transform: translate(-50%, 0);
}
```


---
title: "CSS学习-clip path"
tags: "clip:path()"
categories: "CSS"
description: ""
createDate: "2021-12-30 13:52:25"
updateDate: "2021-12-30 21:53:08"
---


## WHAT

一个CSS属性

使用裁剪方式创建元素的可显示区域。区域内的部分显示，区域外的隐藏

起初是SVG里的，后挪用到CSS

``` css
/* Keyword values */
clip-path: none;

/* <clip-source> values */
clip-path: url(resources.svg);

/* <basic-shape> values */
clip-path: inset(100px 50px);
clip-path: circle(50px at 0 100px);
clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
clip-path: path('M0.5,1 C0.5,1,0,0.7,0,0.3 A0.25,0.25,1,1,1,0.5,0.3 A0.25,0.25,1,1,1,1,0.3 C1,0.7,0.5,1,0.5,1 Z');
```

## WHY

方便创建一些不规则的图形，如切角、内切圆角、箭头等

## HOW

DEMO使用`clip-path: path()`来创建

`path`类似于svg的`path`标签，使用一系列 命令+参数 的序列来创建形状

![SVG-PATH](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/path.png)

[可视化编辑](https://yqnn.github.io/svg-path-editor/)

``` html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .img {
      height: 140px;
      width: 280px;
      background: linear-gradient(90deg, #be0f2d, #cb364a, #f5abb7);
    }

    .popover {
      clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 50% 100%, 25% 75%, 0% 75%);
    }

    .message {
      clip-path: path('M 20 0 L 260 0 A 20 20 90 0 1 280 20 L 280 100 A 20 20 90 0 1 260 120 L 220 120 L 240 140 L 180 120 L 20 120 A 20 20 90 0 1 0 100 L 0 20 A 20 20 90 0 1 20 0');
    }

    .coupon {
      clip-path: path('M 20 0 L 260 0 A 20 20 0 0 0 280 20 L 280 120 A 20 20 0 0 0 260 140 L 20 140 A 20 20 0 0 0 0 120 L 0 20 A 20 20 0 0 0 20 0');
    }

    .notching {
      clip-path: path('M 40 0 L 280 0 L 280 100 L 240 140 L 0 140 L 0 40 L 40 0');
    }

    .outside-circle {
      clip-path: path('M 40 0 L 240 0 A 20 20 90 0 1 260 20 L 260 120 A 20 20 90 0 0 280 140 L 0 140 A 20 20 90 0 0 20 120 L 20 20 A 20 20 90 0 1 40 0');
    }
  </style>
</head>

<body>
  <div src="https://bennettfeely.com/clippy/pics/pittsburgh.jpg" alt="" class="img popover" srcset=""></div>
  <br />
  <br />
  <div src="https://bennettfeely.com/clippy/pics/pittsburgh.jpg" alt="" class="img message" srcset=""></div>
  <br />
  <br />
  <div src="https://bennettfeely.com/clippy/pics/pittsburgh.jpg" alt="" class="img coupon" srcset=""></div>
  <br />
  <br />
  <div src="https://bennettfeely.com/clippy/pics/pittsburgh.jpg" alt="" class="img notching" srcset=""></div>
  <br />
  <br />
  <div src="https://bennettfeely.com/clippy/pics/pittsburgh.jpg" alt="" class="img outside-circle" srcset=""></div>
</body>

</html>
```

![clip-path](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/clip-path.png)
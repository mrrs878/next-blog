---
title: "SVG学习-stroke-dashoffset和stroke-dasharray"
tags: "SVG"
categories: "前端架构&软实力"
description: ""
createDate: "2021-11-24 13:35:30"
updateDate: "2021-11-25 21:54:36"
---


## 起因

周末玩游戏的时候发现游戏内有一个按钮的交互挺有趣，类似于这种效果

![button-svg](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/button-svg.gif)

点击后边框有一个进度条，鼠标长按进度会增加，抬起后回到起始位置

咦，有点意思

![因垂斯汀](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/interesting.gif)

于是就想着能不能使用前端的一些技术实现🤔

于是开始一系列的尝试（此处省略若干字），发现触及到知识盲区了😭，根本无从下手

![知识盲区](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/interesting2.png)

## 转机

突然不知道怎么就想到SVG了，想着要不试试？没准能行，然后一顿搜索，眼前一亮

有大佬使用`stroke`和`stroke-dashoffset`及`stroke-dasharray`做出进度条，同时又想到SVG可以和JavaScript交互，貌似可以实现我的需求

![奇怪的知识增加了](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/interesting3.png)

## stork-dashoffset和stork-dasharray

那么`stroke`和`stroke-dashoffset`以及`stroke-dasharray`是何方神圣腻？🤔

`stroke`: 描边，接受一个颜色值。可作用于大部分SVG元素

`stroke-dasharray`: 用于创建虚线描边

``` js
// 表示：虚线长10，间距10，然后重复 虚线长10，间距10
stroke-dasharray = '10'

// 表示：虚线长10，间距5，然后重复 虚线长10，间距5
stroke-dasharray = '10, 5'

// 当然还有更复杂的设置这里就不细讲了
```

`stroke-dashoffset`：字如其意，表示stroke的偏移。这个属性是相对于起始点的偏移，**正数**偏移x值的时候，相当于往**左**移动了x个长度单位，**负数**偏移x的时候，相当于往**右**移动了x个长度单位

需要注意的是，不管偏移的方向是哪边，要记得dasharray 是循环的，也就是 虚线-间隔-虚线-间隔。
`stroke-dashoffset`要搭配`stroke-dasharray`才能看得出来效果，非虚线的话，是无法看出偏移的。

概念有点抽象，来看一个MDN的例子，图中红线段是偏移的距离

![stroke-dashoffset](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/stroke-dashoffset.png)

上图效果分别是：
1. 没有虚线
2. `stroke-dasharray="3 1"` ，虚线没有设置偏移，也就是stroke-dashoffset值为0
3. `stroke-dashoffset="3"`，偏移正数，虚线整体左移了3个单位，图中3后面的红线段，就是起始线段，线段之后是1个单位的间隔，我们可见区域从这个间隔开始，然后循环 3-1,3-1的虚线-间隔-虚线-间隔
4. `stroke-dashoffset="-3"`，偏移负数，虚线整体右移动了3个单位，由于dasharray 是循环的，前面偏移的位置会有dasharray 填充上
5. `stroke-dashoffset="1"`，偏移正数，虚线整体左移了1个单位，最终呈现出来的效果跟 线段4 一样

**利用这两个属性，我们可以做出好看的动画效果**

1. 设置`stroke-dasharray`为*图形边长*

2. 设置`stroke-dashoffset`为*图形边长*
    
2. 动态减少`stroke-dashoffset`到0

简析：第一步后就有一个长度为图形边长的*长条*，第二步由于设置了`stroke-dashoffset`也为图形边长，因此*长条*会被推到不可见的位置，再通过第三步中动态减少`stroke-dashoffset`，第一步中绘制的*长条*就会慢慢*增长*并显示出来

## 再次挑战

刚开始是想使用`rect`来做的，但发现游戏中的按钮是有一定的圆角的，`rect`在设置圆角之后再添加`storke`有点丑，遂放弃，改用`path`实现

观察原图，实现思路如下：

1. 边框可以使用`path`绘制出来

2. 边框背景也使用`path`绘制（同一套`d`属性），设置一下`opacity`即可

3. 背景色使用SVG的`fill`填充出来

4. 文字使用`text`绘制

实现代码如下：

``` html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SVG</title>
    <style>
        #svg:active {
            opacity: 0.9;
        }
        #path, #background {
            stroke-width: 3;
            stroke: #f00;
            cursor: pointer;
            
            /** 
             * 修正位置，设置水平垂直居中
             */
            transform: translate(5px, 5px);
        }
        #background {
            opacity: 0.2;
        }
        #text {
            user-select: none;
            cursor: pointer;
            fill: #000;
            
            /** 
             * 设置水平垂直居中
             */
            dominant-baseline: middle;
            text-anchor: middle;
        }
    </style>
    <script>
        let rafId = -1;
        const WIDTH = 70;
        const HEIGHT = 30;
        const RADIUS = 6;
        const DEFAULT_OFFSET = 15;
        const STORK_LENGTH = (WIDTH + HEIGHT) << 1;
        const STEP = 5;

        /**
         * @description: 生成带有圆角的path
         */
        function roundedRect(w, h, tlr, trr, brr, blr) {
            return `M 0 ${tlr} A ${tlr} ${tlr} 0 0 1 ${tlr} 0 L ${w - trr} 0 `
                + `A ${trr} ${trr} 0 0 1 ${w} ${trr} L ${w} ${h - brr} `
                + `A ${brr} ${brr} 0 0 1 ${w - brr} ${h} L ${blr} ${h} `
                + `A ${blr} ${blr} 0 0 1 0 ${h - blr} Z`;
        }

        function animation() {
            const path = document.querySelector('#path');
            const preOffset = path.getAttribute('stroke-dashoffset');
            const newOffset = preOffset - STEP;
            path.setAttribute('stroke-dashoffset', newOffset);
            if (newOffset >= 0) {
                rafId = window.requestAnimationFrame(animation);
            } else {
                path.setAttribute('stroke-dashoffset', STORK_LENGTH - DEFAULT_OFFSET);
                alert('success');
            }
        }

        function onMouseDown() {
            rafId = window.requestAnimationFrame(animation);
        }

        function onMouseUp() {
            window.cancelAnimationFrame(rafId);
            path.setAttribute('stroke-dashoffset', STORK_LENGTH - DEFAULT_OFFSET);
        }

        window.addEventListener('load', () => {
            const path = document.querySelector('#path');
            const background = document.querySelector('#background');
            path.setAttribute('stroke-dashoffset', STORK_LENGTH - DEFAULT_OFFSET);
            path.setAttribute('stroke-dasharray', STORK_LENGTH);

            const roundedPath = roundedRect(WIDTH, HEIGHT, RADIUS, RADIUS, RADIUS, RADIUS);
            path.setAttribute('d', roundedPath);
            background.setAttribute('d', roundedPath);
        });
    </script>
</head>

<body>
    <svg id="svg" width="80" height="40" fill="#ccc" onmousedown="onMouseDown()" onmouseup="onMouseUp()"
        xmlns="http://www.w3.org/2000/svg">
        <path id="path"></path>
        <path id="background"></path>
        <text id="text" x="40" y="20">click me</text>
    </svg>
</body>

</html>
```

最终效果

![最终效果](https://mrrs878.github.io/awesome/static/img/button.gif)

[在线体验](https://mrrs878.github.io/awesome/interactive-button/index.html)

参考：

[SVG学习之stroke-dasharray 和 stroke-dashoffset 详解](https://www.cnblogs.com/daisygogogo/p/11044353.html)


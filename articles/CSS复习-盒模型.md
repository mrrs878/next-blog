---
title: "CSS复习-盒模型"
tags: "CSS"
categories: "2021复习"
description: ""
createDate: "2021-05-25 02:33:01"
updateDate: "2021-05-25 11:09:13"
---


> 可以认为每个html标签都是一个方块，然后这个方块又包着几个小方块，如同盒子一层层的包裹着，这就是所谓的盒模型。完整的 CSS 盒模型应用于块级盒子，内联盒子只使用盒模型中定义的部分内容。模型定义了盒的每个部分 —— margin, border, padding, and content —— 合在一起就可以创建我们在页面上看到的内容。为了增加一些额外的复杂性，有一个标准的和替代（IE）的盒模型。

![盒模型](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/box-model.png)

盒模型的各个部分

- Context，用来显示内容，可通过`width`和`height`来设置大小
- Padding，包围在内容区域外部的空白区域，可通过`padding`来设置大小
- Border，包裹`Content`和`padding`，可通过`border`来设置
- Margin，最外面的区域，是盒子和其他元素之间的空白区域，通过`margin`来设置

## 标准盒模型

在标准盒模型中，如果你给盒设置`width`和`height`，实际上设置的是`Content`的大小。`padding`+`border`+`margin`再加上设置的`width`和`height`才是盒子的大小

![标准盒模型](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/box-model-1.png)

## 替代（IE）盒模型

你可能会认为盒子的大小还要加上边框和内边距，这样很麻烦，而且你的想法是对的! 因为这个原因，css还有一个替代盒模型。使用这个模型，所有宽度都是可见宽度，所以内容宽度是该宽度减去边框和填充部分。

![标准盒模型](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/box-model-2.png)

默认浏览器会使用标准模型。如果需要使用替代模型，您可以通过为其设置 `box-sizing: border-box` 来实现。

如果你希望所有元素都使用替代模式，而且确实很常用，设置 box-sizing 在`<html>`元素上，然后设置所有元素继承该属性

``` css
html {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}
```

## 外边框折叠

如果有两个外边距相接的元素，这些外边距将合并为一个外边距，即最大的单个外边距的大小

## 参考

[盒模型](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/The_box_model)

[CSS盒模型详解](https://juejin.cn/post/6844903505983963143)
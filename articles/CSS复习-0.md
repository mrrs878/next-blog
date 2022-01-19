---
title: "CSS复习-0"
tags: "CSS"
categories: "2021复习"
description: ""
createDate: "2021-05-19 14:07:45"
updateDate: "2021-06-30 10:32:57"
---


## flex组合属性

``` css
flex: 1 1 100px;
```

是下面三个属性的缩写：

``` css
/* 指定了flex容器中剩余空间的多少应该分配给项目（flex增长系数） */
flex-grow: 1;
/*  flex 元素的收缩规则。flex 元素仅在默认宽度之和大于容器的时候才会发生收缩，其收缩的大小是依据 flex-shrink 的值 */
flex-shrink: 1;
/* 指定了 flex 元素在主轴方向上的初始大小 */
flex-basis: 100px;
```

不同组合所代表的意义：

``` css
/* 关键字值 */
flex: auto;
flex: initial;
flex: none;

/* 一个值, 无单位数字: flex-grow */
flex: 2;

/* 一个值, width/height: flex-basis */
flex: 10em;
flex: 30px;
flex: min-content;

/* 两个值: flex-grow | flex-basis */
flex: 1 30px;

/* 两个值: flex-grow | flex-shrink */
flex: 2 2;

/* 三个值: flex-grow | flex-shrink | flex-basis */
flex: 2 2 10%;

/*全局属性值 */
flex: inherit;
flex: initial;
flex: unset;
```

## media query

`<link rel="stylesheet" media="screen and (min-width:600px) and (max-width:900px)" href="style.css" type="text/css" />
`

`max-width`: 屏幕大小;

`max-device-width`: 分辨率大小

## offset/screen/scroll xxx

![offset/screen/scroll](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/offset.png)

## 居中

- `grid`布局
    ``` css
    display: grid;
    place-items: center;
    ```

## BFC

> 块格式化上下文（Block Formatting Context，BFC） 是Web页面的可视CSS渲染的一部分，是块盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域

通俗解释：

1. 一个独立的布局环境。BFC内部的元素布局与外部互不影响。
2. 一个工具。可以通过一些条件触发BFC，从而实现布局上的需求或解决一些问题

BFC的触发条件：

- 根元素`<html></html>`
- `float`不为`none`
- `overflow`不为`visible`
- `display`为`inline-block`、`table-cell`、`table-caption`、`flex`、`inline-flex`
- `position`为`absoulte`、`fixed`

BFC的特性：

- 属于同一个BFC的两个**相邻**容器的**上下**`margin`会发生重叠
- BFC的高度包括内部的浮动元素
- BFC不会与浮动元素发生重叠

清除浮动：

父元素设置`overflow: hidden`或`clear: both`

## link vs @import

- `link`是HTML方式，`@import`是css方式
- `link`最大限度支持并行下载，`@imoprt`过多嵌套导致串行下载
- `link`可以通过`rel="alternate stylesheet"`指定候选样式
- 浏览器对于`link`的支持早于`@import`
- `@import`必须放在css顶部

## flex宽度问题

``` html
<div class="container">
    <div class="left"></div>
    <div class="right"></div>
</div>
<style> 
.container{ 
    /* width: 600px; */
    width: 400px; 
    height: 300px; display:flex; 
} 
.left{ 
    flex: 1 2 300px;
} 
.right{ 
    flex: 2 1 200px;
} 
</style>
```

`.left` + `.right`的宽度已经超过`.container`的宽度了，所以会发生缩放，`flex-grow`不起作用，`flex-shrink`和`width`(`flex-basis`)决定具体的大小

具体的计算公式：

``` js

itemSkrinkScaledWidth = flex-shrink * width

shrinkRatio = itemSkrinkScaledWidth / totalShrinkScaledWidth

realWidth = width - shrinkRatio * negativeWidth 

// itemSkrinkScaledWidth 项目收缩比例宽度，flex-shrink * width
// totalShrinkScaledWidth 总的收缩比例宽度，total(flex-shrink * width)
// shrinkRatio 收缩比例
// negativeWidth 溢出的尺寸
// width 所设置的大小，width或flex-basis
// realWidth 真实大小
```

所以
``` js
leftWidth = 300 - (2 * 300 / (2 * 300 + 1 * 200)) * 100 = 225
rightWidth = 200 - (1 * 200 / (2 * 300 + 1 * 200)) * 100 = 175
```

注意：经测试，使用`min-width`设置时上述计算方法失效，大小正常，不发生缩小

## CSS3新特性

- 选择器 `:nth-child(x)`
- 样式`flex` `grid` `filter` `transform` `box-sizing`
- 动画`animation`
- 颜色`rgba`

## 清除浮动

### ::after + clear: both

``` css
.clear-float::after {
  content: "020"; 
  display: block; 
  height: 0; 
  clear: both; 
  visibility: hidden;  
}
```

### overflow不为none

### 父元素设置浮动

## 匹配前N个子元素及最后N个子元素

匹配前三个`:nth-child(-n+3)`

匹配最后三个`:nth-last-child(-n+4)`

## 参考

[MDN-flex](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex)

[MDN-bfc](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)

[BFC是什么？BFC有什么用？看完全明白](https://www.cnblogs.com/qs-cnblogs/p/12349887.html)

[个人总结（css3新特性）](https://segmentfault.com/a/1190000010780991)
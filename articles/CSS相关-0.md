---
title: "CSS相关-0"
tags: "CSS"
categories: "CSS"
description: ""
createDate: "2020-03-24 23:29:35"
updateDate: "10/1/2021, 3:34:43 AM"
---


## 盒模型

描述了元素如何显示，以及（在一定程度上）如何相互作用、相互影响。页面中的所有元素都被看作为一个矩形盒子，这个盒子包含元素的内容、内边距、边框、外边距。

盒模型分为两种：

- 标准盒模型（box-sizing = content-box）

  width = content-width

  height = content-height

- IE盒模型（box-sizing = border-box）

  width = content-width + padding + border

  height = content-height + padding + border

## 层叠上下文

层叠上下文是**包含一组图层的元素**。 在一组层叠上下文中，其子元素的**z-index值是相对于该父元素**而不是 `document root` 设置的。每个层叠上下文完全独立于它的兄弟元素。如果元素 B 位于元素 A 之上，则即使元素 A 的子元素 C 具有比元素 B 更高的`z-index`值，元素 C 也永远不会在元素 B 之上.

CSS 中的`z-index`属性控制重叠元素的垂直叠加顺序。`z-index`只能影响`position`值不是`static`的元素。

产生层叠上下文：

1. HTML中的根元素`<html></html>`本身就具有层叠上下文，称为**根层叠上下文**。

2. 普通元素设置`position`属性为**非**`static`值并设置`z-index`属性为具体数值，产生层叠上下文。

3. CSS3中的新属性也可以产生层叠上下文。

4. - 父元素的display属性值为`flex|inline-flex`，子元素`z-index`属性值不为`auto`的时候，子元素为层叠上下文元素；
   - 元素的`opacity`属性值不是1；
   - 元素的`transform`属性值不是`none`；
   - 元素`mix-blend-mode`属性值不是normal；
   - 元素的`filter`属性值不是`none`；

![z-index](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/z-index.png)

## link标签的rel属性

- `preload`

  让你在你的HTML页面中[head](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/head)标签内部书写一些声明式的资源获取请求，可以指明哪些资源是在页面加载完成后即刻需要的。对于这种即刻需要的资源，你可能希望在页面加载的生命周期的早期阶段就开始获取，在浏览器的主渲染机制介入前就进行预加载。这一机制使得资源可以更早的得到加载并可用，且更不易阻塞页面的初步渲染，进而提升性能。

- `prefetch`

  提示浏览器，用户未来的浏览有可能需要加载目标资源，所以浏览器有可能通过事先获取和缓存对应资源，优化用户体验。
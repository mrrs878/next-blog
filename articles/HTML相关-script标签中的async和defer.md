---
title: "HTML相关-script标签中的async和defer"
tags: "async defer"
categories: "HTML"
description: "script标签用于加载脚本与执行脚本，直接使用script脚本的话，浏览器会按照顺序来加载并执行脚本，在脚本加载&执行的过程中，会阻塞后续的DOM渲染。好在script提供了两种方式来解决上述问题，async和defer，这两个属性使得script都不会阻塞DOM的渲染"
createDate: "2022-01-24 20:25:33"
updateDate: "2022-01-24 22:01:46"
---

`script`标签用于加载脚本与执行脚本，直接使用`script`脚本的话，浏览器会按照顺序来加载并执行脚本，在脚本加载&执行的过程中，会阻塞后续的`DOM`渲染

![默认script加载顺序](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/defer-0.png)

好在`script`提供了两种方式来解决上述问题，`async`和`defer`，这两个属性使得`script`**都不会阻塞DOM的渲染**。
但既然会存在两个属性，那么就说明，这两个属性之间肯定是有差异的。

## defer

用来通知浏览器该脚本将在文档完成解析后，触发[DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event)事件前执行

有`defer`属性的脚本会阻止`DOMContentLoaded`事件，直到脚本被加载并且解析完成

如果有多个设置了`defer`的`script`标签存在，则会按照顺序执行所有的`script`

![defer](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/defer-1.png)

虽然`script3`加载快于`script2`，但由于`defer`存在，因此`script3`只能等`script2`执行完毕后再执行

## async

对于普通脚本，如果存在`async`属性，那么普通脚本会被并行请求，并尽快解析和执行

![async](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/defer-2.png)

`script3`加载快于`script2`，因此`script3`早于`script2`执行

## 图示

![defer-async图示](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/defer-async.png)

## 推荐的应用场景

### defer

如果你的脚本代码依赖于页面中的DOM元素（文档是否解析完毕），或者被其他脚本文件依赖。
例：
- 评论框
- 代码语法高亮
- polyfill.js

### async

如果你的脚本并不关心页面中的DOM元素（文档是否解析完毕），并且也不会产生其他脚本需要的数据。
例：
- 百度统计

如果不太能确定的话，用defer总是会比async稳定。。。

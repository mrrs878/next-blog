---
title: "React.js学习-合成事件"
tags: "React.js 合成事件"
categories: "React.js"
description: ""
createDate: "2021-05-06 08:29:57"
updateDate: "2021-05-06 16:30:04"
---


## 什么是合成事件

如果DOM上绑定了过多的事件处理函数，整个页面响应以及内存占用可能都会受到影响。React为了避免这类DOM事件滥用，同时屏蔽底层不同浏览器之间的事件系统差异，实现了一个中间层——**SyntheticEvent**

## 为什么使用合成事件

1. 兼容浏览器
2. 性能。避免大量节点绑定事件占用内存，将事件委托到`document`上，等事件**冒泡**到`document`上时，React将事件内容封装交给中间层`SyntheticEvent`（负责所有事件合成）

## 和原生事件的区别

1. React的所有事件都通过`document`进行统一分发。当真实Dom触发事件后冒泡到`document`后才会对React事件进行处理

2. 原生事件先执行

3. 不要混用，如果在原生事件中执行`stopPropagation`会导致React事件失效
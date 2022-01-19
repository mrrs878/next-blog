---
title: "React.js复习-0"
tags: "React.js"
categories: "2021复习"
description: ""
createDate: "2021-06-02 10:16:14"
updateDate: "2021-06-04 14:26:03"
---


## 事件合成

### 什么事件合成

在react中，我们绑定的事件`onClick`等，并不是原生事件，而是由原生事件合成的React事件，比如`click`事件合成为`onClick`事件。比如`blur`, `change`, `input`, `keydown`, `keyup`等 , 合成为`onChange`

### 为什么要合成事件

统一管理，消除浏览器差异性

### 事件触发流程

1. 执行`dispatchEvent`
2. 创建事件对应的合成事件`SyntheticEvent`
3. 收集捕获的回调函数和对应的节点实例
4. 收集冒泡的回调函数和对应的节点实例
5. 执行对应的回调函数，同时将`SyntheticEvent`作为参数传入

### 注意

- 原生事件的执行先于合成事件

## 路由懒加载/代码分割

webpack遇到`import()`时会将引入的模块打包成独立的bundle （`import()`函数会返回一个Promise），需要时会异步加载这些bundle


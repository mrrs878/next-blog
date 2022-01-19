---
title: "Vue.js研读-虚拟DOM"
tags: "Vue.js 虚拟DOM"
categories: "Vue.js"
description: ""
createDate: "2020-03-04 23:18:13"
updateDate: "10/1/2021, 3:34:43 AM"
---


## Vue.js为什么要引入虚拟DOM

虚拟DOM是通过状态生成一个虚拟节点树，然后使用虚拟节点树进行渲染。在渲染之前，会使用新生成的虚拟节点树和上次生成的虚拟节点树进行对比，只渲染不同的部分

在Vue.js中，当状态发生变化时，它在一定程度上知道哪些节点使用了这个状态，从而对这些节点进行更新操作，根本不需要比对（Vue.js 1.0）。但这样做缺点很明显：因为粒度太细，每一个绑定都会有一个对应的watcher来观察状态的变化，这样就会有一些内存开销以及依赖追踪的开销。当状态被越来越多的节点使用时，开销就越大。

因此Vue.js 2.0开始选择了一个中等粒度的解决方案，那就是引入虚拟DOM。组件级别是一个watcher实例。就是说即使一个组件内有10个节点使用了某个状态，但其实也只有一个watcher在观察这个状态的变化。所以当这个状态发生变化时，只能通知到组件，然后组件内部通过虚拟DOM去进行比对渲染，这是一个折中方案

![虚拟DOM](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/%E8%99%9A%E6%8B%9FDOM-0.png)

## VNode

vnode可以理解成节点描述对象，它描述了应该怎样去创建真实的DOM节点。渲染视图的过程是先创建vnode，然后再使用vnode去生成真实的DOM元素，最后再插入到页面渲染视图

vnode的类型包括：注释节点(isComment=true)、文本节点、元素节点(具有tag属性)、组件节点、函数式组件、克隆节点

![虚拟DOM](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/%E8%99%9A%E6%8B%9FDOM-1.png)

## patch

对比两个vnode之间的差异只是patch的一部分，这是手段，而不是目的。patch的目的是修改DOM节点，也可以理解为渲染视图。包括：创建新增的节点、删除已经废弃的节点、修改需要更新的节点

path的核心算法diff是通过**同层**的树节点进行比较而非对树进行逐层遍历的方式，所以时间复杂度只有O(n)

![](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/patch-0.png)

- 创建新节点

  事实上，只有三种类型的节点会被创建并插入到DOM中：元素节点、注释节点、文本节点

  - oldVnode中不存在而vnode中存在
  - oldVnode和vnode完全不是同一个节点

  ![创建节点](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/%E8%99%9A%E6%8B%9FDOM-2.png)

- 删除节点

  某个节点只在oldVnode中存在

- 更新节点

  oldVnode和vnode相同（通过sameVnode判断）

  判断依据：key、tag、isComment、data、input的type均相同
  
  ![更新节点](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/%E8%99%9A%E6%8B%9FDOM-3.png)

## DOM Diff过程

简单来说，diff有以下过程：

1. 同级比较，再比较子节点
2. 先判断一方有子节点而另一方没有子节点的情况
3. 比较都有子节点的情况（核心diff算法）
4. 递归比较子节点

![diff过程](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/diff-0.png)

## 核心DIFF算法

Vue2.0采用了**双端比较**的算法：同时从新旧children的两端开始进行比较，借助key值可以找到可复用的节点，再进行相关操作。
![diff-1](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/diff-1.png)
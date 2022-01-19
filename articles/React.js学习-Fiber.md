---
title: "React.js学习-Fiber"
tags: "React.js学习 Fiber"
categories: "React.js"
description: ""
createDate: "2020-09-10 9:48:54"
updateDate: "2020-09-22 23:15:01"
---


# WHAT

- 一种数据结构，它可以用一个纯 JS 对象来表示

```js
const fiber = {
    stateNode,  // 节点实例
    child,      // 第一个子节点
    sibling,    // 第一个兄弟节点
    return,     // 父节点
}
```

- 一种基于`requestIdleCallback`的调度算法

Fiber是一种将recocilation（递归diff）拆分成无数个小任务的算法；它随时能够停止、恢复。停止恢复的时机取决于当前的一帧（16ms）内，还有没有足够的事件允许计算

# WHY

React15在页面元素很多，且需要频繁刷新的场景下会出现掉帧的现象：

![React15渲染很多组件会出现掉帧](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/react15.gif)

其根本原因就是大量的同步计算阻塞了浏览器的UI渲染。当我们调用`setState`更新页面的时候，React会遍历应用的所有节点计算出差异然后更新UI。整个过程是**一气呵成，不能被打断**。如果页面元素很多，整个过程占用的时间就可能超过16ms，就容易出现掉帧的现象

针对这一问题，React团队从框架层面对web页面的渲染机制做了优化：

![React16优化后的效果](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/react16.gif)

# HOW

**递归改循环**

旧版React通过递归的方式进行渲染，使用的是JS引擎自身的函数调用栈，它会一直执行到栈空为止。而Fiber实现了自己组件调用栈，它以**链表**的形式遍历组件树，可以灵活的暂停、继续和丢弃执行的任务。实现的方式是使用了浏览器的`requestIdleCallback`

> window.requestIdleCallback()会在浏览器空闲时期依次调用函数，这就可以让开发者在主事件循环中执行后台或低优先级的任务，而且不会对像动画和用户交互这些延迟触发但关键的事件产生影响。函数一般会按先进先调用的顺序执行，除非函数在浏览器调用它之前就到了它的超时时间

React内部运作可分为3层：

- virtual DOM，描述页面长什么样
- reconciler，负责调用组件生命周期方法，进行Diff运算
- render，根据不同的平台，渲染出相应的界面

## reconciler

之前的`reconciler`被命名为`stack reconciler`，运行过程不能被打断：

![stackReconciler](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/stackReconciler.png)

而`fiber reconciler`每执行一段时间都会将执行权交回浏览器，可以分段执行：

![fiberReconclier](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/fiberReconciler.png)

`fiber reconciler`在执行过程中会分为两个阶段：

![fiberReconcilerPhase](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/fiberReconcilerPhase.png)

- 阶段一，生成`fiber`树，得出需要更新的节点信息。**可以被打断**
- 阶段二，将需要更新的节点依次批量更新，**这个过程不能被打断**

## fiber树

`fiber reconciler`在阶段一进行`diff`计算的时候会生成一颗`fiber`树。这棵树是在`virtual DOM`树的基础上增加额外的信息来生成的，本质来说是一个链表

![fiberTree](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/fiberTree.png)

`Fiber`树在首次渲染的时候会一次性生成。在后续需要`diff`的时候会根据已有树和最新`virtual DOM`的信息生成一颗新的树。这棵树每生成一个新的节点都会将控制权交回主线程，去检查有没有优先级更高的任务需要执行，如果没有则继续构建树的过程：

![fiberTreeBuild](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/fiberBuild.png)

在构建过程中如果有优先级更高的任务需要执行，则`fiber reconciler`会将需要更新的节点信息保存在`effect list中`，在阶段二执行的时候会批量更新相应的节点

# Ref

- [React Fiber 原理介绍](https://segmentfault.com/a/1190000018250127)

- [React 重温之 React Fiber](https://segmentfault.com/a/1190000015057505)

---
title: "React.js复习-一些理念"
tags: "React.js"
categories: "2021复习"
description: ""
createDate: "2021-05-30 14:41:42"
updateDate: "2021-06-01 18:00:03"
---


## 整体架构

- scheduler（调度器）
    调度任务的优先级，高优任务优先进入reconciler
- reconciler（协调器）
    负责找出发生变化的组件
- renderer（渲染器）
    负责将变化的组件渲染到页面上
    
## Fiber

具有三种不同的含义

1. 一种架构
    之前React15的reconciler采用递归的方式执行更新DOM的操作，数据保存在递归调用栈中，所以被称为**stack Reconciler**。React16的reconciler基于Fiber节点实现，被称为**Fiber Reconciler**
2. 一种数据结构
    每个Fiber节点对应一个React element，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息
3. 一个执行任务（工作单元）
    每个Fiber节点保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）
    
``` js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // 用于连接其他Fiber节点形成Fiber树
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;
}
```

## Fiber Reconciler

分为两个阶段，`commit`和`render`

- `commit`
    可中断，生成fiber树，收集effect
- `render`
    不可中断，根据收集到的effect更新DOM，执行一些生命周期函数和hooks（`useEffect`在渲染中之后执行）

## jsx vs fiber

JSX是一种描述当前组件内容的数据结构，它不包含组件`schedule`、`reconcile`、`render`所需的相关信息。

在组件**mount**时，`Reconciler`根据JSX描述的组件内容生成组件对应的`Fiber`节点。

在**update**时，`Reconciler`将JSX与`Fiber`节点保存的数据对比，生成组件对应的`Fiber`节点，并根据对比结果为`Fiber`节点打上标记

## 初次渲染流程

## 更新流程

1. 调用数据更新的方法(`this.setState`/`useState返回的更新方法`)
2. 进入**render**阶段
3. 采用**DFS**创建fiber树
4. 采用**reconcile算法**标记变化
5. 进入**commit**阶段
6. 执行4中变化对应的视图操作

## 参考

[React技术揭秘](https://react.iamkasong.com/)
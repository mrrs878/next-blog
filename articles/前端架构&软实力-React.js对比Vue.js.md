---
title: "前端架构&软实力-React.js对比Vue.js"
tags: "React.js对比Vue.js"
categories: "前端架构&软实力"
description: ""
createDate: "2020-04-28 23:09:43"
updateDate: "2021-02-20 17:15:36"
---


# 设计思想

## Vue.js

渐进式框架，采用自底向上增量开发的模式。

所谓渐进式就是把框架分层。

最核心的部分是视图层渲染，然后往外是组件系统，在这个基础上再加入路由机制，再加入状态管理，最外层是构建工具。

![渐进式](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/vue-5.png)

所谓分层，就是说既可以只用最核心的视图层渲染功能快速开发一些需求，也可以使用一整套全家桶来开发大型应用。Vue.js由足够的灵活性来适应不同的需求，所以开发者可以根据自己的需求选择不同的层级。

## React.js

声明式、组件化

React.js使创建交互式UI变得轻而易举。为应用的每一个状态设计简介地试图，当数据改变时React.js可以有效地更新并渲染组件。此外，React.js可以创建拥有各自状态的组件，再由这些组件构成更加复杂的 UI

# 组件间数据交互

## 父子组件

### Vue.js

Vue.js中父组件通过`props`传递数据给子组件，子组件使用`$emit`触发自定义事件，父组件中监听子组件的自定义事件获取子组件传递来的数据。

### React.js

React.js中父组件使用`props`传递数据和回调函数给子组件，子组件通过`props`传下来的回调函数返回数据，父组件通过回调函数获取子组件传递上来的数据。

## 跨级组件

### Vue.js

Vue.js中通过`provide / inject`在祖先组件向所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。

### React.js

React.js的`Context` 提供了一个无需为每层组件手动添加 `props`就能在组件树间进行数据传递的方法。在父组件创建一个`Context`对象，通过`Context.provider`的`value`属性向消费组件传值。

# 响应式原理

## Vue.js

Vue.js采用数据劫持&发布-订阅模式来实现响应式，Vue.js在创建`vm`的时候，会将数据配置在实例当中，然后通过`Object.defineProperty`对数据进行操作，为数据动态添加了`getter`与`setter`方法，当获取数据的时候会触发对应的`getter`方法，当设置数据的时候会触发对应的`setter`方法，从而进一步触发`vm`的`watcher`方法，然后数据更改，`vm`则会进一步触发视图更新操作。

## React.js

React.js中组件不允许通过`this.state`这种方式直接更改组件的状态。自身设置的状态，可以通过`setState`来进行更改。在`setState`中，传入一个对象，就会将组件的状态中键值对的部分更改，还可以传入一个函数，这个回调函数必须向上面方式一样的一个对象函数可以接受`prevState`和`props`。React.js在接收到用户状态改变通知后，会根据当前渲染树，结合最新的状态改变，通过Diff算法，计算出树中变化的部分，然后只更新变化的部分（DOM操作），从而避免整棵树重构，提高性能。

![React更新过程](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/reactSetData.png)

# Diff算法

## Vue.js

1. 同级比较，再比较子节点
2. 先判断一方有子节点而另一方没有子节点的情况
3. 比较双方都有子节点的情况（[核心diff算法](https://www.jianguoyun.com/static/stackedit/[http://blog.p18c.top/2020/03/04/Vue.js研读-虚拟DOM/](http://blog.p18c.top/2020/03/04/Vue.js研读-虚拟DOM/))）
4. 递归比较子节点

## React.js（[Diff详解](https://www.jianguoyun.com/static/stackedit/[https://zhuanlan.zhihu.com/p/20346379](https://zhuanlan.zhihu.com/p/20346379))）

![React.js DOM Diff](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/reactDomDiff.png)

# 生命周期

## Vue.js

1. beforeCreate

`new Vue()`后触发的第一个钩子，在当前阶段`data`、`methods`、`computed`以及`watch`上的数据和方法均不能被访问

1. created

在实例创建完成之后触发，当前阶段已完成了数据观测，也就是可以使用数据，更改数据，这时更新不会触发`updated`钩子。可以**做一些初始数据的获取**，在当前阶段**无法访问DOM**（可使用vm.$nextTick）

1. beforeMount

发生在挂载之前，在这之前template已导入渲染函数编译，而且当前阶段虚拟DOM已创建完成，即将开始渲染。在此时也可以对数据进行更改，不会触发`updated`

1. mounted

在挂载之后被触发。在当前阶段，真实的DOM被挂载完毕，数据完成双向绑定，可以访问到DOM，可以使用`$ref`属性对DOM进行操作

1. beforeUpdate

在界面发生更新之前被触发。也就是响应式数据发生改变之前、虚拟DOM重新渲染之前被触发，可以在此阶段对数据进行修改，不会造成重渲染

1. updated

早发生更新之前被触发。当前阶段DOM已完成更新。要注意的是避免在此期间更新数据，因为这样可能会造成无限循环的更新

1. beforeDestory

在实例销毁之前触发。在当前阶段实例完全可以被使用，可以在此阶段做些善后工作，如清除定时器

1. destoryed

在实例销毁之后触发。这时候只剩下DOM，组件已被拆解、数据绑定被卸载、监听被移除、子实例也统统被销毁

## React.js（[生命周期详解](https://www.jianguoyun.com/static/stackedit/[https://www.jianshu.com/p/b331d0e4b398](https://www.jianshu.com/p/b331d0e4b398))）

![React.js生命周期](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/reactLifeCycle.png)

![React.js生命周期1](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/reactLifeCycle-1.png)
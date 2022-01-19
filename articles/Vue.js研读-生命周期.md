---
title: "Vue.js研读-生命周期"
tags: "Vue.js"
categories: "Vue.js"
description: ""
createDate: "2020-03-06 23:29:53"
updateDate: "10/1/2021, 3:34:43 AM"
---


## 生命周期概览

![生命周期](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/lifecycle.png)

## 生命周期函数

- beforeCreate

  `new Vue()`之后触发的第一个钩子，在当前阶段`data`、methods、`computed`以及watch上的数据和方法均不能被访问

- created

  在实例创建完成之后触发，当前阶段已完成了数据观测，也就是可以使用数据，更改数据，在这个更改数据不会触发`updated`函数。可以做一些**初始数据的获取**，在当前阶段无法获取DOM（可使用vm.$nextTick）

- beforeMounte

  发生在挂载之前，在这之前template模板已导入渲染函数编译。而当前阶段虚拟DOM已创建完成，即将开始渲染。在此时也可以对数据进行更改，不会触发`updated`

- mounted

  在挂载之后被触发。在当前阶段，真实的DOM被挂载完毕，数据完成双向绑定，可以访问到DOM阶段，使用$ref属性对DOM进行操作

- beforeUpdate

  在界面发生更新之前被触发。也就是响应式数据发生改变之前、虚拟DOM重新渲染之前被触发，可以在此阶段进行更改数据，不会造成重渲染

- updated

  在发生更新之后被触发。当前阶段DOM已完成更新。要注意的是避免在此期间更改数据，因为这可能会导致无限循环的更新

- beforeDestory

  在实例被销毁之前触发。在当前阶段实例完全可以被使用，可以在此阶段做些善后工作，如清除定时器

- destoryed

  在实例被销毁之后触发。这个时候只剩下DOM，组件已被拆解，数据绑定被卸载、监听被移除、子实例也统统被销毁

## 组件的生命周期函数调用顺序

- 加载渲染顺序

  父beforeCreate👉父created👉父beforeMmount👉子beforeCreate👉子created👉子beforeMount👉子mounted👉父mounted

- 更新顺序

  父beforeUpdate👉子beforeUpdate👉子updated👉父updated

- 销毁顺序

  父beforeDestory👉子beforeDestory👉子destoryed👉父destoryed


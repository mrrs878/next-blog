---
title: "vue-router剖析"
tags: "Vue.js vue-router"
categories: "Vue.js"
description: ""
createDate: "2020-03-09 22:05:40"
updateDate: "10/1/2021, 3:34:43 AM"
---


# 路由

路由最早由后端提出，用于根据不同的请求返回不同的页面。大致流程如下：

1. 浏览器发出请求
2. 服务器监听到端口有请求过来
3. 根据服务器的路由配置，返回相应信息（可以是html、json、图片等）
4. 浏览器根据数据包的`Context-Type`来决定如何解析

# 前端路由

随着`ajax`的流行，异步数据请求交互在不刷新浏览器的情况下运行。而异步交互体验的高级版本就是SPA-单页应用。单页应用不仅仅是在页面交互是无刷新的，连页面跳转都是无刷新的，为了实现单页应用，所以就有了前端路由。类似于后端路由，前端路由就是匹配不同的url路径进行解析，然后动态渲染html内容。

## hash模式

`https://www.xxx.com/#/hash`

这种`#`后面`hash`值得变化，并不会触发新的请求，因此也不会刷新页面。每次`hash`值的变化都会触发`hashchange`事件，通过这个事件就可以知道更新哪些页面内容

```js
window.onhashchange = e => {
    console.log(e.oldURL, e.newURL)
    const hash = location.hash.slice(1)
    app.innerHTML = hash
}
```

## history模式

`https://www.xxx.com/login`

随着HTML5的发布，带来了两个新的API：`pushState`和`replaceState`，通过这两个API可以改变url地址且不会发送请求。同时还有`popstate`事件用来监听url的改变。使用history模式，url就不会出现丑陋的`#`，url也变得比较美观。

通过history api去掉了丑陋的`#`，但也存在问题：不怕前进/后退，就怕**刷新**。因为刷新是去请求服务器的，在`hash`下，前端路由修改的是#之后的内容，在发送请求时是不会带上的，但在history下可以自由地修改路径、参数，当刷新时，如果服务器中没有相应的响应或资源，容易爆`404`

# vue-router核心原理

1. 通过`new VueRouter`中的`mode`参数来选择使用那种路由模式

2. 在`router`中使用`current`保存当前url

3. 作为一个插件，大部分功能都在`install`函数中完成

4. 在`install`中使用`Vue.mixin`注入的`beforeCreate`来给组件添加全局唯一的`router`实例（挂载在根组件上，其余组件通过`$parent._routerRoot._router`挂载）

5. 使用`popstate`或`hashchange`两个事件来监听url变化（针对于手动输入url）并设置`current`

6. 使用`Vue.util.defineReactive(this, '_route', this._router.history.current)`来使`router`变为响应式

   current变化	👉	重新渲染`router-view`中的组件 

7. 解析路由配置从而可以更加便利地找到url所对应的页面

   ```js
   Array<{ name: component }>
   ```

   👇

   ```js
   Map<{ name: component }>
   ```

8. 实现`<router-link></router-link>`和`<router-view / >`两个组件

# 总结

`vue-router`以插件方式侵入`Vue`，从而支持一个额外的`router`属性，以提供监听并改变组件路由数据的能力，这样每次路由发生变化后，可以同步到数据，从而响应式地触发组件的更新

![vue-router](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/vue-router.png)

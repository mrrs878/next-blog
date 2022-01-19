---
title: "Vue.js学习-基础"
tags: "Vue.js"
categories: "Vue.js"
description: ""
createDate: "2020-04-18 21:04:39"
updateDate: "10/1/2021, 3:34:43 AM"
---


# 生命周期钩子函数

- beforeCreate

  获取不到props/data

- created

  可以获取到props/data，组件未挂载

- beforeMount

  开始创建VDOM

- mounted

  将VDOM渲染为真实DOM并渲染数据，组件中如果有子组件的话会递归挂载子组件，只有当所有子组件全部挂载完毕才会执行跟组件的挂载钩子

- beforeUpdate/updated

  分别在数据更新前/更新时调用。不能在updated里做更新，会造成死循环

- beforeDestory

  适合移移除事件、定时器等

- destoryed

  所有子组件都销毁完毕后会执行根组件的destoryed

# 组件通信

- `props/$emit`
  通过props将数据自伤而下传递；通过$emit/v-on来向上传递消息

- eventbus
  通过eventbus进行消息的发布订阅

- vuex
  全局数据管理库，可通过vuex管理全局的数据流

- ```
  $attrs/$listeners
  ```

  可以进行跨级的组件通信

  ```js
  // 父组件
  <template>
  	<div class="home">
  		<m-input type="text" title="姓名" v-model="name"></m-input>
  	</div>
  </template>
  <script>
  import MInput from "@/components/MInput.vue";
  
  export default {
  	name: "home",
  	data() {
  		return {
  			name: "zhangsan"
  		};
  	},
  	components: {
  		MInput
  	}
  };
  </script>
  
  // 子组件
  <template>
  	<div class v-bind="$attrs">
  		<input v-bind="$attrs" @input="$emit('input',$event.target.value)" :value="value" />
  	</div>
  </template>
  <script>
  export default {
  	inheritAttrs: false,
  	props: {
  		value: String,
  		default: ""
  	}
  };
  </script>
  ```

- proveded/inject
  允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并且在其上下游关系成立的时间内始终有效

# mixin和mixins的区别

- mixin用于全局混入，会影响到每个组件实例（vuex、vue-router等插件实现核心机制）
- mixins常用来扩展组件

# computed和watch的区别

- computed是计算属性，依赖其他属性计算值，并且computed的值有缓存，只有当计算值发生变化才返回内容
- watch监听到值的变化就会执行回调，在回调中可以进行一些逻辑操作

一般来说需要依赖别的属性来动态获得值得时候可以使用computed，对于监听到值的变化需要做一些**复杂业务逻辑**的情况可以使用watch

[实现原理](https://www.jianguoyun.com/static/stackedit/[http://blog.p18c.top/2020/03/03/Vue.js研读-1/](http://blog.p18c.top/2020/03/03/Vue.js研读-1/))

## computed如何知道依赖

1. Vue.js实例初始化过程中，将所有计算属性包装为lazy watcher
2. 首次访问计算属性时，watcher为dirty，此时开始计算watcher的值
3. 计算开始之前，此watcher将被设置为依赖目标，开始收集依赖
4. 计算watcher值的过程中，被访问到属性的getter中会检查是否存在依赖目标，若存在依赖目标就会创建依赖关系
5. watcher的值计算完成后，新的依赖被设置，旧的依赖会被删除，依赖收集完成
6. 当依赖属性更新时，会通知自身的依赖目标，watcher被设置为dirty
7. 再次访问该计算属性，重复计算及依赖收集步骤（3-6）

# keep-alive有什么作用

如果需要在组件切换的时候**保存一些组件的状态防止多次渲染**，就可以使用`keep-alive`组件包裹需要保存的组件。对于`keep-alive`组件来说，它有两个独有的声明周期钩子函数，分别为`activated`、和`deactivated`。用`keep-alive`包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行`deactivated`钩子函数，命中缓存渲染后会执行`activated`钩子函数。

# v-show和v-if的区别

- `v-show`只是在`display:none`和`display:block`之间切换，无论初始条件是什么DOM都会被创建，后面只需切换CSS。所以总的来说`v-show`在初始渲染时有着更高的开销，但切换开销很小，适合频繁切换的场景。
- `v-if`的话关于到Vue底层的编译。当初始属性为`false`时，组件就不会被渲染，直到条件为`true`。并且切换条件时会触发销毁/挂载组件及回流。所以总的来说在**创建时开销较小，切换时开销大，适合不经常切换的场景**，并且基于`v-if`这种惰性渲染机制，可以在必要的时候才去渲染组件，**减少整个页面的初始渲染开销**

# data为什么使用函数

**组件复用时所有组件实例都会共享data**，如果data是对象的话，就会造成一个组件修改data后影响其他组件，所以有必要将data写成函数，每次用到就调用一次函数获得新的数据

当使用`new Vue()`的方式时，无论我们将data设置为对象函数函数都是可以的，因为`new Vue()`的方式是生成一个根组件，该组件不会被复用也就不会存在共享data的情况了

# Vue.js响应式原理

对于Object，基于发布订阅模式，使用`Object.defineProperty`，在`getter`中收集依赖，在`setter`中通知依赖。当一个vue组件实例创建的时候，vue会遍历`data`选项的属性，用`Object.defineProperty`将它们转换为`getter/setter`并且在内部追踪相关依赖，在属性被访问和修改时通知变化。每个组件实例都有相应的`watcher`实例，它会在组件渲染的过程中把属性记录为依赖，只有当依赖项的`setter`被调用时，会通知`watcher`重新计算从而使它管理的组件得以更新

对于Array，基于函数劫持，改写数组原型方法，并遍历数组，对于是对象的项使用👆的方法进行观测

# Vue.js的特点

- 简洁
- 数据驱动，自动计算属性和追踪依赖的模板表达式
- 组件化，高科服用、解耦的组件来构建页面
- 快速，精确有效批量DOM更新
- 模板友好

# `$nextTick`

Vue.js实现响应式并不是在数据发生变化后dom立即变化，而是按照一定的策略来进行dom更新。nextTick是在下次dom更新循环结束之后执行延迟回调，在修改数据之后使用*n**e**x**t**T**i**c**k*是在下次*d**o**m*更新循环结束之后执行延迟回调，在修改数据之后使用nextTick，则可以在回调中获取更新后的dom

渲染节流

# `v-for`中`key`的作用

当vue更新通过v-for渲染的元素时，它默认使用**就地复用**的策略，如果数据项的顺序被改变，vue将不是移动dom元素来匹配数据项的改变，而是简单复用此处每个元素，并且确保它在特定的索引下显示已经被渲染过的每个元素。为了给vue一个提示，以便它能跟踪每个节点的身份，从而重用和重新排序所有元素，需要给vue提供一个唯一key属性

key **主要用在vue的虚拟dom算法**，在新旧node对比时辨识vnodes。如果不使用key，vue会使用一种最大限度减少动态元素并且尽可能的尝试修复/再利用相同类型元素的算法，使用key，它会基于key的变化重新排列元素顺序，并且会移除key不存在的元素

# `$router`和`$route`

- `$router`是路由信息对象，包括`path、params、hash、query、fullPath、matched、name`等路由信息参数
- `$route`是路由实例，包括了路由跳转方法、钩子函数等

# `@click.native`中`native`的作用

对于普通标签，`@click`会监听点击事件，而对于写在组件上的`@click`，如果不加`native`，则代表坚挺的是组件的点击事件，而不是组件内的点击事件，因此，在组件内写的`click handler`不会被执行

# `v-model`

`v-model`常用于表单元素上进行数据的双向绑定，比如``。除了原生的元素，它还能在自定义组件中使用

```
v-model`是一个语法糖，可以拆解为`props: value`和`events:input`。就是说组件必须提供一个名为`value`的`prop`以及名为`input`的自定义事件，满足这两个条件就能在自定义组件上使用`v-model
```

# 作用域插槽

一种带有数据的插槽

普通插槽 = 父组件设置的样式 + 父组件通过props传递的数据

作用域插槽 = 父组件设置的样式 + **自身的数据**（该数据父组件也可以访问得到）
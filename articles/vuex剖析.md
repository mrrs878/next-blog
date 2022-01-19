---
title: "vuex剖析"
tags: "Vue.js vuex"
categories: "Vue.js"
description: ""
createDate: "2020-03-10 20:50:56"
updateDate: "10/1/2021, 3:34:43 AM"
---


vuex是专门为Vue.js设计的**状态管理工具**，它采用**集中式存储**管理应用的所有状态，并以相应的规则保证状态以一种可预测的方式发生变化。

## vuex的构成

- 引入`State`、`Getter`对状态进行定义

- 使用`Mutation`、`Action`对状态进行修改

- 使用`Module`对状态进行模块化分割

- 引入插件对状态进行快照、记录、跟踪等

- 提供`mapState`、`mapGetters`、`mapActions`、`mapMutations`辅助函数方便开发者处理store

  ![vuex组成](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/vuex-0.png)

## vuex原理

### vuex的store是如何注入到组件中的

- 通过vue的[mixin](https://cn.vuejs.org/v2/guide/mixins.html)机制，在`install`函数中借助于vue的`beforeCreate`生命周期函数

  ```js
  Vue.mixin({ beforeCreate: vuexInit })
  ```

- 在`beforeCreate`中调用vuexInit将store挂载到当前实例上

  ```js
  function vuexInit () {
      const options = this.$options
      // store injection
      if (options.store) {
          // 根组件通过options.store挂载
          this.$store = typeof options.store === 'function'
              ? options.store()
          	: options.store
          // 其余组件通过父组件上的store挂载
      } else if (options.parent && options.parent.$store) {
          this.$store = options.parent.$store
      }
  }
  ```

  ![store注入](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/vuex-1.jpg)

### vuex的state和getter是如何映射到各个组件实例中自动更新的

#### state

```js
class Store {
    construcor () {
        resetStoreVM()
    }
    get state () {
    	return this._vm._data.$$state
	}
}

function resetStoreVM() {
   	store._vm = new Vue({
       	data: {
       		$$state: state
       	},
      	computed
    })
}
```

从源码得知，当使用`this.$store.state.xxx`时会被代理到`store._vm._data.$$state`上，而`store._vm`是一个Vue实例，由于示例中的data是响应式的，所以$$state也是响应式的，那么当更新state时，所有相关组件中的state也会自动更新

#### getter

```js
function resetStoreVM() {
    forEachValue(wrappedGetters, (fn, key) => {
    	// use computed to leverage its lazy-caching mechanism
    	// direct inline function use will lead to closure preserving oldVm.
    	// using partial to return function with only arguments preserved in closure environment.
        computed[key] = partial(fn, store)
        Object.defineProperty(store.getters, key, {
            get: () => store._vm[key],
            enumerable: true // for local getters
        })
    })
}
```

从源码得知，当使用`this.$store.getter.xxx`时会被代理到`store._vm.xxx`，其中添加`computed`属性

从上面可以看出，vuex中的`state`是借助于一个Vue.js实例，将`state`存入实例的`data`中；Vuex中的`getter`则是借助于实例的计算属性`computed`实现数据监听

![state、getter响应式](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/vuex-3.png)
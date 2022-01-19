---
title: "Vue.js研读-响应式"
tags: "Vue.js 响应式"
categories: "Vue.js"
description: ""
createDate: "2020-03-03 23:15:13"
updateDate: "10/1/2021, 3:34:43 AM"
---


## 响应式原理

![响应式管理](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/vue-1.png)

Data通过`Observer`转换成了**getter/setter**的形式类追踪变化

当外界通过`Watcher`读取数据（Compile时会根据**{}**、**v-***来创建Watcher）时会触发getter从而将Watcher添加到依赖中

当数据发生变化时，会触发setter，从而向`Dep`中的依赖（Watcher）发送通知

Wacher接收到通知后，会向外界发送通知，变化通知到外界后可能会触发视图更新，也有可能触发用户的某个回调函数



## 简易版响应式（Proxy + Observer/Watcher/Dep）

``` js
let uid = 0

function parsePath(obj, path) {
    if (path === "") return obj
    return path.split(".").reduce((data, current) => data[current], obj)
}

function defineReactive (data) {
    if (typeof data !== "object") return data
    let dep = new Dep()
    return new Proxy(data, {
        set: (target, prop, value, receiver) => {
            const oldVal = target[prop]
            const res = Reflect.set(target, prop, defineReactive(value), receiver)
            if (oldVal !== value) dep.notify()
            return res
        },
        get: (target, prop, receiver) => {
            dep.depend()
            return Reflect.get(target, prop, receiver)
        }
    })
}

class Observer {
    constructor (vm) {
        if (typeof vm !== "object") throw new TypeError("vm must be an object")
        this.walk(vm)
        return defineReactive(vm)
    }
    walk (vm) {
        Object.keys(vm).forEach(item => {
            if (typeof vm[item] === "object") this.walk(vm[item])
            vm[item] = defineReactive(vm[item])
        })
    }
}

class Dep {
    constructor () {
        this.id = uid++
        this.subs = []
    }
    addSub (sub) {
        this.subs.push(sub)
    }
    depend () {
        Dep.target && Dep.target.addDep(this)
    }
    notify () {
        this.subs.slice().forEach(item => item.update())
    }
    removeSub (sub) {
        const index = this.subs.indexOf(sub)
        index > -1 && this.subs.splice(index, 1)
    }
}

class Watcher {
    constructor (vm, exp, cb) {
        this.vm = vm
        this.exp = exp
        this.cb = cb
        this.deps = []
        this.depIds = new Set()
        this.value = this.get() 
    }
    get () {
        Dep.target = this
        let value = parsePath(this.vm, this.exp)
        Dep.target = undefined
        return value
    }
    update () {
        const oldValue = this.value
        this.value = this.get()
        this.cb.call(this.vm, this.value, oldValue)
    }
    addDep (dep) {
        if (this.depIds.has(dep.id)) return
        this.depIds.add(dep.id)
        this.deps.push(dep)
        dep.addSub(this)
    }
    teardown () {
        this.deps.forEach(item => item.removeSub(this))
    }
}

function watch(vm, exp, cb, options = {}) {
    const watcher = new Watcher(vm, exp, cb)
    if (options.immediate) cb.call(vm, watcher.value)
    return watcher.teardown.bind(watcher)
}

export { Observer, watch }
```

``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
</body>
<script src="./mvvm.js"></script>
<script>
    const data = new Observer({
        student: {
            name: "tom",
            age: 23
        },
        address: {
            province: {
                id: 41,
                view: "河南"
            }
        },
        friends: [ "zhangsan", "lisi", "wangwu" ],
    })
    new Watcher(data, "student", val => {
        console.log('update student', val)
    })
    new Watcher(data, "student.name", val => {
        console.log('update student.name', val)
    })
    new Watcher(data, "student.age", val => {
        console.log('update student.age', val)
    })
    new Watcher(data, "address.province.id", val => {
        console.log("update address.province.id", val);
    })
    new Watcher(data, "friends.length", val => {
        console.log('update student.friends', data.friends[val - 1]);
    })
    const unwatch = watch(data, "address.province.view", val => {
        console.log('address.province.view', val);
    })
</script>
</html>
```

## $vm.watch(expOrFn, callback, [options])

用于观察一个表达式或computed函数在Vue.js实例上的变化。回调函数调用时，会从参数中得到oldValue和newValue

vm.$watch其实是对Watcher的一种封装，没有缓存性，通过Watcher完全可以实现vm.$watch的功能

1. 先执行new Watcher来实现vm.$watch的基本功能
2. 判断用户是否使用immediate参数，如果使用了则立即执行一次cb
3. 判断用户是否使用deep参数，如果使用除了要触发当前这个被监听数据的依赖收集的逻辑之外，还要把当前监听的这个值在内的所有子值都要触发一遍依赖收集逻辑
4. 返回一个函数unwatchFn，用于取消观察数据

## $vm.computed

`computed`是定义在`vm`上的一个特殊的`getter`方法。之所以说特殊是因为在vm上定义`getter`方法时，`get`并不是由用户提供的函数，而是Vue.js内部的一个代理函数。在代理函数中可以结合`Watcher`实现缓存与收集依赖等功能。在模板中使用一个数据渲染视图时，如果这个数据恰好是计算属性，那么读取数据这个操作其实会触发计算属性的`getter`方法。

当这个getter方法被触发时会做两件事：

1. 计算当前属性的值，此时会使用Watcher去观察计算属性中用到的所有其他数据的变化。同时将计算属性的Watcher的dirty属性设置为false，这样再次读取计算属性时将不再重新计算，除非计算属性所依赖的值发生了变化
2. 当计算属性中用到的树发生变化时，将得到通知从而进行重新渲染操作

我们知道计算属性的结果会被缓存，且只有在计算属性所依赖的响应式属性或者计算属性的返回值发生变化时才会重新计算。这是结合`Watcher`的`dirty`属性来分辨的：当`dirty===true`时，说明需要重新计算“计算属性”的返回值；当计算属性中的内容发生变化后，计算属性的`Watcher`与组件的`Watcher`都会得到通知。计算属性的`Watcher`会将自己的`dirty`属性设置为true，当下一次读取计算属性时就会重新计算一次值。与此同时组件的`Watcher`也会得到通知，从而执行render函数进行重新渲染的操作。由于要重新执行`render`函数，所以会重新读取计算属性的值，这时候计算属性的Watcher已经把自己的`dirty`置为`true`，所以会重新计算一次计算属性的值用于本次渲染

![computed原理0](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/computed-0.png)

这种方式实现的computed有一个弊端：只是观察它所用到的数据是否发生了变化，并**没有真正去校验它自身的返回值是否有变化**，所以当它所使用的数据发生变化后，组件**总会重新走一遍渲染流程**。

为解决这个问题，新版计算属性做了一些改动：组件的Watcher不再观察计算属性用到的数据的变化，而是让计算属性的Watcher得到通知后计算一次计算属性的值，如果发现这一次计算属性的值与上一次计算出来的值不一样，再去主动通知组件的Watcher进行重新渲染操作。

![computed原理1](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/computed-1.png)
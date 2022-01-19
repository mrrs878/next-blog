---
title: "Vue.js学习-$nextTick"
tags: "$nextTick"
categories: "Vue.js"
description: ""
createDate: "2020-05-07 23:20:25"
updateDate: "2020-10-16 17:33:23"
---


# [异步更新]([https://cn.vuejs.org/v2/guide/reactivity.html#%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97](https://cn.vuejs.org/v2/guide/reactivity.html#%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97))

Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。

这样做主要是为了提升性能，因为如果在主线程中更新DOM，循环100次就要更新100次DOM；但是如果等待事件循环完成之后再更新DOM，只需要更新一次。为了在数据更新操作之后操作DOM，我们可以在数据变化之后立即使用`Vue.nextTick(callback)`；这样回调函数会在DOM更新完成后被调用，就可以拿到最新的DOM元素了。

# `$nextTick`源码分析

```js
// /src/core/util/next-tick.js
const callbacks = []
let pending = false
let timerFunc

export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    timerFunc()
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```
每次调用$nextTick就是在向callbacks新增回调函数.callbacks新增回调函数后又执行了timerFunc函数，`pending`用来标识同一个时间只能执行一次。
```js
export let isUsingMicroTask = false
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  //判断1：是否原生支持Promise
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  //判断2：是否原生支持MutationObserver
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  //判断3：是否原生支持setImmediate
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  //判断4：上面都不行，直接用setTimeout
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}
```
`timerFunc`做了四个判断，对当前环境进行不断的降级处理，尝试使用原生的`Promise.then`、`MutationObserver`和`setImmediate`，上述三个都不支持最后使用setTimeout；降级处理的目的都是将`flushCallbacks`函数放入微任务(判断1和判断2)或者宏任务(判断3和判断4)，等待下一次事件循环时来执行。`MutationObserver`是Html5的一个新特性，用来监听目标DOM结构是否改变，也就是代码中新建的textNode；如果改变了就执行`MutationObserver`构造函数中的回调函数，不过是它是在微任务中执行的。
```js
function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}
```
`flushCallbacks`把`callbacks`数组复制一份，然后把`callbacks`置为空，最后把复制出来的数组中的每个函数依次执行一遍；所以它的作用仅仅是用来执行`callbacks中`的回调函数。

# 总结

`$nextTick`的总体流程大致是：

1. 把回调函数放入`callbacks`中执行，`callpacks.push`
2. 将执行函数放到微任务会宏任务中，`timerFunc`
3. 事件循环到了微任务或宏任务，执行函数依次执行`callbacks`中的回调，`flushCallbacks`
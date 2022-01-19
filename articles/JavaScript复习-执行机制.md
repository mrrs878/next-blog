---
title: "JavaScript复习-执行机制"
tags: "JavaScript 执行机制 EventLoop"
categories: "2021复习"
description: ""
createDate: "2021-05-13 10:25:45"
updateDate: "2021-06-10 11:03:31"
---


众所周知，JavaScript是一门**单线程**、**异步执行**的语言。虽然在HTML5中提出了`web worker`（可以理解为**浏览器**为JavaScript开的*外挂*），但JavaScript是单线程运行的这一核心仍未改变，所有多线程都是通过单线程**模拟**出来的

## JavaScript的执行与运行

执行与运行不太一样，在不同环境下，比如Node.js、浏览器下，JavaScript的执行结果是不一样的；而运行大多是指基于JavaScript引擎，如V8，结果是一致的

## JavaScript中的异步

JavaScript中的异步主要通过event loop进行模拟，当我们执行JavaScript代码的时候其实就是往执行栈里放入函数，那么遇到异步代码怎么办？其实当遇到异步代码时，会被挂起并在需要执行的时候加入到**task**（有多种task）队列中。一旦执行栈为空，event loop就会从task中拿到需要执行的代码并放入执行栈中执行，所以本质上说JavaScript的异步还是同步行为

## 浏览器中的event loop

来自不同的**任务源**的任务会被分配到不同的task队列中，任务源可以分为**微任务(micro task)** 和 **宏任务(macro task)**。在ES6规范中，微任务被称为**jobs**，宏任务被称为**task**

微任务包括：`precess.nextTick`、`Promise`、`Mutation Observer`

宏任务包括：`script`、`setTimeout`、`setInterval`、`I/O`、`UI Rendering`

**宏任务中包含了 `script` ，因此浏览器会先执行一个宏任务，接下来由异步代码的话才会先执行微任务**

**Promise的构造函数是同步执⾏，`then()`是异步执行**

event loop 执行顺序

1. 先执行宏任务
2. 当执行完后**执行栈为空**，查询是否有异步代码需要执行
3. **执行所有微任务**
4. 当执行完所有微任务，如有需要会渲染页面
5. 然后开始下一轮循环

![event loop](http://mrrsblog.oss-cn-shanghai.aliyuncs.com/browser_event_loop.png)

``` js
console.log(1);
setTimeout(() => {
  console.log(2);
  Promise.resolve().then(() => {
    console.log(3);
  });
});
new Promise((resolve, reject) => {
  console.log(4);
  resolve(5);
}).then(data => {
  console.log(data);
});
setTimeout(() => {
  console.log(6);
});
console.log(7);

// 1 4 7 5 2 3 6
```

## Node.js中的event loop

**v11之后和浏览器保持一致**

Node.js中的event loop分为6个阶段，它们会按照循序反复运行。每当进入到某一个阶段的时候都会从对应的回调队列中取出函数去执行，当**队列为空**或者**执行的回调函数数量达到系统设定的阈值**，就会进入到下一阶段

Node.js的event loop中，执行宏队列的回调任务有6个阶段：

![event loop](http://mrrsblog.oss-cn-shanghai.aliyuncs.com/node_event_loop.png)

1. timers

    **timers**阶段会执行`setTimeout`、`setInterval`回调，并且是由**pool**阶段控制的。

2. I/O

    **I/O**阶段会处理一些上一轮循环中少许未执行的I/O回调

3. idle, prepare

4. poll

    计算应该阻塞并轮询I / O的时间，然后处理轮询队列中的事件

    - 如果poll队列不为空，遍历队列并同步执行回调，直到队列为空或达到系统限制
    - 如果poll队列为空，
        1. 如果有setImmediate回调需要执行，poll阶段会停止并进入**check阶段**
        2. 如果没有，会等待回调被加入队列中并立即执行回调，这里同样有个超时时间防止一直等待下去

5. check

    执行`setImmediate`回调

6. colse callbacks

    执行close事件

    当发生以下任一情况时会触发 'close' 事件：

    - 调用 `rl.close()` 方法，且 `readline.Interface` 实例放弃对 `input` 流和 `output` 流的控制；
    - `input` 流接收到其 `end` 事件；
    - `input` 流接收到 `<ctrl>-D` 以发信号传输结束`（EOT）`；
    - `input` 流接收到 `<ctrl>-C` 以发信号 `SIGINT`，并且 `readline.Interface` 实例上没有注册 'SIGINT' 事件监听器。
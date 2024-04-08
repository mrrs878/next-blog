---
title: "JavaScript复习-Promise"
tags: "JavaScript Promise Generator Promise"
categories: "2024复习"
description: ""
createDate: "2024-04-07 19:38:54"
updateDate: "2024-04-08 19:47:28"
---

深入研究一下 `Promise`

🤔

## 令人疑惑的执行顺序

观察以下代码片段

``` js
new Promise((resolve) => {
  console.log('promise1 resolve');
  resolve();
}).then(() => {
  console.log('promise1 then1');
  new Promise((resolve) => {
    console.log('promise2 resolve');
    resolve();
  }).then(() => {
    console.log('promise2 then1');
  }).then(() => {
    console.log('promise2 then2');
  })
}).then(() => {
  console.log('promise1 then2');
})
console.log('hello Promise');

// promise1 resolve
// hello Promise
// promise1 then1
// promise2 resolve
// promise2 then1
// promise1 then2
// promise2 then2
```

Q1: 为什么 `hello Promise` 在较前打印？
A1: 因为 **非重入期约方法** 机制，即： 当 `Promise` 进入 `Settled` 状态时，与该状态相关的处理程序仅仅会被排期（进入微任务队列），而非立即执行。跟在添加这个处理程序的代码之后的同步代码一定会在处理程序之前执行。 `new Promise` 中的代码是同步的， `then` 方法中的处理程序是才是异步的。

Q2: 为什么 `promise2 then1` 在 `promise1 then2` 前打印
A2: 当打印 `promise2 resolve` 后，此时 `promise2` 进入 `Settled` 状态，此时会将 `promise2-then1` 添加进微任务队列，注意此时仍在**执行微任务队列中**的任务中，因此，接下来会打印 `promise2 then1` 。

Q3: 为什么 `promise1 then2` 在 `promise2 then2` 前打印
A3: 当打印完 `promise2 then1` 时，按理说应该注册 `promise2-then2` 回调，但编译器会优化，防止一个 `Promise` 占据过多时间。即**如果有多个fulfilled的Promise实例，同时执行then链式调用，then会交替执行。**

## 为什么 Promise 状态不可逆

确保 `Promise` 的行为是可预测和可靠的。这个设计决定主要有以下几个原因:

- 保证异步执行结果的可靠性:一旦 `Promise` 的状态被改变( `fulfilled` 或 `rejected` ),就不会再发生变化。这样可以确保异步操作的结果一定会被可靠地传递给后续的 then 或 catch 回调函数。

- 简化错误处理: `Promise` 的状态一旦改变就不可逆,这意味着一个 `Promise` 对象只会触发一次 `then` 或 `catch` 回调。这简化了错误处理的逻辑,开发者不需要担心状态再次改变而引发新的错误。

- 避免竞态条件: 如果 `Promise` 状态可逆,就可能出现竞态条件,即多个异步操作同时修改 `Promise` 状态,导致结果不可预测。状态不可逆可以避免这种情况的发生。

- 更好的并行和串行组合: `Promise` 的状态不可逆使得多个 `Promise` 的并行和串行组合变得更加简单和可靠。开发者可以放心地使用 `Promise.all` 、 `Promise.race` 等方法,不必担心状态的变化会影响结果。

总之, `Promise` 状态不可逆是为了确保异步编程中的可靠性和可预测性,这是 `Promise` 设计的一个重要特性。虽然有时会给开发带来一些限制,但总的来说这是一个合理的设计决定。

## 为什么 try/catch 无法捕获 Promise.reject

如下所示

``` js
try {
  Promise.reject(new Error("foo"));
} catch (e) {
  console.log(e);
}

// Uncaught (in promise) Error: foo
```

`Promise.reject` 并没有抛到执行同步代码的线程里，而是通过浏览器异步消息队列来处理的。因此，代码一旦以异步模式执行，则唯一与之交互的方式就是使用异步结构--更具体地说，就是 `Promise` 的方法

## 为什么 Promise 不可取消

> 我们经常会遇到期约正在处理过程中，程序却不再需要其结果的情形。这时候如果能够取消期约就好了。某些第三方库，比如Bluebird，就提供了这个特性。实际上，TC39 委员会也曾准备增加这个特性，但相关提案最终被撤回了。结果，ES6期约被认为是“激进的”: 只要期约的逻辑开始执行，就没有办法阻止它执行到完成 --JS高程4

## 一个 Promise 一直没有被 resolve 或 reject 会造成内存泄漏吗

分情况， `Promise` 可以认为是一个普通的对象，也遵循垃圾回收机制，当没有引用时，在合适的时机即被回收。但一些不规范的写法会造成内存泄漏，但却不是 `Promise` 引起的，比如下面的🌰

``` js
const p = new Promise((resolve) => {
  setTimeout(resolve, 100000000, null);
});
```

这个 `Promise` 实例可能会长时间不会被回收从而造成内存泄漏，但本质原因在于 `setTimeout` 内部引用了 `resolve` 导致 `Promise` 无法被回收

## 参考

[MDN-使用Promise-时序](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises#%E6%97%B6%E5%BA%8F)

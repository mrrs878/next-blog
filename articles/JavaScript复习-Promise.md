---
title: "JavaScript复习-Promise"
tags: "JavaScript Promise Generator Promise"
categories: "2024复习"
description: ""
createDate: "2024-04-07 19:38:54"
updateDate: "2024-04-07 19:47:28"
---

深入研究一下 `Promise`

🤔

## 令人疑惑的执行顺序

// TODO

## 为什么 Promise 状态不可逆

确保 `Promise` 的行为是可预测和可靠的。这个设计决定主要有以下几个原因:

- 保证异步执行结果的可靠性:一旦 `Promise` 的状态被改变( `fulfilled` 或 `rejected` ),就不会再发生变化。这样可以确保异步操作的结果一定会被可靠地传递给后续的 then 或 catch 回调函数。

- 简化错误处理: `Promise` 的状态一旦改变就不可逆,这意味着一个 `Promise` 对象只会触发一次 `then` 或 `catch` 回调。这简化了错误处理的逻辑,开发者不需要担心状态再次改变而引发新的错误。

- 避免竞态条件: 如果 `Promise` 状态可逆,就可能出现竞态条件,即多个异步操作同时修改 `Promise` 状态,导致结果不可预测。状态不可逆可以避免这种情况的发生。

- 更好的并行和串行组合: `Promise` 的状态不可逆使得多个 `Promise` 的并行和串行组合变得更加简单和可靠。开发者可以放心地使用 `Promise.all` 、 `Promise.race` 等方法,不必担心状态的变化会影响结果。

总之, `Promise` 状态不可逆是为了确保异步编程中的可靠性和可预测性,这是 `Promise` 设计的一个重要特性。虽然有时会给开发带来一些限制,但总的来说这是一个合理的设计决定。

## 为什么 Promise 不可取消

// TODO

## 一个 Promise 一直没有被 resolve 或 reject 会造成内存泄漏吗

// TODO

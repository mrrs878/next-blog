---
title: "JavaScript-模块化机制"
tags: "JavaScript模块化机制"
categories: "JavaScript"
description: ""
createDate: "2020-04-24 22:55:14"
updateDate: "2021-05-13 14:16:51"
---


# AMD

## 简介

全称是Asynchronous Module Definition（异步模块加载机制）。后来由该草案的作者以RequireJS实现了该规范，所以一般说AMD也是指RequireJS。适用于**浏览器环境**

## 用法

```js
// a.js
define(function () {
	return 1
})

// b.js
require(['a'], function (a) {
	console.log(a)
})
```

## 特点

对于依赖的模块，AMD推崇**依赖前置，提前执行**。也就是说在`define`方法里传入的依赖模块（数组）会在一来是就下载并执行

# CommonJS

## 简介

由CommonJS小组所提出，目的是弥补JavaScript在服务端缺少模块化机制。**Node.js、webpack**都是基于该规范实现

## 用法

```js
// a.js
module.exports = function () {
	console.log("i am a function")
}

// b.js
const a = require("./a.js")
a()
// a.js
exports.num = 1
exports.obj = { name: 'zhangsan' }

// b.js
const a = require("./a.js")
console.log(a) // { num: 1, obj: { name: 'zhangsan' } }
```

## 特点

- 所有代码都运行在模块作用域，不会污染全局环境
- 模块是同步加载的，即只有加载完成次啊能执行后面的操作
- 模块在首次执行后就会**缓存**，再次加载只返回缓存结果，如果想要再次执行，可清除缓存
- CommonJS **输出的是值的拷贝**
- `this`指向当前模块

# ESM

## 简介

ES6定义的模块化规范

## 基本用法

```js
// a.js
export const name = "zhangsan"
export const age = 23
export default {
	address: "shanghai"
}

// b.js
import address, { name, age } from "./a.js"

console.log(address, name, age) // "shanghai" "zhangsan" 23
```

## 特点

- 编译时输出接口
- 可以单独加载模块某个接口
- 输出的是引用
- `this`指向`undefined`

# ESM VS CommonJS

|          | CommonJS     | ESM            |
| -- | -- | -- |
| 加载时间 | 运行时加载   | 编译时输出接口 |
| 加载方式 | 加载整个模块 | 按需加载       |
| 输出方式 | 值的拷贝     | 值的引用       |
| `this`   | 指向当前模块 | `undefined`    |
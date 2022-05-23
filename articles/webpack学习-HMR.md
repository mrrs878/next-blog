---
title: "webpack 学习-HMR"
tags: "webpack HMR"
categories: "webpack"
description: ""
createDate: "2022-02-09 20:41:29"
updateDate: "2022-05-20 19:38:52"
---

## WHAT

HMR: (hot module replacement)热模块替换/模块热替换，见名思意，即无需刷新在内存环境中即可替换掉过旧模块。与 Live Reload 相对应

> PS: Live Reload，当代码进行更新后，在浏览器自动刷新以获取最新前端代码

`*.css`: 可以使用 HMR 功能，因为`style-loader`内部实现了

`*.js`: 默认不能使用 HMR 功能 --> 需要修改 js 代码，添加支持 HMR 功能的代码

注意: HMR 功能对`js`的处理，只能处理非入口`js`文件的其他文件

```js
// js文件开启HMR
if (module.hot) {
  // 需要检测的文件
  module.hot.accept("path/to/HMRFile.js", () => {
    /*
     * HMRFile文件关键逻辑
     */
  });

  // 或者简单得传个空函数
  module.hot.accept(() => {});
}
```

## WHY

一个模块发生变化，只会重新打包这一个模块(而不是打包所有模块)极大提升构建速度

## HOW

### 关于 chunk 和 module

chunk 就是若干 module 打成的包，一个 chunk 应该包括多个 module，一般来说最终会形成一个 file。而 js 以外的资源，webpack 会通过各种 loader 转化成一个 module，这个模块会被打包到某个 chunk 中，并不会形成一个单独的 chunk。

### 关于 HMR 和 webpack-dev-server, webpack-hot-middleware, webpack-dev-middleware 之间的关系

`webpack-dev-server` 实现了封装好的的 HMR，除了配置文件和命令行参数外，较难定制开发

`webpack-hot-middleware` / `webpack-dev-middleware` 可搭配服务端框架实现个性化的 HMR 服务

两者的区别在于

1. `webpack-dev-server` 使用 websocket 来作为客户端/服务端之间的通信方式，后者使用[EventSource](https://developer.mozilla.org/zh-CN/docs/Web/API/EventSource)

2. 通信过程中使用的事件名不同。前者使用 `hash` 和 `ok` ，后者使用 `build` 和 `sync`

### HMR原理

webpack-dev-server hmr流程图

![webpack-dev-server hmr流程图](/img/webpack-hmr-0.jpeg)

在`webpack的`运行时使用`__webpack__modules__`维护所有的模块

而热模块替换的原理，即通过`chunk`的方式加载最新的`modules`，找到`__webpack__modules__`中对应的模块逐一替换，并删除其上下缓存。

其精简数据结构用以下代码表示:

```js
// webpack 运行时代码
const __webpack_modules = [
  (module, exports, __webpack_require__) => {
    __webpack_require__(0);
  },
  () => {
    console.log("这是一号模块");
  },
];

// HMR Chunk 代码
// JSONP 异步加载的所需要更新的 modules，并在 __webpack_modules__ 中进行替换
self["webpackHotUpdate"](0, {
  1: () => {
    console.log("这是最新的一号模块");
  },
});
```

其下为更具体更完整的流程，每一步都涉及众多，有兴趣的可阅读`webpack-dev-server`及开发环境`webpack`运行时的源码。

1. `webpack-dev-server`将打包输出`bundle`使用内存型文件系统控制，而非真实的文件系统。此时使用的是[memfs](https://github.com/streamich/memfs)模拟 node.js fs API

2. 每当文件发生变更时，`webpack`将会重新编译，`webpack-dev-server`将会监控到此时文件变更事件，并找到其对应的`module`。此时使用的是[chokidar](https://github.com/paulmillr/chokidar)监控文件变更

3. `webpack-dev-server`将会把变更模块通知到浏览器端，此时使用`websocket`与浏览器进行交流。此时使用的是[ws](https://github.com/websockets/ws)

4. 浏览器根据`websocket`接收到`hash`，并通过`hash`以[JSONP](https://en.wikipedia.org/wiki/JSONP)的方式请求更新模块的`chunk`

5. 浏览器加载`chunk`，并使用新的模块对旧模块进行热替换，并删除其缓存

## 各大框架中的 HMR

- react, [react-refresh](https://github.com/facebook/react/blob/main/packages/react-refresh/README.md)

- vue, [vue-loader](https://www.npmjs.com/package/vue-loader)

## 参考

[【Q078】webpack 中什么是 HMR，原理是什么 #79](https://github.com/shfshanyue/Daily-Question/issues/79)

---
title: "webpack学习-HMR"
tags: "webpack优化 HMR"
categories: "webpack"
description: ""
createDate: "2022-02-09 20:41:29"
updateDate: "2022-02-09 21:03:52"
---


## WHAT

HMR: (hot module replacement)热模块替换/模块热替换，见名思意，即无需刷新在内存环境中即可替换掉过旧模块。与 Live Reload 相对应

> PS: Live Reload，当代码进行更新后，在浏览器自动刷新以获取最新前端代码

`*.css`: 可以使用HMR功能，因为`style-loader`内部实现了

`*.js`: 默认不能使用HMR功能 --> 需要修改js代码，添加支持HMR功能的代码
    注意: HMR功能对`js`的处理，只能处理非入口`js`文件的其他文件

``` js
// js文件开启HMR
if (module.hot) {
    // 需要检测的文件
    module.hot.accept('path/to/HMRFile.js', () => {
        /*
         * HMRFile文件关键逻辑
        */ 
    })
}
```

`*.html`: 默认不能使用HMR功能。同时会导致问题: `html`文件不能热更新了 (**没必要做HMR功能**)
    解决:修改`entry`入口， 将`html`文件引入

## WHY

一个模块发生变化，只会重新打包这一个模块(而不是打包所有模块)极大提升构建速度
	
## HOW

在`webpack的`运行时中`__webpack__modules__`用以维护所有的模块

而热模块替换的原理，即通过`chunk`的方式加载最新的`modules`，找到`__webpack__modules__`中对应的模块逐一替换，并删除其上下缓存。

其精简数据结构用以下代码表示:
``` js
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

1. `webpack-dev-server`将打包输出`bundle`使用内存型文件系统控制，而非真实的文件系统。此时使用的是[memfs](https://github.com/streamich/memfs)模拟node.js fs API

2. 每当文件发生变更时，`webpack`将会重新编译，`webpack-dev-server`将会监控到此时文件变更事件，并找到其对应的`module`。此时使用的是[chokidar](https://github.com/paulmillr/chokidar)监控文件变更

3. `webpack-dev-server`将会把变更模块通知到浏览器端，此时使用`websocket`与浏览器进行交流。此时使用的是[ws](https://github.com/websockets/ws)

4. 浏览器根据`websocket`接收到`hash`，并通过`hash`以[JSONP](https://en.wikipedia.org/wiki/JSONP)的方式请求更新模块的`chunk`

5. 浏览器加载`chunk`，并使用新的模块对旧模块进行热替换，并删除其缓存

## 参考

[【Q078】webpack 中什么是 HMR，原理是什么 #79](https://github.com/shfshanyue/Daily-Question/issues/79)

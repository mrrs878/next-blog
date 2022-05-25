---
title: "webpack学习-HMR原理"
tags: "webpack HMR webpack-dev-server"
categories: "webpack"
description: ""
createDate: "2022-05-24 17:56:32"
updateDate: "2022-05-20 19:38:52"
---

研究一下`webpack-dev-server`的 HMR 原理

基于 webpack5 单页应用构建流程分析

## 如何使用

在配置文件中添加

```js
module.exports = {
  devServer: {
    hot: true,
  },
};
```

后，即可启用`webpack-dev-server`的 HMR 功能，只是启用，还需要在业务代码中告诉`webpack-dev-server`如何更新代码

```js
if (module.hot) {
  module.hot.accept(["./content.js"], () => {
    render();
  });
}
```

这样，在`content.js`发生改变后，会执行回调函数，即重新`render`

## 流程

核心流程总结如下

包括`webpack-dev-server`和`webpack.HotModuleReplacementPlugin`

1. `webpack-dev-server`会启动静态文件服务器，用于返回打包后的资源，该服务器使用[memory-fs](https://github.com/webpack/memory-fs)模拟原生文件系统

2. `webpack-dev-server`会修改`entry`，将`webpack.HotModuleReplacementPlugin`的一些运行时代码注入到 chunk 中，并开启`webpack`的`watch`模式

3. 客户端请求文件后，会和`webpack-dev-server`建立一个`ws`服务

4. 文件发生变动后，`webpack-dev-server`会重新打包文件，生成两个额外文件：`chunkId.hash.hot-update.json`和`chunkId.hash.hot-update.js`，同时会通过`ws`向客户端发送消息，告知客户端有最新的代码

5. 客户端收到消息后先请求`chunkId.hash.hot-update.json`，然后通过返回值去请求`chunkId.hash.hot-update.js`

6. 增量更新客户端代码并重新执行`module.hot.accept`传递进来的回调函数

其中`webpack-dev-server`和`webpack.HotModuleReplacementPlugin`分别完成的工作包括

`webpack-dev-server`:

- 启动一个`express`服务器，返回打包后的文件

- 修改`compiler.outputFileSystem`为`memory-fs`

- 建立一个`ws`服务

- 修改`entry`文件，将一些代码添加到 chunk 中（和服务端建立`ws`，处理各种消息等）

`webpack.HotModuleReplacementPlugin`:

- 代码变动后生成`chunkId.hash.hot-update.json`和`chunkId.hash.hot-update.js`

- 请求新模块，热更代码等

## 原理

将分为以下几个模块分析

### 建立 HMR 服务

创建一个 websocket 服务：在代码变动并编译完成后，向客户端发送两个消息`{ type: "hash", data: "xxx" }`和`{ type: "ok" }`

![hmr websocket消息](/img/webpack-hmr-1.png)

### 更新 compiler

`webpack-dev-server`会更新配置文件中的`entry`，将`webpack-dev-server/lib/client.js`打包进 chunk 中

`webpack-dev-server/lib/client.js`会在客户端执行，并和 HMR Server 建立连接，接收消息

### 注入运行时

`webpack.HotModuleReplacementPlugin`会注入一些运行时代码

![hmr 运行时](/img/webpack-hmr-2.png)

此时，构建产物中即包含了所有运行 HMR 所需的客户端运行时与接口。这些 HMR 运行时会在浏览器执行一套基于 WebSocket 消息的时序框架，如图：

![hmr 运行时](/img/webpack-hmr-3.png)

### 增量构建

除注入客户端代码外，`webpack.HotModuleReplacementPlugin`还会在代码发生变动后生成两个文件`chunkId.hash.hot-update.json`和`chunkId.hash.hot-update.js`，稍后`webpack-dev-server`会向客户端发送`hash`和`ok`消息

![hmr 运行时](/img/webpack-hmr-1.png)

### 应用更新

客户端在接收到`webpack-dev-server`中`ws`服务发送的`hash`和`ok`消息后，会根据最新的`hash`获取`chunkId.hash.hot-update.json`文件，然后根据文件中提及到的`chunk`，再去请求`chunkId.hash-hot.update.js`

![hmr 运行时](/img/webpack-hmr-4.png)

*注意，在 Webpack 4 及之前，热更新文件以模块为单位，即所有发生变化的模块都会生成对应的热更新文件； Webpack 5 之后热更新文件以 chunk 为单位，如上例中，main chunk 下任意文件的变化都只会生成 main.[hash].hot-update.js 更新文件。*

`chunkId.hash-hot.update.js`拿到后会将代码更新到`__webpack_require__.c`中，并且执行`module.hot.accept`回调

至此，热更新完毕

---
title: "webpack学习-ModuleFederation"
tags: "webpack ModuleFederation"
categories: "webpack"
description: ""
createDate: "2022-06-11 18:51:42"
updateDate: "2022-06-12 22:51:42"
---

学习webpack@5.73.0的 ModuleFederation

## WHAT

webpack 提供的一种跨项目模块共享机制

先通过一个 🌰 了解一下

![webpack ModuleFederation](/img/webpack-mf-0.png)

如图所示，分别创建了两个项目 `host` 和 `remote`

- `remote` 中创建了两个组件 `Button` 和 `Header`
- `host` 中的 `bootstrap.jsx` 引用了两个组件 (注意，这两个组件在 `host` 项目中并未定义)

分别在两个项目下执行 `npx webpack serve` ，然后访问 `host` 的开发地址 `http://localhost:8080/` 效果如图所示，接着尝试修改 `remote` 中的 `components/Header.jsx` 发现页面中也相应发生变化

🤔

也就是说，我们在 `host` 中引用了 `remote` 中的组件？😱

对的，这就是 webpack5 提供的新特性 ModuleFederation ，中文直译模块联邦

联邦模块有两个主要概念： `host` （消费其他 `remote` ）和 `remote` （被 `host` 消费）。 每个项目可以是 `host` 也可以是 `remote` ，也可以两个都是。可以通过 webpack 配置来区分，可以参考上述的例子

- 作为 `host` 需要配置 `remotes` 列表

- 作为 `remote` 需要配置项目名（ `name` ），打包后的文件名（ `filename` ），提供的模块（ `exposes` ）

而且想要开启这一特性，只需要少许的配置即可

在需要共享的项目中，即上述的 `remote` 中，添加这个 webpack 配置

```js
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  plugins: [
    // ...
    new ModuleFederationPlugin({
      // 当前应用的名字，全局唯一ID，通过 name/{expose} 的方式使用
      name: "remote",
      // *可选，打包方式，与 name 保持一致即可
      library: { type: "var", name: "remote" },
      // 共享组件/模块打包后所在的文件，使用者直接导入这个文件即可
      filename: "remoteEntry.js",
      exposes: {
        // 这里便是我们要共享的模块/组件，引用方式为 import(name/{expose})，比如 import('remote/Button')
        "./Button": "./src/components/Button.jsx",
        "./Header": "./src/components/Header.jsx",
      },
      // 在这里指定需要共享的package
      shared: {
        react: { singleton: true, requiredVersion: "^18.1.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.1.0" },
      },
    }),
  ],
};
```

同时，在需要引用这些组件的项目中，即上述的`host`项目，webpack 配置文件中新增这些配置

```js
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      // 表示当前应用是一个 Host，可以引用 remote 中 expose 的模块
      remotes: {
        remote: "remote@http://localhost:8081/remoteEntry.js",
      },
      // 在这里指定需要共享的package
      // 在使用 Module Federation 时，Host、Remote 必须配置一致的 shared 这样才会生效
      shared: {
        react: { singleton: true, requiredVersion: "^18.1.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.1.0" },
      },
    }),
  ],
};
```

在这里，我们也可以简单得分析一下 host 应用加载的 js 文件

![webpack ModuleFederation配置shared的构建文件](/img/webpack-mf-1.png)

如图所示，在本示例中 host 加载了三个 remote 的文件`remoteEntry.js`和`src_components_Header_jsx.js`与`src_components_Button_jsx.js`，其中后两者是加载的组件代码，`remoteEntry.js`是入口文件，可以发现并没有加载 react 相关的源码，这是因为我们配置了`shared`，这样 remote 就可以和 host 共用一套 react（在这里，react 是被打包进`main.js`中）。如果没有配置`shared`选项，那么会单独加载一份 react 代码

![webpack ModuleFederation未配置shared的构建文件](/img/webpack-mf-2.png)

可以看到，这时会单独加载一份react源码

## WHY

在构建工具层面上对模块共享、模块加载做一些扩展、优化

## HOW

修改了 `webpack_require` 的部分实现，在 `require` 的时候从远程加载资源，缓存到全局对象 `window["webpackChunk"+appName]` 中，然后合并到 `webpack_modules` 中

webpack 每次打包都会将资源全部包裹在一个立即执行函数里面，这样虽然避免了全局环境的污染，但也使得外部不能访问内部模块。 在这个立即执行函数里面，webpack 使用 `webpack_modules` 对象保存所有的模块代码，然后用内部定义的 `webpack_require` 方法从 `webpack_modules` 中加载模块。并且在异步加载和文件拆分两种情况下向全局暴露一个 `webpackChunk` 数组用于沟通多个 webpack 资源，这个数组通过被 webpack 重写 `push` 方法，会在其他资源向 `webpackChunk` 数组中新增内容时同步添加到 `webpack_modules` 中从而实现模块整合

## 参考

[模块联邦浅析](https://www.zoo.team/article/webpack-modular)

[webpack 中文文档](https://webpack.docschina.org/concepts/module-federation/#Uncaught-Error-Shared-module-is-not-available-for-eager-consumption)

[module-federation-examples/basic-host-remote](https://github.com/module-federation/module-federation-examples/tree/master/basic-host-remote)
